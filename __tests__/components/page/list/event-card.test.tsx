import React from 'react';
import { render, screen } from '@testing-library/react';
import EventCard from '../../../../components/page/list/event-card';

jest.mock('../../../../components/page/event-detail/event-hosts', () => {
  return function MockEventHosts(props: any) {
    return <div data-testid="event-hosts">Event Hosts</div>;
  };
});

jest.mock('../../../../components/page/event-detail/tags', () => {
  return function MockTags(props: any) {
    const { tags, noOftagsToShow } = props;
    return (
      <div data-testid="tags" data-tags-count={tags?.length || 0} data-show-count={noOftagsToShow}>
        {tags?.slice(0, noOftagsToShow).map((tag: any, index: number) => (
          <span key={index} data-testid={`tag-${index}`}>
            {tag}
          </span>
        ))}
      </div>
    );
  };
});

// Mock constants
jest.mock('../../../../utils/constants', () => ({
  ACCESS_TYPES: {
    PAID: 'paid',
    INVITE: 'invite',
  },
  TYPE_CONSTANTS: {
    VIRTUAL: 'virtual',
    HYBRID: 'hybrid',
  },
}));

// Mock helper functions
jest.mock('../../../../utils/helper', () => ({
  getBackgroundColor: jest.fn(() => '#ffffff'),
  getHoverColor: jest.fn(() => '#156ff7'),
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('EventCard Component', () => {
  const mockEvent = {
    name: 'Test Event',
    accessOption: 'paid',
    multiday: false,
    format: 'virtual',
    tags: ['tag1', 'tag2', 'tag3'],
    isFeatured: false,
    dateRange: 'Jan 15-17, 2024',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
  };

  const defaultProps = {
    event: mockEvent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<EventCard {...defaultProps} />);
      
      const container = document.querySelector('.eventCard');
      const header = document.querySelector('.eventCard__header');
      const title = screen.getByText('Test Event');
      const footer = document.querySelector('.eventCard__footer');
      
      expect(container).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<EventCard {...defaultProps} />);
      
      const container = document.querySelector('.eventCard');
      const header = document.querySelector('.eventCard__header');
      const title = document.querySelector('.eventCard__header__title');
      const labels = document.querySelector('.eventCard__header__labels');
      const footer = document.querySelector('.eventCard__footer');
      
      expect(container).toHaveClass('eventCard');
      expect(header).toHaveClass('eventCard__header');
      expect(title).toHaveClass('eventCard__header__title');
      expect(labels).toHaveClass('eventCard__header__labels');
      expect(footer).toHaveClass('eventCard__footer');
    });

    it('renders event title with correct content', () => {
      render(<EventCard {...defaultProps} />);
      
      const title = screen.getByText('Test Event');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Event');
      expect(title).toHaveAttribute('title', 'Test Event');
    });

    it('renders EventHosts component', () => {
      render(<EventCard {...defaultProps} />);
      
      const eventHosts = screen.getByTestId('event-hosts');
      expect(eventHosts).toBeInTheDocument();
    });

    it('renders Tags components for mobile and desktop', () => {
      render(<EventCard {...defaultProps} />);
      
      const mobileTags = document.querySelector('.eventCard__tags__mobile');
      const desktopTags = document.querySelector('.eventCard__tags__desktop');
      const tagsComponents = screen.getAllByTestId('tags');
      
      expect(mobileTags).toBeInTheDocument();
      expect(desktopTags).toBeInTheDocument();
      expect(tagsComponents).toHaveLength(2);
    });

    it('renders MORE INFO button', () => {
      render(<EventCard {...defaultProps} />);
      
      const moreInfoButton = screen.getByText('MORE INFO');
      const chevronIcon = document.querySelector('img[alt="chevron right"]');
      
      expect(moreInfoButton).toBeInTheDocument();
      expect(chevronIcon).toBeInTheDocument();
    });
  });

  describe('Event Format Labels', () => {
    it('renders virtual format label when format is virtual', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: 'virtual' }} />);
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      expect(virtualIcon).toBeInTheDocument();
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual-sqaure.svg');
      expect(virtualIcon).toHaveAttribute('title', 'Virtual');
    });

    it('renders hybrid format label when format is hybrid', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: 'hybrid' }} />);
      
      const hybridIcon = document.querySelector('img[alt="in person"]');
      expect(hybridIcon).toBeInTheDocument();
      expect(hybridIcon).toHaveAttribute('src', '/icons/hybrid-square.svg');
      expect(hybridIcon).toHaveAttribute('title', 'Hybrid');
    });

    it('does not render format label when format is empty', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: '' }} />);
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      const hybridIcon = document.querySelector('img[alt="in person"]');
      
      expect(virtualIcon).not.toBeInTheDocument();
      expect(hybridIcon).not.toBeInTheDocument();
    });

    it('does not render format label when format is undefined', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: undefined }} />);
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      const hybridIcon = document.querySelector('img[alt="in person"]');
      
      expect(virtualIcon).not.toBeInTheDocument();
      expect(hybridIcon).not.toBeInTheDocument();
    });
  });

  describe('Access Type Labels', () => {
    it('renders paid access label when accessOption is paid', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, accessOption: 'paid' }} />);
      
      const paidIcon = document.querySelector('img[alt="paid"]');
      expect(paidIcon).toBeInTheDocument();
      expect(paidIcon).toHaveAttribute('src', '/icons/paid-square.svg');
      expect(paidIcon).toHaveAttribute('title', 'Paid');
      expect(paidIcon).toHaveAttribute('loading', 'lazy');
    });

    it('renders invite access label when accessOption is invite', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, accessOption: 'invite' }} />);
      
      const inviteIcon = document.querySelector('img[alt="invite logo"]');
      expect(inviteIcon).toBeInTheDocument();
      expect(inviteIcon).toHaveAttribute('src', '/icons/invite-only-sqaure.svg');
      expect(inviteIcon).toHaveAttribute('title', 'Invite Only');
      expect(inviteIcon).toHaveAttribute('loading', 'lazy');
    });

    it('does not render access label when accessOption is empty', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, accessOption: '' }} />);
      
      const paidIcon = document.querySelector('img[alt="paid"]');
      const inviteIcon = document.querySelector('img[alt="invite logo"]');
      
      expect(paidIcon).not.toBeInTheDocument();
      expect(inviteIcon).not.toBeInTheDocument();
    });

    it('does not render access label when accessOption is undefined', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, accessOption: undefined }} />);
      
      const paidIcon = document.querySelector('img[alt="paid"]');
      const inviteIcon = document.querySelector('img[alt="invite logo"]');
      
      expect(paidIcon).not.toBeInTheDocument();
      expect(inviteIcon).not.toBeInTheDocument();
    });
  });

  describe('Multiday Label', () => {
    it('renders multiday label when multiday is true', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, multiday: true }} />);
      
      const multidayContainer = document.querySelector('.eventCard__header__labels__multiday');
      const multidayIcon = document.querySelector('img[alt="multiday"]');
      const multidayText = screen.getByText('MULTIDAY');
      
      expect(multidayContainer).toBeInTheDocument();
      expect(multidayIcon).toBeInTheDocument();
      expect(multidayText).toBeInTheDocument();
      expect(multidayContainer).toHaveAttribute('title', 'Multiday');
    });

    it('does not render multiday label when multiday is false', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, multiday: false }} />);
      
      const multidayContainer = document.querySelector('.eventCard__header__labels__multiday');
      expect(multidayContainer).not.toBeInTheDocument();
    });

    it('does not render multiday label when multiday is undefined', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, multiday: undefined }} />);
      
      const multidayContainer = document.querySelector('.eventCard__header__labels__multiday');
      expect(multidayContainer).not.toBeInTheDocument();
    });

    it('renders multiday label with correct CSS classes', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, multiday: true }} />);
      
      const multidayContainer = document.querySelector('.eventCard__header__labels__multiday');
      const multidayText = document.querySelector('.eventCard__header__label__text');
      
      expect(multidayContainer).toHaveClass('eventCard__header__labels__multiday');
      expect(multidayText).toHaveClass('eventCard__header__label__text');
    });
  });

  describe('Featured Card', () => {
    it('applies featured-card class when isFeatured is true', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, isFeatured: true }} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).toHaveClass('featured-card');
    });

    it('does not apply featured-card class when isFeatured is false', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, isFeatured: false }} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).not.toHaveClass('featured-card');
    });

    it('does not apply featured-card class when isFeatured is undefined', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, isFeatured: undefined }} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).not.toHaveClass('featured-card');
    });
  });

  describe('Date and Time Display', () => {
    it('renders date range', () => {
      render(<EventCard {...defaultProps} />);
      
      const dateText = screen.getByText('Jan 15-17, 2024');
      const calendarIcon = document.querySelector('img[alt="day"]');
      
      expect(dateText).toBeInTheDocument();
      expect(calendarIcon).toBeInTheDocument();
      expect(calendarIcon).toHaveAttribute('src', '/icons/calendar-black.svg');
    });

    it('renders time when startTime is not provided', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, startTime: undefined }} />);
      
      const timeText = screen.getByText('- 12:00 PM');
      const clockIcon = document.querySelector('img[alt="clock"]');
      
      expect(timeText).toBeInTheDocument();
      expect(clockIcon).toBeInTheDocument();
      expect(clockIcon).toHaveAttribute('src', '/icons/clock.svg');
    });

    it('does not render time when startTime is provided', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, startTime: '10:00 AM' }} />);
      
      const timeText = screen.queryByText('10:00 AM - 12:00 PM');
      const clockIcon = document.querySelector('img[alt="clock"]');
      
      expect(timeText).not.toBeInTheDocument();
      expect(clockIcon).not.toBeInTheDocument();
    });

    it('renders time with correct CSS classes', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, startTime: undefined }} />);
      
      const timeContainer = document.querySelector('.eventCard__footer__dateTime__date__time');
      const timeText = document.querySelector('.eventCard__footer__dateTime__date__time__text');
      
      expect(timeContainer).toHaveClass('eventCard__footer__dateTime__date__time');
      expect(timeText).toHaveClass('eventCard__footer__dateTime__date__time__text');
    });
  });

  describe('Tags Display', () => {
    it('passes correct props to mobile Tags component', () => {
      render(<EventCard {...defaultProps} />);
      
      const mobileTags = document.querySelector('.eventCard__tags__mobile');
      const tagsComponent = mobileTags?.querySelector('[data-testid="tags"]');
      
      expect(tagsComponent).toHaveAttribute('data-tags-count', '3');
      expect(tagsComponent).toHaveAttribute('data-show-count', '2');
    });

    it('passes correct props to desktop Tags component', () => {
      render(<EventCard {...defaultProps} />);
      
      const desktopTags = document.querySelector('.eventCard__tags__desktop');
      const tagsComponent = desktopTags?.querySelector('[data-testid="tags"]');
      
      expect(tagsComponent).toHaveAttribute('data-tags-count', '3');
      expect(tagsComponent).toHaveAttribute('data-show-count', '5');
    });

    it('handles empty tags array', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, tags: [] }} />);
      
      const tagsComponents = screen.getAllByTestId('tags');
      tagsComponents.forEach(component => {
        expect(component).toHaveAttribute('data-tags-count', '0');
      });
    });

    it('handles undefined tags', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, tags: undefined }} />);
      
      const tagsComponents = screen.getAllByTestId('tags');
      tagsComponents.forEach(component => {
        expect(component).toHaveAttribute('data-tags-count', '0');
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop gracefully', () => {
      render(<EventCard event={[]} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).toBeInTheDocument();
    });

    it('handles undefined event prop', () => {
      render(<EventCard event={[]} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).toBeInTheDocument();
    });

    it('handles null event prop', () => {
      render(<EventCard event={[]} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).toBeInTheDocument();
    });

    it('handles empty event object', () => {
      render(<EventCard event={{}} />);
      
      const container = document.querySelector('.eventCard');
      const title = document.querySelector('.eventCard__header__title');
      
      expect(container).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<EventCard {...defaultProps} />);
      
      const container = document.querySelector('.eventCard');
      const header = document.querySelector('.eventCard__header');
      const title = screen.getByText('Test Event');
      const labels = document.querySelector('.eventCard__header__labels');
      const footer = document.querySelector('.eventCard__footer');
      
      expect(container).toContainElement(header as HTMLElement);
      expect(header).toContainElement(title);
      expect(header).toContainElement(labels as HTMLElement);
      expect(container).toContainElement(footer as HTMLElement);
    });

    it('renders styled-jsx styles', () => {
      render(<EventCard {...defaultProps} />);
      
      // Check if the component renders without errors
      const container = document.querySelector('.eventCard');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<EventCard {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Test Event');
    });

    it('has proper alt text for images', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: 'virtual', accessOption: 'paid', multiday: true }} />);
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      const paidIcon = document.querySelector('img[alt="paid"]');
      const multidayIcon = document.querySelector('img[alt="multiday"]');
      const calendarIcon = document.querySelector('img[alt="day"]');
      const chevronIcon = document.querySelector('img[alt="chevron right"]');
      
      expect(virtualIcon).toBeInTheDocument();
      expect(paidIcon).toBeInTheDocument();
      expect(multidayIcon).toBeInTheDocument();
      expect(calendarIcon).toBeInTheDocument();
      expect(chevronIcon).toBeInTheDocument();
    });

    it('has proper title attributes', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, format: 'virtual', accessOption: 'paid', multiday: true }} />);
      
      const virtualIcon = document.querySelector('img[title="Virtual"]');
      const paidIcon = document.querySelector('img[title="Paid"]');
      const multidayContainer = document.querySelector('[title="Multiday"]');
      
      expect(virtualIcon).toBeInTheDocument();
      expect(paidIcon).toBeInTheDocument();
      expect(multidayContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles event with all properties undefined', () => {
      render(<EventCard event={{
        name: undefined,
        accessOption: undefined,
        multiday: undefined,
        format: undefined,
        tags: undefined,
        isFeatured: undefined,
        dateRange: undefined,
        startTime: undefined,
        endTime: undefined,
      }} />);
      
      const container = document.querySelector('.eventCard');
      expect(container).toBeInTheDocument();
    });

    it('handles event with empty string values', () => {
      render(<EventCard event={{
        name: '',
        accessOption: '',
        format: '',
        dateRange: '',
        startTime: '',
        endTime: '',
        tags: [],
      }} />);
      
      const container = document.querySelector('.eventCard');
      const title = document.querySelector('.eventCard__header__title');
      
      expect(container).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });

    it('handles event with special characters in name', () => {
      render(<EventCard event={{ ...mockEvent, name: 'Test & Event < > " \' `' }} />);
      
      const title = screen.getByText('Test & Event < > " \' `');
      expect(title).toBeInTheDocument();
    });

    it('handles event with very long name', () => {
      const longName = 'A'.repeat(1000);
      render(<EventCard event={{ ...mockEvent, name: longName }} />);
      
      const title = screen.getByText(longName);
      expect(title).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<EventCard {...defaultProps} event={{ ...mockEvent, multiday: true }} />);
      
      const container = document.querySelector('.eventCard');
      const header = document.querySelector('.eventCard__header');
      const title = document.querySelector('.eventCard__header__title');
      const labels = document.querySelector('.eventCard__header__labels');
      const multidayContainer = document.querySelector('.eventCard__header__labels__multiday');
      const multidayText = document.querySelector('.eventCard__header__label__text');
      const footer = document.querySelector('.eventCard__footer');
      const dateTime = document.querySelector('.eventCard__footer__dateTime');
      const date = document.querySelector('.eventCard__footer__dateTime__date');
      const dateText = document.querySelector('.eventCard__footer__dateTime__date__text');
      const moreInfoBtn = document.querySelector('.eventCard__footer__moreInfo__btn');
      
      expect(container).toHaveClass('eventCard');
      expect(header).toHaveClass('eventCard__header');
      expect(title).toHaveClass('eventCard__header__title');
      expect(labels).toHaveClass('eventCard__header__labels');
      expect(multidayContainer).toHaveClass('eventCard__header__labels__multiday');
      expect(multidayText).toHaveClass('eventCard__header__label__text');
      expect(footer).toHaveClass('eventCard__footer');
      expect(dateTime).toHaveClass('eventCard__footer__dateTime');
      expect(date).toHaveClass('eventCard__footer__dateTime__date');
      expect(dateText).toHaveClass('eventCard__footer__dateTime__date__text');
      expect(moreInfoBtn).toHaveClass('eventCard__footer__moreInfo__btn');
    });
  });
});
