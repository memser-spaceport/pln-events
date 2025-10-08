import React from 'react';
import { render, screen } from '@testing-library/react';
import EventHeader from '../../../../components/page/event-detail/event-header';

// Mock constants
jest.mock('../../../../utils/constants', () => ({
  ACCESS_TYPES: {
    PAID: 'PAID',
    FREE: 'FREE',
    INVITE: 'INVITE',
    FREE_LABEL: 'FREE',
  },
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('EventHeader Component', () => {
  const mockEvent = {
    id: 'event1',
    name: 'Test Event',
    eventLogo: 'https://example.com/event-logo.png',
    hostLogo: 'https://example.com/host-logo.png',
    accessOption: 'PAID',
    isFeatured: true,
    multiday: true,
  };

  const mockEventWithDefaults = {
    id: 'event2',
    name: 'Test Event 2',
    accessOption: 'FREE',
    isFeatured: false,
    multiday: false,
  };

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventHeader = document.querySelector('.event__header');
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      const labelsContainer = document.querySelector('.event__header__labels');
      
      expect(eventHeader).toBeInTheDocument();
      expect(eventLogo).toBeInTheDocument();
      expect(labelsContainer).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventHeader = document.querySelector('.event__header');
      const labelsContainer = document.querySelector('.event__header__labels');
      
      expect(eventHeader).toHaveClass('event__header');
      expect(labelsContainer).toHaveClass('event__header__labels');
    });
  });

  describe('Event Logo', () => {
    it('renders event logo when provided', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      expect(eventLogo).toHaveAttribute('src', 'https://example.com/event-logo.png');
      expect(eventLogo).toHaveAttribute('width', '32');
      expect(eventLogo).toHaveAttribute('height', '32');
      expect(eventLogo).toHaveAttribute('alt', 'event logo');
    });

    it('renders host logo when event logo is not provided', () => {
      const eventWithHostLogo = {
        id: 'event3',
        name: 'Test Event 3',
        hostLogo: 'https://example.com/host-logo.png',
        accessOption: 'FREE',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithHostLogo} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      expect(eventLogo).toHaveAttribute('src', 'https://example.com/host-logo.png');
    });

    it('renders default logo when neither event logo nor host logo is provided', () => {
      const eventWithoutLogos = {
        id: 'event4',
        name: 'Test Event 4',
        accessOption: 'FREE',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithoutLogos} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      expect(eventLogo).toHaveAttribute('src', '/icons/default-event-logo.svg');
    });

    it('prioritizes event logo over host logo', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      expect(eventLogo).toHaveAttribute('src', 'https://example.com/event-logo.png');
    });
  });

  describe('Multiday Label', () => {
    it('renders multiday label when multiday is true', () => {
      render(<EventHeader event={mockEvent} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      const multidayIcon = document.querySelector('.event__header__labels__label.multiday img[alt="multiday"]');
      const multidayText = document.querySelector('.event__header__labels__label.multiday span');
      
      expect(multidayLabel).toBeInTheDocument();
      expect(multidayIcon).toHaveAttribute('src', '/icons/multiday.svg');
      expect(multidayIcon).toHaveAttribute('width', '10');
      expect(multidayIcon).toHaveAttribute('height', '10');
      expect(multidayIcon).toHaveAttribute('alt', 'multiday');
      expect(multidayIcon).toHaveAttribute('loading', 'lazy');
      expect(multidayText).toHaveTextContent('MULTIDAY');
    });

    it('does not render multiday label when multiday is false', () => {
      render(<EventHeader event={mockEventWithDefaults} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      expect(multidayLabel).not.toBeInTheDocument();
    });

    it('does not render multiday label when multiday is undefined', () => {
      const eventWithoutMultiday = {
        id: 'event5',
        name: 'Test Event 5',
        accessOption: 'FREE',
        isFeatured: false,
      };
      
      render(<EventHeader event={eventWithoutMultiday} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      expect(multidayLabel).not.toBeInTheDocument();
    });
  });

  describe('Access Type Labels', () => {
    it('renders PAID label when accessOption is PAID', () => {
      const paidEvent = {
        id: 'event6',
        name: 'Test Event 6',
        accessOption: 'PAID',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={paidEvent} />);
      
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const paidIcon = document.querySelector('.event__header__labels__label.paid img[alt="paid Logo"]');
      const paidText = document.querySelector('.event__header__labels__label.paid span');
      
      expect(paidLabel).toBeInTheDocument();
      expect(paidIcon).toHaveAttribute('src', '/icons/paid-green.svg');
      expect(paidIcon).toHaveAttribute('width', '10');
      expect(paidIcon).toHaveAttribute('height', '10');
      expect(paidIcon).toHaveAttribute('alt', 'paid Logo');
      expect(paidIcon).toHaveAttribute('loading', 'lazy');
      expect(paidText).toHaveTextContent('PAID');
    });

    it('renders FREE label when accessOption is FREE', () => {
      render(<EventHeader event={mockEventWithDefaults} />);
      
      const freeLabel = document.querySelector('.event__header__labels__label.free');
      const freeIcon = document.querySelector('.event__header__labels__label.free img[alt="free Logo"]');
      const freeText = document.querySelector('.event__header__labels__label.free span');
      
      expect(freeLabel).toBeInTheDocument();
      expect(freeIcon).toHaveAttribute('src', '/icons/free.svg');
      expect(freeIcon).toHaveAttribute('width', '10');
      expect(freeIcon).toHaveAttribute('height', '10');
      expect(freeIcon).toHaveAttribute('alt', 'free Logo');
      expect(freeIcon).toHaveAttribute('loading', 'lazy');
      expect(freeText).toHaveTextContent('FREE');
    });

    it('renders INVITE ONLY label when accessOption is INVITE', () => {
      const inviteEvent = {
        id: 'event7',
        name: 'Test Event 7',
        accessOption: 'INVITE',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={inviteEvent} />);
      
      const inviteLabel = document.querySelector('.event__header__labels__label.invite-only');
      const inviteIcon = document.querySelector('.event__header__labels__label.invite-only img[alt="invite logo"]');
      const inviteText = document.querySelector('.event__header__labels__label.invite-only span');
      
      expect(inviteLabel).toBeInTheDocument();
      expect(inviteIcon).toHaveAttribute('src', '/icons/invite-only.svg');
      expect(inviteIcon).toHaveAttribute('width', '12');
      expect(inviteIcon).toHaveAttribute('height', '12');
      expect(inviteIcon).toHaveAttribute('alt', 'invite logo');
      expect(inviteIcon).toHaveAttribute('loading', 'lazy');
      expect(inviteText).toHaveTextContent('INVITE ONLY');
    });

    it('does not render access type label when accessOption is empty', () => {
      const eventWithEmptyAccess = {
        id: 'event8',
        name: 'Test Event 8',
        accessOption: '',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithEmptyAccess} />);
      
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const freeLabel = document.querySelector('.event__header__labels__label.free');
      const inviteLabel = document.querySelector('.event__header__labels__label.invite-only');
      
      expect(paidLabel).not.toBeInTheDocument();
      expect(freeLabel).not.toBeInTheDocument();
      expect(inviteLabel).not.toBeInTheDocument();
    });

    it('does not render access type label when accessOption is undefined', () => {
      const eventWithUndefinedAccess = {
        id: 'event9',
        name: 'Test Event 9',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithUndefinedAccess} />);
      
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const freeLabel = document.querySelector('.event__header__labels__label.free');
      const inviteLabel = document.querySelector('.event__header__labels__label.invite-only');
      
      expect(paidLabel).not.toBeInTheDocument();
      expect(freeLabel).not.toBeInTheDocument();
      expect(inviteLabel).not.toBeInTheDocument();
    });
  });

  describe('Featured Label', () => {
    it('renders featured label when isFeatured is true', () => {
      const featuredEvent = {
        id: 'event10',
        name: 'Test Event 10',
        accessOption: 'FREE',
        isFeatured: true,
        multiday: false,
      };
      
      render(<EventHeader event={featuredEvent} />);
      
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      const featuredIcon = document.querySelector('.event__header__labels__label.featured img[alt="featured"]');
      const featuredText = document.querySelector('.event__header__labels__label.featured .event__header__labels__label_text__featured');
      
      expect(featuredLabel).toBeInTheDocument();
      expect(featuredIcon).toHaveAttribute('src', '/icons/featured-star.svg');
      expect(featuredIcon).toHaveAttribute('width', '12');
      expect(featuredIcon).toHaveAttribute('height', '12');
      expect(featuredIcon).toHaveAttribute('alt', 'featured');
      expect(featuredIcon).toHaveAttribute('loading', 'lazy');
      expect(featuredIcon).toHaveClass('event__header__labels__label_icon');
      expect(featuredText).toHaveTextContent('FEATURED');
      expect(featuredText).toHaveClass('event__header__labels__label_text__featured');
    });

    it('does not render featured label when isFeatured is false', () => {
      render(<EventHeader event={mockEventWithDefaults} />);
      
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      expect(featuredLabel).not.toBeInTheDocument();
    });

    it('does not render featured label when isFeatured is undefined', () => {
      const eventWithoutFeatured = {
        id: 'event11',
        name: 'Test Event 11',
        accessOption: 'FREE',
        multiday: false,
      };
      
      render(<EventHeader event={eventWithoutFeatured} />);
      
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      expect(featuredLabel).not.toBeInTheDocument();
    });
  });

  describe('Multiple Labels', () => {
    it('renders multiple labels when multiple conditions are true', () => {
      render(<EventHeader event={mockEvent} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      
      expect(multidayLabel).toBeInTheDocument();
      expect(paidLabel).toBeInTheDocument();
      expect(featuredLabel).toBeInTheDocument();
    });

    it('renders only applicable labels', () => {
      const eventWithSomeLabels = {
        id: 'event12',
        name: 'Test Event 12',
        accessOption: 'FREE',
        isFeatured: true,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithSomeLabels} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      const freeLabel = document.querySelector('.event__header__labels__label.free');
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      
      expect(multidayLabel).not.toBeInTheDocument();
      expect(freeLabel).toBeInTheDocument();
      expect(featuredLabel).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventHeader = document.querySelector('.event__header');
      const labelsContainer = document.querySelector('.event__header__labels');
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      
      expect(eventHeader).toHaveClass('event__header');
      expect(labelsContainer).toHaveClass('event__header__labels');
      expect(multidayLabel).toHaveClass('event__header__labels__label', 'multiday');
      expect(paidLabel).toHaveClass('event__header__labels__label', 'paid');
      expect(featuredLabel).toHaveClass('event__header__labels__label', 'featured');
    });

    it('applies correct CSS classes to featured label elements', () => {
      const featuredEvent = {
        id: 'event13',
        name: 'Test Event 13',
        accessOption: 'FREE',
        isFeatured: true,
        multiday: false,
      };
      
      render(<EventHeader event={featuredEvent} />);
      
      const featuredIcon = document.querySelector('.event__header__labels__label.featured img');
      const featuredText = document.querySelector('.event__header__labels__label.featured span');
      
      expect(featuredIcon).toHaveClass('event__header__labels__label_icon');
      expect(featuredText).toHaveClass('event__header__labels__label_text__featured');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventHeader = document.querySelector('.event__header');
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      const labelsContainer = document.querySelector('.event__header__labels');
      
      expect(eventHeader).toContainElement(eventLogo as HTMLElement);
      expect(eventHeader).toContainElement(labelsContainer as HTMLElement);
    });

    it('renders styled-jsx styles', () => {
      render(<EventHeader event={mockEvent} />);
      
      // Check if the component renders without errors
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop gracefully', () => {
      render(<EventHeader />);
      
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });

    it('handles null event prop gracefully', () => {
      render(<EventHeader event={null} />);
      
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });

    it('handles undefined event prop gracefully', () => {
      render(<EventHeader event={undefined} />);
      
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });

    it('handles event with missing properties', () => {
      const incompleteEvent = {
        id: 'event14',
      };
      
      render(<EventHeader event={incompleteEvent} />);
      
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles event with all properties set to false', () => {
      const eventWithAllFalse = {
        id: 'event15',
        name: 'Test Event 15',
        accessOption: '',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithAllFalse} />);
      
      const eventHeader = document.querySelector('.event__header');
      const labelsContainer = document.querySelector('.event__header__labels');
      
      expect(eventHeader).toBeInTheDocument();
      expect(labelsContainer).toBeInTheDocument();
      
      // Should not render any labels
      const allLabels = document.querySelectorAll('.event__header__labels__label');
      expect(allLabels).toHaveLength(0);
    });

    it('handles event with all properties set to true', () => {
      const eventWithAllTrue = {
        id: 'event16',
        name: 'Test Event 16',
        accessOption: 'PAID',
        isFeatured: true,
        multiday: true,
      };
      
      render(<EventHeader event={eventWithAllTrue} />);
      
      const multidayLabel = document.querySelector('.event__header__labels__label.multiday');
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      const featuredLabel = document.querySelector('.event__header__labels__label.featured');
      
      expect(multidayLabel).toBeInTheDocument();
      expect(paidLabel).toBeInTheDocument();
      expect(featuredLabel).toBeInTheDocument();
    });

    it('handles event with special characters in name', () => {
      const eventWithSpecialName = {
        id: 'event17',
        name: 'Test Event with Special Chars: !@#$%^&*()',
        accessOption: 'FREE',
        isFeatured: false,
        multiday: false,
      };
      
      render(<EventHeader event={eventWithSpecialName} />);
      
      const eventHeader = document.querySelector('.event__header');
      expect(eventHeader).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for all images', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      const multidayIcon = document.querySelector('.event__header__labels__label.multiday img[alt="multiday"]');
      const paidIcon = document.querySelector('.event__header__labels__label.paid img[alt="paid Logo"]');
      const featuredIcon = document.querySelector('.event__header__labels__label.featured img[alt="featured"]');
      
      expect(eventLogo).toHaveAttribute('alt', 'event logo');
      expect(multidayIcon).toHaveAttribute('alt', 'multiday');
      expect(paidIcon).toHaveAttribute('alt', 'paid Logo');
      expect(featuredIcon).toHaveAttribute('alt', 'featured');
    });

    it('has proper loading attributes for all images', () => {
      render(<EventHeader event={mockEvent} />);
      
      const eventLogo = document.querySelector('.event__header img[alt="event logo"]');
      const multidayIcon = document.querySelector('.event__header__labels__label.multiday img[alt="multiday"]');
      const paidIcon = document.querySelector('.event__header__labels__label.paid img[alt="paid Logo"]');
      const featuredIcon = document.querySelector('.event__header__labels__label.featured img[alt="featured"]');
      
      expect(eventLogo).not.toHaveAttribute('loading');
      expect(multidayIcon).toHaveAttribute('loading', 'lazy');
      expect(paidIcon).toHaveAttribute('loading', 'lazy');
      expect(featuredIcon).toHaveAttribute('loading', 'lazy');
    });
  });
});
