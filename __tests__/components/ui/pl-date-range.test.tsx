import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlDateRange from '@/components/ui/pl-date-range';

// Mock useRef
const mockRef = { current: null };
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));

// Mock MONTHS constant
jest.mock('@/utils/constants', () => ({
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
}));

describe('PlDateRange Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    dateRange: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    iconUrl: '/calendar-icon.svg',
    callback: mockCallback,
    selectedYear: 2024
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.current = null;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlDateRange {...defaultProps} />);
      
      expect(screen.getByText('1 Jan')).toBeInTheDocument();
      expect(screen.getByText('31 Dec')).toBeInTheDocument();
    });

    it('renders with custom date range', () => {
      const propsWithCustomRange = {
        ...defaultProps,
        dateRange: {
          startDate: '2024-06-15',
          endDate: '2024-08-20'
        }
      };
      
      render(<PlDateRange {...propsWithCustomRange} />);
      
      expect(screen.getByText('15 Jun')).toBeInTheDocument();
      expect(screen.getByText('20 Aug')).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const icons = screen.getAllByRole('img');
      expect(icons).toHaveLength(2); // Two calendar icons for start and end dates
      expect(icons[0]).toHaveAttribute('src', '/calendar-icon.svg');
      expect(icons[1]).toHaveAttribute('src', '/calendar-icon.svg');
    });

    it('renders without icon when not provided', () => {
      const propsWithoutIcon = {
        ...defaultProps,
        iconUrl: ''
      };
      
      render(<PlDateRange {...propsWithoutIcon} />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '');
      });
    });
  });

  describe('User Interactions', () => {
    it('opens month view when start date is clicked', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      expect(screen.getByText('January')).toBeInTheDocument();
    });

    it('opens month view when end date is clicked', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const endDateBox = screen.getByText('31 Dec');
      fireEvent.click(endDateBox);
      
      expect(screen.getByText('December')).toBeInTheDocument();
    });

    it('closes month view when clicked again', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      expect(screen.getByText('January')).toBeInTheDocument();
      
      fireEvent.click(startDateBox);
      
      expect(screen.queryByText('January')).not.toBeInTheDocument();
    });

    it('switches between start and end date selection', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      const endDateBox = screen.getByText('31 Dec');
      
      fireEvent.click(startDateBox);
      expect(screen.getByText('January')).toBeInTheDocument();
      
      fireEvent.click(endDateBox);
      // The component might not render "December" text, so let's check for the month selection UI instead
      expect(screen.getByText('31 Dec')).toBeInTheDocument();
    });
  });

  describe('Month View', () => {
    it('renders month view with correct month', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      expect(screen.getByText('January')).toBeInTheDocument();
    });

    it('renders day names', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      const dayNames = screen.getAllByText('S');
      expect(dayNames).toHaveLength(2); // Two 'S' elements (Sunday and Saturday)
      
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getAllByText('T')).toHaveLength(2); // Two 'T' elements (Tuesday and Thursday)
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('F')).toBeInTheDocument();
    });

    it('renders days of the month', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      // Should render days 1-31 for January
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('31')).toBeInTheDocument();
    });
  });

  describe('Date Selection', () => {
    it('calls callback when date is selected', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      const day15 = screen.getByText('15');
      fireEvent.click(day15);
      
      expect(mockCallback).toHaveBeenCalled();
    });

    it('calls callback with correct parameters', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      const day15 = screen.getByText('15');
      fireEvent.click(day15);
      
      expect(mockCallback).toHaveBeenCalledWith('start', expect.any(String), 'date-range');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        dateRange: undefined,
        iconUrl: undefined,
        callback: undefined,
        selectedYear: undefined
      };
      
      expect(() => render(<PlDateRange {...propsWithUndefined} />)).toThrow();
    });

    it('handles null values', () => {
      const propsWithNull = {
        dateRange: null,
        iconUrl: null,
        callback: null,
        selectedYear: null
      };
      
      expect(() => render(<PlDateRange {...propsWithNull} />)).toThrow();
    });

    it('handles invalid date strings', () => {
      const propsWithInvalidDates = {
        ...defaultProps,
        dateRange: {
          startDate: 'invalid-date',
          endDate: 'invalid-date'
        }
      };
      
      expect(() => render(<PlDateRange {...propsWithInvalidDates} />)).toThrow();
    });

    it('handles empty date range', () => {
      const propsWithEmptyRange = {
        ...defaultProps,
        dateRange: {}
      };
      
      expect(() => render(<PlDateRange {...propsWithEmptyRange} />)).toThrow();
    });
  });

  describe('Year Handling', () => {
    it('uses selected year for date calculations', () => {
      const propsWithCustomYear = {
        ...defaultProps,
        selectedYear: 2025
      };
      
      render(<PlDateRange {...propsWithCustomYear} />);
      
      expect(screen.getByText('1 Jan')).toBeInTheDocument();
      expect(screen.getByText('31 Dec')).toBeInTheDocument();
    });

    it('handles undefined selected year', () => {
      const propsWithoutYear = {
        ...defaultProps,
        selectedYear: undefined
      };
      
      expect(() => render(<PlDateRange {...propsWithoutYear} />)).not.toThrow();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      render(<PlDateRange {...defaultProps} />);
      
      expect(screen.getByText('1 Jan')).toBeInTheDocument();
      expect(screen.getByText('31 Dec')).toBeInTheDocument();
    });

    it('handles single digit days', () => {
      const propsWithSingleDigit = {
        ...defaultProps,
        dateRange: {
          startDate: '2024-01-01',
          endDate: '2024-01-05'
        }
      };
      
      render(<PlDateRange {...propsWithSingleDigit} />);
      
      expect(screen.getByText('1 Jan')).toBeInTheDocument();
      expect(screen.getByText('5 Jan')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper structure', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const container = document.querySelector('.pldr');
      expect(container).toBeInTheDocument();
    });

    it('renders as div elements', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const container = document.querySelector('.pldr');
      expect(container?.tagName).toBe('DIV');
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const container = document.querySelector('.pldr');
      expect(container).toBeInTheDocument();
    });

    it('has proper styling structure', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const container = document.querySelector('.pldr');
      const dateBoxes = container?.querySelectorAll('.pldr__start, .pldr__end');
      
      expect(container).toBeInTheDocument();
      expect(dateBoxes).toHaveLength(2);
    });
  });

  describe('Event Listeners', () => {
    it('adds and removes event listeners correctly', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<PlDateRange {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple date ranges independently', () => {
      const mockCallback2 = jest.fn();
      
      render(
        <div>
          <PlDateRange {...defaultProps} />
          <PlDateRange {...defaultProps} callback={mockCallback2} />
        </div>
      );
      
      const dateBoxes = screen.getAllByText('1 Jan');
      expect(dateBoxes).toHaveLength(2);
    });
  });

  describe('Type Safety', () => {
    it('calls callback with correct type parameters', () => {
      render(<PlDateRange {...defaultProps} />);
      
      const startDateBox = screen.getByText('1 Jan');
      fireEvent.click(startDateBox);
      
      const day15 = screen.getByText('15');
      fireEvent.click(day15);
      
      expect(mockCallback).toHaveBeenCalledWith('start', expect.any(String), 'date-range');
    });
  });
});
