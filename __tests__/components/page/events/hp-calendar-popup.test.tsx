import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpCalendarPopup from '../../../../components/page/events/hp-calendar-popup';
import { IEvent } from '@/types/events.type';

// Mock the PlEventCard component
jest.mock('../../../../components/ui/pl-event-card', () => {
  return function MockPlEventCard({ onLinkItemClicked, ...props }: any) {
    return (
      <div data-testid="pl-event-card">
        <div data-testid="event-title">{props.eventName || props.title}</div>
        <button 
          data-testid="event-link-button"
          onClick={() => onLinkItemClicked && onLinkItemClicked(props.id, props.website)}
        >
          View Event
        </button>
      </div>
    );
  };
});

// Mock the useHash hook
jest.mock('@/hooks/use-hash', () => ({
  useHash: jest.fn(),
}));

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

describe('HpCalendarPopup Component', () => {
  const mockEvents: IEvent[] = [
    {
      id: 'event1',
      eventName: 'Test Event 1',
      website: 'https://event1.com',
      location: 'Location 1',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      dateTBD: false,
      startDateValue: new Date('2024-01-15'),
      endDateValue: new Date('2024-01-16'),
      startDay: 15,
      startDayString: '15',
      startMonthIndex: 0,
      startMonth: 'January',
      startYear: "2024",
      locationLogo: 'locationLogo1',
      slug: 'test-event-1',
      externalLinkIcon: 'externalLinkIcon1',
    },
    {
      id: 'event2',
      eventName: 'Test Event 2',
      website: 'https://event2.com',
      location: 'Location 2',
      startDate: '2024-02-20',
      endDate: '2024-02-21',
      dateTBD: false,
      startDateValue: new Date('2024-02-20'),
      endDateValue: new Date('2024-02-21'),
      startDay: 20,
      startDayString: '20',
      startMonthIndex: 1,
      startMonth: 'February',
      startYear: 2024,
      locationLogo: 'locationLogo2',
      slug: 'test-event-2',
      externalLinkIcon: 'externalLinkIcon2',
    },
  ];

  const defaultProps = {
    rawEvents: mockEvents,
    monthName: 'January',
  };

  const mockUseHash = require('@/hooks/use-hash').useHash as jest.Mock;
  const mockUseRouter = require('next/navigation').useRouter as jest.Mock;
  const mockUseEventsAnalytics = require('@/analytics/events.analytics').default as jest.Mock;

  const mockRouter = {
    push: jest.fn(),
  };

  const mockAnalytics = {
    onCardLinkClicked: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHash.mockReturnValue(null);
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseEventsAnalytics.mockReturnValue(mockAnalytics);
  });

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpCalendarPopup {...defaultProps} />);
      
      // Component should render but popup should not be visible initially
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('renders popup when event card is active', () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      // Simulate setting event card as active
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
    });

    it('renders event card with correct props when active', () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      const eventCard = screen.getByTestId('pl-event-card');
      expect(eventCard).toBeInTheDocument();
    });
  });

  describe('Event Listeners', () => {
    it('listens for showCalenderPopup custom event', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<HpCalendarPopup {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('showCalenderPopup', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('showCalenderPopup', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('handles showCalenderPopup event correctly', async () => {
      render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
    });
  });

  describe('Hash-based Event Selection', () => {
    it('shows event card when hash matches event slug', async () => {
      mockUseHash.mockReturnValue('#test-event-1');
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
    });

    it('does not show event card when hash does not match any event', () => {
      mockUseHash.mockReturnValue('#non-existent-event');
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles empty hash gracefully', () => {
      mockUseHash.mockReturnValue('');
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles null hash gracefully', () => {
      mockUseHash.mockReturnValue(null);
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('closes event card when close button is clicked', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      // First show the popup
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
      
      // Then close it
      const closeButton = document.querySelector('.eventCard__item__close');
      expect(closeButton).toBeInTheDocument();
      
      fireEvent.click(closeButton!);
      
      await waitFor(() => {
        expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
      });
    });

    it('calls router.push when closing event card', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      // First show the popup
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
      
      // Then close it
      const closeButton = document.querySelector('.eventCard__item__close');
      fireEvent.click(closeButton!);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/events?view=calendar', { scroll: false });
    });
  });

  describe('Event Link Handling', () => {
    it('calls analytics when event link is clicked', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      // First show the popup
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
      
      // Click the event link button
      const linkButton = screen.getByTestId('event-link-button');
      fireEvent.click(linkButton);
      
      expect(mockAnalytics.onCardLinkClicked).toHaveBeenCalledWith('event1', 'https://event1.com', 'calender');
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to event card container', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const eventCardContainer = document.querySelector('.eventCard');
        expect(eventCardContainer).toBeInTheDocument();
        expect(eventCardContainer).toHaveClass('eventCard');
      });
    });

    it('applies correct CSS classes to event card item', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const eventCardItem = document.querySelector('.eventCard__item');
        expect(eventCardItem).toBeInTheDocument();
        expect(eventCardItem).toHaveClass('eventCard__item');
      });
    });

    it('applies correct CSS classes to close button', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const closeButton = document.querySelector('.eventCard__item__close');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('eventCard__item__close');
      });
    });

    it('applies correct CSS classes to close button image', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const closeButtonImage = document.querySelector('.eventCard__item__close__img');
        expect(closeButtonImage).toBeInTheDocument();
        expect(closeButtonImage).toHaveClass('eventCard__item__close__img');
        expect(closeButtonImage).toHaveAttribute('src', '/icons/pln-close-white.svg');
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing rawEvents prop gracefully', () => {
      render(<HpCalendarPopup monthName="January" />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles empty rawEvents array', () => {
      render(<HpCalendarPopup {...defaultProps} rawEvents={[]} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles null rawEvents prop', () => {
      render(<HpCalendarPopup {...defaultProps} rawEvents={null} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles missing monthName prop gracefully', () => {
      render(<HpCalendarPopup rawEvents={mockEvents} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      render(<HpCalendarPopup />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple showCalenderPopup events', async () => {
      render(<HpCalendarPopup {...defaultProps} />);
      
      // First event
      act(() => {
        const event1 = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event1);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
      
      // Second event
      act(() => {
        const event2 = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[1]
        });
        document.dispatchEvent(event2);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
    });

    it('handles events with missing slug property', () => {
      const eventsWithoutSlug = [
        {
          ...mockEvents[0],
          slug: undefined,
        }
      ];
      
      mockUseHash.mockReturnValue('#test-event-1');
      
      render(<HpCalendarPopup {...defaultProps} rawEvents={eventsWithoutSlug} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles hash with special characters', () => {
      mockUseHash.mockReturnValue('#test-event-1-with-special-chars');
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });

    it('handles very long hash values', () => {
      const longHash = '#'.repeat(1000);
      mockUseHash.mockReturnValue(longHash);
      
      render(<HpCalendarPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('pl-event-card')).not.toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('cleans up event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<HpCalendarPopup {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('showCalenderPopup', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('showCalenderPopup', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('updates selected event when hash changes', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      // First hash
      mockUseHash.mockReturnValue('#test-event-1');
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
      
      // Second hash
      mockUseHash.mockReturnValue('#test-event-2');
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pl-event-card')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('renders close button with proper structure', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const closeButton = document.querySelector('.eventCard__item__close');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('eventCard__item__close');
      });
    });

    it('renders event card with proper structure', async () => {
      const { rerender } = render(<HpCalendarPopup {...defaultProps} />);
      
      act(() => {
        const event = new CustomEvent('showCalenderPopup', {
          detail: mockEvents[0]
        });
        document.dispatchEvent(event);
      });
      
      rerender(<HpCalendarPopup {...defaultProps} />);
      
      await waitFor(() => {
        const eventCard = screen.getByTestId('pl-event-card');
        expect(eventCard).toBeInTheDocument();
      });
    });
  });
});
