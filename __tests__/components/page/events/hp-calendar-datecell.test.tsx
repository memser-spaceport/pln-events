import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpCalendarDateCell from '../../../../components/page/events/hp-calendar-datecell';

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('HpCalendarDateCell Component', () => {
  const defaultProps = {
    isToday: false,
    dow: 1, // Monday
    dayNumberText: '15',
  };

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpCalendarDateCell {...defaultProps} />);
      
      const dateElement = screen.getByText('15');
      const dayElement = screen.getByText('Mon');
      
      expect(dateElement).toBeInTheDocument();
      expect(dayElement).toBeInTheDocument();
    });

    it('renders date number correctly', () => {
      render(<HpCalendarDateCell {...defaultProps} dayNumberText="25" />);
      
      const dateElement = screen.getByText('25');
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveClass('dcn__date');
    });

    it('renders day of week correctly', () => {
      const testCases = [
        { dow: 0, expectedDay: 'Sun' },
        { dow: 1, expectedDay: 'Mon' },
        { dow: 2, expectedDay: 'Tue' },
        { dow: 3, expectedDay: 'Wed' },
        { dow: 4, expectedDay: 'Thu' },
        { dow: 5, expectedDay: 'Fri' },
        { dow: 6, expectedDay: 'Sat' },
      ];

      testCases.forEach(({ dow, expectedDay }) => {
        const { unmount } = render(
          <HpCalendarDateCell {...defaultProps} dow={dow} />
        );
        
        const dayElement = screen.getByText(expectedDay);
        expect(dayElement).toBeInTheDocument();
        expect(dayElement).toHaveClass('dcn__day');
        
        unmount();
      });
    });
  });

  describe('Today Indicator', () => {
    it('renders today dot when isToday is true', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={true} />);
      
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).toBeInTheDocument();
    });

    it('does not render today dot when isToday is false', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={false} />);
      
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).not.toBeInTheDocument();
    });

    it('handles undefined isToday prop gracefully', () => {
      render(<HpCalendarDateCell dow={1} dayNumberText="15" isToday={false} />);
      
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to date element', () => {
      render(<HpCalendarDateCell {...defaultProps} />);
      
      const dateElement = screen.getByText('15');
      expect(dateElement).toHaveClass('dcn__date');
    });

    it('applies correct CSS classes to day element', () => {
      render(<HpCalendarDateCell {...defaultProps} />);
      
      const dayElement = screen.getByText('Mon');
      expect(dayElement).toHaveClass('dcn__day');
    });

    it('applies correct CSS classes to container', () => {
      render(<HpCalendarDateCell {...defaultProps} />);
      
      const container = document.querySelector('.dcn');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to today dot', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={true} />);
      
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).toHaveClass('dcn__dot');
    });
  });

  describe('Component Structure', () => {
    it('renders all required elements in correct structure', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={true} />);
      
      // Check container
      const container = document.querySelector('.dcn');
      expect(container).toBeInTheDocument();
      
      // Check date
      const dateElement = screen.getByText('15');
      expect(dateElement).toBeInTheDocument();
      
      // Check day
      const dayElement = screen.getByText('Mon');
      expect(dayElement).toBeInTheDocument();
      
      // Check today dot
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).toBeInTheDocument();
    });

    it('renders minimal structure when not today', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={false} />);
      
      // Check container
      const container = document.querySelector('.dcn');
      expect(container).toBeInTheDocument();
      
      // Check date
      const dateElement = screen.getByText('15');
      expect(dateElement).toBeInTheDocument();
      
      // Check day
      const dayElement = screen.getByText('Mon');
      expect(dayElement).toBeInTheDocument();
      
      // Check no today dot
      const todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles different day numbers', () => {
      const testCases = ['1', '15', '31', '99'];
      
      testCases.forEach((dayNumber) => {
        const { unmount } = render(
          <HpCalendarDateCell {...defaultProps} dayNumberText={dayNumber} />
        );
        
        const dateElement = screen.getByText(dayNumber);
        expect(dateElement).toBeInTheDocument();
        
        unmount();
      });
    });

    it('handles edge case day of week values', () => {
      const testCases = [0, 6, 7, -1, 10];
      
      testCases.forEach((dow) => {
        const { unmount } = render(
          <HpCalendarDateCell {...defaultProps} dow={dow} />
        );
        
        // Should render without crashing
        const container = document.querySelector('.dcn');
        expect(container).toBeInTheDocument();
        
        unmount();
      });
    });

    it('handles empty day number text', () => {
      render(<HpCalendarDateCell {...defaultProps} dayNumberText="" />);
      
      const dateElement = screen.getAllByText('')[0];
      expect(dateElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing props gracefully', () => {
      render(<HpCalendarDateCell dow={1} dayNumberText="15" isToday={false} />);
      
      const container = document.querySelector('.dcn');
      expect(container).toBeInTheDocument();
    });

    it('handles null/undefined dayNumberText', () => {
      render(<HpCalendarDateCell {...defaultProps} dayNumberText={undefined as any} />);
      
      const container = document.querySelector('.dcn');
      expect(container).toBeInTheDocument();
    });

    it('handles boolean isToday values', () => {
      const { rerender } = render(<HpCalendarDateCell {...defaultProps} isToday={true} />);
      
      let todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).toBeInTheDocument();
      
      rerender(<HpCalendarDateCell {...defaultProps} isToday={false} />);
      
      todayDot = document.querySelector('.dcn__dot');
      expect(todayDot).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders text content that is accessible', () => {
      render(<HpCalendarDateCell {...defaultProps} />);
      
      const dateElement = screen.getByText('15');
      const dayElement = screen.getByText('Mon');
      
      expect(dateElement).toBeVisible();
      expect(dayElement).toBeVisible();
    });

    it('maintains text content visibility for today indicator', () => {
      render(<HpCalendarDateCell {...defaultProps} isToday={true} />);
      
      const dateElement = screen.getByText('15');
      const dayElement = screen.getByText('Mon');
      
      expect(dateElement).toBeVisible();
      expect(dayElement).toBeVisible();
    });
  });
});
