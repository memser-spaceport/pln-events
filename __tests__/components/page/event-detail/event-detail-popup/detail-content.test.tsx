import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailViewDesktop from '@/components/page/event-detail/event-detail-popup/detail-content';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, loading, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} loading={loading} {...props} />;
  };
});

// Mock the EventType component
jest.mock('@/components/page/event-detail/event-detail-popup/event-type', () => {
  return function MockEventType({ event }: { event: any }) {
    return <div data-testid="event-type">Event Type Component</div>;
  };
});

// Mock the constants
jest.mock('@/utils/constants', () => ({
  ACCESS_TYPES: {
    PAID: 'PAID',
    FREE: 'FREE',
    INVITE: 'INVITE',
    FREE_LABEL: 'FREE',
  },
}));

describe('DetailViewDesktop Component', () => {
  const defaultProps = {
    event: {
      accessOption: 'FREE',
    },
    onClose: jest.fn(),
    handleRefreshClick: jest.fn(),
    isRefreshing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the main container', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const container = document.querySelector('.detail-content');
      expect(container).toBeInTheDocument();
    });

    it('renders back button section', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const backButton = document.querySelector('.detail-content__back-button');
      expect(backButton).toBeInTheDocument();
      
      const backButtonWrapper = document.querySelector('.detail-content__back-button__wrapper');
      expect(backButtonWrapper).toBeInTheDocument();
    });

    it('renders back button icon and text', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const backIcon = document.querySelector('.detail-content__back-button__wrapper__icon');
      expect(backIcon).toBeInTheDocument();
      expect(backIcon).toHaveAttribute('src', '/icons/arrow-right.svg');
      expect(backIcon).toHaveAttribute('alt', 'back');
      expect(backIcon).toHaveAttribute('width', '14');
      expect(backIcon).toHaveAttribute('height', '14');
      
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders header section', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const header = document.querySelector('.detail-content__header');
      expect(header).toBeInTheDocument();
      
      const headerLeft = document.querySelector('.detail-content__header__left');
      expect(headerLeft).toBeInTheDocument();
      
      const headerRight = document.querySelector('.detail-content__header__right');
      expect(headerRight).toBeInTheDocument();
    });

    it('renders header title', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      expect(screen.getByText('EVENT DETAILS')).toBeInTheDocument();
    });

    it('renders EventType component', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      expect(screen.getByTestId('event-type')).toBeInTheDocument();
      expect(screen.getByText('Event Type Component')).toBeInTheDocument();
    });
  });

  describe('Access Type Labels', () => {
    it('renders PAID label when accessOption is PAID', () => {
      const propsWithPaidEvent = {
        ...defaultProps,
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<DetailViewDesktop {...propsWithPaidEvent} />);
      
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      expect(paidLabel).toBeInTheDocument();
      expect(screen.getByText('PAID')).toBeInTheDocument();
      
      const paidIcon = paidLabel?.querySelector('img');
      expect(paidIcon).toHaveAttribute('src', '/icons/paid-green.svg');
      expect(paidIcon).toHaveAttribute('alt', 'paid Logo');
      expect(paidIcon).toHaveAttribute('width', '10');
      expect(paidIcon).toHaveAttribute('height', '10');
    });

    it('renders FREE label when accessOption is FREE', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const freeLabel = document.querySelector('.event__header__labels__label.free');
      expect(freeLabel).toBeInTheDocument();
      expect(screen.getByText('FREE')).toBeInTheDocument();
      
      const freeIcon = freeLabel?.querySelector('img');
      expect(freeIcon).toHaveAttribute('src', '/icons/free.svg');
      expect(freeIcon).toHaveAttribute('alt', 'free Logo');
      expect(freeIcon).toHaveAttribute('width', '10');
      expect(freeIcon).toHaveAttribute('height', '10');
    });

    it('renders INVITE ONLY label when accessOption is INVITE', () => {
      const propsWithInviteEvent = {
        ...defaultProps,
        event: {
          accessOption: 'INVITE',
        },
      };
      
      render(<DetailViewDesktop {...propsWithInviteEvent} />);
      
      const inviteLabel = document.querySelector('.event__header__labels__label.invite-only');
      expect(inviteLabel).toBeInTheDocument();
      expect(screen.getByText('INVITE ONLY')).toBeInTheDocument();
      
      const inviteIcon = inviteLabel?.querySelector('img');
      expect(inviteIcon).toHaveAttribute('src', '/icons/invite-only.svg');
      expect(inviteIcon).toHaveAttribute('alt', 'invite logo');
      expect(inviteIcon).toHaveAttribute('width', '12');
      expect(inviteIcon).toHaveAttribute('height', '12');
    });

    it('does not render any access type label when accessOption is not recognized', () => {
      const propsWithUnknownAccess = {
        ...defaultProps,
        event: {
          accessOption: 'UNKNOWN',
        },
      };
      
      render(<DetailViewDesktop {...propsWithUnknownAccess} />);
      
      expect(screen.queryByText('PAID')).not.toBeInTheDocument();
      expect(screen.queryByText('FREE')).not.toBeInTheDocument();
      expect(screen.queryByText('INVITE ONLY')).not.toBeInTheDocument();
    });

    it('does not render any access type label when accessOption is undefined', () => {
      const propsWithUndefinedAccess = {
        ...defaultProps,
        event: {},
      };
      
      render(<DetailViewDesktop {...propsWithUndefinedAccess} />);
      
      expect(screen.queryByText('PAID')).not.toBeInTheDocument();
      expect(screen.queryByText('FREE')).not.toBeInTheDocument();
      expect(screen.queryByText('INVITE ONLY')).not.toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('calls onClose when back button is clicked', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const backButton = document.querySelector('.detail-content__back-button__wrapper');
      fireEvent.click(backButton!);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when back button icon is clicked', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const backIcon = document.querySelector('.detail-content__back-button__wrapper__icon');
      fireEvent.click(backIcon!);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when back button text is clicked', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const backText = screen.getByText('Back');
      fireEvent.click(backText);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props Handling', () => {
    it('passes event prop to EventType component', () => {
      const mockEvent = { accessOption: 'FREE', name: 'Test Event' };
      const propsWithEvent = {
        ...defaultProps,
        event: mockEvent,
      };
      
      render(<DetailViewDesktop {...propsWithEvent} />);
      
      // EventType component should receive the event prop
      expect(screen.getByTestId('event-type')).toBeInTheDocument();
    });

    it('handles missing event prop', () => {
      const propsWithoutEvent = {
        onClose: jest.fn(),
        handleRefreshClick: jest.fn(),
        isRefreshing: false,
      };
      
      render(<DetailViewDesktop {...propsWithoutEvent} />);
      
      // Should not crash and should render basic structure
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
      expect(screen.getByText('EVENT DETAILS')).toBeInTheDocument();
    });

    it('handles null event prop', () => {
      const propsWithNullEvent = {
        ...defaultProps,
        event: null,
      };
      
      render(<DetailViewDesktop {...propsWithNullEvent} />);
      
      // Should not crash and should render basic structure
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
      expect(screen.getByText('EVENT DETAILS')).toBeInTheDocument();
    });

    it('handles undefined onClose prop', () => {
      const propsWithoutOnClose = {
        event: { accessOption: 'FREE' },
        handleRefreshClick: jest.fn(),
        isRefreshing: false,
      };
      
      render(<DetailViewDesktop {...propsWithoutOnClose} />);
      
      const backButton = document.querySelector('.detail-content__back-button__wrapper');
      fireEvent.click(backButton!);
      
      // Should not crash when onClose is undefined
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const container = document.querySelector('.detail-content');
      expect(container).toHaveClass('detail-content');
      
      const backButton = document.querySelector('.detail-content__back-button');
      expect(backButton).toHaveClass('detail-content__back-button');
      
      const backButtonWrapper = document.querySelector('.detail-content__back-button__wrapper');
      expect(backButtonWrapper).toHaveClass('detail-content__back-button__wrapper');
      
      const backIcon = document.querySelector('.detail-content__back-button__wrapper__icon');
      expect(backIcon).toHaveClass('detail-content__back-button__wrapper__icon');
      
      const header = document.querySelector('.detail-content__header');
      expect(header).toHaveClass('detail-content__header');
      
      const headerLeft = document.querySelector('.detail-content__header__left');
      expect(headerLeft).toHaveClass('detail-content__header__left');
      
      const headerRight = document.querySelector('.detail-content__header__right');
      expect(headerRight).toHaveClass('detail-content__header__right');
    });

    it('applies correct CSS classes to access type labels', () => {
      const propsWithPaidEvent = {
        ...defaultProps,
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<DetailViewDesktop {...propsWithPaidEvent} />);
      
      const paidLabel = document.querySelector('.event__header__labels__label.paid');
      expect(paidLabel).toHaveClass('event__header__labels__label', 'paid');
    });

    it('renders with proper structure for styling', () => {
      render(<DetailViewDesktop {...defaultProps} />);
      
      const container = document.querySelector('.detail-content');
      expect(container).toBeInTheDocument();
      
      const backButton = container?.querySelector('.detail-content__back-button');
      expect(backButton).toBeInTheDocument();
      
      const header = container?.querySelector('.detail-content__header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    it('logs eventAccessOption to console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithEvent = {
        ...defaultProps,
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<DetailViewDesktop {...propsWithEvent} />);
      
      expect(consoleSpy).toHaveBeenCalledWith('PAID');
      
      consoleSpy.mockRestore();
    });

    it('logs undefined when eventAccessOption is undefined', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithoutAccessOption = {
        ...defaultProps,
        event: {},
      };
      
      render(<DetailViewDesktop {...propsWithoutAccessOption} />);
      
      expect(consoleSpy).toHaveBeenCalledWith(undefined);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles event with only accessOption property', () => {
      const propsWithMinimalEvent = {
        ...defaultProps,
        event: {
          accessOption: 'FREE',
        },
      };
      
      render(<DetailViewDesktop {...propsWithMinimalEvent} />);
      
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
      expect(screen.getByText('FREE')).toBeInTheDocument();
    });

    it('handles event with multiple properties', () => {
      const propsWithFullEvent = {
        ...defaultProps,
        event: {
          accessOption: 'PAID',
          name: 'Test Event',
          description: 'Test Description',
          date: '2025-01-01',
        },
      };
      
      render(<DetailViewDesktop {...propsWithFullEvent} />);
      
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
      expect(screen.getByText('PAID')).toBeInTheDocument();
    });

    it('handles isRefreshing prop (not used in component but passed)', () => {
      const propsWithRefreshing = {
        ...defaultProps,
        isRefreshing: true,
      };
      
      render(<DetailViewDesktop {...propsWithRefreshing} />);
      
      // Component should render normally regardless of isRefreshing value
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
    });

    it('handles handleRefreshClick prop (not used in component but passed)', () => {
      const propsWithRefreshClick = {
        ...defaultProps,
        handleRefreshClick: jest.fn(),
      };
      
      render(<DetailViewDesktop {...propsWithRefreshClick} />);
      
      // Component should render normally regardless of handleRefreshClick value
      expect(document.querySelector('.detail-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      const propsWithPaidEvent = {
        ...defaultProps,
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<DetailViewDesktop {...propsWithPaidEvent} />);
      
      const backIcon = document.querySelector('.detail-content__back-button__wrapper__icon');
      expect(backIcon).toHaveAttribute('alt', 'back');
      
      const paidIcon = document.querySelector('.event__header__labels__label.paid img');
      expect(paidIcon).toHaveAttribute('alt', 'paid Logo');
    });

    it('provides proper alt text for all access type icons', () => {
      const propsWithFreeEvent = {
        ...defaultProps,
        event: {
          accessOption: 'FREE',
        },
      };
      
      render(<DetailViewDesktop {...propsWithFreeEvent} />);
      
      const freeIcon = document.querySelector('.event__header__labels__label.free img');
      expect(freeIcon).toHaveAttribute('alt', 'free Logo');
    });

    it('provides proper alt text for invite only icon', () => {
      const propsWithInviteEvent = {
        ...defaultProps,
        event: {
          accessOption: 'INVITE',
        },
      };
      
      render(<DetailViewDesktop {...propsWithInviteEvent} />);
      
      const inviteIcon = document.querySelector('.event__header__labels__label.invite-only img');
      expect(inviteIcon).toHaveAttribute('alt', 'invite logo');
    });
  });
});
