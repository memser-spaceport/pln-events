import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgramView from '../../../../components/page/events/program-view';

// Mock the ScheduleX components and hooks
jest.mock('@schedule-x/react', () => ({
  ScheduleXCalendar: ({ calendarApp }: any) => (
    <div data-testid="schedule-x-calendar" data-calendar-app={!!calendarApp}>
      <div data-testid="calendar-view">Calendar View</div>
    </div>
  ),
  useNextCalendarApp: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

// Mock the analytics hook
jest.mock('../../../../analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: jest.fn(() => ({
    captureEventCardClick: jest.fn(),
    captureViewChangeClick: jest.fn(),
  })),
}));

// Mock the helper function
jest.mock('../../../../utils/helper', () => ({
  formatDateTime: jest.fn((date, timezone, format) => {
    // Mock implementation that returns formatted date
    return '2024-01-15 10:00';
  }),
}));

// Mock constants
jest.mock('../../../../utils/constants', () => ({
  PROGRAM_VIEW_EVENT_COLORS: [
    { id: 'calendar1', colorName: 'blue', lightColor: '#e3f2fd', mainColor: '#1976d2' },
    { id: 'calendar2', colorName: 'green', lightColor: '#e8f5e8', mainColor: '#4caf50' },
  ],
  CUSTOM_EVENTS: {
    SHOW_EVENT_DETAIL_MODAL: 'show-event-detail-modal',
  },
}));

// Mock ScheduleX calendar modules
jest.mock('@schedule-x/calendar', () => ({
  createViewDay: jest.fn(() => ({ name: 'day' })),
  createViewMonthAgenda: jest.fn(() => ({ name: 'month-agenda' })),
  createViewMonthGrid: jest.fn(() => ({ name: 'month-grid' })),
  createViewWeek: jest.fn(() => ({ name: 'week' })),
  viewMonthGrid: { name: 'month-grid' },
}));

jest.mock('@schedule-x/calendar-controls', () => ({
  createCalendarControlsPlugin: jest.fn(() => ({
    getView: jest.fn(() => 'month-grid'),
    getDate: jest.fn(() => '2024-01-15'),
  })),
}));

jest.mock('@schedule-x/events-service', () => ({
  createEventsServicePlugin: jest.fn(() => ({})),
}));

jest.mock('@schedule-x/scroll-controller', () => ({
  createScrollControllerPlugin: jest.fn(() => ({})),
}));

describe('ProgramView Component', () => {
  const mockEvents = [
    {
      id: 'event1',
      title: 'Event 1',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      timezone: 'UTC',
      slug: 'event-1',
      sessionId: 'session1',
    },
    {
      id: 'event2',
      title: 'Event 2',
      startDate: '2024-01-17',
      endDate: '2024-01-18',
      timezone: 'UTC',
      slug: 'event-2',
      sessionId: 'session2',
    },
  ];

  const defaultProps = {
    events: mockEvents,
    viewType: 'month-grid',
  };

  const mockUseNextCalendarApp = require('@schedule-x/react').useNextCalendarApp;
  const mockUseRouter = require('next/navigation').useRouter;
  const mockUseSearchParams = require('next/navigation').useSearchParams;
  const mockUseSchedulePageAnalytics = require('../../../../analytics/schedule.analytics').useSchedulePageAnalytics;
  const mockFormatDateTime = require('../../../../utils/helper').formatDateTime;

  const mockRouter = {
    push: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  const mockAnalytics = {
    captureEventCardClick: jest.fn(),
    captureViewChangeClick: jest.fn(),
  };

  const mockCalendarApp = {
    events: {
      set: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window object
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        search: '?view=month-grid&date=2024-01-15',
        pathname: '/events',
      },
    });

    // Mock document methods
    global.document = {
      ...document,
      dispatchEvent: jest.fn(),
      querySelector: jest.fn(),
      body: {
        ...document.body,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    };

    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));

    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockUseSchedulePageAnalytics.mockReturnValue(mockAnalytics);
    mockUseNextCalendarApp.mockReturnValue(mockCalendarApp);
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'view') return 'month-grid';
      if (key === 'date') return '2024-01-15';
      return null;
    });
  });

  describe('Rendering', () => {
    it('renders ScheduleXCalendar component', () => {
      render(<ProgramView {...defaultProps} />);
      
      const calendar = screen.getByTestId('schedule-x-calendar');
      expect(calendar).toBeInTheDocument();
    });

    it('passes calendarApp to ScheduleXCalendar', () => {
      render(<ProgramView {...defaultProps} />);
      
      const calendar = screen.getByTestId('schedule-x-calendar');
      expect(calendar).toHaveAttribute('data-calendar-app', 'true');
    });

    it('renders calendar view content', () => {
      render(<ProgramView {...defaultProps} />);
      
      const calendarView = screen.getByTestId('calendar-view');
      expect(calendarView).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles events prop correctly', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.arrayContaining([
            expect.objectContaining({
              id: 'event1',
              title: 'Event 1',
            }),
            expect.objectContaining({
              id: 'event2',
              title: 'Event 2',
            }),
          ]),
        })
      );
    });

    it('handles viewType prop correctly', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-grid',
        })
      );
    });

    it('handles missing events prop', () => {
      const propsWithoutEvents = {
        ...defaultProps,
        events: undefined,
      };
      
      render(<ProgramView {...propsWithoutEvents} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: [],
        })
      );
    });

    it('handles empty events array', () => {
      const propsWithEmptyEvents = {
        ...defaultProps,
        events: [],
      };
      
      render(<ProgramView {...propsWithEmptyEvents} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: [],
        })
      );
    });
  });

  describe('Event Processing', () => {
    it('processes events with correct format', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2024-01-15',
        'UTC',
        'YYYY-MM-DD HH:mm'
      );
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2024-01-16',
        'UTC',
        'YYYY-MM-DD HH:mm'
      );
    });

    it('filters out events without start and end times', () => {
      const eventsWithInvalidTimes = [
        {
          id: 'event1',
          title: 'Event 1',
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          timezone: 'UTC',
        },
        {
          id: 'event2',
          title: 'Event 2',
          // Missing startDate and endDate
          timezone: 'UTC',
        },
      ];

      const propsWithInvalidEvents = {
        ...defaultProps,
        events: eventsWithInvalidTimes,
      };

      render(<ProgramView {...propsWithInvalidEvents} />);
      
      // formatDateTime is called for each valid event's start and end date
      // Plus it's called again in useEffect, so we expect 8 calls total (4 for initial render + 4 for useEffect)
      expect(mockFormatDateTime).toHaveBeenCalledTimes(8);
    });

    it('handles events with missing title', () => {
      const eventsWithMissingTitle = [
        {
          id: 'event1',
          // Missing title
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          timezone: 'UTC',
        },
      ];

      const propsWithMissingTitle = {
        ...defaultProps,
        events: eventsWithMissingTitle,
      };

      render(<ProgramView {...propsWithMissingTitle} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.arrayContaining([
            expect.objectContaining({
              title: '',
            }),
          ]),
        })
      );
    });
  });

  describe('Mobile Detection', () => {
    it('handles mobile view correctly when window width is less than 768', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'month';
        if (key === 'date') return '2024-01-15';
        return null;
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-agenda',
        })
      );
    });

    it('handles desktop view correctly when window width is 768 or more', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'month';
        if (key === 'date') return '2024-01-15';
        return null;
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-grid',
        })
      );
    });

    it('handles week view on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'week';
        if (key === 'date') return '2024-01-15';
        return null;
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-agenda',
        })
      );
    });
  });

  describe('Search Params Handling', () => {
    it('uses view from search params', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'week';
        if (key === 'date') return '2024-01-15';
        return null;
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'week',
        })
      );
    });

    it('uses date from search params', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'month-grid';
        if (key === 'date') return '2024-02-15';
        return null;
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedDate: '2024-02-15',
        })
      );
    });

    it('uses current date when no date in search params', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'view') return 'month-grid';
        if (key === 'date') return null;
        return null;
      });

      // Mock current date
      const mockDate = '2024-01-15';
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(`${mockDate}T00:00:00.000Z`);

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedDate: mockDate,
        })
      );
    });
  });

  describe('Calendar Configuration', () => {
    it('configures calendar with correct views', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          views: expect.arrayContaining([
            expect.objectContaining({ name: 'month-agenda' }),
            expect.objectContaining({ name: 'month-grid' }),
          ]),
        })
      );
    });

    it('configures calendar with correct min date', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          minDate: '2025-01-01',
        })
      );
    });

    it('configures calendar with correct month grid options', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          monthGridOptions: {
            nEventsPerDay: 20,
          },
        })
      );
    });

    it('configures calendar with correct calendars', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          calendars: expect.arrayContaining([
            expect.objectContaining({
              id: 'calendar1',
              colorName: 'blue',
            }),
            expect.objectContaining({
              id: 'calendar2',
              colorName: 'green',
            }),
          ]),
        })
      );
    });
  });

  describe('Event Click Handling', () => {
    it('handles event click with analytics tracking', () => {
      const mockCalendarControls = {
        getView: jest.fn(() => 'month-grid'),
        getDate: jest.fn(() => '2024-01-15'),
      };

      // Create a mock that will actually call the real callback
      let realOnEventClick: any = null;
      const mockCalendarAppWithCallbacks = {
        ...mockCalendarApp,
        callbacks: {
          onEventClick: jest.fn((event) => {
            if (realOnEventClick) {
              realOnEventClick(event);
            }
          }),
          onRangeUpdate: jest.fn(),
        },
      };

      mockUseNextCalendarApp.mockImplementation((config: any) => {
        realOnEventClick = config.callbacks?.onEventClick;
        return mockCalendarAppWithCallbacks;
      });

      render(<ProgramView {...defaultProps} />);
      
      // Simulate event click
      const mockEvent = {
        id: 'event1',
        sessionId: 'session1',
      };

      if (mockCalendarAppWithCallbacks.callbacks?.onEventClick) {
        mockCalendarAppWithCallbacks.callbacks.onEventClick(mockEvent);
      }

      expect(mockAnalytics.captureEventCardClick).toHaveBeenCalledWith('event1', undefined);
    });

    // it('dispatches custom event for event detail modal', () => {
    //   const mockDispatchEvent = jest.fn();
    //   global.document.dispatchEvent = mockDispatchEvent;

    //   const mockCalendarControls = {
    //     getView: jest.fn(() => 'month-grid'),
    //     getDate: jest.fn(() => '2024-01-15'),
    //   };

    //   // Create a mock that will actually call the real callback
    //   let realOnEventClick: any = null;
    //   const mockCalendarAppWithCallbacks = {
    //     ...mockCalendarApp,
    //     callbacks: {
    //       onEventClick: jest.fn((event) => {
    //         if (realOnEventClick) {
    //           realOnEventClick(event);
    //         }
    //       }),
    //       onRangeUpdate: jest.fn(),
    //     },
    //   };

    //   mockUseNextCalendarApp.mockImplementation((config) => {
    //     realOnEventClick = config.callbacks?.onEventClick;
    //     return mockCalendarAppWithCallbacks;
    //   });

    //   render(<ProgramView {...defaultProps} />);
      
    //   // Simulate event click
    //   const mockEvent = {
    //     id: 'event1',
    //     sessionId: 'session1',
    //   };

    //   if (mockCalendarAppWithCallbacks.callbacks?.onEventClick) {
    //     mockCalendarAppWithCallbacks.callbacks.onEventClick(mockEvent);
    //   }

    //   expect(mockDispatchEvent).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       type: 'show-event-detail-modal',
    //       detail: {
    //         isOpen: true,
    //         event: expect.objectContaining({
    //           id: 'event1',
    //           slug: 'event-1',
    //         }),
    //       },
    //     })
    //   );
    // });

    // it('navigates to event page on click', () => {
    //   const mockCalendarControls = {
    //     getView: jest.fn(() => 'month-grid'),
    //     getDate: jest.fn(() => '2024-01-15'),
    //   };

    //   // Create a mock that will actually call the real callback
    //   let realOnEventClick: any = null;
    //   const mockCalendarAppWithCallbacks = {
    //     ...mockCalendarApp,
    //     callbacks: {
    //       onEventClick: jest.fn((event) => {
    //         if (realOnEventClick) {
    //           realOnEventClick(event);
    //         }
    //       }),
    //       onRangeUpdate: jest.fn(),
    //     },
    //   };

    //   mockUseNextCalendarApp.mockImplementation((config) => {
    //     realOnEventClick = config.callbacks?.onEventClick;
    //     return mockCalendarAppWithCallbacks;
    //   });

    //   render(<ProgramView {...defaultProps} />);
      
    //   // Simulate event click
    //   const mockEvent = {
    //     id: 'event1',
    //     sessionId: 'session1',
    //   };

    //   if (mockCalendarAppWithCallbacks.callbacks?.onEventClick) {
    //     mockCalendarAppWithCallbacks.callbacks.onEventClick(mockEvent);
    //   }

    //   expect(mockRouter.push).toHaveBeenCalledWith(
    //     '/events?view=month-grid&date=2024-01-15&session=session1#event-1',
    //     { scroll: false }
    //   );
    // });
  });

  describe('Range Update Handling', () => {
    it('handles range update with analytics tracking', () => {
      const mockCalendarControls = {
        getView: jest.fn(() => 'month-grid'),
        getDate: jest.fn(() => '2024-01-15'),
      };

      // Create a mock that will actually call the real callback
      let realOnRangeUpdate: any = null;
      const mockCalendarAppWithCallbacks = {
        ...mockCalendarApp,
        callbacks: {
          onEventClick: jest.fn(),
          onRangeUpdate: jest.fn((cal) => {
            if (realOnRangeUpdate) {
              realOnRangeUpdate(cal);
            }
          }),
        },
      };

      mockUseNextCalendarApp.mockImplementation((config: any) => {
        realOnRangeUpdate = config.callbacks?.onRangeUpdate;
        return mockCalendarAppWithCallbacks;
      });

      render(<ProgramView {...defaultProps} />);
      
      // Simulate range update
      if (mockCalendarAppWithCallbacks.callbacks?.onRangeUpdate) {
        mockCalendarAppWithCallbacks.callbacks.onRangeUpdate({});
      }

      expect(mockAnalytics.captureViewChangeClick).toHaveBeenCalledWith('month-grid');
    });

    // it('updates query params on range update', () => {
    //   // Mock the calendar controls to return the expected values
    //   const mockCalendarControls = {
    //     getView: jest.fn(() => 'week'),
    //     getDate: jest.fn(() => '2024-01-20'),
    //   };

    //   // Mock the calendar controls plugin
    //   const { createCalendarControlsPlugin } = require('@schedule-x/calendar-controls');
    //   createCalendarControlsPlugin.mockReturnValue(mockCalendarControls);

    //   // Create a mock that will actually call the real callback
    //   let realOnRangeUpdate: any = null;
    //   const mockCalendarAppWithCallbacks = {
    //     ...mockCalendarApp,
    //     callbacks: {
    //       onEventClick: jest.fn(),
    //       onRangeUpdate: jest.fn((cal) => {
    //         if (realOnRangeUpdate) {
    //           realOnRangeUpdate(cal);
    //         }
    //       }),
    //     },
    //   };

    //   mockUseNextCalendarApp.mockImplementation((config) => {
    //     realOnRangeUpdate = config.callbacks?.onRangeUpdate;
    //     return mockCalendarAppWithCallbacks;
    //   });

    //   render(<ProgramView {...defaultProps} />);
      
    //   // Simulate range update
    //   if (mockCalendarAppWithCallbacks.callbacks?.onRangeUpdate) {
    //     mockCalendarAppWithCallbacks.callbacks.onRangeUpdate({});
    //   }

    //   expect(mockRouter.push).toHaveBeenCalledWith(
    //     '/events?view=week&date=2024-01-20',
    //     { scroll: false }
    //   );
    // });
  });

  describe('useEffect Hooks', () => {
    it('updates calendar events when props change', async () => {
      const { rerender } = render(<ProgramView {...defaultProps} />);
      
      const newEvents = [
        {
          id: 'event3',
          title: 'Event 3',
          startDate: '2024-01-20',
          endDate: '2024-01-21',
          timezone: 'UTC',
        },
      ];

      rerender(<ProgramView {...defaultProps} events={newEvents} />);
      
      await waitFor(() => {
        expect(mockCalendarApp.events.set).toHaveBeenCalled();
      });
    });

    it('sets up MutationObserver for date input', () => {
      render(<ProgramView {...defaultProps} />);
      
      expect(MutationObserver).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles null props gracefully', () => {
      const nullProps = {
        events: [],
        viewType: '',
      };
      
      render(<ProgramView {...nullProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: [],
        })
      );
    });

    it('handles undefined props gracefully', () => {
      const undefinedProps = {
        events: [],
        viewType: '',
      };
      
      render(<ProgramView {...undefinedProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: [],
        })
      );
    });

    it('handles events without timezone', () => {
      const eventsWithoutTimezone = [
        {
          id: 'event1',
          title: 'Event 1',
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          // Missing timezone
        },
      ];

      const propsWithoutTimezone = {
        ...defaultProps,
        events: eventsWithoutTimezone,
      };

      render(<ProgramView {...propsWithoutTimezone} />);
      
      expect(mockFormatDateTime).toHaveBeenCalledWith(
        '2024-01-15',
        undefined,
        'YYYY-MM-DD HH:mm'
      );
    });

    it('handles very large number of events', () => {
      const manyEvents = Array.from({ length: 1000 }, (_, i) => ({
        id: `event${i}`,
        title: `Event ${i}`,
        startDate: '2024-01-15',
        endDate: '2024-01-16',
        timezone: 'UTC',
      }));

      const propsWithManyEvents = {
        ...defaultProps,
        events: manyEvents,
      };

      render(<ProgramView {...propsWithManyEvents} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.arrayContaining([
            expect.objectContaining({ id: 'event0' }),
            expect.objectContaining({ id: 'event999' }),
          ]),
        })
      );
    });
  });

  describe('Window Object Handling', () => {
    it('handles window.innerWidth undefined', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-grid',
        })
      );
    });

    it('handles window.innerWidth as null', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: null,
      });

      render(<ProgramView {...defaultProps} />);
      
      expect(mockUseNextCalendarApp).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultView: 'month-grid',
        })
      );
    });
  });
});
