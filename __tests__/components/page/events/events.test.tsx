import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Events from '../../../../components/page/events/events';
import { IEvent, ISelectedItem } from '@/types/events.type';

// Mock child components
jest.mock('../../../../components/page/events/hp-filter-head', () => {
  return function MockHpFilterHead({ selectedItems, showBanner }: any) {
    return (
      <div data-testid="hp-filter-head">
        <div data-testid="selected-items">{JSON.stringify(selectedItems)}</div>
        <div data-testid="show-banner">{showBanner ? 'true' : 'false'}</div>
      </div>
    );
  };
});

jest.mock('../../../../components/page/events/timeline-view', () => {
  return function MockHpTimeline({ selectedItems, events, showBanner }: any) {
    return (
      <div data-testid="hp-timeline">
        <div data-testid="timeline-selected-items">{JSON.stringify(selectedItems)}</div>
        <div data-testid="timeline-events-count">{events?.length || 0}</div>
        <div data-testid="timeline-show-banner">{showBanner ? 'true' : 'false'}</div>
      </div>
    );
  };
});

jest.mock('../../../../components/page/events/hp-calendar', () => {
  return function MockHpCalendar({ eventItems, rawEvents, filters, monthWiseEvents, filterdListCount, showBanner }: any) {
    return (
      <div data-testid="hp-calendar">
        <div data-testid="calendar-event-items-count">{eventItems?.length || 0}</div>
        <div data-testid="calendar-raw-events-count">{rawEvents?.length || 0}</div>
        <div data-testid="calendar-filters">{JSON.stringify(filters)}</div>
        <div data-testid="calendar-month-wise-events">{JSON.stringify(monthWiseEvents)}</div>
        <div data-testid="calendar-filtered-count">{filterdListCount}</div>
        <div data-testid="calendar-show-banner">{showBanner ? 'true' : 'false'}</div>
      </div>
    );
  };
});

// Mock helper function
jest.mock('../../../../components/page/events/hp-helper', () => ({
  getMonthWiseEvents: jest.fn((events) => {
    // Simple mock implementation
    const grouped: any = {};
    events.forEach((event: any) => {
      const month = new Date(event.startDateValue).toISOString().substring(0, 7);
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(event);
    });
    return grouped;
  }),
}));

describe('Events Component', () => {
  const mockEvents = [
    {
      eventName: 'event1',
      website: 'website1',
      location: 'location1',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      dateTBD: true,
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
      startDay: 1,
      startDayString: 'Monday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 0,
      endDay: 1,
      fullDateFormat: 'January 1, 2024',
      tagLogo: 'tagLogo1',
      calenderLogo: 'calenderLogo1',
      startDateValue: new Date('2024-01-15'),
      endDateValue: new Date('2024-01-16'),
      locationLogo: 'locationLogo1',
      slug: 'slug1',
      externalLinkIcon: 'externalLinkIcon1',
    },
    {
      eventName: 'event2',
      website: 'website2',
      location: 'location2',
      startDate: '2024-01-17',
      endDate: '2024-01-18',
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
      startMonthIndex: 0,
      startDay: 2,
      startDayString: 'Tuesday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 0,
      endDay: 2,
      fullDateFormat: 'January 2, 2024',
      tagLogo: 'tagLogo2',
      calenderLogo: 'calenderLogo2',
      startDateValue: new Date('2024-01-17'),
      endDateValue: new Date('2024-01-18'),
      locationLogo: 'locationLogo2',
      slug: 'slug2',
      externalLinkIcon: 'externalLinkIcon2',
    }
  ];

  const mockSelectedItems = {
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
    events: mockEvents as IEvent[],
    rawEvents: mockEvents ,
    viewType: 'timeline',
    showBanner: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock document.querySelector
    Object.defineProperty(document, 'querySelector', {
      value: jest.fn().mockReturnValue({
        scrollTop: 0,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }),
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('renders main content container with correct id and class', () => {
      render(<Events {...defaultProps} />);
      
      const mainContent = document.getElementById('main-content');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass('hp__maincontent');
    });

    it('renders HpFilterHead component with correct props', () => {
      render(<Events {...defaultProps} />);
      
      const filterHead = screen.getByTestId('hp-filter-head');
      expect(filterHead).toBeInTheDocument();
      
      const selectedItems = screen.getByTestId('selected-items');
      expect(selectedItems).toHaveTextContent(JSON.stringify(mockSelectedItems));
      
      const showBanner = screen.getByTestId('show-banner');
      expect(showBanner).toHaveTextContent('false');
    });

     it('renders timeline view when viewType is timeline', () => {
       render(<Events {...defaultProps} />);
       
       const timeline = screen.getByTestId('hp-timeline');
       expect(timeline).toBeInTheDocument();
       
       const eventsCount = screen.getByTestId('timeline-events-count');
       expect(eventsCount).toHaveTextContent('2');
     });

    it('renders calendar view when viewType is calendar', () => {
      const calendarProps = {
        ...defaultProps,
        selectedItems: { ...mockSelectedItems, viewType: 'calendar' },
      };
      
      render(<Events {...calendarProps} />);
      
      const calendar = screen.getByTestId('hp-calendar');
      expect(calendar).toBeInTheDocument();
      
      const eventItemsCount = screen.getByTestId('calendar-event-items-count');
      expect(eventItemsCount).toHaveTextContent('2');
    });
  });

  describe('Event Processing', () => {
    it('processes events correctly for calendar view', () => {
      const calendarProps = {
        ...defaultProps,
        selectedItems: { ...mockSelectedItems, viewType: 'calendar' },
      };
      
      render(<Events {...calendarProps} />);
      
      const eventItemsCount = screen.getByTestId('calendar-event-items-count');
      expect(eventItemsCount).toHaveTextContent('2');
      
      const rawEventsCount = screen.getByTestId('calendar-raw-events-count');
      expect(rawEventsCount).toHaveTextContent('2');
    });

    it('handles empty events array', () => {
      const emptyEventsProps = {
        ...defaultProps,
        events: [],
        rawEvents: [],
      };
      
      render(<Events {...emptyEventsProps} />);
      
      const timeline = screen.getByTestId('hp-timeline');
      expect(timeline).toBeInTheDocument();
      
      const eventsCount = screen.getByTestId('timeline-events-count');
      expect(eventsCount).toHaveTextContent('0');
    });

     it('handles undefined events array', () => {
       const undefinedEventsProps = {
         ...defaultProps,
         events: [] as IEvent[],
         rawEvents: [] as IEvent[],
         selectedItems: { ...mockSelectedItems, viewType: 'timeline' },
         viewType: 'timeline',
         showBanner: false,
       };
       
       render(<Events {...undefinedEventsProps} />);
       
       const timeline = screen.getByTestId('hp-timeline');
       expect(timeline).toBeInTheDocument();
       
       const eventsCount = screen.getByTestId('timeline-events-count');
       expect(eventsCount).toHaveTextContent('0');
     });
  });

  describe('Scroll Up Status', () => {
    it('does not show scroll up message initially', () => {
      render(<Events {...defaultProps} />);
      
      const scrollUpMessage = screen.queryByText('Scroll up to view past events');
      expect(scrollUpMessage).not.toBeInTheDocument();
    });

    it('shows scroll up message when scrolled and in timeline view', async () => {
      // Mock document.querySelector to return an element with scrollTop > 5
      const mockHtmlElement = {
        scrollTop: 10,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      
      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockImplementation((selector) => {
          if (selector === 'html') {
            return mockHtmlElement;
          }
          return null;
        }),
        writable: true,
      });

      render(<Events {...defaultProps} />);
      
      // Simulate scroll event by directly calling the scroll handler
      const scrollEvent = new Event('scroll');
      document.dispatchEvent(scrollEvent);
      
      await waitFor(() => {
        const scrollUpMessage = screen.getByText('Scroll up to view past events');
        expect(scrollUpMessage).toBeInTheDocument();
      });
    });

    it('does not show scroll up message in calendar view even when scrolled', () => {
      const calendarProps = {
        ...defaultProps,
        selectedItems: { ...mockSelectedItems, viewType: 'calendar' },
      };

      // Mock scrollTop > 5
      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockReturnValue({
          scrollTop: 10,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }),
        writable: true,
      });

      render(<Events {...calendarProps} />);
      
      const scrollUpMessage = screen.queryByText('Scroll up to view past events');
      expect(scrollUpMessage).not.toBeInTheDocument();
    });
  });

   describe('Scroll Up Message Styling', () => {
    it('applies correct styling when showBanner is false', async () => {
      // Mock document.querySelector to return an element with scrollTop > 5
      const mockHtmlElement = {
        scrollTop: 10,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      
      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockImplementation((selector) => {
          if (selector === 'html') {
            return mockHtmlElement;
          }
          return null;
        }),
        writable: true,
      });

      render(<Events {...defaultProps} />);
      
      // Simulate scroll event by directly calling the scroll handler
      const scrollEvent = new Event('scroll');
      document.dispatchEvent(scrollEvent);
      
      await waitFor(() => {
        const scrollUpDiv = screen.getByText('Scroll up to view past events').closest('.hmt__scollup');
        expect(scrollUpDiv).toBeInTheDocument();
      });
    });

     it('applies correct styling when showBanner is true', async () => {
       const bannerProps = {
         ...defaultProps,
         showBanner: true,
       };

       // Mock document.querySelector to return an element with scrollTop > 5
       const mockHtmlElement = {
         scrollTop: 10,
         addEventListener: jest.fn(),
         removeEventListener: jest.fn(),
       };
       
       Object.defineProperty(document, 'querySelector', {
         value: jest.fn().mockImplementation((selector) => {
           if (selector === 'html') {
             return mockHtmlElement;
           }
           return null;
         }),
         writable: true,
       });

       render(<Events {...bannerProps} />);
       
       // Simulate scroll event by directly calling the scroll handler
       const scrollEvent = new Event('scroll');
       document.dispatchEvent(scrollEvent);
       
       await waitFor(() => {
         const scrollUpDiv = screen.getByText('Scroll up to view past events').closest('.hmt__scollup');
         expect(scrollUpDiv).toBeInTheDocument();
       });
     });
   });

  describe('Props Handling', () => {
    it('handles missing selectedItems prop', () => {
      const propsWithoutSelectedItems = {
        events: mockEvents,
        rawEvents: mockEvents,
        selectedItems: {} as ISelectedItem,
        viewType: 'timeline',
        showBanner: false,
      };
      
      render(<Events {...propsWithoutSelectedItems} />);
      
      const filterHead = screen.getByTestId('hp-filter-head');
      expect(filterHead).toBeInTheDocument();
    });

    it('handles missing events prop', () => {
      const propsWithoutEvents = {
        selectedItems: mockSelectedItems,
        events: [] as IEvent[],
        rawEvents: mockEvents,
        viewType: 'timeline',
        showBanner: false,
      };
      
      render(<Events {...propsWithoutEvents} />);
      
      const timeline = screen.getByTestId('hp-timeline');
      expect(timeline).toBeInTheDocument();
      
      const eventsCount = screen.getByTestId('timeline-events-count');
      expect(eventsCount).toHaveTextContent('0');
    });

     it('handles missing rawEvents prop', () => {
       const propsWithoutRawEvents = {
         ...defaultProps,
         selectedItems: { ...mockSelectedItems, viewType: 'calendar' },
         rawEvents: [] as IEvent[],
         viewType: 'calendar',
       };
       
       render(<Events {...propsWithoutRawEvents} />);
       
       const calendar = screen.getByTestId('hp-calendar');
       expect(calendar).toBeInTheDocument();
       
       const rawEventsCount = screen.getByTestId('calendar-raw-events-count');
       expect(rawEventsCount).toHaveTextContent('0');
     });
  });

  describe('Filtered List Count', () => {
     it('calculates filtered list count correctly', () => {
       render(<Events {...defaultProps} />);
       
       const timeline = screen.getByTestId('hp-timeline');
       expect(timeline).toBeInTheDocument();
       
       // The count should match the events array length
       const eventsCount = screen.getByTestId('timeline-events-count');
       expect(eventsCount).toHaveTextContent('2');
     });

    it('handles zero filtered events', () => {
      const emptyProps = {
        ...defaultProps,
        events: [],
      };
      
      render(<Events {...emptyProps} />);
      
      const timeline = screen.getByTestId('hp-timeline');
      expect(timeline).toBeInTheDocument();
      
      const eventsCount = screen.getByTestId('timeline-events-count');
      expect(eventsCount).toHaveTextContent('0');
    });
  });

   describe('Event Listeners', () => {
     it('adds scroll event listener on mount', async () => {
       const mockAddEventListener = jest.fn();
       const originalAddEventListener = document.addEventListener;
       
       document.addEventListener = mockAddEventListener;

       render(<Events {...defaultProps} />);
       
       // Wait for useEffect to run
       await waitFor(() => {
         expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
       });

       // Restore original addEventListener
       document.addEventListener = originalAddEventListener;
     });
   });

  describe('Edge Cases', () => {
    it('handles null selectedItems', () => {
      const nullSelectedItemsProps = {
        ...defaultProps,
        selectedItems: {} as ISelectedItem,
      };
      
      render(<Events {...nullSelectedItemsProps} />);
      
      const filterHead = screen.getByTestId('hp-filter-head');
      expect(filterHead).toBeInTheDocument();
    });

     it('handles undefined viewType', () => {
       const undefinedViewTypeProps = {
         ...defaultProps,
         selectedItems: { ...mockSelectedItems, viewType: '' },
       };
       
       render(<Events {...undefinedViewTypeProps} />);
       
       // Should not render timeline or calendar when viewType is empty
       const timeline = screen.queryByTestId('hp-timeline');
       const calendar = screen.queryByTestId('hp-calendar');
       
       expect(timeline).not.toBeInTheDocument();
       expect(calendar).not.toBeInTheDocument();
     });

    // it('handles very large number of events', () => {
    //   const manyEvents = Array.from({ length: 1000 }, (_, i) => ({
    //     id: `event-${i}`,
    //     eventName: `Event ${i}`,
    //     startDateValue: `2024-01-${(i % 30) + 1}T10:00:00Z`,
    //     endDateValue: `2024-01-${(i % 30) + 1}T12:00:00Z`,
    //   }));

    //   const manyEventsProps = {
    //     ...defaultProps,
    //     events: manyEvents,
    //     rawEvents: manyEvents,
    //   };
      
    //   render(<Events {...manyEventsProps} />);
      
    //   const timeline = screen.getByTestId('hp-timeline');
    //   expect(timeline).toBeInTheDocument();
      
    //   const eventsCount = screen.getByTestId('timeline-events-count');
    //   expect(eventsCount).toHaveTextContent('1000');
    // });
  });
});
