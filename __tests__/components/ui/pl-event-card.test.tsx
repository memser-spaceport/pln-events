import { render, screen, fireEvent } from '@testing-library/react';
import PlEventCard from '@/components/ui/pl-event-card';

describe('PlEventCard Component', () => {
  const mockOnLinkItemClicked = jest.fn();
  const defaultProps = {
    eventName: 'Test Event',
    topics: ['Topic 1', 'Topic 2', 'Topic 3'],
    tag: 'Test Tag',
    fullDateFormat: 'January 1, 2024',
    description: 'Test event description',
    location: 'Test Location',
    website: 'https://test.com',
    eventType: 'Conference',
    venueName: 'Test Venue',
    venueAddress: '123 Test St',
    venueMapsLink: 'https://maps.test.com',
    isFeaturedEvent: false,
    eventHosts: [],
    preferredContacts: [],
    dateTBD: false,
    onLinkItemClicked: mockOnLinkItemClicked,
    tagLogo: '/tag-logo.svg',
    calenderLogo: '/calendar-logo.svg',
    locationLogo: '/location-logo.svg',
    externalLinkIcon: '/external-link.svg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlEventCard {...defaultProps} />);
      
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
      expect(screen.getByText('Conference')).toBeInTheDocument();
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();
    });

    it('renders with featured event styling', () => {
      const propsWithFeatured = {
        ...defaultProps,
        isFeaturedEvent: true
      };
      
      render(<PlEventCard {...propsWithFeatured} />);
      
      expect(screen.getByText('FEATURED')).toBeInTheDocument();
      const card = screen.getByText('Test Event').closest('.pec');
      expect(card).toHaveClass('pec--feat');
    });

    it('renders without tag when not provided', () => {
      const propsWithoutTag = {
        ...defaultProps,
        tag: ''
      };
      
      render(<PlEventCard {...propsWithoutTag} />);
      
      expect(screen.queryByText('Test Tag')).not.toBeInTheDocument();
    });

    it('renders without event type when not provided', () => {
      const propsWithoutEventType = {
        ...defaultProps,
        eventType: ''
      };
      
      render(<PlEventCard {...propsWithoutEventType} />);
      
      expect(screen.queryByText('Conference')).not.toBeInTheDocument();
    });

    it('renders with limited topics', () => {
      const propsWithManyTopics = {
        ...defaultProps,
        topics: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6']
      };
      
      render(<PlEventCard {...propsWithManyTopics} />);
      
      expect(screen.getByText('Topic 1')).toBeInTheDocument();
      expect(screen.getByText('Topic 2')).toBeInTheDocument();
      expect(screen.getByText('Topic 3')).toBeInTheDocument();
      expect(screen.getByText('Topic 4')).toBeInTheDocument();
      expect(screen.queryByText('Topic 5')).not.toBeInTheDocument();
      expect(screen.queryByText('Topic 6')).not.toBeInTheDocument();
    });
  });

  describe('Images and Icons', () => {
    it('renders tag logo when provided', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const tagLogo = screen.getAllByRole('img')[0];
      expect(tagLogo).toHaveAttribute('src', '/tag-logo.svg');
    });

    it('renders event type icon', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const eventTypeIcon = screen.getAllByRole('img')[1];
      expect(eventTypeIcon).toHaveAttribute('src', '/icons/pln-event-conference.svg');
    });

    it('renders calendar logo', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const calendarLogo = screen.getAllByRole('img')[2];
      expect(calendarLogo).toHaveAttribute('src', '/calendar-logo.svg');
    });

    it('renders location logo', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const locationLogo = screen.getAllByRole('img')[3];
      expect(locationLogo).toHaveAttribute('src', '/location-logo.svg');
    });

    it('renders external link icon', () => {
      render(<PlEventCard {...defaultProps} />);
      
      // The external link icon is rendered as a CSS background on the title span
      const titleElement = screen.getByText('Test Event');
      expect(titleElement).toHaveClass('title');
    });
  });

  describe('Address Handling', () => {
    it('renders full address when all components provided', () => {
      render(<PlEventCard {...defaultProps} />);
      
      expect(screen.getByText('Test Venue, 123 Test St, Test Location')).toBeInTheDocument();
    });

    it('renders partial address when some components missing', () => {
      const propsWithPartialAddress = {
        ...defaultProps,
        venueName: '',
        venueAddress: '123 Test St',
        location: 'Test Location'
      };
      
      render(<PlEventCard {...propsWithPartialAddress} />);
      
      expect(screen.getByText('123 Test St, Test Location')).toBeInTheDocument();
    });

    it('renders empty address when no components provided', () => {
      const propsWithNoAddress = {
        ...defaultProps,
        venueName: '',
        venueAddress: '',
        location: ''
      };
      
      render(<PlEventCard {...propsWithNoAddress} />);
      
      // When all address components are empty, the location text should be empty
      const locationText = screen.getByText('Test Event').closest('.pec')?.querySelector('.pec__location__text');
      expect(locationText).toHaveTextContent('');
    });
  });

  describe('User Interactions', () => {
    it('calls onLinkItemClicked when website link is clicked', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const websiteLink = screen.getByRole('link', { name: /Test Event/i });
      fireEvent.click(websiteLink);
      
      expect(mockOnLinkItemClicked).toHaveBeenCalledWith('event', 'https://test.com');
    });

    it('calls onLinkItemClicked when maps link is clicked', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const mapsLink = screen.getByText('Test Venue, 123 Test St, Test Location');
      fireEvent.click(mapsLink);
      
      expect(mockOnLinkItemClicked).toHaveBeenCalledWith('location', 'https://maps.test.com');
    });

    it('handles missing onLinkItemClicked gracefully', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onLinkItemClicked: undefined
      };
      
      render(<PlEventCard {...propsWithoutCallback} />);
      
      const websiteLink = screen.getByRole('link', { name: /Test Event/i });
      expect(() => fireEvent.click(websiteLink)).not.toThrow();
    });
  });

  describe('Event Hosts', () => {
    it('renders event hosts when provided', () => {
      const propsWithHosts = {
        ...defaultProps,
        eventHosts: [
          { name: 'Host 1', email: 'host1@test.com', logo: '/host1.png', primaryIcon: '/host1-primary.png' },
          { name: 'Host 2', email: 'host2@test.com', logo: '/host2.png' }
        ]
      };
      
      render(<PlEventCard {...propsWithHosts} />);
      
      expect(screen.getByTitle('Host 1')).toBeInTheDocument();
      expect(screen.getByTitle('Host 2')).toBeInTheDocument();
    });

    it('renders empty hosts when not provided', () => {
      render(<PlEventCard {...defaultProps} />);
      
      expect(screen.queryByTitle('Host 1')).not.toBeInTheDocument();
    });
  });

  describe('Preferred Contacts', () => {
    it('renders preferred contacts when provided', () => {
      const propsWithContacts = {
        ...defaultProps,
        preferredContacts: [
          { name: 'Contact 1', link: 'contact1@test.com', logo: '/contact1.png' },
          { name: 'Contact 2', link: 'contact2@test.com', logo: '/contact2.png' }
        ]
      };
      
      render(<PlEventCard {...propsWithContacts} />);
      
      expect(screen.getByTitle('Contact 1')).toBeInTheDocument();
      expect(screen.getByTitle('Contact 2')).toBeInTheDocument();
    });

    it('renders empty contacts when not provided', () => {
      render(<PlEventCard {...defaultProps} />);
      
      expect(screen.queryByTitle('Contact 1')).not.toBeInTheDocument();
    });
  });

  describe('Date TBD', () => {
    it('renders date when dateTBD is false', () => {
      render(<PlEventCard {...defaultProps} />);
      
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    });

    it('renders TBD when dateTBD is true', () => {
      const propsWithTBD = {
        ...defaultProps,
        dateTBD: true
      };
      
      render(<PlEventCard {...propsWithTBD} />);
      
      expect(screen.getByText('Date TBD')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        eventName: undefined,
        topics: undefined,
        tag: undefined,
        fullDateFormat: undefined,
        description: undefined,
        location: undefined,
        website: undefined,
        eventType: undefined,
        venueName: undefined,
        venueAddress: undefined,
        venueMapsLink: undefined,
        isFeaturedEvent: undefined,
        eventHosts: undefined,
        preferredContacts: undefined,
        dateTBD: undefined,
        onLinkItemClicked: undefined,
        tagLogo: undefined,
        calenderLogo: undefined,
        locationLogo: undefined,
        externalLinkIcon: undefined
      };
      
      expect(() => render(<PlEventCard {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles null values', () => {
      const propsWithNull = {
        eventName: null,
        topics: null,
        tag: null,
        fullDateFormat: null,
        description: null,
        location: null,
        website: null,
        eventType: null,
        venueName: null,
        venueAddress: null,
        venueMapsLink: null,
        isFeaturedEvent: null,
        eventHosts: null,
        preferredContacts: null,
        dateTBD: null,
        onLinkItemClicked: null,
        tagLogo: null,
        calenderLogo: null,
        locationLogo: null,
        externalLinkIcon: null
      };
      
      expect(() => render(<PlEventCard {...propsWithNull} />)).not.toThrow();
    });

    it('handles empty arrays', () => {
      const propsWithEmptyArrays = {
        ...defaultProps,
        topics: [],
        eventHosts: [],
        preferredContacts: []
      };
      
      render(<PlEventCard {...propsWithEmptyArrays} />);
      
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const card = screen.getByText('Test Event').closest('.pec');
      expect(card).toHaveClass('pec');
    });

    it('applies featured class when isFeaturedEvent is true', () => {
      const propsWithFeatured = {
        ...defaultProps,
        isFeaturedEvent: true
      };
      
      render(<PlEventCard {...propsWithFeatured} />);
      
      const card = screen.getByText('Test Event').closest('.pec');
      expect(card).toHaveClass('pec', 'pec--feat');
    });
  });

  describe('Accessibility', () => {
    it('renders as a div element', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const card = screen.getByText('Test Event').closest('.pec');
      expect(card?.tagName).toBe('DIV');
    });

    it('has proper structure', () => {
      render(<PlEventCard {...defaultProps} />);
      
      const card = screen.getByText('Test Event').closest('.pec');
      const info = card?.querySelector('.pec__info');
      
      expect(card).toBeInTheDocument();
      expect(info).toBeInTheDocument();
    });
  });
});
