import React from 'react';
import { render, screen } from '@testing-library/react';
import EventHosts from '../../../../components/page/event-detail/event-hosts';

// Mock HostLogo component
jest.mock('../../../../components/ui/host-logo', () => {
  return function MockHostLogo(props: any) {
    const { firstLetter, height, width, fontSize } = props;
    return (
      <div 
        data-testid="host-logo" 
        style={{ height, width, fontSize }}
        data-first-letter={firstLetter}
      >
        {firstLetter}
      </div>
    );
  };
});

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('EventHosts Component', () => {
  const mockEvent = {
    id: 'event1',
    name: 'Test Event',
    hostName: 'Main Host',
    hostLogo: 'https://example.com/host-logo.png',
    coHosts: [
      { name: 'Co-Host 1', logo: 'https://example.com/cohost1-logo.png' },
      { name: 'Co-Host 2', logo: 'https://example.com/cohost2-logo.png' }
    ]
  };

  const mockEventWithOnlyHost = {
    id: 'event2',
    name: 'Test Event 2',
    hostName: 'Only Host',
    hostLogo: 'https://example.com/only-host-logo.png',
    coHosts: []
  };

  const mockEventWithOnlyCoHosts = {
    id: 'event3',
    name: 'Test Event 3',
    coHosts: [
      { name: 'Co-Host A', logo: 'https://example.com/cohost-a-logo.png' },
      { name: 'Co-Host B', logo: 'https://example.com/cohost-b-logo.png' }
    ]
  };

  describe('Rendering', () => {
    it('renders with correct structure when hosts are present', () => {
      render(<EventHosts event={mockEvent} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      const eventHostsList = document.querySelector('.eventHosts__list');
      
      expect(eventHosts).toBeInTheDocument();
      expect(eventHostsList).toBeInTheDocument();
    });

    it('does not render when no hosts are present', () => {
      const eventWithoutHosts = {
        id: 'event4',
        name: 'Test Event 4',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithoutHosts} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<EventHosts event={mockEvent} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      const eventHostsList = document.querySelector('.eventHosts__list');
      
      expect(eventHosts).toHaveClass('eventHosts');
      expect(eventHostsList).toHaveClass('eventHosts__list');
    });
  });

  describe('Title Display', () => {
    it('renders title when showTitle is true', () => {
      render(<EventHosts event={mockEvent} showTitle={true} />);
      
      const title = document.querySelector('.eventHosts__title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Hosted By');
      expect(title).toHaveClass('eventHosts__title');
    });

    it('does not render title when showTitle is false', () => {
      render(<EventHosts event={mockEvent} showTitle={false} />);
      
      const title = document.querySelector('.eventHosts__title');
      expect(title).not.toBeInTheDocument();
    });

    it('does not render title when showTitle is undefined', () => {
      render(<EventHosts event={mockEvent} />);
      
      const title = document.querySelector('.eventHosts__title');
      expect(title).not.toBeInTheDocument();
    });
  });

  describe('Host Display', () => {
    it('renders main host with logo when both hostName and hostLogo are provided', () => {
      render(<EventHosts event={mockEventWithOnlyHost} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostImage = document.querySelector('.eventHosts__host img[alt="host logo"]');
      const hostName = document.querySelector('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(1);
      expect(hostImage).toHaveAttribute('src', 'https://example.com/only-host-logo.png');
      expect(hostImage).toHaveAttribute('width', '15');
      expect(hostImage).toHaveAttribute('height', '15');
      expect(hostImage).toHaveAttribute('alt', 'host logo');
      expect(hostName).toHaveTextContent('Only Host');
    });

    it('renders main host with HostLogo component when hostName is provided but hostLogo is not', () => {
      const eventWithHostNameOnly = {
        id: 'event5',
        name: 'Test Event 5',
        hostName: 'Host Without Logo',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithHostNameOnly} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      const hostName = document.querySelector('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(1);
      expect(hostLogo).toBeInTheDocument();
      expect(hostLogo).toHaveAttribute('data-first-letter', 'H');
      expect(hostLogo).toHaveAttribute('style', 'height: 15px; width: 15px; font-size: 12px;');
      expect(hostName).toHaveTextContent('Host Without Logo');
    });

    it('renders main host with HostLogo component when hostLogo is empty string', () => {
      const eventWithEmptyHostLogo = {
        id: 'event6',
        name: 'Test Event 6',
        hostName: 'Host With Empty Logo',
        hostLogo: '',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithEmptyHostLogo} />);
      
      const hostImage = document.querySelector('.eventHosts__host img[alt="host logo"]');
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      
      expect(hostImage).not.toBeInTheDocument();
      expect(hostLogo).toBeInTheDocument();
      expect(hostLogo).toHaveAttribute('data-first-letter', 'H');
    });

    it('does not render main host when hostName is not provided', () => {
      const eventWithoutHostName = {
        id: 'event7',
        name: 'Test Event 7',
        hostLogo: 'https://example.com/logo.png',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithoutHostName} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });
  });

  describe('Co-Hosts Display', () => {
    it('renders co-hosts when provided', () => {
      render(<EventHosts event={mockEventWithOnlyCoHosts} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostImages = document.querySelectorAll('.eventHosts__host img[alt="host logo"]');
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(2);
      expect(hostImages).toHaveLength(2);
      expect(hostNames).toHaveLength(2);
      
      expect(hostImages[0]).toHaveAttribute('src', 'https://example.com/cohost-a-logo.png');
      expect(hostImages[1]).toHaveAttribute('src', 'https://example.com/cohost-b-logo.png');
      expect(hostNames[0]).toHaveTextContent('Co-Host A');
      expect(hostNames[1]).toHaveTextContent('Co-Host B');
    });

    it('renders both main host and co-hosts', () => {
      render(<EventHosts event={mockEvent} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostImages = document.querySelectorAll('.eventHosts__host img[alt="host logo"]');
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(3); // Main host + 2 co-hosts
      expect(hostImages).toHaveLength(3);
      expect(hostNames).toHaveLength(3);
      
      // Main host should be first
      expect(hostImages[0]).toHaveAttribute('src', 'https://example.com/host-logo.png');
      expect(hostNames[0]).toHaveTextContent('Main Host');
      
      // Co-hosts should follow
      expect(hostImages[1]).toHaveAttribute('src', 'https://example.com/cohost1-logo.png');
      expect(hostNames[1]).toHaveTextContent('Co-Host 1');
      expect(hostImages[2]).toHaveAttribute('src', 'https://example.com/cohost2-logo.png');
      expect(hostNames[2]).toHaveTextContent('Co-Host 2');
    });

    it('handles co-hosts with missing names', () => {
      const eventWithIncompleteCoHosts = {
        id: 'event8',
        name: 'Test Event 8',
        coHosts: [
          { name: 'Valid Co-Host', logo: 'https://example.com/valid-logo.png' },
          { logo: 'https://example.com/no-name-logo.png' }, // Missing name
          { name: 'Another Valid Co-Host', logo: 'https://example.com/another-logo.png' }
        ]
      };
      
      render(<EventHosts event={eventWithIncompleteCoHosts} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(2); // Only hosts with names
      expect(hostNames).toHaveLength(2);
      expect(hostNames[0]).toHaveTextContent('Valid Co-Host');
      expect(hostNames[1]).toHaveTextContent('Another Valid Co-Host');
    });

    it('handles co-hosts with missing logos', () => {
      const eventWithCoHostsWithoutLogos = {
        id: 'event9',
        name: 'Test Event 9',
        coHosts: [
          { name: 'Co-Host Without Logo' },
          { name: 'Another Co-Host Without Logo' }
        ]
      };
      
      render(<EventHosts event={eventWithCoHostsWithoutLogos} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostLogos = document.querySelectorAll('[data-testid="host-logo"]');
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      
      expect(hostElements).toHaveLength(2);
      expect(hostLogos).toHaveLength(2);
      expect(hostNames).toHaveLength(2);
      
      expect(hostLogos[0]).toHaveAttribute('data-first-letter', 'C');
      expect(hostLogos[1]).toHaveAttribute('data-first-letter', 'A');
    });
  });

  describe('Host Logo Logic', () => {
    it('renders img when both logo and name are present', () => {
      const eventWithLogoAndName = {
        id: 'event10',
        name: 'Test Event 10',
        hostName: 'Host With Logo',
        hostLogo: 'https://example.com/logo.png',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithLogoAndName} />);
      
      const hostImage = document.querySelector('.eventHosts__host img[alt="host logo"]');
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      
      expect(hostImage).toBeInTheDocument();
      expect(hostLogo).not.toBeInTheDocument();
    });

    it('renders HostLogo component when name is present but logo is not', () => {
      const eventWithNameOnly = {
        id: 'event11',
        name: 'Test Event 11',
        hostName: 'Host Without Logo',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithNameOnly} />);
      
      const hostImage = document.querySelector('.eventHosts__host img[alt="host logo"]');
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      
      expect(hostImage).not.toBeInTheDocument();
      expect(hostLogo).toBeInTheDocument();
    });

    it('renders nothing when neither logo nor name is present', () => {
      const eventWithNeither = {
        id: 'event12',
        name: 'Test Event 12',
        coHosts: [{ logo: 'https://example.com/logo.png' }] // No name
      };
      
      render(<EventHosts event={eventWithNeither} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      expect(hostElements).toHaveLength(0);
    });
  });

  describe('Host Name Processing', () => {
    it('trims and capitalizes first letter for HostLogo component', () => {
      const eventWithSpacedName = {
        id: 'event13',
        name: 'Test Event 13',
        hostName: '  spaced host name  ',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithSpacedName} />);
      
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      expect(hostLogo).toHaveAttribute('data-first-letter', 'S');
    });

    it('handles single character host names', () => {
      const eventWithSingleChar = {
        id: 'event14',
        name: 'Test Event 14',
        hostName: 'A',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithSingleChar} />);
      
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      expect(hostLogo).toHaveAttribute('data-first-letter', 'A');
    });

    it('handles empty string host names', () => {
      const eventWithEmptyName = {
        id: 'event15',
        name: 'Test Event 15',
        hostName: '',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithEmptyName} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<EventHosts event={mockEvent} showTitle={true} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      const eventHostsTitle = document.querySelector('.eventHosts__title');
      const eventHostsList = document.querySelector('.eventHosts__list');
      const hostElements = document.querySelectorAll('.eventHosts__host');
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      
      expect(eventHosts).toHaveClass('eventHosts');
      expect(eventHostsTitle).toHaveClass('eventHosts__title');
      expect(eventHostsList).toHaveClass('eventHosts__list');
      
      hostElements.forEach(host => {
        expect(host).toHaveClass('eventHosts__host');
      });
      
      hostNames.forEach(name => {
        expect(name).toHaveClass('eventHosts__host__name');
      });
    });

    it('renders styled-jsx styles', () => {
      render(<EventHosts event={mockEvent} />);
      
      // Check if the component renders without errors
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<EventHosts event={mockEvent} showTitle={true} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      const eventHostsTitle = document.querySelector('.eventHosts__title');
      const eventHostsList = document.querySelector('.eventHosts__list');
      
      expect(eventHosts).toContainElement(eventHostsTitle as HTMLElement);
      expect(eventHosts).toContainElement(eventHostsList as HTMLElement);
    });

    it('renders host elements with proper structure', () => {
      render(<EventHosts event={mockEvent} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      
      hostElements.forEach(host => {
        const hostName = host.querySelector('.eventHosts__host__name');
        expect(hostName).toBeInTheDocument();
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop gracefully', () => {
      render(<EventHosts />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });

    it('handles null event prop gracefully', () => {
      render(<EventHosts event={null} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });

    it('handles undefined event prop gracefully', () => {
      render(<EventHosts event={undefined} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });

    it('handles event with missing properties', () => {
      const incompleteEvent = {
        id: 'event16',
      };
      
      render(<EventHosts event={incompleteEvent} />);
      
      const eventHosts = document.querySelector('.eventHosts');
      expect(eventHosts).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty coHosts array', () => {
      const eventWithEmptyCoHosts = {
        id: 'event17',
        name: 'Test Event 17',
        hostName: 'Main Host',
        hostLogo: 'https://example.com/logo.png',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithEmptyCoHosts} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      expect(hostElements).toHaveLength(1); // Only main host
    });

    it('handles null coHosts', () => {
      const eventWithNullCoHosts = {
        id: 'event18',
        name: 'Test Event 18',
        hostName: 'Main Host',
        hostLogo: 'https://example.com/logo.png',
        coHosts: null
      };
      
      render(<EventHosts event={eventWithNullCoHosts} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      expect(hostElements).toHaveLength(1); // Only main host
    });

    it('handles undefined coHosts', () => {
      const eventWithUndefinedCoHosts = {
        id: 'event19',
        name: 'Test Event 19',
        hostName: 'Main Host',
        hostLogo: 'https://example.com/logo.png'
      };
      
      render(<EventHosts event={eventWithUndefinedCoHosts} />);
      
      const hostElements = document.querySelectorAll('.eventHosts__host');
      expect(hostElements).toHaveLength(1); // Only main host
    });

    it('handles hosts with special characters in names', () => {
      const eventWithSpecialNames = {
        id: 'event20',
        name: 'Test Event 20',
        hostName: 'Host with Special Chars: !@#$%^&*()',
        coHosts: [
          { name: 'Co-Host with Émojis 🎉', logo: 'https://example.com/emoji-logo.png' }
        ]
      };
      
      render(<EventHosts event={eventWithSpecialNames} />);
      
      const hostNames = document.querySelectorAll('.eventHosts__host__name');
      expect(hostNames[0]).toHaveTextContent('Host with Special Chars: !@#$%^&*()');
      expect(hostNames[1]).toHaveTextContent('Co-Host with Émojis 🎉');
    });

    it('handles very long host names', () => {
      const eventWithLongName = {
        id: 'event21',
        name: 'Test Event 21',
        hostName: 'This is a very long host name that might cause layout issues in the UI',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithLongName} />);
      
      const hostName = document.querySelector('.eventHosts__host__name');
      expect(hostName).toHaveTextContent('This is a very long host name that might cause layout issues in the UI');
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for host logo images', () => {
      render(<EventHosts event={mockEvent} />);
      
      const hostImages = document.querySelectorAll('.eventHosts__host img[alt="host logo"]');
      
      hostImages.forEach(img => {
        expect(img).toHaveAttribute('alt', 'host logo');
      });
    });

    it('has proper dimensions for host logo images', () => {
      render(<EventHosts event={mockEvent} />);
      
      const hostImages = document.querySelectorAll('.eventHosts__host img[alt="host logo"]');
      
      hostImages.forEach(img => {
        expect(img).toHaveAttribute('width', '15');
        expect(img).toHaveAttribute('height', '15');
      });
    });

    it('has proper dimensions for HostLogo components', () => {
      const eventWithHostLogo = {
        id: 'event22',
        name: 'Test Event 22',
        hostName: 'Host Without Image',
        coHosts: []
      };
      
      render(<EventHosts event={eventWithHostLogo} />);
      
      const hostLogo = document.querySelector('[data-testid="host-logo"]');
      expect(hostLogo).toHaveAttribute('style', 'height: 15px; width: 15px; font-size: 12px;');
    });
  });
});
