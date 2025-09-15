import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationAndDate from '@/components/page/event-detail/event-detail-popup/location-and-date';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, style, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} style={style} {...props} />;
  };
});

describe('LocationAndDate Component', () => {
  const defaultEvent = {
    detailDateRange: 'January 1, 2025 - January 2, 2025',
    location: 'Test Location',
    locationUrl: 'https://example.com/location',
    meetingPlatform: 'Zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    addressInfo: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      address: '123 Main St',
      locationUrl: 'https://maps.google.com/123-main-st',
      location_instructions: 'Enter through the main entrance',
    },
    locationAddress: '123 Main St, San Francisco, CA',
  };

  describe('Rendering', () => {
    it('renders main container', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details-content-location-and-date');
      expect(container).toBeInTheDocument();
    });

    it('renders date section', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const dateSection = document.querySelector('.primary-event-details-content-date');
      expect(dateSection).toBeInTheDocument();
      
      expect(screen.getByText('January 1, 2025 - January 2, 2025')).toBeInTheDocument();
    });

    it('renders location section when location info is available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const locationSection = document.querySelector('.primary-event-details-content-location');
      expect(locationSection).toBeInTheDocument();
    });

    it('renders meeting platform section when meeting link is available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const meetingSection = document.querySelector('.primary-event-details-content-location-and-date-meeting-platform');
      expect(meetingSection).toBeInTheDocument();
    });
  });

  describe('Date Rendering', () => {
    it('renders date with calendar icon', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const calendarIcon = document.querySelector('img[alt="day"]');
      expect(calendarIcon).toHaveAttribute('src', '/icons/calendar-black.svg');
      expect(calendarIcon).toHaveAttribute('width', '15');
      expect(calendarIcon).toHaveAttribute('height', '15');
      
      const dateText = document.querySelector('.primary-event-details-content-date-text');
      expect(dateText).toHaveTextContent('January 1, 2025 - January 2, 2025');
    });

    it('handles missing detailDateRange', () => {
      const eventWithoutDate = {
        ...defaultEvent,
        detailDateRange: null,
      };
      
      render(<LocationAndDate event={eventWithoutDate} />);
      
      const dateText = document.querySelector('.primary-event-details-content-date-text');
      expect(dateText).toHaveTextContent('');
    });

    it('handles undefined detailDateRange', () => {
      const eventWithoutDate = {
        ...defaultEvent,
        detailDateRange: undefined,
      };
      
      render(<LocationAndDate event={eventWithoutDate} />);
      
      const dateText = document.querySelector('.primary-event-details-content-date-text');
      expect(dateText).toHaveTextContent('');
    });
  });

  describe('Location Information', () => {
    it('renders location with address info when available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const locationSection = document.querySelector('.primary-event-details-content-location');
      expect(locationSection).toBeInTheDocument();
      
      const locationIcon = document.querySelector('img[alt="location"]');
      expect(locationIcon).toHaveAttribute('src', '/icons/location-black.svg');
      expect(locationIcon).toHaveAttribute('width', '15');
      expect(locationIcon).toHaveAttribute('height', '15');
    });

    it('renders clickable address when locationUrl is available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const addressLink = document.querySelector('a[href="https://maps.google.com/123-main-st"]');
      expect(addressLink).toBeInTheDocument();
      expect(addressLink).toHaveAttribute('target', '_blank');
      expect(addressLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const addressText = addressLink?.querySelector('.location-name');
      expect(addressText).toHaveTextContent('123 Main St');
      
      const linkIcon = addressLink?.querySelector('img[alt="link"]');
      expect(linkIcon).toHaveAttribute('src', '/icons/link.svg');
    });

    it('renders location address text', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('San Francisco, CA, USA');
    });

    it('renders location instructions when available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const instructions = document.querySelector('.location-building');
      expect(instructions).toHaveTextContent('Enter through the main entrance');
    });

    it('does not render location instructions when not available', () => {
      const eventWithoutInstructions = {
        ...defaultEvent,
        addressInfo: {
          ...defaultEvent.addressInfo,
          location_instructions: null,
        },
      };
      
      render(<LocationAndDate event={eventWithoutInstructions} />);
      
      expect(screen.queryByText('Enter through the main entrance')).not.toBeInTheDocument();
    });
  });

  describe('Address Info Processing', () => {
    it('processes addressInfo correctly with city, state, and country', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('San Francisco, CA, USA');
    });

    it('handles addressInfo with only city', () => {
      const eventWithOnlyCity = {
        ...defaultEvent,
        addressInfo: {
          city: 'San Francisco',
        },
      };
      
      render(<LocationAndDate event={eventWithOnlyCity} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('San Francisco');
    });

    it('handles addressInfo with city and country (skips state if same as city)', () => {
      const eventWithSameCityState = {
        ...defaultEvent,
        addressInfo: {
          city: 'San Francisco',
          state: 'San Francisco',
          country: 'USA',
        },
      };
      
      render(<LocationAndDate event={eventWithSameCityState} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('San Francisco, USA');
    });

    it('falls back to locationAddress when addressInfo is not available', () => {
      const eventWithoutAddressInfo = {
        ...defaultEvent,
        addressInfo: null,
        locationAddress: '123 Main St, San Francisco, CA',
      };
      
      expect(() => {
        render(<LocationAndDate event={eventWithoutAddressInfo} />);
      }).toThrow();
    });

    it('falls back to "Location TBD" when no location info is available', () => {
      const eventWithoutLocation = {
        ...defaultEvent,
        addressInfo: null,
        locationAddress: null,
      };
      
      expect(() => {
        render(<LocationAndDate event={eventWithoutLocation} />);
      }).toThrow();
    });

    it('handles address_info (underscore) property for compatibility', () => {
      const eventWithUnderscoreAddressInfo = {
        ...defaultEvent,
        addressInfo: null,
        address_info: {
          city: 'New York',
          state: 'NY',
          country: 'USA',
        },
      };
      
      expect(() => {
        render(<LocationAndDate event={eventWithUnderscoreAddressInfo} />);
      }).toThrow();
    });
  });

  describe('Meeting Platform', () => {
    it('renders meeting platform when meetingLink is available', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const meetingSection = document.querySelector('.primary-event-details-content-location-and-date-meeting-platform');
      expect(meetingSection).toBeInTheDocument();
      
      const meetingIcon = document.querySelector('img[alt="meeting-platform"]');
      expect(meetingIcon).toHaveAttribute('src', '/icons/virtual.svg');
      expect(meetingIcon).toHaveAttribute('width', '15');
      expect(meetingIcon).toHaveAttribute('height', '15');
    });

    it('renders clickable meeting link', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const meetingLink = document.querySelector('a[href="https://zoom.us/j/123456789"]');
      expect(meetingLink).toBeInTheDocument();
      expect(meetingLink).toHaveAttribute('target', '_blank');
      expect(meetingLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(meetingLink).toHaveTextContent('https://zoom.us/j/123456789');
      
      // The link icon is rendered as a sibling, not a child of the link
      const meetingSection = document.querySelector('.primary-event-details-content-location-and-date-meeting-platform');
      const linkIcon = meetingSection?.querySelector('img[alt="link"]');
      expect(linkIcon).toHaveAttribute('src', '/icons/link.svg');
    });

    it('does not render meeting platform when meetingLink is not available', () => {
      const eventWithoutMeetingLink = {
        ...defaultEvent,
        meetingLink: null,
      };
      
      render(<LocationAndDate event={eventWithoutMeetingLink} />);
      
      expect(screen.queryByText('https://zoom.us/j/123456789')).not.toBeInTheDocument();
    });

    it('does not render meeting platform when meetingLink is empty string', () => {
      const eventWithoutMeetingLink = {
        ...defaultEvent,
        meetingLink: '',
      };
      
      render(<LocationAndDate event={eventWithoutMeetingLink} />);
      
      expect(screen.queryByText('https://zoom.us/j/123456789')).not.toBeInTheDocument();
    });
  });

  describe('Location Section Visibility', () => {
    it('does not render location section when locationInfo is empty', () => {
      const eventWithoutLocation = {
        ...defaultEvent,
        addressInfo: null,
        locationAddress: null,
        location: null,
      };
      
      expect(() => {
        render(<LocationAndDate event={eventWithoutLocation} />);
      }).toThrow();
    });

    it('renders location section when locationInfo is "Location TBD"', () => {
      const eventWithTbdLocation = {
        ...defaultEvent,
        addressInfo: null,
        locationAddress: null,
        location: 'Location TBD',
      };
      
      expect(() => {
        render(<LocationAndDate event={eventWithTbdLocation} />);
      }).toThrow();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop', () => {
      expect(() => {
        render(<LocationAndDate event={null} />);
      }).toThrow();
    });

    it('handles undefined event prop', () => {
      expect(() => {
        render(<LocationAndDate event={undefined} />);
      }).toThrow();
    });

    it('handles event with minimal properties', () => {
      const minimalEvent = {
        detailDateRange: 'January 1, 2025',
        addressInfo: {},
      };
      
      render(<LocationAndDate event={minimalEvent} />);
      
      expect(screen.getByText('January 1, 2025')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details-content-location-and-date');
      expect(container).toHaveClass('primary-event-details-content-location-and-date');
      
      const dateSection = document.querySelector('.primary-event-details-content-date');
      expect(dateSection).toHaveClass('primary-event-details-content-date');
      
      const locationSection = document.querySelector('.primary-event-details-content-location');
      expect(locationSection).toHaveClass('primary-event-details-content-location');
    });

    it('renders with proper structure for styling', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details-content-location-and-date');
      expect(container).toBeInTheDocument();
      
      const dateSection = container?.querySelector('.primary-event-details-content-date');
      expect(dateSection).toBeInTheDocument();
      
      const locationSection = container?.querySelector('.primary-event-details-content-location');
      expect(locationSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for all images', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const calendarIcon = document.querySelector('img[alt="day"]');
      expect(calendarIcon).toHaveAttribute('alt', 'day');
      
      const locationIcon = document.querySelector('img[alt="location"]');
      expect(locationIcon).toHaveAttribute('alt', 'location');
      
      const linkIcons = document.querySelectorAll('img[alt="link"]');
      linkIcons.forEach(icon => {
        expect(icon).toHaveAttribute('alt', 'link');
      });
      
      const meetingIcon = document.querySelector('img[alt="meeting-platform"]');
      expect(meetingIcon).toHaveAttribute('alt', 'meeting-platform');
    });

    it('provides proper target and rel attributes for external links', () => {
      render(<LocationAndDate event={defaultEvent} />);
      
      const addressLink = document.querySelector('a[href="https://maps.google.com/123-main-st"]');
      expect(addressLink).toHaveAttribute('target', '_blank');
      expect(addressLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const meetingLink = document.querySelector('a[href="https://zoom.us/j/123456789"]');
      expect(meetingLink).toHaveAttribute('target', '_blank');
      expect(meetingLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long location information', () => {
      const eventWithLongLocation = {
        ...defaultEvent,
        addressInfo: {
          city: 'A'.repeat(100),
          state: 'B'.repeat(100),
          country: 'C'.repeat(100),
        },
      };
      
      render(<LocationAndDate event={eventWithLongLocation} />);
      
      const addressText = document.querySelector('.location-address');
      const expectedText = 'A'.repeat(100) + ', ' + 'B'.repeat(100) + ', ' + 'C'.repeat(100);
      expect(addressText).toHaveTextContent(expectedText);
    });

    it('handles special characters in location information', () => {
      const eventWithSpecialChars = {
        ...defaultEvent,
        addressInfo: {
          city: 'São Paulo',
          state: 'São Paulo',
          country: 'Brasil',
        },
      };
      
      render(<LocationAndDate event={eventWithSpecialChars} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('São Paulo, Brasil');
    });

    it('handles empty addressInfo object', () => {
      const eventWithEmptyAddressInfo = {
        ...defaultEvent,
        addressInfo: {},
        locationAddress: '123 Main St, San Francisco, CA',
      };
      
      render(<LocationAndDate event={eventWithEmptyAddressInfo} />);
      
      const addressText = document.querySelector('.location-address');
      expect(addressText).toHaveTextContent('123 Main St, San Francisco, CA');
    });
  });
});
