import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SessionCard from '@/components/page/event-detail/session-card';

// Mock the CollapsibleContent component
jest.mock('@/components/page/event-detail/collapsible-content', () => {
  return function MockCollapsibleContent({ content }: { content: string }) {
    return <div data-testid="collapsible-content">{content}</div>;
  };
});

// Mock the formatDateTime helper
jest.mock('@/utils/helper', () => ({
  formatDateTime: jest.fn((date: string, timezone: string, format: string) => {
    if (format === 'h:mm A') {
      // Handle null/undefined dates
      if (!date) {
        return '12:00 PM';
      }
      if (date.includes('10:00:00Z')) {
        return '10:00 AM';
      }
      if (date.includes('11:30:00Z')) {
        return '11:30 AM';
      }
      if (date.includes('12:00:00Z')) {
        return '12:00 PM';
      }
      return '10:00 AM';
    }
    return '2025-01-01T10:00:00Z';
  }),
}));

const mockFormatDateTime = require('@/utils/helper').formatDateTime as jest.MockedFunction<any>;

describe('SessionCard Component', () => {
  const defaultProps = {
    detail: {
      name: 'Test Session',
      description: 'This is a test session description',
      startDate: '2025-01-01T10:00:00Z',
      endDate: '2025-01-01T11:30:00Z',
    },
    className: 'test-class',
    eventTimezone: 'UTC',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders session card with basic information', () => {
      render(<SessionCard {...defaultProps} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM • Test Session')).toBeInTheDocument();
      expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
      expect(screen.getByTestId('collapsible-content')).toHaveTextContent('This is a test session description');
    });

    it('renders with custom className', () => {
      const { container } = render(<SessionCard {...defaultProps} />);
      
      const sessionDiv = container.querySelector('.session');
      expect(sessionDiv).toHaveClass('session', 'test-class');
    });

    it('renders without description when description is empty', () => {
      const propsWithoutDescription = {
        ...defaultProps,
        detail: {
          ...defaultProps.detail,
          description: '',
        },
      };
      
      render(<SessionCard {...propsWithoutDescription} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM • Test Session')).toBeInTheDocument();
      expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();
    });

    it('renders without description when description is undefined', () => {
      const propsWithoutDescription = {
        ...defaultProps,
        detail: {
          name: 'Test Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:30:00Z',
        },
      };
      
      render(<SessionCard {...propsWithoutDescription} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM • Test Session')).toBeInTheDocument();
      expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();
    });

    it('renders with empty session name when name is undefined', () => {
      const propsWithoutName = {
        ...defaultProps,
        detail: {
          description: 'Test description',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:30:00Z',
        },
      };
      
      render(<SessionCard {...propsWithoutName} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM •')).toBeInTheDocument();
    });

    it('renders with empty session name when name is null', () => {
      const propsWithoutName = {
        ...defaultProps,
        detail: {
          name: null,
          description: 'Test description',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:30:00Z',
        },
      };
      
      render(<SessionCard {...propsWithoutName} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM •')).toBeInTheDocument();
    });
  });

  describe('Time Formatting', () => {
    it('calls formatDateTime with correct parameters for start time', () => {
      render(<SessionCard {...defaultProps} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2025-01-01T10:00:00Z',
        'UTC',
        'h:mm A'
      );
    });

    it('calls formatDateTime with correct parameters for end time', () => {
      render(<SessionCard {...defaultProps} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2025-01-01T11:30:00Z',
        'UTC',
        'h:mm A'
      );
    });

    it('displays correct time range', () => {
      render(<SessionCard {...defaultProps} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM • Test Session')).toBeInTheDocument();
    });

    it('handles different timezone', () => {
      const propsWithDifferentTimezone = {
        ...defaultProps,
        eventTimezone: 'America/New_York',
      };
      
      render(<SessionCard {...propsWithDifferentTimezone} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2025-01-01T10:00:00Z',
        'America/New_York',
        'h:mm A'
      );
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2025-01-01T11:30:00Z',
        'America/New_York',
        'h:mm A'
      );
    });
  });

  describe('Component Structure', () => {
    it('renders session div with correct structure', () => {
      const { container } = render(<SessionCard {...defaultProps} />);
      
      const sessionDiv = container.querySelector('.session');
      expect(sessionDiv).toBeInTheDocument();
      
      const timeSpan = sessionDiv?.querySelector('.session__time');
      expect(timeSpan).toBeInTheDocument();
      expect(timeSpan).toHaveTextContent('10:00 AM - 11:30 AM • Test Session');
    });

    it('renders session description div when description exists', () => {
      const { container } = render(<SessionCard {...defaultProps} />);
      
      const sessionDiv = container.querySelector('.session');
      const descDiv = sessionDiv?.querySelector('.session__desc');
      expect(descDiv).toBeInTheDocument();
      expect(descDiv).toContainElement(screen.getByTestId('collapsible-content'));
    });

    it('does not render session description div when description is empty', () => {
      const propsWithoutDescription = {
        ...defaultProps,
        detail: {
          ...defaultProps.detail,
          description: '',
        },
      };
      
      const { container } = render(<SessionCard {...propsWithoutDescription} />);
      
      const sessionDiv = container.querySelector('.session');
      const descDiv = sessionDiv?.querySelector('.session__desc');
      expect(descDiv).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing detail prop gracefully', () => {
      const propsWithoutDetail = {
        className: 'test-class',
        eventTimezone: 'UTC',
      };
      
      render(<SessionCard {...propsWithoutDetail} />);
      
      expect(screen.getByText('12:00 PM - 12:00 PM •')).toBeInTheDocument();
    });

    it('handles null detail prop gracefully', () => {
      const propsWithNullDetail = {
        detail: null,
        className: 'test-class',
        eventTimezone: 'UTC',
      };
      
      render(<SessionCard {...propsWithNullDetail} />);
      
      expect(screen.getByText('12:00 PM - 12:00 PM •')).toBeInTheDocument();
    });

    it('handles missing className prop', () => {
      const propsWithoutClassName = {
        detail: defaultProps.detail,
        eventTimezone: 'UTC',
      };
      
      const { container } = render(<SessionCard {...propsWithoutClassName} />);
      
      const sessionDiv = container.querySelector('.session');
      expect(sessionDiv).toHaveClass('session');
      expect(sessionDiv).not.toHaveClass('test-class');
    });

    it('handles missing eventTimezone prop', () => {
      const propsWithoutTimezone = {
        detail: defaultProps.detail,
        className: 'test-class',
      };
      
      render(<SessionCard {...propsWithoutTimezone} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2025-01-01T10:00:00Z',
        undefined,
        'h:mm A'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles session with only start date', () => {
      const propsWithOnlyStartDate = {
        ...defaultProps,
        detail: {
          name: 'Test Session',
          description: 'Test description',
          startDate: '2025-01-01T10:00:00Z',
        },
      };
      
      render(<SessionCard {...propsWithOnlyStartDate} />);
      
      expect(screen.getByText('10:00 AM - 12:00 PM • Test Session')).toBeInTheDocument();
    });

    it('handles session with only end date', () => {
      const propsWithOnlyEndDate = {
        ...defaultProps,
        detail: {
          name: 'Test Session',
          description: 'Test description',
          endDate: '2025-01-01T11:30:00Z',
        },
      };
      
      render(<SessionCard {...propsWithOnlyEndDate} />);
      
      expect(screen.getByText('12:00 PM - 11:30 AM • Test Session')).toBeInTheDocument();
    });

    it('handles session with no dates', () => {
      const propsWithNoDates = {
        ...defaultProps,
        detail: {
          name: 'Test Session',
          description: 'Test description',
        },
      };
      
      render(<SessionCard {...propsWithNoDates} />);
      
      expect(screen.getByText('12:00 PM - 12:00 PM • Test Session')).toBeInTheDocument();
    });

    it('handles very long session description', () => {
      const longDescription = 'This is a very long session description that should be handled properly by the CollapsibleContent component. '.repeat(10);
      const propsWithLongDescription = {
        ...defaultProps,
        detail: {
          ...defaultProps.detail,
          description: longDescription,
        },
      };
      
      render(<SessionCard {...propsWithLongDescription} />);
      
      const collapsibleContent = screen.getByTestId('collapsible-content');
      expect(collapsibleContent).toBeInTheDocument();
      expect(collapsibleContent.textContent).toContain('This is a very long session description');
    });

    it('handles session with special characters in name', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        detail: {
          ...defaultProps.detail,
          name: 'Session & Workshop (Part 1) - "Advanced Topics"',
        },
      };
      
      render(<SessionCard {...propsWithSpecialChars} />);
      
      expect(screen.getByText('10:00 AM - 11:30 AM • Session & Workshop (Part 1) - "Advanced Topics"')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      const { container } = render(<SessionCard {...defaultProps} />);
      
      const sessionDiv = container.querySelector('.session');
      expect(sessionDiv).toHaveClass('session');
      
      const timeSpan = sessionDiv?.querySelector('.session__time');
      expect(timeSpan).toHaveClass('session__time');
      
      const descDiv = sessionDiv?.querySelector('.session__desc');
      expect(descDiv).toHaveClass('session__desc');
    });
  });
});
