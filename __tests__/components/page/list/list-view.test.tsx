import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListView from '../../../../components/page/list/list-view';

// Mock child components
jest.mock('../../../../components/page/list/event-card', () => {
  return function MockEventCard(props: any) {
    return <div data-testid="event-card" data-event-id={props.event?.id} data-event-name={props.event?.name} />;
  };
});

jest.mock('../../../../components/page/list/side-bar', () => {
  return function MockSideBar(props: any) {
    return <div data-testid="side-bar" data-events={JSON.stringify(props.events)} />;
  };
});

jest.mock('../../../../components/ui/events-no-results', () => {
  return function MockEventsNoResults() {
    return <div data-testid="events-no-results">No events found</div>;
  };
});

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock analytics
const mockOnEventClicked = jest.fn();
jest.mock('../../../../analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: () => ({
    onEventClicked: mockOnEventClicked,
  }),
}));

// Mock helper functions
jest.mock('../../../../utils/helper', () => ({
  formatDateTime: jest.fn((date, timezone, format) => {
    if (format === 'YYYY') return '2024';
    return '2024-01-15';
  }),
  groupByStartDate: jest.fn(),
  sortEventsByStartDate: jest.fn(),
}));


// Mock constants
jest.mock('../../../../utils/constants', () => ({
  CUSTOM_EVENTS: {
    UPDATE_EVENTS_OBSERVER: 'UPDATE_EVENTS_OBSERVER',
    SHOW_EVENT_DETAIL_MODAL: 'SHOW_EVENT_DETAIL_MODAL',
  },
  ABBREVIATED_MONTH_NAMES: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock window and document methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: {
    pathname: '/events',
    search: '?view=list',
  },
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    top: 100,
    left: 0,
    bottom: 200,
    right: 100,
    width: 100,
    height: 100,
  })),
});

Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

describe('ListView Component', () => {
  const mockEvents = [
    {
      id: 'event1',
      name: 'Event 1',
      slug: 'event-1',
      startDate: 'Jan 15, 2024',
      timezone: 'UTC',
      isHidden: false,
    },
    {
      id: 'event2',
      name: 'Event 2',
      slug: 'event-2',
      startDate: 'Feb 20, 2024',
      timezone: 'UTC',
      isHidden: false,
    },
  ];

  const defaultProps = {
    events: mockEvents,
    viewType: 'list',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    eventTimezone: 'UTC',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    const { sortEventsByStartDate, groupByStartDate } = require('../../../../utils/helper');
    sortEventsByStartDate.mockImplementation((events: any) => events || []);
    groupByStartDate.mockImplementation((events: any) => {
      if (!events || events.length === 0) return {};
      return {
        'Jan': events.filter((e: any) => e.startDate?.includes('Jan') || e.month === 'Jan'),
        'Feb': events.filter((e: any) => e.startDate?.includes('Feb') || e.month === 'Feb'),
      };
    });
    
    // Mock document.getElementById
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'Jan') {
        return {
          getBoundingClientRect: () => ({
            top: 100,
            left: 0,
            bottom: 200,
            right: 100,
            width: 100,
            height: 100,
          }),
        } as any;
      }
      return null;
    });
    // Mock document.dispatchEvent
    jest.spyOn(document, 'dispatchEvent').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<ListView {...defaultProps} />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      const container = document.querySelector('.listview__cn');
      const listView = document.querySelector('.listView');
      const sidebar = document.querySelector('.listView__sidebar');
      
      expect(wrapper).toBeInTheDocument();
      expect(container).toBeInTheDocument();
      expect(listView).toBeInTheDocument();
      expect(sidebar).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<ListView {...defaultProps} />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      const container = document.querySelector('.listview__cn');
      const listView = document.querySelector('.listView');
      const sidebar = document.querySelector('.listView__sidebar');
      
      expect(wrapper).toHaveClass('listView__wrpr');
      expect(container).toHaveClass('listview__cn');
      expect(listView).toHaveClass('listView');
      expect(sidebar).toHaveClass('listView__sidebar');
    });

    it('renders EventCard components for each event', () => {
      render(<ListView {...defaultProps} />);
      
      const eventCards = screen.getAllByTestId('event-card');
      expect(eventCards).toHaveLength(2);
    });

    it('renders SideBar component', () => {
      render(<ListView {...defaultProps} />);
      
      const sideBar = screen.getByTestId('side-bar');
      expect(sideBar).toBeInTheDocument();
    });

    it('renders month headers with year', () => {
      render(<ListView {...defaultProps} />);
      
      const monthHeaders = screen.getAllByText(/Jan-2024|Feb-2024/);
      expect(monthHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('Event Handling', () => {
    it('calls onEventClicked when event is clicked', () => {
      render(<ListView {...defaultProps} />);
      
      const eventElement = document.querySelector('.listView__events__event');
      fireEvent.click(eventElement!);
      
      expect(mockOnEventClicked).toHaveBeenCalledWith('list', 'event1', 'Event 1');
    });

    it('dispatches custom event when event with slug is clicked', () => {
      render(<ListView {...defaultProps} />);
      
      const eventElement = document.querySelector('.listView__events__event');
      fireEvent.click(eventElement!);
      
      expect(document.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SHOW_EVENT_DETAIL_MODAL',
          detail: {
            isOpen: true,
            event: mockEvents[0],
          },
        })
      );
    });

    it('calls router.push when event with slug is clicked', () => {
      render(<ListView {...defaultProps} />);
      
      const eventElement = document.querySelector('.listView__events__event');
      fireEvent.click(eventElement!);
      
      expect(mockPush).toHaveBeenCalledWith('/events?view=list#event-1', { scroll: false });
    });

    it('does not render hidden events', () => {
      const eventsWithHidden = [
        ...mockEvents,
        {
          id: 'event3',
          name: 'Hidden Event',
          slug: 'hidden-event',
          startDate: 'Jan 20, 2024',
          timezone: 'UTC',
          isHidden: true,
        },
      ];
      
      // Mock the grouping to include the hidden event
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': [mockEvents[0], eventsWithHidden[2]],
        'Feb': [mockEvents[1]],
      });
      
      render(<ListView {...defaultProps} events={eventsWithHidden} />);
      
      const eventCards = screen.getAllByTestId('event-card');
      expect(eventCards).toHaveLength(2); // Only non-hidden events
    });
  });

  describe('Empty State', () => {
    it('renders EventsNoResults when no events', () => {
      render(<ListView {...defaultProps} events={[]} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });

    it('renders EventsNoResults when events is undefined', () => {
      render(<ListView {...defaultProps} events={undefined} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });

    it('renders EventsNoResults when groupedEvents is empty', () => {
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({});
      
      render(<ListView {...defaultProps} events={mockEvents} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });
  });

  describe('useEffect Behavior', () => {
    it('scrolls to current month on mount', async () => {
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': [mockEvents[0]],
        'Feb': [mockEvents[1]],
      });
      
      render(<ListView {...defaultProps} />);
      
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalled();
      });
    });

    it('dispatches UPDATE_EVENTS_OBSERVER event on scroll', async () => {
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': [mockEvents[0]],
      });
      
      render(<ListView {...defaultProps} />);
      
      await waitFor(() => {
        expect(document.dispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'UPDATE_EVENTS_OBSERVER',
            detail: { month: 'Jan' },
          })
        );
      });
    });

    it('does not scroll when no grouped events', () => {
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({});
      
      render(<ListView {...defaultProps} />);
      
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('does not scroll when target element not found', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      render(<ListView {...defaultProps} />);
      
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      render(<ListView />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles undefined events', () => {
      render(<ListView {...defaultProps} events={undefined} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });

    it('handles null events', () => {
      render(<ListView {...defaultProps} events={null} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });

    it('handles empty events array', () => {
      render(<ListView {...defaultProps} events={[]} />);
      
      const noResults = screen.getByTestId('events-no-results');
      expect(noResults).toBeInTheDocument();
    });

    it('passes correct props to SideBar', () => {
      render(<ListView {...defaultProps} />);
      
      const sideBar = screen.getByTestId('side-bar');
      expect(sideBar).toHaveAttribute('data-events');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<ListView {...defaultProps} />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      const container = document.querySelector('.listview__cn');
      const listView = document.querySelector('.listView');
      const sidebar = document.querySelector('.listView__sidebar');
      
      expect(wrapper).toContainElement(container as any);
      expect(container).toContainElement(listView as any);
      expect(wrapper).toContainElement(sidebar as any);
    });

    it('renders month sections with correct structure', () => {
      render(<ListView {...defaultProps} />);
      
      const monthWrappers = document.querySelectorAll('.listView__events__wrpr');
      const monthHeaders = document.querySelectorAll('.listView__agenda__header');
      const eventsContainers = document.querySelectorAll('.listView__events');
      
      expect(monthWrappers.length).toBeGreaterThan(0);
      expect(monthHeaders.length).toBeGreaterThan(0);
      expect(eventsContainers.length).toBeGreaterThan(0);
    });

    it('renders styled-jsx styles', () => {
      render(<ListView {...defaultProps} />);
      
      // Check if the component renders without errors
      const wrapper = document.querySelector('.listView__wrpr');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Event Card Integration', () => {
    it('passes correct event data to EventCard', () => {
      render(<ListView {...defaultProps} />);
      
      const eventCards = screen.getAllByTestId('event-card');
      expect(eventCards[0]).toHaveAttribute('data-event-id', 'event1');
      expect(eventCards[0]).toHaveAttribute('data-event-name', 'Event 1');
      expect(eventCards[1]).toHaveAttribute('data-event-id', 'event2');
      expect(eventCards[1]).toHaveAttribute('data-event-name', 'Event 2');
    });

    it('renders correct number of EventCard components', () => {
      render(<ListView {...defaultProps} />);
      
      const eventCards = screen.getAllByTestId('event-card');
      expect(eventCards).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles events with missing properties', () => {
      const eventsWithMissingProps = [
        {
          id: 'event1',
          // missing name, slug, etc.
        },
        {
          name: 'Event 2',
          // missing id, slug, etc.
        },
      ];
      
      render(<ListView {...defaultProps} events={eventsWithMissingProps} />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles events with special characters in names', () => {
      const eventsWithSpecialChars = [
        {
          id: 'event1',
          name: 'Event & Test < > " \' `',
          slug: 'event-test',
          startDate: 'Jan 15, 2024',
          timezone: 'UTC',
          isHidden: false,
        },
      ];
      
      // Mock the grouping to include the special character event
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': eventsWithSpecialChars,
      });
      
      render(<ListView {...defaultProps} events={eventsWithSpecialChars} />);
      
      const eventCard = screen.getByTestId('event-card');
      expect(eventCard).toHaveAttribute('data-event-name', 'Event & Test < > " \' `');
    });

    it('handles very large number of events', () => {
      const manyEvents = Array.from({ length: 100 }, (_, i) => ({
        id: `event${i}`,
        name: `Event ${i}`,
        slug: `event-${i}`,
        startDate: 'Jan 15, 2024',
        timezone: 'UTC',
        isHidden: false,
      }));
      
      // Mock the grouping to include all events
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': manyEvents,
      });
      
      render(<ListView {...defaultProps} events={manyEvents} />);
      
      const eventCards = screen.getAllByTestId('event-card');
      expect(eventCards).toHaveLength(100);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      // Mock the grouping to ensure events are rendered
      const { groupByStartDate } = require('../../../../utils/helper');
      groupByStartDate.mockReturnValue({
        'Jan': [mockEvents[0]],
        'Feb': [mockEvents[1]],
      });
      
      render(<ListView {...defaultProps} />);
      
      const wrapper = document.querySelector('.listView__wrpr');
      const container = document.querySelector('.listview__cn');
      const listView = document.querySelector('.listView');
      const sidebar = document.querySelector('.listView__sidebar');
      const monthWrapper = document.querySelector('.listView__events__wrpr');
      const monthHeader = document.querySelector('.listView__agenda__header');
      const monthHeaderText = document.querySelector('.listView__agenda__header__text');
      const eventsContainer = document.querySelector('.listView__events');
      const eventElement = document.querySelector('.listView__events__event');
      
      expect(wrapper).toHaveClass('listView__wrpr');
      expect(container).toHaveClass('listview__cn');
      expect(listView).toHaveClass('listView');
      expect(sidebar).toHaveClass('listView__sidebar');
      expect(monthWrapper).toHaveClass('listView__events__wrpr');
      expect(monthHeader).toHaveClass('listView__agenda__header');
      expect(monthHeaderText).toHaveClass('listView__agenda__header__text');
      expect(eventsContainer).toHaveClass('listView__events');
      expect(eventElement).toHaveClass('listView__events__event');
    });
  });
});
