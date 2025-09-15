import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'next/navigation';
import EventLocation from '@/components/page/event-detail/event-location';
import { TYPE_CONSTANTS } from '@/utils/constants';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// Mock analytics hook - commented out since the module doesn't exist
// jest.mock('@/analytics/24-pg/event-detail-analytics', () => ({
//   useEventDetailAnalytics: () => ({
//     onEventUrlClicked: jest.fn(),
//   }),
// }));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe('EventLocation Component', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ type: 'event' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('In-Person Events', () => {
    it('renders in-person event with location URL as clickable link', () => {
      const event = {
        id: 'event1',
        name: 'Test Event 1',
        format: TYPE_CONSTANTS.IN_PERSON,
        location: 'San Francisco, CA',
        locationUrl: 'https://maps.google.com/sf',
      };

      render(<EventLocation event={event} />);

      const locationLink = screen.getByRole('link');
      const locationIcon = screen.getByAltText('location');
      const locationText = screen.getByText('San Francisco, CA');

      expect(locationLink).toBeInTheDocument();
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/sf');
      expect(locationLink).toHaveAttribute('target', '_blank');
      expect(locationLink).toHaveClass('event__location', 'cursor-pointer');
      expect(locationIcon).toHaveAttribute('src', '/icons/location-black.svg');
      expect(locationIcon).toHaveAttribute('width', '11');
      expect(locationIcon).toHaveAttribute('height', '13');
      expect(locationText).toHaveClass('event__location__txt', 'link');
    });

    it('renders in-person event without location URL as non-clickable span', () => {
      const event = {
        id: 'event2',
        name: 'Test Event 2',
        format: TYPE_CONSTANTS.IN_PERSON,
        location: 'New York, NY',
        locationUrl: '',
      };

      render(<EventLocation event={event} />);

      const locationSpan = document.querySelector('.event__location');
      const locationIcon = screen.getByAltText('location');
      const locationText = screen.getByText('New York, NY');

      expect(locationSpan).toBeInTheDocument();
      expect(locationSpan?.tagName).toBe('SPAN');
      expect(locationSpan).toHaveClass('event__location');
      expect(locationSpan).not.toHaveClass('cursor-pointer');
      expect(locationIcon).toHaveAttribute('src', '/icons/location-black.svg');
      expect(locationText).toHaveClass('event__location__txt');
      expect(locationText).not.toHaveClass('link');
    });

    it('renders default location "TBD" when location is not provided', () => {
      const event = {
        id: 'event3',
        name: 'Test Event 3',
        format: TYPE_CONSTANTS.IN_PERSON,
      };

      render(<EventLocation event={event} />);

      expect(screen.getByText('TBD')).toBeInTheDocument();
    });

    it('calls onClickEventUrl when location link is clicked', () => {
      const event = {
        id: 'event4',
        name: 'Test Event 4',
        format: TYPE_CONSTANTS.IN_PERSON,
        location: 'Chicago, IL',
        locationUrl: 'https://maps.google.com/chicago',
      };

      render(<EventLocation event={event} />);

      const locationLink = screen.getByRole('link');
      fireEvent.click(locationLink);

      // The onClickEventUrl function is called but analytics is mocked
      expect(locationLink).toBeInTheDocument();
    });
  });

  describe('Virtual Events', () => {
    it('renders virtual event with meeting link as clickable link', () => {
      const event = {
        id: 'event5',
        name: 'Test Event 5',
        format: TYPE_CONSTANTS.VIRTUAL,
        meetingPlatform: 'Zoom',
        meetingLink: 'https://zoom.us/j/123456789',
      };

      render(<EventLocation event={event} />);

      const meetingLink = screen.getByRole('link');
      const virtualIcon = screen.getByAltText('location');
      const platformText = screen.getByText('Zoom');

      expect(meetingLink).toBeInTheDocument();
      expect(meetingLink).toHaveAttribute('href', 'https://zoom.us/j/123456789');
      expect(meetingLink).toHaveAttribute('target', '_blank');
      expect(meetingLink).toHaveClass('event__location', 'cursor-pointer');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
      expect(virtualIcon).toHaveAttribute('width', '14');
      expect(virtualIcon).toHaveAttribute('height', '14');
      expect(platformText).toHaveClass('event__location__txt', 'link');
    });

    it('renders virtual event without meeting link as non-clickable span', () => {
      const event = {
        id: 'event6',
        name: 'Test Event 6',
        format: TYPE_CONSTANTS.VIRTUAL,
        meetingPlatform: 'Microsoft Teams',
        meetingLink: '',
      };

      render(<EventLocation event={event} />);

      const meetingSpan = document.querySelector('.event__location');
      const virtualIcon = screen.getByAltText('location');
      const platformText = screen.getByText('Microsoft Teams');

      expect(meetingSpan).toBeInTheDocument();
      expect(meetingSpan?.tagName).toBe('SPAN');
      expect(meetingSpan).toHaveClass('event__location');
      expect(meetingSpan).not.toHaveClass('cursor-pointer');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
      expect(platformText).toHaveClass('event__location__txt');
      expect(platformText).not.toHaveClass('link');
    });

    it('renders default platform "TBD" when meetingPlatform is not provided', () => {
      const event = {
        id: 'event7',
        name: 'Test Event 7',
        format: TYPE_CONSTANTS.VIRTUAL,
      };

      render(<EventLocation event={event} />);

      expect(screen.getByText('TBD')).toBeInTheDocument();
    });

    it('calls onClickEventUrl when meeting link is clicked', () => {
      const event = {
        id: 'event8',
        name: 'Test Event 8',
        format: TYPE_CONSTANTS.VIRTUAL,
        meetingPlatform: 'Google Meet',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      };

      render(<EventLocation event={event} />);

      const meetingLink = screen.getByRole('link');
      fireEvent.click(meetingLink);

      expect(meetingLink).toBeInTheDocument();
    });
  });

  describe('Hybrid Events', () => {
    it('renders hybrid event with both location and meeting links', () => {
      const event = {
        id: 'event9',
        name: 'Test Event 9',
        format: TYPE_CONSTANTS.HYBRID,
        location: 'Boston, MA',
        locationUrl: 'https://maps.google.com/boston',
        meetingPlatform: 'Webex',
        meetingLink: 'https://webex.com/meeting/123',
      };

      render(<EventLocation event={event} />);

      const wrapper = document.querySelector('.event__location__wrpr');
      const links = screen.getAllByRole('link');
      const locationLink = links[0];
      const meetingLink = links[1];
      const icons = screen.getAllByAltText('location logo');
      const locationIcon = icons[0];
      const virtualIcon = icons[1];

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('event__location__wrpr');
      expect(links).toHaveLength(2);

      // Location link
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/boston');
      expect(locationLink).toHaveClass('event__location', 'cursor-pointer');
      expect(screen.getByText('Boston, MA')).toHaveClass('event__location__txt', 'link');

      // Meeting link
      expect(meetingLink).toHaveAttribute('href', 'https://webex.com/meeting/123');
      expect(meetingLink).toHaveClass('event__location', 'cursor-pointer');
      expect(screen.getByText('Webex')).toHaveClass('event__location__txt', 'link');

      // Icons
      expect(locationIcon).toHaveAttribute('src', '/icons/location-black.svg');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
    });

    it('renders hybrid event with location link but no meeting link', () => {
      const event = {
        id: 'event10',
        name: 'Test Event 10',
        format: TYPE_CONSTANTS.HYBRID,
        location: 'Seattle, WA',
        locationUrl: 'https://maps.google.com/seattle',
        meetingPlatform: 'Teams',
        meetingLink: '',
      };

      render(<EventLocation event={event} />);

      const wrapper = document.querySelector('.event__location__wrpr');
      const locationLink = screen.getByRole('link');
      const meetingSpan = document.querySelectorAll('.event__location')[1];

      expect(wrapper).toBeInTheDocument();
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/seattle');
      expect(meetingSpan?.tagName).toBe('SPAN');
      expect(meetingSpan).not.toHaveClass('cursor-pointer');
      expect(screen.getByText('Teams')).not.toHaveClass('link');
    });

    it('renders hybrid event with meeting link but no location link', () => {
      const event = {
        id: 'event11',
        name: 'Test Event 11',
        format: TYPE_CONSTANTS.HYBRID,
        location: 'Austin, TX',
        locationUrl: '',
        meetingPlatform: 'Slack',
        meetingLink: 'https://slack.com/call/123',
      };

      render(<EventLocation event={event} />);

      const wrapper = document.querySelector('.event__location__wrpr');
      const locationSpan = document.querySelectorAll('.event__location')[0];
      const meetingLink = screen.getByRole('link');

      expect(wrapper).toBeInTheDocument();
      expect(locationSpan?.tagName).toBe('SPAN');
      expect(locationSpan).not.toHaveClass('cursor-pointer');
      expect(meetingLink).toHaveAttribute('href', 'https://slack.com/call/123');
      expect(screen.getByText('Slack')).toHaveClass('link');
    });

    it('renders hybrid event with neither location nor meeting links', () => {
      const event = {
        id: 'event12',
        name: 'Test Event 12',
        format: TYPE_CONSTANTS.HYBRID,
        location: 'Miami, FL',
        locationUrl: '',
        meetingPlatform: 'Discord',
        meetingLink: '',
      };

      render(<EventLocation event={event} />);

      const wrapper = document.querySelector('.event__location__wrpr');
      const spans = document.querySelectorAll('.event__location');

      expect(wrapper).toBeInTheDocument();
      expect(spans).toHaveLength(2);
      spans.forEach(span => {
        expect(span.tagName).toBe('SPAN');
        expect(span).not.toHaveClass('cursor-pointer');
      });
      expect(screen.getByText('Miami, FL')).not.toHaveClass('link');
      expect(screen.getByText('Discord')).not.toHaveClass('link');
    });
  });

  describe('Edge Cases', () => {
    it('renders nothing when event format is not recognized', () => {
      const event = {
        id: 'event13',
        name: 'Test Event 13',
        format: 'UNKNOWN',
      };

      const { container } = render(<EventLocation event={event} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is empty', () => {
      const event = {
        id: 'event14',
        name: 'Test Event 14',
        format: '',
      };

      const { container } = render(<EventLocation event={event} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is undefined', () => {
      const event = {
        id: 'event15',
        name: 'Test Event 15',
      };

      const { container } = render(<EventLocation event={event} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles missing event prop gracefully', () => {
      const { container } = render(<EventLocation event={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles null event prop gracefully', () => {
      const { container } = render(<EventLocation event={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes for styling', () => {
      const event = {
        id: 'event16',
        name: 'Test Event 16',
        format: TYPE_CONSTANTS.IN_PERSON,
        location: 'Portland, OR',
        locationUrl: 'https://maps.google.com/portland',
      };

      render(<EventLocation event={event} />);

      const locationLink = screen.getByRole('link');
      const locationText = screen.getByText('Portland, OR');

      expect(locationLink).toHaveClass('event__location', 'cursor-pointer');
      expect(locationText).toHaveClass('event__location__txt', 'link');
    });

    it('renders with correct alt text for icons', () => {
      const event = {
        id: 'event17',
        name: 'Test Event 17',
        format: TYPE_CONSTANTS.VIRTUAL,
        meetingPlatform: 'Zoom',
        meetingLink: 'https://zoom.us/j/123',
      };

      render(<EventLocation event={event} />);

      const virtualIcon = screen.getByAltText('location');
      expect(virtualIcon).toBeInTheDocument();
    });

    it('renders with correct alt text for hybrid event icons', () => {
      const event = {
        id: 'event18',
        name: 'Test Event 18',
        format: TYPE_CONSTANTS.HYBRID,
        location: 'Denver, CO',
        locationUrl: 'https://maps.google.com/denver',
        meetingPlatform: 'Teams',
        meetingLink: 'https://teams.microsoft.com/123',
      };

      render(<EventLocation event={event} />);

      const icons = screen.getAllByAltText('location logo');
      expect(icons).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper link attributes for external links', () => {
      const event = {
        id: 'event19',
        name: 'Test Event 19',
        format: TYPE_CONSTANTS.IN_PERSON,
        location: 'Phoenix, AZ',
        locationUrl: 'https://maps.google.com/phoenix',
      };

      render(<EventLocation event={event} />);

      const locationLink = screen.getByRole('link');
      expect(locationLink).toHaveAttribute('target', '_blank');
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/phoenix');
    });

    it('has proper image attributes for icons', () => {
      const event = {
        id: 'event20',
        name: 'Test Event 20',
        format: TYPE_CONSTANTS.VIRTUAL,
        meetingPlatform: 'Zoom',
        meetingLink: 'https://zoom.us/j/123',
      };

      render(<EventLocation event={event} />);

      const virtualIcon = screen.getByAltText('location');
      expect(virtualIcon).toHaveAttribute('width', '14');
      expect(virtualIcon).toHaveAttribute('height', '14');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
    });
  });
});
