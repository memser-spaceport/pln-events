import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FilterBox from '@/components/core/filter-box';
import { getFilterCount } from '@/utils/helper';
import { useSchedulePageAnalytics } from '@/analytics/schedule.analytics';
import { VIEW_TYPE } from '@/utils/constants';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/helper', () => ({
  getFilterCount: jest.fn(),
}));

jest.mock('@/analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: jest.fn(),
}));

jest.mock('@/components/page/filter/filter-item', () => {
  return function MockFilterItem(props: any) {
    return (
      <div data-testid={`filter-item-${props.identifierId}`}>
        <span>{props.name}</span>
      </div>
    );
  };
});

jest.mock('@/components/page/filter/filter-strip', () => {
  return function MockFilterStrip(props: any) {
    return (
      <div data-testid="filter-strip">
        <span>Filter Strip</span>
      </div>
    );
  };
});

describe('FilterBox Component - Basic Tests', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockAnalytics = {
    onFilterClearAllBtnClicked: jest.fn(),
    onFilterMenuClicked: jest.fn(),
  };

  const defaultProps = {
    rawFilters: {
      modes: ['Virtual', 'In-Person'],
      accessOption: ['Free', 'Paid'],
      location: ['San Francisco', 'New York'],
      allHost: ['Protocol Labs', 'IPFS'],
      tags: ['AI', 'Blockchain'],
    },
    searchParams: { test: 'value' },
    initialFilters: { test: 'initial' },
    filteredEvents: [
      { id: 1, name: 'Event 1' },
      { id: 2, name: 'Event 2' },
    ],
    type: 'test-type',
    from: 'test-page',
    viewType: VIEW_TYPE.list.name,
    selectedFilterValues: {
      isFeatured: false,
      modes: ['Virtual'],
      location: ['San Francisco'],
      allHost: ['Protocol Labs'],
      tags: ['AI'],
      accessOption: ['Free'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSchedulePageAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
    (getFilterCount as jest.Mock).mockReturnValue(3);
    
    // Mock window object
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/test-path',
      },
    });
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<FilterBox {...defaultProps} />);
    }).not.toThrow();
  });

  it('renders basic elements', () => {
    render(<FilterBox {...defaultProps} />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getAllByText('Clear All')[0]).toBeInTheDocument();
  });

  it('renders filter items', () => {
    render(<FilterBox {...defaultProps} />);
    
    expect(screen.getByTestId('filter-item-isFeatured')).toBeInTheDocument();
    expect(screen.getByTestId('filter-item-modes')).toBeInTheDocument();
    expect(screen.getByTestId('filter-item-accessType')).toBeInTheDocument();
    expect(screen.getByTestId('filter-item-locations')).toBeInTheDocument();
    expect(screen.getByTestId('filter-item-host')).toBeInTheDocument();
    expect(screen.getByTestId('filter-item-tags')).toBeInTheDocument();
  });

  it('displays event count', () => {
    render(<FilterBox {...defaultProps} />);
    
    expect(screen.getByText('View 2 event(s)')).toBeInTheDocument();
  });

  it('calls getFilterCount with selectedFilterValues', () => {
    render(<FilterBox {...defaultProps} />);
    
    expect(getFilterCount).toHaveBeenCalledWith(defaultProps.selectedFilterValues);
  });

  it('handles different view types', () => {
    const calendarProps = { ...defaultProps, viewType: VIEW_TYPE.calendar.name };
    
    expect(() => {
      render(<FilterBox {...calendarProps} />);
    }).not.toThrow();
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('handles empty filteredEvents', () => {
    const propsWithEmptyEvents = {
      ...defaultProps,
      filteredEvents: [],
    };
    
    render(<FilterBox {...propsWithEmptyEvents} />);
    
    expect(screen.getByText('View 0 event(s)')).toBeInTheDocument();
  });

  it('handles undefined props gracefully', () => {
    const minimalProps = {
      rawFilters: {},
      searchParams: {},
      initialFilters: {},
      filteredEvents: [],
      type: 'test',
      viewType: VIEW_TYPE.list.name,
      selectedFilterValues: {},
    };
    
    expect(() => {
      render(<FilterBox {...minimalProps} />);
    }).not.toThrow();
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
});
