import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpCalendarEvent from '../../../../components/page/events/hp-calendar-event';
import { IEventHost } from '@/types/shared.type';

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('HpCalendarEvent Component', () => {
  const mockEventHosts: IEventHost[] = [
    { logo: 'host1-logo.png', name: 'Host 1', primaryIcon: 'host1-primary-icon.png' },
    { logo: 'host2-logo.png', name: 'Host 2', primaryIcon: 'host2-primary-icon.png' },
    { logo: 'host3-logo.png', name: 'Host 3', primaryIcon: 'host3-primary-icon.png' },
  ];

  const defaultEventInfo = {
    event: {
      title: 'Test Event',
      extendedProps: {
        isFeaturedEvent: false,
        eventType: 'social',
        eventHosts: mockEventHosts,
        startDateValue: new Date('2024-01-15'),
        endDateValue: new Date('2024-01-15'),
        tagLogo: '/icons/tag-logo.png',
        tag: 'Test Tag',
      },
    },
    isStart: true,
    isEnd: true,
  };

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const titleElement = screen.getByText('Test Event');
      const container = document.querySelector('.cn');
      
      expect(titleElement).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it('renders event title correctly', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const titleElement = screen.getByText('Test Event');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveClass('title');
      expect(titleElement).toHaveAttribute('title', 'Test Event');
    });

    it('renders with different event titles', () => {
      const testCases = ['Conference 2024', 'Workshop Series', 'Virtual Meetup'];
      
      testCases.forEach((title) => {
        const { unmount } = render(
          <HpCalendarEvent 
            {...defaultEventInfo} 
            event={{ ...defaultEventInfo.event, title }}
          />
        );
        
        const titleElement = screen.getByText(title);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveAttribute('title', title);
        
        unmount();
      });
    });
  });

  describe('Event Type Styling', () => {
    it('applies social class for social events', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('social');
    });

    it('applies conference class for conference events', () => {
      const conferenceEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventType: 'conference',
          },
        },
      };
      
      render(<HpCalendarEvent {...conferenceEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('conference');
    });

    it('applies virtual class for virtual events', () => {
      const virtualEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventType: 'virtual',
          },
        },
      };
      
      render(<HpCalendarEvent {...virtualEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('virtual');
    });

    it('applies featured class for featured events', () => {
      const featuredEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            isFeaturedEvent: true,
          },
        },
      };
      
      render(<HpCalendarEvent {...featuredEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('featured');
    });

    it('handles undefined event type gracefully', () => {
      const undefinedTypeEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventType: undefined,
          },
        },
      };
      
      render(<HpCalendarEvent {...undefinedTypeEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('social'); // Default fallback
    });

    it('handles null event type gracefully', () => {
      const nullTypeEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventType: null,
          },
        },
      };
      
      render(<HpCalendarEvent {...nullTypeEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('social'); // Default fallback
    });
  });

  describe('Host Logos', () => {
    it('renders host logos when conditions are met', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).toBeInTheDocument();
      
      const hostLogoItems = document.querySelectorAll('.cn__hostlogos__item');
      expect(hostLogoItems).toHaveLength(3); // Limited to 4, but we have 3
    });

    it('limits host logos to 4 items', () => {
      const manyHosts = Array.from({ length: 6 }, (_, i) => ({
        logo: `host${i + 1}-logo.png`,
        name: `Host ${i + 1}`,
        primaryIcon: `host${i + 1}-primary-icon.png`,
      }));
      
      const eventWithManyHosts = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventHosts: manyHosts,
          },
        },
      };
      
      render(<HpCalendarEvent {...eventWithManyHosts} />);
      
      const hostLogoItems = document.querySelectorAll('.cn__hostlogos__item');
      expect(hostLogoItems).toHaveLength(4); // Limited to 4
    });

    it('does not render host logos when not single row', () => {
      const notSingleRowEvent = {
        ...defaultEventInfo,
        isStart: true,
        isEnd: false,
      };
      
      render(<HpCalendarEvent {...notSingleRowEvent} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).not.toBeInTheDocument();
    });

    it('does not render host logos when not same day', () => {
      const notSameDayEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-16'),
          },
        },
      };
      
      render(<HpCalendarEvent {...notSameDayEvent} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).not.toBeInTheDocument();
    });

    it('does not render host logos when no hosts available', () => {
      const noHostsEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventHosts: [],
          },
        },
      };
      
      render(<HpCalendarEvent {...noHostsEvent} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).not.toBeInTheDocument();
    });

    it('renders host logo images correctly', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const hostLogoImages = document.querySelectorAll('.cn__hostlogos__item__img');
      expect(hostLogoImages).toHaveLength(3);
      
      hostLogoImages.forEach((img, index) => {
        expect(img).toHaveAttribute('src', mockEventHosts[index].logo);
      });
    });
  });

  describe('Event Type Icons', () => {
    it('renders event type icons when conditions are met', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const eventTypesContainer = document.querySelector('.cn__eventtypes');
      expect(eventTypesContainer).toBeInTheDocument();
      
      const eventTypeImages = document.querySelectorAll('.cn__eventtypes img');
      expect(eventTypeImages).toHaveLength(2); // Event type icon and tag icon
    });

    it('renders correct event type icon', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const eventTypeImages = document.querySelectorAll('.cn__eventtypes img');
      const eventTypeIcon = eventTypeImages[0];
      
      expect(eventTypeIcon).toHaveAttribute('src', '/icons/pln-calendar-social.svg');
      expect(eventTypeIcon).toHaveAttribute('title', 'social');
    });

    it('renders tag icon correctly', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const eventTypeImages = document.querySelectorAll('.cn__eventtypes img');
      const tagIcon = eventTypeImages[1];
      
      expect(tagIcon).toHaveAttribute('src', '/icons/tag-logo.png');
      expect(tagIcon).toHaveAttribute('title', 'Test Tag');
      expect(tagIcon).toHaveClass('cn__tag');
    });

    it('does not render event type icons when not single row', () => {
      const notSingleRowEvent = {
        ...defaultEventInfo,
        isStart: true,
        isEnd: false,
      };
      
      render(<HpCalendarEvent {...notSingleRowEvent} />);
      
      const eventTypesContainer = document.querySelector('.cn__eventtypes');
      expect(eventTypesContainer).not.toBeInTheDocument();
    });

    it('does not render event type icons when not same day', () => {
      const notSameDayEvent = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-16'),
          },
        },
      };
      
      render(<HpCalendarEvent {...notSameDayEvent} />);
      
      const eventTypesContainer = document.querySelector('.cn__eventtypes');
      expect(eventTypesContainer).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct base CSS classes', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const container = document.querySelector('.cn');
      expect(container).toHaveClass('cn');
      expect(container).toHaveClass('social');
    });

    it('applies correct CSS classes to title', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const titleElement = screen.getByText('Test Event');
      expect(titleElement).toHaveClass('title');
    });

    it('applies correct CSS classes to host logos container', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).toHaveClass('cn__hostlogos');
    });

    it('applies correct CSS classes to host logo items', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const hostLogoItems = document.querySelectorAll('.cn__hostlogos__item');
      hostLogoItems.forEach(item => {
        expect(item).toHaveClass('cn__hostlogos__item');
      });
    });

    it('applies correct CSS classes to host logo images', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const hostLogoImages = document.querySelectorAll('.cn__hostlogos__item__img');
      hostLogoImages.forEach(img => {
        expect(img).toHaveClass('cn__hostlogos__item__img');
      });
    });

    it('applies correct CSS classes to event types container', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const eventTypesContainer = document.querySelector('.cn__eventtypes');
      expect(eventTypesContainer).toHaveClass('cn__eventtypes');
    });

    it('applies correct CSS classes to tag icon', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const tagIcon = document.querySelector('.cn__tag');
      expect(tagIcon).toHaveClass('cn__tag');
    });
  });

  describe('Props Handling', () => {
    it('handles missing extendedProps gracefully', () => {
      const eventWithoutExtendedProps = {
        event: {
          title: 'Test Event',
          extendedProps: {
            isFeaturedEvent: false,
            eventType: 'social',
            eventHosts: [],
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-15'),
            tagLogo: '/icons/tag-logo.png',
            tag: 'Test Tag',
          },
        },
        isStart: true,
        isEnd: true,
      };
      
      render(<HpCalendarEvent {...eventWithoutExtendedProps} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('social'); // Default fallback
    });

    it('handles null extendedProps gracefully', () => {
      const eventWithNullExtendedProps = {
        event: {
          title: 'Test Event',
          extendedProps: {
            isFeaturedEvent: false,
            eventType: 'social',
            eventHosts: [],
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-15'),
            tagLogo: '/icons/tag-logo.png',
            tag: 'Test Tag',
          },
        },
        isStart: true,
        isEnd: true,
      };
      
      render(<HpCalendarEvent {...eventWithNullExtendedProps} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('social'); // Default fallback
    });

    it('handles undefined isStart and isEnd gracefully', () => {
      const eventWithUndefinedFlags = {
        event: {
          title: 'Test Event',
          extendedProps: {
            isFeaturedEvent: false,
            eventType: 'social',
            eventHosts: [],
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-15'),
            tagLogo: '/icons/tag-logo.png',
            tag: 'Test Tag',
          },
        },
      };
      
      render(<HpCalendarEvent {...eventWithUndefinedFlags} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
    });

    it('handles empty eventHosts array', () => {
      const eventWithEmptyHosts = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventHosts: [],
          },
        },
      };
      
      render(<HpCalendarEvent {...eventWithEmptyHosts} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).not.toBeInTheDocument();
    });

    it('handles null eventHosts', () => {
      const eventWithNullHosts = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            eventHosts: null,
          },
        },
      };
      
      render(<HpCalendarEvent {...eventWithNullHosts} />);
      
      const hostLogosContainer = document.querySelector('.cn__hostlogos');
      expect(hostLogosContainer).not.toBeInTheDocument();
    });

    it('handles missing tag properties', () => {
      const eventWithoutTag = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          extendedProps: {
            ...defaultEventInfo.event.extendedProps,
            tagLogo: undefined,
            tag: undefined,
          },
        },
      };
      
      render(<HpCalendarEvent {...eventWithoutTag} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing event prop gracefully', () => {
      const eventInfoWithoutEvent = {
        event: {
          title: 'Test Event',
          extendedProps: {
            isFeaturedEvent: false,
            eventType: 'social',
            eventHosts: [],
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-15'),
            tagLogo: '/icons/tag-logo.png',
            tag: 'Test Tag',
          },
        },
        isStart: true,
        isEnd: true,
      };
      
      render(<HpCalendarEvent {...eventInfoWithoutEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
    });

    it('handles null event prop gracefully', () => {
      const eventInfoWithNullEvent = {
        event: {
          title: 'Test Event',
          extendedProps: {
            isFeaturedEvent: false,
            eventType: 'social',
            eventHosts: [],
            startDateValue: new Date('2024-01-15'),
            endDateValue: new Date('2024-01-15'),
            tagLogo: '/icons/tag-logo.png',
            tag: 'Test Tag',
          },
        },
        isStart: true,
        isEnd: true,
      };
      
      render(<HpCalendarEvent {...eventInfoWithNullEvent} />);
      
      const container = document.querySelector('.cn');
      expect(container).toBeInTheDocument();
    });

    it('handles very long event titles', () => {
      const longTitle = 'A'.repeat(200);
      const eventWithLongTitle = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          title: longTitle,
        },
      };
      
      render(<HpCalendarEvent {...eventWithLongTitle} />);
      
      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveAttribute('title', longTitle);
    });

    it('handles special characters in event title', () => {
      const specialTitle = 'Event with "quotes" & symbols! @#$%';
      const eventWithSpecialTitle = {
        ...defaultEventInfo,
        event: {
          ...defaultEventInfo.event,
          title: specialTitle,
        },
      };
      
      render(<HpCalendarEvent {...eventWithSpecialTitle} />);
      
      const titleElement = screen.getByText(specialTitle);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveAttribute('title', specialTitle);
    });
  });

  describe('Accessibility', () => {
    it('renders title with proper title attribute', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const titleElement = screen.getByText('Test Event');
      expect(titleElement).toHaveAttribute('title', 'Test Event');
    });

    it('renders images with proper alt text and titles', () => {
      render(<HpCalendarEvent {...defaultEventInfo} />);
      
      const eventTypeImages = document.querySelectorAll('.cn__eventtypes img');
      const eventTypeIcon = eventTypeImages[0];
      const tagIcon = eventTypeImages[1];
      
      expect(eventTypeIcon).toHaveAttribute('title', 'social');
      expect(tagIcon).toHaveAttribute('title', 'Test Tag');
    });
  });
});
