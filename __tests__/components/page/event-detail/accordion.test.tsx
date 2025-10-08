import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Accordion from '../../../../components/page/event-detail/accordion';

describe('Accordion Component', () => {
  const mockAgenda = {
    title: 'Test Agenda',
    content: 'Test content for the agenda'
  };

  const defaultProps = {
    agenda: mockAgenda
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders accordion with agenda title', () => {
      render(<Accordion {...defaultProps} />);
      
      const headerText = screen.getByText('Test Agenda');
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveClass('accordion__header__text');
    });

    it('renders accordion with agenda content when open', () => {
      render(<Accordion {...defaultProps} />);
      
      const content = screen.getByText('Test content for the agenda');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('accordion__body');
    });

    it('renders chevron down icon when accordion is open', () => {
      render(<Accordion {...defaultProps} />);
      
      const icon = screen.getByAltText('day');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/icons/chevron-down.svg');
      expect(icon).toHaveAttribute('height', '20');
      expect(icon).toHaveAttribute('width', '20');
    });

    it('renders accordion header with correct structure', () => {
      render(<Accordion {...defaultProps} />);
      
      const header = screen.getByText('Test Agenda').closest('.accordion__header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('accordion__header');
    });

    it('renders accordion container with correct class', () => {
      render(<Accordion {...defaultProps} />);
      
      const accordion = screen.getByText('Test Agenda').closest('.accordion');
      expect(accordion).toBeInTheDocument();
      expect(accordion).toHaveClass('accordion');
    });
  });

  describe('Toggle Functionality', () => {
    it('toggles accordion content when header is clicked', () => {
      render(<Accordion {...defaultProps} />);
      
      const header = screen.getByText('Test Agenda').closest('.accordion__header');
      
      // Initially open
      let content = screen.getByText('Test content for the agenda');
      expect(content).toBeInTheDocument();
      
      // Click to close
      fireEvent.click(header!);
      expect(screen.queryByText('Test content for the agenda')).not.toBeInTheDocument();
      
      // Click to open again
      fireEvent.click(header!);
      content = screen.getByText('Test content for the agenda');
      expect(content).toBeInTheDocument();
    });

    it('changes icon when accordion is toggled', () => {
      render(<Accordion {...defaultProps} />);
      
      const header = screen.getByText('Test Agenda').closest('.accordion__header');
      const icon = screen.getByAltText('day');
      
      // Initially shows chevron down
      expect(icon).toHaveAttribute('src', '/icons/chevron-down.svg');
      
      // Click to close
      fireEvent.click(header!);
      expect(icon).toHaveAttribute('src', '/icons/chevron-up-circle.svg');
      
      // Click to open again
      fireEvent.click(header!);
      expect(icon).toHaveAttribute('src', '/icons/chevron-down.svg');
    });
  });

  describe('Props Handling', () => {
    it('handles missing agenda prop gracefully', () => {
      render(<Accordion />);
      
      const headerText = screen.getByRole('heading', { level: 6 });
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveClass('accordion__header__text');
      expect(headerText).toHaveTextContent('');
    });

    it('handles agenda with missing title', () => {
      const propsWithNoTitle = {
        agenda: { content: 'Test content' }
      };
      
      render(<Accordion {...propsWithNoTitle} />);
      
      const headerText = screen.getByRole('heading', { level: 6 });
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveTextContent('');
    });

    it('handles agenda with missing content', () => {
      const propsWithNoContent = {
        agenda: { title: 'Test Title' }
      };
      
      render(<Accordion {...propsWithNoContent} />);
      
      const headerText = screen.getByText('Test Title');
      expect(headerText).toBeInTheDocument();
      
      // Content should not be rendered when empty
      const accordionBody = document.querySelector('.accordion__body');
      expect(accordionBody).toBeInTheDocument();
      expect(accordionBody).toHaveTextContent('');
    });

    it('handles null agenda prop', () => {
      render(<Accordion agenda={null} />);
      
      const headerText = screen.getByRole('heading', { level: 6 });
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveTextContent('');
    });

    it('handles undefined agenda prop', () => {
      render(<Accordion agenda={undefined} />);
      
      const headerText = screen.getByRole('heading', { level: 6 });
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveTextContent('');
    });
  });

  describe('Initial State', () => {
    it('starts in open state by default', () => {
      render(<Accordion {...defaultProps} />);
      
      const content = screen.getByText('Test content for the agenda');
      expect(content).toBeInTheDocument();
      
      const icon = screen.getByAltText('day');
      expect(icon).toHaveAttribute('src', '/icons/chevron-down.svg');
    });
  });

  describe('Accessibility', () => {
    it('has clickable header element', () => {
      render(<Accordion {...defaultProps} />);
      
      const header = screen.getByText('Test Agenda').closest('.accordion__header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveStyle('cursor: pointer');
    });

    it('maintains icon alt text for accessibility', () => {
      render(<Accordion {...defaultProps} />);
      
      const icon = screen.getByAltText('day');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string agenda title', () => {
      const propsWithEmptyTitle = {
        agenda: { title: '', content: 'Test content' }
      };
      
      render(<Accordion {...propsWithEmptyTitle} />);
      
      const headerText = screen.getByRole('heading', { level: 6 });
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveTextContent('');
    });

    it('handles empty string agenda content', () => {
      const propsWithEmptyContent = {
        agenda: { title: 'Test Title', content: '' }
      };
      
      render(<Accordion {...propsWithEmptyContent} />);
      
      const headerText = screen.getByText('Test Title');
      expect(headerText).toBeInTheDocument();
      
      // Empty content should not render
      const accordionBody = document.querySelector('.accordion__body');
      expect(accordionBody).toBeInTheDocument();
      expect(accordionBody).toHaveTextContent('');
    });

    it('handles very long agenda content', () => {
      const longContent = 'A'.repeat(1000);
      const propsWithLongContent = {
        agenda: { title: 'Test Title', content: longContent }
      };
      
      render(<Accordion {...propsWithLongContent} />);
      
      const content = screen.getByText(longContent);
      expect(content).toBeInTheDocument();
    });
  });
});
