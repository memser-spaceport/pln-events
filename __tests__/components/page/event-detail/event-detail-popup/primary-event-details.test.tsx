import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryEventDetails from '@/components/page/event-detail/event-detail-popup/primary-event-details';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, style, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} style={style} {...props} />;
  };
});

// Mock the child components
jest.mock('@/components/page/event-detail/tags', () => {
  return function MockTags({ tags, noOftagsToShow }: { tags: any[]; noOftagsToShow: number }) {
    return <div data-testid="tags">Tags Component - {tags.length} tags</div>;
  };
});

jest.mock('@/components/page/event-detail/agenda', () => {
  return function MockAgenda({ event, eventTimezone }: { event: any; eventTimezone: string }) {
    return <div data-testid="agenda">Agenda Component - {eventTimezone}</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/event-type', () => {
  return function MockEventType({ event }: { event: any }) {
    return <div data-testid="event-type">Event Type Component</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/event-access-option', () => {
  return function MockEventAccessOption({ event }: { event: any }) {
    return <div data-testid="event-access-option">Event Access Option Component</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/location-and-date', () => {
  return function MockLocationAndDate({ event }: { event: any }) {
    return <div data-testid="location-and-date">Location And Date Component</div>;
  };
});

describe('PrimaryEventDetails Component', () => {
  const defaultEvent = {
    name: 'Test Event',
    eventLogo: '/test-event-logo.svg',
    hostLogo: '/test-host-logo.svg',
    hostName: 'Test Host',
    coHosts: [{ name: 'Test Co-Host' }],
    description: '<p>Test event description</p>',
    sessions: [
      { name: 'Session 1', startDate: '2025-01-01T10:00:00Z' },
      { name: 'Session 2', startDate: '2025-01-01T11:00:00Z' },
    ],
    timezone: 'UTC',
    tags: ['blockchain', 'web3', 'defi'],
  };

  describe('Rendering', () => {
    it('renders main container', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
    });

    it('renders desktop layout', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const desktopLayout = document.querySelector('.primary-event-details-desktop');
      expect(desktopLayout).toBeInTheDocument();
      
      const mobileLayout = document.querySelector('.primary-event-details-mobile');
      expect(mobileLayout).toBeInTheDocument();
    });

    it('renders event image with correct attributes', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const desktopImage = document.querySelector('.primary-event-details-image img');
      expect(desktopImage).toHaveAttribute('src', '/test-event-logo.svg');
      expect(desktopImage).toHaveAttribute('alt', 'Primary Event Details Image');
      expect(desktopImage).toHaveAttribute('width', '180');
      expect(desktopImage).toHaveAttribute('height', '180');
    });

    it('renders mobile event image with correct attributes', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const mobileImage = document.querySelector('.primary-event-details-mobile__title img');
      expect(mobileImage).toHaveAttribute('src', '/test-event-logo.svg');
      expect(mobileImage).toHaveAttribute('alt', 'Primary Event Details Image');
      expect(mobileImage).toHaveAttribute('width', '58');
      expect(mobileImage).toHaveAttribute('height', '58');
    });

    it('renders event name', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getAllByText('Test Event')[0]).toBeInTheDocument();
    });

    it('renders LocationAndDate component', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getAllByTestId('location-and-date')[0]).toBeInTheDocument();
    });
  });

  describe('Event Logo Handling', () => {
    it('uses eventLogo when available', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const images = document.querySelectorAll('img[alt="Primary Event Details Image"]');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '/test-event-logo.svg');
      });
    });

    it('falls back to hostLogo when eventLogo is not available', () => {
      const eventWithoutEventLogo = {
        ...defaultEvent,
        eventLogo: null,
      };
      
      render(<PrimaryEventDetails event={eventWithoutEventLogo} />);
      
      const images = document.querySelectorAll('img[alt="Primary Event Details Image"]');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '/test-host-logo.svg');
      });
    });

    it('falls back to default logo when both eventLogo and hostLogo are not available', () => {
      const eventWithoutLogos = {
        ...defaultEvent,
        eventLogo: null,
        hostLogo: null,
      };
      
      render(<PrimaryEventDetails event={eventWithoutLogos} />);
      
      const images = document.querySelectorAll('img[alt="Primary Event Details Image"]');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '/icons/default-event-logo.svg');
      });
    });

    it('handles empty string eventLogo', () => {
      const eventWithEmptyEventLogo = {
        ...defaultEvent,
        eventLogo: '',
      };
      
      render(<PrimaryEventDetails event={eventWithEmptyEventLogo} />);
      
      const images = document.querySelectorAll('img[alt="Primary Event Details Image"]');
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '/test-host-logo.svg');
      });
    });
  });

  describe('Tags Rendering', () => {
    it('renders Tags component when tags are available', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByTestId('tags')).toBeInTheDocument();
      expect(screen.getByText('Tags Component - 3 tags')).toBeInTheDocument();
    });

    it('does not render Tags component when tags array is empty', () => {
      const eventWithoutTags = {
        ...defaultEvent,
        tags: [],
      };
      
      render(<PrimaryEventDetails event={eventWithoutTags} />);
      
      expect(screen.queryByTestId('tags')).not.toBeInTheDocument();
    });

    it('does not render Tags component when tags are undefined', () => {
      const eventWithoutTags = {
        ...defaultEvent,
        tags: undefined,
      };
      
      render(<PrimaryEventDetails event={eventWithoutTags} />);
      
      expect(screen.queryByTestId('tags')).not.toBeInTheDocument();
    });

    it('passes correct props to Tags component', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByTestId('tags')).toBeInTheDocument();
      // Tags component should receive all tags and noOftagsToShow equal to tags length
    });
  });

  describe('Host Information', () => {
    it('renders host information', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByText('Host')).toBeInTheDocument();
      expect(screen.getByText('Test Host')).toBeInTheDocument();
    });

    it('renders default host name when hostName is not available', () => {
      const eventWithoutHostName = {
        ...defaultEvent,
        hostName: null,
      };
      
      render(<PrimaryEventDetails event={eventWithoutHostName} />);
      
      expect(screen.getByText('Host Name')).toBeInTheDocument();
    });

    it('renders co-host information when available', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByText('Co-Host')).toBeInTheDocument();
      expect(screen.getByText('Test Co-Host')).toBeInTheDocument();
    });

    it('does not render co-host section when coHosts is empty', () => {
      const eventWithoutCoHosts = {
        ...defaultEvent,
        coHosts: [],
      };
      
      render(<PrimaryEventDetails event={eventWithoutCoHosts} />);
      
      expect(screen.queryByText('Co-Host')).not.toBeInTheDocument();
    });

    it('does not render co-host section when coHosts is undefined', () => {
      const eventWithoutCoHosts = {
        ...defaultEvent,
        coHosts: undefined,
      };
      
      render(<PrimaryEventDetails event={eventWithoutCoHosts} />);
      
      expect(screen.queryByText('Co-Host')).not.toBeInTheDocument();
    });

    it('renders default co-host name when co-host name is not available', () => {
      const eventWithEmptyCoHost = {
        ...defaultEvent,
        coHosts: [{}],
      };
      
      render(<PrimaryEventDetails event={eventWithEmptyCoHost} />);
      
      expect(screen.getByText('Co-Host Name')).toBeInTheDocument();
    });
  });

  describe('Description Rendering', () => {
    it('renders description when available', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();
    });

    it('does not render description section when description is not available', () => {
      const eventWithoutDescription = {
        ...defaultEvent,
        description: null,
      };
      
      render(<PrimaryEventDetails event={eventWithoutDescription} />);
      
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('does not render description section when description is empty string', () => {
      const eventWithoutDescription = {
        ...defaultEvent,
        description: '',
      };
      
      render(<PrimaryEventDetails event={eventWithoutDescription} />);
      
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('renders HTML content in description', () => {
      const eventWithHtmlDescription = {
        ...defaultEvent,
        description: '<p>HTML <strong>description</strong></p>',
      };
      
      render(<PrimaryEventDetails event={eventWithHtmlDescription} />);
      
      const descriptionElement = document.querySelector('.primary-event-details-content-description-text');
      expect(descriptionElement).toHaveProperty('innerHTML', '<p>HTML <strong>description</strong></p>');
    });
  });

  describe('Sessions/Agenda Rendering', () => {
    it('renders agenda section when sessions are available', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByText('Agenda')).toBeInTheDocument();
      expect(screen.getByTestId('agenda')).toBeInTheDocument();
    });

    it('does not render agenda section when sessions array is empty', () => {
      const eventWithoutSessions = {
        ...defaultEvent,
        sessions: [],
      };
      
      render(<PrimaryEventDetails event={eventWithoutSessions} />);
      
      expect(screen.queryByText('Agenda')).not.toBeInTheDocument();
      expect(screen.queryByTestId('agenda')).not.toBeInTheDocument();
    });

    it('does not render agenda section when sessions are undefined', () => {
      const eventWithoutSessions = {
        ...defaultEvent,
        sessions: undefined,
      };
      
      render(<PrimaryEventDetails event={eventWithoutSessions} />);
      
      expect(screen.queryByText('Agenda')).not.toBeInTheDocument();
      expect(screen.queryByTestId('agenda')).not.toBeInTheDocument();
    });

    it('passes correct props to Agenda component', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      expect(screen.getByTestId('agenda')).toBeInTheDocument();
      expect(screen.getByText('Agenda Component - UTC')).toBeInTheDocument();
    });
  });

  describe('Mobile Layout', () => {
    it('renders mobile type and access components', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const mobileTypeAndAccess = document.querySelector('.primary-event-details-mobile__type-and-access');
      expect(mobileTypeAndAccess).toBeInTheDocument();
      
      expect(screen.getByTestId('event-type')).toBeInTheDocument();
      expect(screen.getByTestId('event-access-option')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop', () => {
      render(<PrimaryEventDetails event={null} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
    });

    it('handles undefined event prop', () => {
      render(<PrimaryEventDetails event={undefined} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
    });

    it('handles event with minimal properties', () => {
      const minimalEvent = {
        name: 'Minimal Event',
      };
      
      render(<PrimaryEventDetails event={minimalEvent} />);
      
      expect(screen.getAllByText('Minimal Event')[0]).toBeInTheDocument();
      expect(screen.getByText('Host Name')).toBeInTheDocument(); // Default host name
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toHaveClass('primary-event-details');
      
      const desktopLayout = document.querySelector('.primary-event-details-desktop');
      expect(desktopLayout).toHaveClass('primary-event-details-desktop');
      
      const mobileLayout = document.querySelector('.primary-event-details-mobile');
      expect(mobileLayout).toHaveClass('primary-event-details-mobile');
    });

    it('renders with proper structure for styling', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
      
      const desktopLayout = container?.querySelector('.primary-event-details-desktop');
      expect(desktopLayout).toBeInTheDocument();
      
      const mobileLayout = container?.querySelector('.primary-event-details-mobile');
      expect(mobileLayout).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<PrimaryEventDetails event={defaultEvent} />);
      
      const images = document.querySelectorAll('img[alt="Primary Event Details Image"]');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt', 'Primary Event Details Image');
      });
      
      const hostIcon = document.querySelector('img[alt="host-icon"]');
      expect(hostIcon).toHaveAttribute('alt', 'host-icon');
      
      const descIcon = document.querySelector('img[alt="description"]');
      expect(descIcon).toHaveAttribute('alt', 'description');
      
      const agendaIcon = document.querySelector('img[alt="schedule"]');
      expect(agendaIcon).toHaveAttribute('alt', 'schedule');
    });
  });

  describe('Edge Cases', () => {
    it('handles event with all properties undefined', () => {
      const emptyEvent = {};
      
      render(<PrimaryEventDetails event={emptyEvent} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
    });

    it('handles event with null values', () => {
      const eventWithNulls = {
        name: null,
        eventLogo: null,
        hostLogo: null,
        hostName: null,
        coHosts: null,
        description: null,
        sessions: null,
        tags: null,
      };
      
      render(<PrimaryEventDetails event={eventWithNulls} />);
      
      const container = document.querySelector('.primary-event-details');
      expect(container).toBeInTheDocument();
    });

    it('handles very long event name', () => {
      const eventWithLongName = {
        ...defaultEvent,
        name: 'A'.repeat(1000),
      };
      
      render(<PrimaryEventDetails event={eventWithLongName} />);
      
      expect(screen.getAllByText('A'.repeat(1000))[0]).toBeInTheDocument();
    });
  });
});
