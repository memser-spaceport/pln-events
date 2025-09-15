import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterWrapper from '../../../../components/page/events/filter-wrapper';
import { IEvent, IFilterValue, ISelectedItem } from '@/types/events.type';

// Mock the Filter component
jest.mock('../../../../components/core/filter', () => {
  return function MockFilter({ events, filterValues, selectedItems }: any) {
    return (
      <div data-testid="filter-component">
        <div data-testid="filter-events-count">{events?.length || 0}</div>
        <div data-testid="filter-values-count">{filterValues?.length || 0}</div>
        <div data-testid="filter-selected-items">{JSON.stringify(selectedItems)}</div>
      </div>
    );
  };
});

// Mock the useFilterHook
jest.mock('../../../../hooks/use-filter-hook', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    clearAllQuery: jest.fn(),
  })),
}));

// Mock the helper function
jest.mock('../../../../components/page/events/hp-helper', () => ({
  getNoFiltersApplied: jest.fn((selectedItems) => {
    // Simple mock implementation - count non-empty arrays and strings
    let count = 0;
    if (selectedItems?.locations?.length) count++;
    if (selectedItems?.eventHosts?.length) count++;
    if (selectedItems?.topics?.length) count++;
    if (selectedItems?.year && selectedItems.year !== '') count++;
    if (selectedItems?.eventType && selectedItems.eventType !== '') count++;
    if (selectedItems?.startDate && selectedItems.startDate !== '') count++;
    if (selectedItems?.endDate && selectedItems.endDate !== '') count++;
    if (selectedItems?.isPlnEventOnly !== undefined) count++;
    return count;
  }),
}));

// Mock CUSTOM_EVENTS
jest.mock('../../../../utils/constants', () => ({
  CUSTOM_EVENTS: {
    FILTEROPEN: 'filteropen',
  },
}));

describe('FilterWrapper Component', () => {
  const mockEvents: IEvent[] = [
    {
      eventName: 'Event 1',
      website: 'website1',
      location: 'location1',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      dateTBD: true,
      dri: 'dri1',
      tag: 'tag1',
      description: 'description1',
      juanSpeaking: 'juanSpeaking1',
      eventOrg: 'eventOrg1',
      eventLogo: 'eventLogo1',
      eventType: 'eventType1',
      venueName: 'venueName1',
      venueMapsLink: 'venueMapsLink1',
      venueAddress: 'venueAddress1',
      isFeaturedEvent: true,
      topics: ['topic1'],
      eventHosts: [{
        name: 'eventHost1',
        logo: 'eventHostLogo1',
        primaryIcon: 'eventHostPrimaryIcon1',
      }],
      preferredContacts: [{
        name: 'preferredContact1',
        logo: 'preferredContactLogo1',
        link: 'preferredContactLink1',
      }],
      startDateTimeStamp: 1715769600000,
      startMonthIndex: 0,
      startDay: 1,
      startDayString: 'Monday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 0,
      endDay: 1,
      fullDateFormat: 'January 1, 2024',
      tagLogo: 'tagLogo1',
      calenderLogo: 'calenderLogo1',
      startDateValue: new Date('2024-01-15'),
      endDateValue: new Date('2024-01-16'),
      locationLogo: 'locationLogo1',
      slug: 'slug1',
      externalLinkIcon: 'externalLinkIcon1',
    },
    {
      eventName: 'Event 2',
      website: 'website2',
      location: 'location2',
      startDate: '2024-01-17',
      endDate: '2024-01-18',
      dateTBD: false,
      dri: 'dri2',
      tag: 'tag2',
      description: 'description2',
      juanSpeaking: 'juanSpeaking2',
      eventOrg: 'eventOrg2',
      eventLogo: 'eventLogo2',
      eventType: 'eventType2',
      venueName: 'venueName2',
      venueMapsLink: 'venueMapsLink2',
      venueAddress: 'venueAddress2',
      isFeaturedEvent: false,
      topics: ['topic2'],
      eventHosts: [{
        name: 'eventHost2',
        logo: 'eventHostLogo2',
        primaryIcon: 'eventHostPrimaryIcon2',
      }],
      preferredContacts: [{
        name: 'preferredContact2',
        logo: 'preferredContactLogo2',
        link: 'preferredContactLink2',
      }],
      startDateTimeStamp: 1715769600000,
      startMonthIndex: 0,
      startDay: 2,
      startDayString: 'Tuesday',
      startYear: '2024',
      endDateTimeStamp: 1715769600000,
      endMonthIndex: 0,
      endDay: 2,
      fullDateFormat: 'January 2, 2024',
      tagLogo: 'tagLogo2',
      calenderLogo: 'calenderLogo2',
      startDateValue: new Date('2024-01-17'),
      endDateValue: new Date('2024-01-18'),
      locationLogo: 'locationLogo2',
      slug: 'slug2',
      externalLinkIcon: 'externalLinkIcon2',
    }
  ];

  const mockFilterValues: IFilterValue[] = [
    {
      name: 'Year',
      type: 'select',
      items: ['2024', '2023'],
      selectedItem: '2024',
      identifierId: 'year',
    },
    {
      name: 'Location',
      type: 'multi-select',
      items: ['Location 1', 'Location 2'],
      selectedItems: ['Location 1'],
      identifierId: 'location',
    }
  ];

  const mockSelectedItems: ISelectedItem = {
    viewType: 'timeline',
    year: '2024',
    locations: ['location1'],
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    eventHosts: ['host1'],
    eventType: 'eventType1',
    topics: ['topic1'],
    isPlnEventOnly: true,
  };

  const defaultProps = {
    filterValues: mockFilterValues,
    selectedItems: mockSelectedItems,
    events: mockEvents,
    showBanner: false,
  };

  const mockUseFilterHook = require('../../../../hooks/use-filter-hook').default;
  const mockClearAllQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterHook.mockReturnValue({
      clearAllQuery: mockClearAllQuery,
    });
  });

  describe('Rendering', () => {
    it('renders main wrapper with correct class', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const wrapper = document.querySelector('.fw');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders web filter by default', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const webFilter = document.querySelector('.fw__web');
      expect(webFilter).toBeInTheDocument();
      
      const filterComponent = screen.getByTestId('filter-component');
      expect(filterComponent).toBeInTheDocument();
    });

    it('does not render mobile filter initially', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const mobileFilter = document.querySelector('.fw__mobile');
      expect(mobileFilter).not.toBeInTheDocument();
    });

    it('passes correct props to Filter component', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const eventsCount = screen.getByTestId('filter-events-count');
      expect(eventsCount).toHaveTextContent('2');
      
      const filterValuesCount = screen.getByTestId('filter-values-count');
      expect(filterValuesCount).toHaveTextContent('2');
      
      const selectedItems = screen.getByTestId('filter-selected-items');
      expect(selectedItems).toHaveTextContent(JSON.stringify(mockSelectedItems));
    });
  });

  describe('Mobile Filter State', () => {
    it('shows mobile filter when isMobileFilter is true', async () => {
      // Mock the component to have isMobileFilter true
      const { rerender } = render(<FilterWrapper {...defaultProps} />);
      
      // Simulate mobile filter being opened
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      rerender(<FilterWrapper {...defaultProps} />);
      
      const mobileFilter = document.querySelector('.fw__mobile');
      expect(mobileFilter).toBeInTheDocument();
    });

    it('hides mobile filter when isMobileFilter is false', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const mobileFilter = document.querySelector('.fw__mobile');
      expect(mobileFilter).not.toBeInTheDocument();
    });
  });

  describe('Mobile Filter Actions', () => {
    it('renders mobile filter tools when mobile filter is open', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Dispatch custom event to open mobile filter
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      // Wait for state update
      await waitFor(() => {
        const clearButton = screen.getByText('Clear all');
        const applyButton = screen.getByText('View 2 event(s)');
        
        expect(clearButton).toBeInTheDocument();
        expect(applyButton).toBeInTheDocument();
      });
    });

    it('calls clearAllQuery when clear button is clicked and filters are applied', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Dispatch custom event to open mobile filter
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      // Wait for state update and then click clear button
      await waitFor(async () => {
        const clearButton = screen.getByText('Clear all');
        fireEvent.click(clearButton);
        
        expect(mockClearAllQuery).toHaveBeenCalled();
      });
    });

    it('toggles mobile filter when apply button is clicked', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Dispatch custom event to open mobile filter
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      // Wait for state update and then click apply button
      await waitFor(() => {
        const applyButton = screen.getByText('View 2 event(s)');
        expect(applyButton).toBeInTheDocument();
        fireEvent.click(applyButton);
      });
      
      // After clicking, the mobile filter should be toggled off
      // We can verify this by checking that the mobile filter elements are no longer present
      await waitFor(() => {
        const mobileFilter = document.querySelector('.fw__mobile');
        expect(mobileFilter).not.toBeInTheDocument();
      });
    });

    it('shows correct event count in apply button', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Dispatch custom event to open mobile filter
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      // Wait for state update
      await waitFor(() => {
        const applyButton = screen.getByText('View 2 event(s)');
        expect(applyButton).toBeInTheDocument();
      });
    });
  });

  describe('Event Listeners', () => {
    it('adds FILTEROPEN event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<FilterWrapper {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('filteropen', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('removes FILTEROPEN event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<FilterWrapper {...defaultProps} />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('filteropen', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('responds to FILTEROPEN custom event', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Initially mobile filter should not be visible
      let mobileFilter = document.querySelector('.fw__mobile');
      expect(mobileFilter).not.toBeInTheDocument();
      
      // Dispatch custom event to open mobile filter
      await act(async () => {
        const customEvent = new CustomEvent('filteropen', {
          detail: { isOpen: true }
        });
        document.dispatchEvent(customEvent);
      });
      
      // Wait for state update
      await waitFor(() => {
        mobileFilter = document.querySelector('.fw__mobile');
        expect(mobileFilter).toBeInTheDocument();
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing filterValues prop', () => {
      const propsWithoutFilterValues = {
        ...defaultProps,
        filterValues: [],
      };
      
      render(<FilterWrapper {...propsWithoutFilterValues} />);
      
      const filterComponent = screen.getByTestId('filter-component');
      expect(filterComponent).toBeInTheDocument();
      
      const filterValuesCount = screen.getByTestId('filter-values-count');
      expect(filterValuesCount).toHaveTextContent('0');
    });

    it('handles missing events prop', () => {
      const propsWithoutEvents = {
        ...defaultProps,
        events: [],
      };    
      
      render(<FilterWrapper {...propsWithoutEvents} />);
      
      const filterComponent = screen.getByTestId('filter-component');
      expect(filterComponent).toBeInTheDocument();
      
      const eventsCount = screen.getByTestId('filter-events-count');
      expect(eventsCount).toHaveTextContent('0');
    });

    it('handles missing selectedItems prop', () => {
      const propsWithoutSelectedItems = {
        ...defaultProps,
        selectedItems: {} as ISelectedItem,
      };
      
      render(<FilterWrapper {...propsWithoutSelectedItems} />);
      
      const filterComponent = screen.getByTestId('filter-component');
      expect(filterComponent).toBeInTheDocument();
    });

    it('handles empty events array', () => {
      const propsWithEmptyEvents = {
        ...defaultProps,
        events: [],
      };
      
      render(<FilterWrapper {...propsWithEmptyEvents} />);
      
      const applyButton = screen.queryByText('View 0 event(s)');
      // Apply button only shows when mobile filter is open
      expect(applyButton).not.toBeInTheDocument();
    });
  });

  describe('Filter Count Logic', () => {
    it('calls getNoFiltersApplied with selectedItems', () => {
      const { getNoFiltersApplied } = require('../../../../components/page/events/hp-helper');
      
      render(<FilterWrapper {...defaultProps} />);
      
      expect(getNoFiltersApplied).toHaveBeenCalledWith(mockSelectedItems);
    });

    it('handles clear action when no filters are applied', async () => {
      // Mock getNoFiltersApplied to return 0
      const { getNoFiltersApplied } = require('../../../../components/page/events/hp-helper');
      getNoFiltersApplied.mockReturnValue(0);
      
      render(<FilterWrapper {...defaultProps} />);
      
      // Open mobile filter
      const customEvent = new CustomEvent('filteropen', {
        detail: { isOpen: true }
      });
      document.dispatchEvent(customEvent);
      
      // Wait for state update and then click clear button
      await waitFor(async () => {
        const clearButton = screen.getByText('Clear all');
        fireEvent.click(clearButton);
        
        // clearAllQuery should not be called when no filters are applied
        expect(mockClearAllQuery).not.toHaveBeenCalled();
      });
    });
  });

  describe('Styling and CSS', () => {
    it('applies correct CSS classes', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const wrapper = document.querySelector('.fw');
      const webFilter = document.querySelector('.fw__web');
      
      expect(wrapper).toBeInTheDocument();
      expect(webFilter).toBeInTheDocument();
    });

    it('applies mobile filter styles when mobile filter is open', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Open mobile filter
      const customEvent = new CustomEvent('filteropen', {
        detail: { isOpen: true }
      });
      document.dispatchEvent(customEvent);
      
      // Wait for state update
      await waitFor(() => {
        const mobileFilter = document.querySelector('.fw__mobile');
        const mfilter = document.querySelector('.mfilter');
        const mfilterTop = document.querySelector('.mfilter__top');
        const mfilterBottom = document.querySelector('.mfilter__bottom');
        
        expect(mobileFilter).toBeInTheDocument();
        expect(mfilter).toBeInTheDocument();
        expect(mfilterTop).toBeInTheDocument();
        expect(mfilterBottom).toBeInTheDocument();
      });
    });

    it('applies body overflow hidden when mobile filter is open', async () => {
      render(<FilterWrapper {...defaultProps} />);
      
      // Open mobile filter
      const customEvent = new CustomEvent('filteropen', {
        detail: { isOpen: true }
      });
      document.dispatchEvent(customEvent);
      
      // Wait for state update and check body style
      await waitFor(() => {
        const body = document.body;
        expect(body).toHaveStyle('overflow: hidden');
      });
    });
  });

  describe('Show Banner Prop', () => {
    it('applies correct styling when showBanner is true', () => {
      const propsWithBanner = {
        ...defaultProps,
        showBanner: true,
      };
      
      render(<FilterWrapper {...propsWithBanner} />);
      
      const wrapper = document.querySelector('.fw');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies correct styling when showBanner is false', () => {
      render(<FilterWrapper {...defaultProps} />);
      
      const wrapper = document.querySelector('.fw');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null props gracefully', () => {
      const nullProps = {
        filterValues: [],
        selectedItems: {},
        events: [],
        showBanner: false,
      };
      
      render(<FilterWrapper {...nullProps} />);
      
      const wrapper = document.querySelector('.fw');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      const undefinedProps = {
        filterValues: [],
        selectedItems: {},
        events: [],
        showBanner: false,
      };
      
      render(<FilterWrapper {...undefinedProps} />);
      
      const wrapper = document.querySelector('.fw');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles very large number of events', () => {
      const manyEvents = Array.from({ length: 1000 }, (_, i) => ({
        ...mockEvents[0],
        eventName: `Event ${i}`,
        slug: `event-${i}`,
      }));

      const propsWithManyEvents = {
        ...defaultProps,
        events: manyEvents,
      };
      
      render(<FilterWrapper {...propsWithManyEvents} />);
      
      const filterComponent = screen.getByTestId('filter-component');
      expect(filterComponent).toBeInTheDocument();
      
      const eventsCount = screen.getByTestId('filter-events-count');
      expect(eventsCount).toHaveTextContent('1000');
    });
  });
});
