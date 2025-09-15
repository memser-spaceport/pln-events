import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/components/page/event-detail/event-detail-popup/footer';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    type: 'calendar',
  })),
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock analytics
jest.mock('@/analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: jest.fn(() => ({
    onScheduleRefreshClick: jest.fn(),
    onEventUrlClicked: jest.fn(),
    onViewAttendeesUrlClicked: jest.fn(),
  })),
}));

// Mock helper functions
jest.mock('@/utils/helper', () => ({
  getRefreshStatus: jest.fn(() => false),
}));

// Mock service
jest.mock('@/service/events.service', () => ({
  getRefreshedAgenda: jest.fn(),
}));

// Mock SocialLinks component
jest.mock('@/components/page/event-detail/social-links', () => {
  return function MockSocialLinks({ event }: { event: any }) {
    return <div data-testid="social-links">Social Links Component</div>;
  };
});

const mockUseSchedulePageAnalytics = require('@/analytics/schedule.analytics').useSchedulePageAnalytics as jest.MockedFunction<any>;
const mockGetRefreshStatus = require('@/utils/helper').getRefreshStatus as jest.MockedFunction<any>;
const mockGetRefreshedAgenda = require('@/service/events.service').getRefreshedAgenda as jest.MockedFunction<any>;
const mockToast = require('react-toastify').toast as any;

describe('Footer Component', () => {
  const defaultEvent = {
    id: 'event-1',
    name: 'Test Event',
    irlLink: 'https://example.com/attendees',
    websiteLink: 'https://example.com/website',
    sessions: [
      { name: 'Session 1', start_date: '2025-01-01T10:00:00Z', end_date: '2025-01-01T11:00:00Z' },
    ],
  };

  const mockSetEvent = jest.fn();
  const mockAnalytics = {
    onScheduleRefreshClick: jest.fn(),
    onEventUrlClicked: jest.fn(),
    onViewAttendeesUrlClicked: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSchedulePageAnalytics.mockReturnValue(mockAnalytics);
    mockGetRefreshStatus.mockReturnValue(false);
    mockGetRefreshedAgenda.mockResolvedValue({
      agenda: [
        { name: 'Updated Session', start_date: '2025-01-01T10:00:00Z', end_date: '2025-01-01T11:00:00Z' },
      ],
    });
  });

  describe('Rendering', () => {
    it('renders main footer container', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });

    it('renders social links section', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });

    it('renders controls section', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const controls = document.querySelector('.event__footer__ctrls');
      expect(controls).toBeInTheDocument();
    });

    it('renders refresh button when not restricted', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right');
      expect(refreshButton).toBeInTheDocument();
      expect(screen.getByText('Refresh Schedule')).toBeInTheDocument();
    });

    it('renders attendees button', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button');
      expect(attendeesButton).toBeInTheDocument();
      expect(screen.getByText('View Attendees')).toBeInTheDocument();
    });

    it('renders website button', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website');
      expect(websiteButton).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
    });
  });

  describe('Refresh Button', () => {
    it('shows refresh button when not restricted', () => {
      mockGetRefreshStatus.mockReturnValue(false);
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right');
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).not.toHaveClass('disabled');
    });

    it('hides refresh button when restricted', () => {
      mockGetRefreshStatus.mockReturnValue(true);
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right');
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('shows refresh icon and text when not refreshing', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshIcon = document.querySelector('img[alt="edit"]');
      expect(refreshIcon).toHaveAttribute('src', '/icons/refresh.svg');
      expect(refreshIcon).toHaveAttribute('width', '16');
      expect(refreshIcon).toHaveAttribute('height', '16');
      
      expect(screen.getByText('Refresh Schedule')).toBeInTheDocument();
    });

    it('shows refreshing text when refreshing', async () => {
      mockGetRefreshedAgenda.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(screen.getByText('Refreshing...')).toBeInTheDocument();
      });
    });

    it('calls analytics when refresh button is clicked', async () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      expect(mockAnalytics.onScheduleRefreshClick).toHaveBeenCalledWith('event-1', 'Test Event', 'clicked');
    });

    it('updates event with refreshed agenda on successful refresh', async () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockSetEvent).toHaveBeenCalledWith(expect.any(Function));
      });
    });

    it('handles refresh error and shows toast', async () => {
      mockGetRefreshedAgenda.mockRejectedValue(new Error('Refresh failed'));
      
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Session refresh failed');
        expect(mockAnalytics.onScheduleRefreshClick).toHaveBeenCalledWith('event-1', 'Test Event', 'error');
      });
    });

    it('does not refresh when event id is missing', async () => {
      const eventWithoutId = { ...defaultEvent, id: null };
      render(<Footer event={eventWithoutId} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      expect(mockGetRefreshedAgenda).not.toHaveBeenCalled();
    });
  });

  describe('Attendees Button', () => {
    it('renders attendees button with correct attributes when irlLink is available', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button') as HTMLAnchorElement;
      expect(attendeesButton).toHaveAttribute('href', 'https://example.com/attendees');
      expect(attendeesButton).toHaveAttribute('target', '_blank');
      expect(attendeesButton).toHaveAttribute('rel', 'noopener noreferrer');
      expect(attendeesButton).not.toHaveClass('disabled');
    });

    it('renders disabled attendees button when irlLink is not available', () => {
      const eventWithoutIrlLink = { ...defaultEvent, irlLink: null };
      render(<Footer event={eventWithoutIrlLink} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button') as HTMLAnchorElement;
      expect(attendeesButton).toHaveAttribute('href', '');
      expect(attendeesButton).toHaveClass('disabled');
    });

    it('renders attendees icon', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const attendeesIcon = document.querySelector('.event__footer__ctrls__attendees__img');
      expect(attendeesIcon).toHaveAttribute('src', '/icons/avatar-group.svg');
      expect(attendeesIcon).toHaveAttribute('alt', 'Attendees');
      expect(attendeesIcon).toHaveClass('event__footer__ctrls__attendees__img');
    });

    it('calls analytics when attendees button is clicked with valid link', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button') as HTMLAnchorElement;
      fireEvent.click(attendeesButton);
      
      expect(mockAnalytics.onViewAttendeesUrlClicked).toHaveBeenCalledWith(
        'calendar',
        'event-1',
        'Test Event',
        'view attendees',
        'https://example.com/attendees',
        {}
      );
    });

    it('prevents navigation when attendees button is clicked without valid link', () => {
      const eventWithoutIrlLink = { ...defaultEvent, irlLink: null };
      render(<Footer event={eventWithoutIrlLink} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button') as HTMLAnchorElement;
      
      // Test that the button has the disabled class when irlLink is null
      expect(attendeesButton).toHaveClass('disabled');
      
      // Test that analytics is not called when clicking disabled button
      fireEvent.click(attendeesButton);
      expect(mockAnalytics.onViewAttendeesUrlClicked).not.toHaveBeenCalled();
    });
  });

  describe('Website Button', () => {
    it('renders website button with correct attributes when websiteLink is available', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website') as HTMLAnchorElement;
      expect(websiteButton).toHaveAttribute('href', 'https://example.com/website');
      expect(websiteButton).toHaveAttribute('target', '_blank');
      expect(websiteButton).not.toHaveClass('disabled');
    });

    it('renders disabled website button when websiteLink is not available', () => {
      const eventWithoutWebsiteLink = { ...defaultEvent, websiteLink: null };
      render(<Footer event={eventWithoutWebsiteLink} setEvent={mockSetEvent} />);
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website') as HTMLAnchorElement;
      expect(websiteButton).toHaveAttribute('href', '');
      expect(websiteButton).toHaveClass('disabled');
    });

    it('calls analytics when website button is clicked with valid link', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website') as HTMLAnchorElement;
      fireEvent.click(websiteButton);
      
      expect(mockAnalytics.onEventUrlClicked).toHaveBeenCalledWith(
        'calendar',
        'event-1',
        'Test Event',
        'website',
        'https://example.com/website',
        {}
      );
    });

    it('prevents navigation when website button is clicked without valid link', () => {
      const eventWithoutWebsiteLink = { ...defaultEvent, websiteLink: null };
      render(<Footer event={eventWithoutWebsiteLink} setEvent={mockSetEvent} />);
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website') as HTMLAnchorElement;
      
      // Test that the button has the disabled class when websiteLink is null
      expect(websiteButton).toHaveClass('disabled');
      
      // Test that analytics is not called when clicking disabled button
      fireEvent.click(websiteButton);
      expect(mockAnalytics.onEventUrlClicked).not.toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop', () => {
      render(<Footer event={null} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });

    it('handles undefined event prop', () => {
      render(<Footer event={undefined} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });

    it('handles event with minimal properties', () => {
      const minimalEvent = { id: 'minimal-event' };
      render(<Footer event={minimalEvent} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });

    it('handles missing setEvent prop', () => {
      render(<Footer event={defaultEvent} setEvent={null} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toHaveClass('event__footer');
      
      const socialLinks = document.querySelector('.event__footer__socialLinks');
      expect(socialLinks).toHaveClass('event__footer__socialLinks');
      
      const controls = document.querySelector('.event__footer__ctrls');
      expect(controls).toHaveClass('event__footer__ctrls');
    });

    it('renders with proper structure for styling', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
      
      const socialLinks = footer?.querySelector('.event__footer__socialLinks');
      expect(socialLinks).toBeInTheDocument();
      
      const controls = footer?.querySelector('.event__footer__ctrls');
      expect(controls).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('manages refreshing state correctly', async () => {
      mockGetRefreshedAgenda.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      
      // Initially not refreshing
      expect(refreshButton).not.toBeDisabled();
      expect(screen.getByText('Refresh Schedule')).toBeInTheDocument();
      
      // Click to start refreshing
      fireEvent.click(refreshButton);
      
      // Should be refreshing
      await waitFor(() => {
        expect(refreshButton).toBeDisabled();
        expect(screen.getByText('Refreshing...')).toBeInTheDocument();
      });
      
      // Wait for refresh to complete
      await waitFor(() => {
        expect(refreshButton).not.toBeDisabled();
        expect(screen.getByText('Refresh Schedule')).toBeInTheDocument();
      });
    });
  });

  describe('Analytics Integration', () => {
    it('calls correct analytics functions with proper parameters', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      // Test refresh analytics
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      expect(mockAnalytics.onScheduleRefreshClick).toHaveBeenCalledWith('event-1', 'Test Event', 'clicked');
      
      // Test attendees analytics
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button') as HTMLAnchorElement;
      fireEvent.click(attendeesButton);
      
      expect(mockAnalytics.onViewAttendeesUrlClicked).toHaveBeenCalledWith(
        'calendar',
        'event-1',
        'Test Event',
        'view attendees',
        'https://example.com/attendees',
        {}
      );
      
      // Test website analytics
      const websiteButton = document.querySelector('.event__footer__ctrls__website') as HTMLAnchorElement;
      fireEvent.click(websiteButton);
      
      expect(mockAnalytics.onEventUrlClicked).toHaveBeenCalledWith(
        'calendar',
        'event-1',
        'Test Event',
        'website',
        'https://example.com/website',
        {}
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles event with all properties undefined', () => {
      const emptyEvent = {};
      render(<Footer event={emptyEvent} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });

    it('handles refresh when agenda is not returned', async () => {
      mockGetRefreshedAgenda.mockResolvedValue({});
      
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockSetEvent).not.toHaveBeenCalled();
      });
    });

    it('handles refresh when agenda is null', async () => {
      mockGetRefreshedAgenda.mockResolvedValue({ agenda: null });
      
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshButton = document.querySelector('.event__schedule__cn__right') as HTMLButtonElement;
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockSetEvent).not.toHaveBeenCalled();
      });
    });

    it('handles very long event names', () => {
      const eventWithLongName = {
        ...defaultEvent,
        name: 'A'.repeat(1000),
      };
      
      render(<Footer event={eventWithLongName} setEvent={mockSetEvent} />);
      
      const footer = document.querySelector('.event__footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const refreshIcon = document.querySelector('img[alt="edit"]');
      expect(refreshIcon).toHaveAttribute('alt', 'edit');
      
      const attendeesIcon = document.querySelector('img[alt="Attendees"]');
      expect(attendeesIcon).toHaveAttribute('alt', 'Attendees');
    });

    it('provides proper target and rel attributes for external links', () => {
      render(<Footer event={defaultEvent} setEvent={mockSetEvent} />);
      
      const attendeesButton = document.querySelector('.event__footer__ctrls__attendees__button');
      expect(attendeesButton).toHaveAttribute('target', '_blank');
      expect(attendeesButton).toHaveAttribute('rel', 'noopener noreferrer');
      
      const websiteButton = document.querySelector('.event__footer__ctrls__website');
      expect(websiteButton).toHaveAttribute('target', '_blank');
    });
  });
});
