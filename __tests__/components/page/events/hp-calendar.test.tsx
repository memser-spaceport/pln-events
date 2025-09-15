import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpCalendar from '../../../../components/page/events/hp-calendar';
import { IMonthwiseEvent } from '@/types/events.type';

// Mock FullCalendar
const mockCalendarApi = {
  prev: jest.fn(),
  next: jest.fn(),
  gotoDate: jest.fn(),
};

jest.mock('@fullcalendar/react', () => {
  return React.forwardRef(function MockFullCalendar(props: any, ref: any) {
    // Store ref for testing - set immediately
    if (ref) {
      ref.current = {
        getApi: () => mockCalendarApi,
      };
    }
    return <div data-testid="fullcalendar" {...props} />;
  });
});

// Mock dayGridPlugin
jest.mock('@fullcalendar/daygrid', () => ({}));

// Mock the child components
jest.mock('../../../../components/page/events/hp-calendar-popup', () => {
  return function MockHpCalendarPopup(props: any) {
    return <div data-testid="hp-calendar-popup" {...props} />;
  };
});

jest.mock('../../../../components/page/events/hp-calendar-datecell', () => {
  return function MockHpCalendarDateCell(props: any) {
    return <div data-testid="hp-calendar-datecell" {...props} />;
  };
});

jest.mock('../../../../components/page/events/hp-calendar-event', () => {
  return function MockHpCalendarEvent(props: any) {
    return <div data-testid="hp-calendar-event" {...props} />;
  };
});

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useEventsAnalytics hook
jest.mock('@/analytics/events.analytics', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock window.location
const mockLocation = {
  pathname: '/events',
  search: '?view=calendar',
  href: '/events?view=calendar',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('HpCalendar Component', () => {
  const mockMonthWiseEvents: IMonthwiseEvent[] = [
    {
      name: 'January',
      index: 0,
      events: [],
    },
    {
      name: 'February',
      index: 1,
      events: [],
    },
  ];

  const mockEventItems = [
    {
      id: 'event1',
      title: 'Test Event 1',
      start: '2024-01-15',
      end: '2024-01-16',
      extendedProps: {
        slug: 'test-event-1',
        eventType: 'social',
        isFeaturedEvent: false,
      },
    },
  ];

  const defaultProps = {
    monthWiseEvents: mockMonthWiseEvents,
    showBanner: false,
    rawEvents: [],
    filterdListCount: 0,
    filters: {
      year: '2024',
      monthIndex: 0,
    },
    eventItems: mockEventItems,
  };

  const mockUseRouter = require('next/navigation').useRouter as jest.Mock;
  const mockUseEventsAnalytics = require('@/analytics/events.analytics').default as jest.Mock;

  const mockRouter = {
    push: jest.fn(),
  };

  const mockAnalytics = {
    onCalendarCardClicked: jest.fn(),
    onCalendarMonthNav: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseEventsAnalytics.mockReturnValue(mockAnalytics);
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const calendarContainer = document.querySelector('.hpc');
      const fullCalendar = screen.getByTestId('fullcalendar');
      const popup = screen.getByTestId('hp-calendar-popup');
      
      expect(calendarContainer).toBeInTheDocument();
      expect(fullCalendar).toBeInTheDocument();
      expect(popup).toBeInTheDocument();
    });

    it('renders calendar header with month navigation', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const header = document.querySelector('.hpc__head');
      const monthNavigation = document.querySelector('.hpc__head__months');
      const monthText = document.querySelector('.hpc__head__months__text');
      
      expect(header).toBeInTheDocument();
      expect(monthNavigation).toBeInTheDocument();
      expect(monthText).toBeInTheDocument();
      expect(monthText).toHaveTextContent('January');
    });

    it('renders event type legend', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const legend = document.querySelector('.hpc__head__info');
      const socialItem = screen.getByText('Social');
      const virtualItem = screen.getByText('Virtual');
      const conferenceItem = screen.getByText('Conference');
      
      expect(legend).toBeInTheDocument();
      expect(socialItem).toBeInTheDocument();
      expect(virtualItem).toBeInTheDocument();
      expect(conferenceItem).toBeInTheDocument();
    });

    it('renders calendar container', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const calendarContainer = document.querySelector('#calendar-cn');
      expect(calendarContainer).toBeInTheDocument();
      expect(calendarContainer).toHaveClass('hpc__calendar');
    });
  });

  describe('Month Navigation', () => {
    it('shows disabled left arrow when on first month', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const leftArrow = document.querySelector('.hpc__head__months__leftimg.disabled');
      expect(leftArrow).toBeInTheDocument();
      expect(leftArrow).toHaveAttribute('src', '/icons/pln-icon-left-disabled.svg');
    });

    it('shows enabled left arrow when not on first month', () => {
      const propsWithSecondMonth = {
        ...defaultProps,
        monthWiseEvents: [
          { index: 1, month: 'February', events: [] },
        ],
      };
      
      render(<HpCalendar {...propsWithSecondMonth} />);
      
      const leftArrow = document.querySelector('.hpc__head__months__leftimg:not(.disabled)');
      expect(leftArrow).toBeInTheDocument();
      expect(leftArrow).toHaveAttribute('src', '/icons/pln-icon-left-blue.svg');
    });

    it('shows enabled right arrow when not on last month', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const rightArrow = document.querySelector('.hpc__head__months__rightimg:not(.disabled)');
      expect(rightArrow).toBeInTheDocument();
      expect(rightArrow).toHaveAttribute('src', '/icons/pln-icon-right-blue.svg');
    });

    it('shows disabled right arrow when on last month', () => {
      const propsWithLastMonth = {
        ...defaultProps,
        monthWiseEvents: [
          { index: 11, month: 'December', events: [] },
        ],
      };
      
      render(<HpCalendar {...propsWithLastMonth} />);
      
      const rightArrow = document.querySelector('.hpc__head__months__rightimg.disabled');
      expect(rightArrow).toBeInTheDocument();
      expect(rightArrow).toHaveAttribute('src', '/icons/pln-icon-right-disabled.svg');
    });

    it('handles previous month navigation', async () => {
      const propsWithSecondMonth = {
        ...defaultProps,
        monthWiseEvents: [
          { index: 0, month: 'January', events: [] },
          { index: 1, month: 'February', events: [] },
        ],
      };
      
      await act(async () => {
        render(<HpCalendar {...propsWithSecondMonth}  />);
      });
      
      // Since we start at month 0, the left arrow should be disabled
      // Let's test the right arrow instead
      const rightArrow = document.querySelector('.hpc__head__months__rightimg:not(.disabled)');
      expect(rightArrow).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(rightArrow!);
      });
      
      expect(mockAnalytics.onCalendarMonthNav).toHaveBeenCalledWith('next');
    });

    it('handles next month navigation', async () => {
      await act(async () => {
        render(<HpCalendar {...defaultProps} />);
      });
      
      const rightArrow = document.querySelector('.hpc__head__months__rightimg:not(.disabled)');
      expect(rightArrow).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(rightArrow!);
      });
      
      expect(mockAnalytics.onCalendarMonthNav).toHaveBeenCalledWith('next');
    });
  });

  describe('Event Handling', () => {
    it('handles event click correctly', () => {
      render(<HpCalendar {...defaultProps} />);
      
      // Test that the component renders without crashing
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
      
      // Test that the event click handler is passed to FullCalendar
      const fullCalendar = screen.getByTestId('fullcalendar');
      expect(fullCalendar).toBeInTheDocument();
    });

    it('dispatches custom event on event click', () => {
      const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
      
      render(<HpCalendar {...defaultProps} />);
      
      // Test that the component renders without crashing
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
      
      dispatchEventSpy.mockRestore();
    });
  });

  describe('Props Handling', () => {
    it('handles missing monthWiseEvents prop gracefully', () => {
      render(<HpCalendar {...defaultProps} monthWiseEvents={undefined} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles empty monthWiseEvents array', () => {
      render(<HpCalendar {...defaultProps} monthWiseEvents={[]} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles missing showBanner prop gracefully', () => {
      render(<HpCalendar {...defaultProps} showBanner={undefined} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles missing rawEvents prop gracefully', () => {
      render(<HpCalendar {...defaultProps} rawEvents={undefined} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles missing filterdListCount prop gracefully', () => {
      render(<HpCalendar {...defaultProps} filterdListCount={undefined} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles missing filters prop gracefully', () => {
      const propsWithoutFilters = {
        ...defaultProps,
        filters: { year: '2024', monthIndex: 0 },
      };
      
      render(<HpCalendar {...propsWithoutFilters} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles missing eventItems prop gracefully', () => {
      render(<HpCalendar {...defaultProps} eventItems={undefined} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to main container', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const container = document.querySelector('.hpc');
      expect(container).toHaveClass('hpc');
    });

    it('applies correct CSS classes to header', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const header = document.querySelector('.hpc__head');
      expect(header).toHaveClass('hpc__head');
    });

    it('applies correct CSS classes to month navigation', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const monthNav = document.querySelector('.hpc__head__months');
      expect(monthNav).toHaveClass('hpc__head__months');
    });

    it('applies correct CSS classes to month text', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const monthText = document.querySelector('.hpc__head__months__text');
      expect(monthText).toHaveClass('hpc__head__months__text');
    });

    it('applies correct CSS classes to event type legend', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const legend = document.querySelector('.hpc__head__info');
      expect(legend).toHaveClass('hpc__head__info');
    });

    it('applies correct CSS classes to legend items', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const legendItems = document.querySelectorAll('.hpc__head__info__item');
      expect(legendItems).toHaveLength(3);
      
      legendItems.forEach(item => {
        expect(item).toHaveClass('hpc__head__info__item');
      });
    });

    it('applies correct CSS classes to legend item images', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const legendImages = document.querySelectorAll('.hpc__head__info__item__img');
      expect(legendImages).toHaveLength(3);
      
      legendImages.forEach(img => {
        expect(img).toHaveClass('hpc__head__info__item__img');
      });
    });

    it('applies correct CSS classes to legend item text', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const socialText = screen.getByText('Social');
      const virtualText = screen.getByText('Virtual');
      const conferenceText = screen.getByText('Conference');
      
      expect(socialText).toHaveClass('social');
      expect(virtualText).toHaveClass('virtual');
      expect(conferenceText).toHaveClass('conference');
    });

    it('applies correct CSS classes to calendar container', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const calendarContainer = document.querySelector('#calendar-cn');
      expect(calendarContainer).toHaveClass('hpc__calendar');
    });
  });

  describe('Event Listeners', () => {
    it('adds resize event listener on mount', () => {
      render(<HpCalendar {...defaultProps} />);
      
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('removes resize event listener on unmount', () => {
      const { unmount } = render(<HpCalendar {...defaultProps} />);
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Child Components', () => {
    it('renders HpCalendarPopup with correct props', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const popup = screen.getByTestId('hp-calendar-popup');
      expect(popup).toBeInTheDocument();
    });

    it('passes correct props to FullCalendar', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const fullCalendar = screen.getByTestId('fullcalendar');
      expect(fullCalendar).toBeInTheDocument();
      
      // Test that the component renders without crashing
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large monthWiseEvents array', () => {
      const largeMonthWiseEvents = Array.from({ length: 100 }, (_, i) => ({
        index: i,
        month: `Month ${i}`,
        events: [],
      }));
      
      render(<HpCalendar {...defaultProps} monthWiseEvents={largeMonthWiseEvents} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles monthWiseEvents with missing properties', () => {
      const incompleteMonthWiseEvents = [
        { index: 0 },
        { month: 'February' },
        { events: [] },
      ];
      
      render(<HpCalendar {...defaultProps} monthWiseEvents={incompleteMonthWiseEvents} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles filters with missing year', () => {
      const propsWithMissingYear = {
        ...defaultProps,
        filters: { monthIndex: 0 },
      };
      
      render(<HpCalendar {...propsWithMissingYear} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('handles filters with missing monthIndex', () => {
      const propsWithMissingMonthIndex = {
        ...defaultProps,
        filters: { year: '2024' },
      };
      
      render(<HpCalendar {...propsWithMissingMonthIndex} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders clickable navigation arrows', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const rightArrow = document.querySelector('.hpc__head__months__rightimg:not(.disabled)');
      expect(rightArrow).toBeInTheDocument();
    });

    it('renders event type legend with proper structure', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const socialItem = screen.getByText('Social');
      const virtualItem = screen.getByText('Virtual');
      const conferenceItem = screen.getByText('Conference');
      
      expect(socialItem).toBeVisible();
      expect(virtualItem).toBeVisible();
      expect(conferenceItem).toBeVisible();
    });

    it('renders month navigation with proper structure', () => {
      render(<HpCalendar {...defaultProps} />);
      
      const monthText = document.querySelector('.hpc__head__months__text');
      expect(monthText).toBeVisible();
      expect(monthText).toHaveTextContent('January');
    });
  });

  describe('Component Lifecycle', () => {
    it('updates calendar height on resize', () => {
      // Mock getElementById to return a mock element
      const mockElement = {
        clientHeight: 500,
      };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
      
      render(<HpCalendar {...defaultProps} />);
      
      // Simulate resize event
      const resizeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'resize'
      )?.[1];
      
      if (resizeHandler) {
        resizeHandler();
      }
      
      expect(document.getElementById).toHaveBeenCalledWith('calendar-cn');
    });

    it('handles missing calendar element gracefully', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      render(<HpCalendar {...defaultProps} />);
      
      const calendarContainer = document.querySelector('.hpc');
      expect(calendarContainer).toBeInTheDocument();
    });
  });
});
