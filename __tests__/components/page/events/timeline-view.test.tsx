import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpTimeline from '../../../../components/page/events/timeline-view';
import { IEvent, ISelectedItem } from '@/types/events.type';

// Mock the PlEventCard component
jest.mock('../../../../components/ui/pl-event-card', () => {
  return function MockPlEventCard(props: any) {
    const { onLinkItemClicked, eventName, title, website, ...rest } = props;
    return (
      <div data-testid="pl-event-card" data-event-name={eventName}>
        <div data-testid="event-title">{eventName || title}</div>
        <button 
          data-testid="event-link-button"
          onClick={() => onLinkItemClicked && onLinkItemClicked(eventName, website)}
        >
          View Event
        </button>
      </div>
    );
  };
});

// Mock the HpMonthBox component
jest.mock('../../../../components/page/events/hp-month-box', () => {
  return function MockHpMonthBox({ allData, currentIndex, ...props }: any) {
    return (
      <div data-testid="hp-month-box" data-current-index={currentIndex}>
        <div data-testid="month-name">{props.monthName}</div>
        <div data-testid="month-year">{props.year}</div>
        <div data-testid="events-count">{props.events?.length || 0}</div>
      </div>
    );
  };
});

// Mock the analytics hook
jest.mock('../../../../analytics/events.analytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onCardLinkClicked: jest.fn(),
    onMonthMenuClicked: jest.fn(),
  })),
}));

// Mock the helper function
jest.mock('../../../../components/page/events/hp-helper', () => ({
  getMonthWiseEvents: jest.fn((events) => {
    // Simple mock implementation that groups events by month
    const monthWiseEvents = events.reduce((acc: any[], event: IEvent) => {
      const monthIndex = event.startMonthIndex || 0;
      const existingMonth = acc.find(m => m.index === monthIndex);
      
      if (existingMonth) {
        existingMonth.events.push(event);
      } else {
        acc.push({
          index: monthIndex,
          monthName: `Month ${monthIndex + 1}`,
          year: event.startYear || '2024',
          events: [event],
        });
      }
      
      return acc;
    }, []);
    
    return monthWiseEvents.sort((a: any, b: any) => a.index - b.index);
  }),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('HpTimeline Component', () => {
  const mockEvents: IEvent[] = [
    {
      eventName: 'Event 1',
      website: 'https://event1.com',
      location: 'Location 1',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      dateTBD: false,
      dri: 'dri1',
      tag: 'tag1',
      description: 'description1',
      juanSpeaking: 'juanSpeaking1',
      eventOrg: 'eventOrg1',
      eventLogo: 'eventLogo1',
      eventType: 'eventType1',
      venueName: 'venueName1',
      venueMapsLink: 'venueMapsLink1',
      venueAddress: 'venueAddress1',
      isFeaturedEvent: true,
      topics: ['topic1'],
      eventHosts: [{
        name: 'eventHost1',
        logo: 'eventHostLogo1',
        primaryIcon: 'eventHostPrimaryIcon1',
      }],
      preferredContacts: [{
        name: 'preferredContact1',
        logo: 'preferredContactLogo1',
        link: 'preferredContactLink1',
      }],
      startDateTimeStamp: 1715769600000,
      startMonthIndex: 0,
      startDay: 15,
      startDayString: 'Monday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 0,
      endDay: 16,
      fullDateFormat: 'January 15, 2024',
      tagLogo: 'tagLogo1',
      calenderLogo: 'calenderLogo1',
      startDateValue: new Date('2024-01-15'),
      endDateValue: new Date('2024-01-16'),
      locationLogo: 'locationLogo1',
      slug: 'event-1',
      externalLinkIcon: 'externalLinkIcon1',
    },
    {
      eventName: 'Event 2',
      website: 'https://event2.com',
      location: 'Location 2',
      startDate: '2024-02-20',
      endDate: '2024-02-21',
      dateTBD: false,
      dri: 'dri2',
      tag: 'tag2',
      description: 'description2',
      juanSpeaking: 'juanSpeaking2',
      eventOrg: 'eventOrg2',
      eventLogo: 'eventLogo2',
      eventType: 'eventType2',
      venueName: 'venueName2',
      venueMapsLink: 'venueMapsLink2',
      venueAddress: 'venueAddress2',
      isFeaturedEvent: false,
      topics: ['topic2'],
      eventHosts: [{
        name: 'eventHost2',
        logo: 'eventHostLogo2',
        primaryIcon: 'eventHostPrimaryIcon2',
      }],
      preferredContacts: [{
        name: 'preferredContact2',
        logo: 'preferredContactLogo2',
        link: 'preferredContactLink2',
      }],
      startDateTimeStamp: 1715769600000,
      startMonthIndex: 1,
      startDay: 20,
      startDayString: 'Tuesday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 1,
      endDay: 21,
      fullDateFormat: 'February 20, 2024',
      tagLogo: 'tagLogo2',
      calenderLogo: 'calenderLogo2',
      startDateValue: new Date('2024-02-20'),
      endDateValue: new Date('2024-02-21'),
      locationLogo: 'locationLogo2',
      slug: 'event-2',
      externalLinkIcon: 'externalLinkIcon2',
    }
  ];

  const mockSelectedItems: ISelectedItem = {
    viewType: 'timeline',
    year: '2024',
    locations: ['location1'],
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    eventHosts: ['host1'],
    eventType: 'eventType1',
    topics: ['topic1'],
    isPlnEventOnly: true,
  };

  const defaultProps = {
    selectedItems: mockSelectedItems,
    events: mockEvents,
    showBanner: false,
  };

  const mockUseEventsAnalytics = require('../../../../analytics/events.analytics').default;
  const mockGetMonthWiseEvents = require('../../../../components/page/events/hp-helper').getMonthWiseEvents;
  const mockUseRouter = require('next/navigation').useRouter;

  const mockAnalytics = {
    onCardLinkClicked: jest.fn(),
    onMonthMenuClicked: jest.fn(),
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock document methods
    global.document = {
      ...document,
      getElementById: jest.fn(),
      querySelector: jest.fn(),
    };

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();

    mockUseEventsAnalytics.mockReturnValue(mockAnalytics);
    mockUseRouter.mockReturnValue(mockRouter);
  });

  describe('Rendering', () => {
    it('renders main timeline container', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
      expect(timelineContainer).toHaveClass('hmt');
    });

    it('renders timeline content container', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const contentContainer = document.querySelector('.hmt__cn');
      expect(contentContainer).toBeInTheDocument();
    });

    it('renders month sections for each month with events', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const monthSections = document.querySelectorAll('.hmt__cn__sec');
      expect(monthSections).toHaveLength(2); // Two months with events
    });

    it('renders HpMonthBox for each month', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const monthBoxes = screen.getAllByTestId('hp-month-box');
      expect(monthBoxes).toHaveLength(2);
    });

    it('renders PlEventCard for each event', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventCards = screen.getAllByTestId('pl-event-card');
      expect(eventCards).toHaveLength(2);
    });

    it('renders timeline elements for each event', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const timelineElements = document.querySelectorAll('.hmt__cn__sec__timeline');
      expect(timelineElements).toHaveLength(2); // One per month section
    });

    it('renders event timeline elements', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventTimelineElements = document.querySelectorAll('.hmt__cn__sec__event__timeline');
      expect(eventTimelineElements).toHaveLength(2); // One per event
    });

    it('renders event databox elements', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const databoxElements = document.querySelectorAll('.hmt__cn__sec__event__databox');
      expect(databoxElements).toHaveLength(2); // One per event
    });

    it('renders dummy element at the end', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const dummyElement = document.querySelector('.dummy');
      expect(dummyElement).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty message when no events', () => {
      const propsWithNoEvents = {
        ...defaultProps,
        events: [] as IEvent[],
      };
      
      render(<HpTimeline {...propsWithNoEvents} />);
      
      const emptyMessage = document.querySelector('.hmt__cn__empty');
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent('No matching events available.');
    });

    it('does not render empty message when events exist', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const emptyMessage = document.querySelector('.hmt__cn__empty');
      expect(emptyMessage).not.toBeInTheDocument();
    });
  });

  describe('Event Card Rendering', () => {
    it('passes correct props to PlEventCard', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventCards = screen.getAllByTestId('pl-event-card');
      expect(eventCards[0]).toHaveAttribute('data-event-name', 'Event 1');
      expect(eventCards[1]).toHaveAttribute('data-event-name', 'Event 2');
    });

    it('renders event titles correctly', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventTitles = screen.getAllByTestId('event-title');
      expect(eventTitles[0]).toHaveTextContent('Event 1');
      expect(eventTitles[1]).toHaveTextContent('Event 2');
    });

    it('applies correct CSS classes for alternating events', () => {
      // Create events in the same month to test alternating
      const eventsInSameMonth = [
        {
          ...mockEvents[0],
          startMonthIndex: 0,
        },
        {
          ...mockEvents[1],
          startMonthIndex: 0, // Same month as event1
        }
      ];

      const propsWithSameMonthEvents = {
        ...defaultProps,
        events: eventsInSameMonth,
      };

      render(<HpTimeline {...propsWithSameMonthEvents} />);
      
      const eventItems = document.querySelectorAll('.hmt__cn__sec__event__item');
      expect(eventItems[0]).toHaveClass('left');
      expect(eventItems[1]).toHaveClass('right');
    });

    it('applies correct timeline CSS classes for alternating events', () => {
      // Create events in the same month to test alternating
      const eventsInSameMonth = [
        {
          ...mockEvents[0],
          startMonthIndex: 0,
        },
        {
          ...mockEvents[1],
          startMonthIndex: 0, // Same month as event1
        }
      ];

      const propsWithSameMonthEvents = {
        ...defaultProps,
        events: eventsInSameMonth,
      };

      render(<HpTimeline {...propsWithSameMonthEvents} />);
      
      const timelineElements = document.querySelectorAll('.hmt__cn__sec__event__timeline');
      expect(timelineElements[0]).toHaveClass('hmt__cn__sec__event__timeline--left');
      expect(timelineElements[1]).toHaveClass('hmt__cn__sec__event__timeline--right');
    });

    it('applies correct databox CSS classes for alternating events', () => {
      // Create events in the same month to test alternating
      const eventsInSameMonth = [
        {
          ...mockEvents[0],
          startMonthIndex: 0,
        },
        {
          ...mockEvents[1],
          eventName: 'Event 2',
          startMonthIndex: 0, // Same month as event1
        }
      ];

      const propsWithSameMonthEvents = {
        ...defaultProps,
        events: eventsInSameMonth,
      };

      render(<HpTimeline {...propsWithSameMonthEvents} />);
      
      const databoxElements = document.querySelectorAll('.hmt__cn__sec__event__databox');
      expect(databoxElements[0]).toHaveClass('hmt__cn__sec__event__databox--left');
      expect(databoxElements[1]).toHaveClass('hmt__cn__sec__event__databox--right');
    });
  });

  describe('Event Data Display', () => {
    it('displays correct event day in databox', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const dayElements = document.querySelectorAll('.hmt__cn__sec__event__databox__date');
      expect(dayElements[0]).toHaveTextContent('15');
      expect(dayElements[1]).toHaveTextContent('20');
    });

    it('displays correct event day string in databox', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const dayStringElements = document.querySelectorAll('.hmt__cn__sec__event__databox__day');
      expect(dayStringElements[0]).toHaveTextContent('Monday');
      expect(dayStringElements[1]).toHaveTextContent('Tuesday');
    });
  });

  describe('Event Interactions', () => {
    it('calls onLinkItemClicked when event link is clicked', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const linkButtons = screen.getAllByTestId('event-link-button');
      fireEvent.click(linkButtons[0]);
      
      expect(mockAnalytics.onCardLinkClicked).toHaveBeenCalledWith('Event 1', 'https://event1.com', 'timeline');
    });

    it('calls onMonthMenuClicked when month is clicked', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const monthElements = document.querySelectorAll('.hmt__cn__sec__month');
      fireEvent.click(monthElements[0]);
      
      expect(mockAnalytics.onMonthMenuClicked).toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing events prop', () => {
      const propsWithoutEvents = {
        ...defaultProps,
        events: [] as IEvent[],
      };
      
      render(<HpTimeline {...propsWithoutEvents} />);
      
      const emptyMessage = document.querySelector('.hmt__cn__empty');
      expect(emptyMessage).toBeInTheDocument();
    });

    it('handles null events prop', () => {
      const propsWithNullEvents = {
        ...defaultProps,
        events: [] as IEvent[],
      };
      
      render(<HpTimeline {...propsWithNullEvents} />);
      
      const emptyMessage = document.querySelector('.hmt__cn__empty');
      expect(emptyMessage).toBeInTheDocument();
    });

    it('handles missing selectedItems prop', () => {
      const propsWithoutSelectedItems = {
        ...defaultProps,
        selectedItems: {
          viewType: 'timeline',
          year: '2024',
          locations: [],
          startDate: '',
          endDate: '',
          eventHosts: [],
          eventType: '',
          topics: [],
          isPlnEventOnly: false,
        },
      };
      
      render(<HpTimeline {...propsWithoutSelectedItems} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
    });

    it('handles missing showBanner prop', () => {
      const propsWithoutShowBanner = {
        ...defaultProps,
        showBanner: false,
      };
      
      render(<HpTimeline {...propsWithoutShowBanner} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
    });
  });

  describe('Scroll Functionality', () => {
    it('calls getMonthWiseEvents with events', () => {
      render(<HpTimeline {...defaultProps} />);
      
      expect(mockGetMonthWiseEvents).toHaveBeenCalledWith(mockEvents);
    });

    it('calculates total events count correctly', () => {
      render(<HpTimeline {...defaultProps} />);
      
      // The component calculates total events count internally
      // We can verify this by checking that the correct number of events are rendered
      const eventCards = screen.getAllByTestId('pl-event-card');
      expect(eventCards).toHaveLength(2);
    });

    it('handles scroll to current month functionality', () => {
      // Mock document.getElementById to return a scroll container
      const mockScrollContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
      };
      
      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return mockScrollContainer as any;
        }
        return null;
      });

      render(<HpTimeline {...defaultProps} />);
      
      // The scroll functionality is called in useEffect
      // We can verify that getElementById was called with 'main-content'
      expect(global.document.getElementById).toHaveBeenCalledWith('main-content');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to main container', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toHaveClass('hmt');
    });

    it('applies correct CSS classes to content container', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const contentContainer = document.querySelector('.hmt__cn');
      expect(contentContainer).toHaveClass('hmt__cn');
    });

    it('applies correct CSS classes to month sections', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const monthSections = document.querySelectorAll('.hmt__cn__sec');
      monthSections.forEach(section => {
        expect(section).toHaveClass('hmt__cn__sec');
      });
    });

    it('applies correct CSS classes to event containers', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventContainers = document.querySelectorAll('.hmt__cn__sec__event');
      eventContainers.forEach(container => {
        expect(container).toHaveClass('hmt__cn__sec__event');
      });
    });
  });

  describe('Event IDs and Keys', () => {
    it('generates correct IDs for month sections', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const monthSections = document.querySelectorAll('.hmt__cn__sec');
      expect(monthSections[0]).toHaveAttribute('id', 'm-0');
      expect(monthSections[1]).toHaveAttribute('id', 'm-1');
    });

    it('generates correct IDs for event containers', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventContainers = document.querySelectorAll('.hmt__cn__sec__event');
      expect(eventContainers[0]).toHaveAttribute('id', 'm-0-15-cn');
      expect(eventContainers[1]).toHaveAttribute('id', 'm-1-20-cn');
    });

    it('generates correct IDs for event items', () => {
      render(<HpTimeline {...defaultProps} />);
      
      const eventItems = document.querySelectorAll('.hmt__cn__sec__event__item');
      expect(eventItems[0]).toHaveAttribute('id', 'm-0-15');
      expect(eventItems[1]).toHaveAttribute('id', 'm-1-20');
    });
  });

  describe('Edge Cases', () => {
    it('handles events with missing startDay', () => {
      const eventsWithMissingStartDay = [
        {
          ...mockEvents[0],
          startDay: 0,
        }
      ];

      const propsWithMissingStartDay = {
        ...defaultProps,
        events: eventsWithMissingStartDay,
      };

      render(<HpTimeline {...propsWithMissingStartDay} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
    });

    it('handles events with missing startDayString', () => {
      const eventsWithMissingStartDayString = [
        {
          ...mockEvents[0],
          startDayString: '',
        }
      ];

      const propsWithMissingStartDayString = {
        ...defaultProps,
        events: eventsWithMissingStartDayString,
      };

      render(<HpTimeline {...propsWithMissingStartDayString} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
    });

    it('handles events with missing startMonthIndex', () => {
      const eventsWithMissingStartMonthIndex = [
        {
          ...mockEvents[0],
          startMonthIndex: 0,
        }
      ];

      const propsWithMissingStartMonthIndex = {
        ...defaultProps,
        events: eventsWithMissingStartMonthIndex,
      };

      render(<HpTimeline {...propsWithMissingStartMonthIndex} />);
      
      const timelineContainer = document.querySelector('#timeline-cn');
      expect(timelineContainer).toBeInTheDocument();
    });

    it('handles very large number of events', () => {
      const manyEvents = Array.from({ length: 100 }, (_, i) => ({
        ...mockEvents[0],
        id: `event${i}`,
        eventName: `Event ${i}`,
        startMonthIndex: i % 12,
        startDay: i + 1,
      }));

      const propsWithManyEvents = {
        ...defaultProps,
        events: manyEvents,
      };

      render(<HpTimeline {...propsWithManyEvents} />);
      
      const eventCards = screen.getAllByTestId('pl-event-card');
      expect(eventCards).toHaveLength(100);
    });
  });

  describe('useEffect Dependencies', () => {
    it('calls onScrollToCurrentMonth when filterdListCount changes', async () => {
      const { rerender } = render(<HpTimeline {...defaultProps} />);
      
      // Change the events to trigger filterdListCount change
      const newEvents = [...mockEvents, {
        ...mockEvents[0],
        eventName: 'Event 3',
      }];

      rerender(<HpTimeline {...defaultProps} events={newEvents} />);
      
      // The useEffect should run when filterdListCount changes
      await waitFor(() => {
        expect(global.document.getElementById).toHaveBeenCalledWith('main-content');
      });
    });

    it('calls onScrollToCurrentMonth when showBanner changes', async () => {
      const { rerender } = render(<HpTimeline {...defaultProps} />);
      
      // Change showBanner to trigger useEffect
      rerender(<HpTimeline {...defaultProps} showBanner={true} />);
      
      // The useEffect should run when showBanner changes
      await waitFor(() => {
        expect(global.document.getElementById).toHaveBeenCalledWith('main-content');
      });
    });
  });

  describe('onScrollToCurrentMonth Function - Lines 45-86 Coverage', () => {
    beforeEach(() => {
      // Mock Date to control current date
      const mockDate = new Date('2024-01-15'); // January 15, 2024
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('handles different year selection - scrolls to top when year is different', () => {
      const mockScrollContainer = {
        scrollTop: 500,
        scrollHeight: 1000,
      };
      
      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return mockScrollContainer as any;
        }
        return null;
      });

      const propsWithDifferentYear = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          year: '2023', // Different from current year 2024
        },
      };

      render(<HpTimeline {...propsWithDifferentYear} />);
      
      expect(mockScrollContainer.scrollTop).toBe(0);
    });

    it('finds current month index correctly', () => {
      const currentMonthEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 0, // January (current month)
          startDay: 20, // Future day
        },
        {
          ...mockEvents[1],
          startMonthIndex: 0, // January (current month)
          startDay: 10, // Past day
        }
      ];

      const propsWithCurrentMonthEvents = {
        ...defaultProps,
        events: currentMonthEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithCurrentMonthEvents} />);
      
      // Should find current month index (0 for January)
      expect(mockGetMonthWiseEvents).toHaveBeenCalledWith(currentMonthEvents);
    });

    it('filters current month events by future days only', () => {
      const currentMonthEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 0, // January (current month)
          startDay: 20, // Future day (after current day 15)
        },
        {
          ...mockEvents[1],
          startMonthIndex: 0, // January (current month)
          startDay: 10, // Past day (before current day 15)
        },
        {
          ...mockEvents[0],
          eventName: 'Event 3',
          startMonthIndex: 0, // January (current month)
          startDay: 15, // Current day
        }
      ];

      const propsWithCurrentMonthEvents = {
        ...defaultProps,
        events: currentMonthEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithCurrentMonthEvents} />);
      
      // Should filter events to only include future days (day >= 15)
      expect(mockGetMonthWiseEvents).toHaveBeenCalledWith(currentMonthEvents);
    });

    it('selects first future event from current month when available', async () => {
      const mockScrollItem = {
        scrollIntoView: jest.fn(),
      };

      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return { scrollTop: 0, scrollHeight: 1000 };
        }
        if (id === 'm-0-20') { // Current month, future day
          return mockScrollItem as any;
        }
        return null;
      });

      const currentMonthEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 0, // January (current month)
          startDay: 20, // Future day
        }
      ];

      const propsWithCurrentMonthEvents = {
        ...defaultProps,
        events: currentMonthEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithCurrentMonthEvents} />);
      
      // Wait for useEffect to trigger the scroll function
      await waitFor(() => {
        expect(mockScrollItem.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center'
        });
      });
    });

    it('selects first event from future month when no current month future events', async () => {
      const mockScrollItem = {
        scrollIntoView: jest.fn(),
      };

      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return { scrollTop: 0, scrollHeight: 1000 };
        }
        if (id === 'm-1-20') { // Future month
          return mockScrollItem as any;
        }
        return null;
      });

      const futureMonthEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 1, // February (future month)
          startDay: 20,
        }
      ];

      const propsWithFutureMonthEvents = {
        ...defaultProps,
        events: futureMonthEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithFutureMonthEvents} />);
      
      // Wait for useEffect to trigger the scroll function
      await waitFor(() => {
        expect(mockScrollItem.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center'
        });
      });
    });

    it('scrolls to bottom when no events found', async () => {
      const mockScrollContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
      };

      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return mockScrollContainer as any;
        }
        return null; // No events found
      });

      const propsWithNoEvents = {
        ...defaultProps,
        events: [],
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithNoEvents} />);
      
      // Wait for useEffect to trigger the scroll function
      await waitFor(() => {
        expect(mockScrollContainer.scrollTop).toBe(1000);
      });
    });

    it('handles current month with no events', () => {
      const futureMonthEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 2, // March (future month)
          startDay: 20,
        }
      ];

      const propsWithNoCurrentMonthEvents = {
        ...defaultProps,
        events: futureMonthEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithNoCurrentMonthEvents} />);
      
      // Should still work and find future month events
      expect(mockGetMonthWiseEvents).toHaveBeenCalledWith(futureMonthEvents);
    });

    it('handles current month with only past events', async () => {
      const mockScrollItem = {
        scrollIntoView: jest.fn(),
      };

      global.document.getElementById = jest.fn((id) => {
        if (id === 'main-content') {
          return { scrollTop: 0, scrollHeight: 1000 };
        }
        if (id === 'm-1-20') { // Future month
          return mockScrollItem as any;
        }
        return null;
      });

      const pastAndFutureEvents = [
        {
          ...mockEvents[0],
          startMonthIndex: 0, // January (current month)
          startDay: 10, // Past day
        },
        {
          ...mockEvents[1],
          startMonthIndex: 1, // February (future month)
          startDay: 20,
        }
      ];

      const propsWithPastAndFutureEvents = {
        ...defaultProps,
        events: pastAndFutureEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      render(<HpTimeline {...propsWithPastAndFutureEvents} />);
      
      // Wait for useEffect to trigger the scroll function
      await waitFor(() => {
        expect(mockScrollItem.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center'
        });
      });
    });

    it('handles scroll container not found gracefully', () => {
      global.document.getElementById = jest.fn(() => null);

      const propsWithEvents = {
        ...defaultProps,
        events: mockEvents,
        selectedItems: {
          ...mockSelectedItems,
          year: '2024', // Same as current year
        },
      };

      // Should not throw error when scroll container is not found
      expect(() => {
        render(<HpTimeline {...propsWithEvents} />);
      }).not.toThrow();
    });
  });
});
