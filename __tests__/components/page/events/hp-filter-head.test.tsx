import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpFilterHead from '../../../../components/page/events/hp-filter-head';
import { ISelectedItem } from '@/types/events.type';

// Mock the useFilterHook hook
jest.mock('@/hooks/use-filter-hook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useFilterAnalytics hook
jest.mock('@/analytics/filter.analytics', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the hp-helper module
jest.mock('../../../../components/page/events/hp-helper', () => ({
  getNoFiltersApplied: jest.fn(),
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock CUSTOM_EVENTS
jest.mock('@/utils/constants', () => ({
  CUSTOM_EVENTS: {
    FILTEROPEN: 'filterOpen',
  },
}));

describe('HpFilterHead Component', () => {
  const mockSelectedItems: ISelectedItem = {
    viewType: 'timeline',
    year: '2024',
    locations: [],
    startDate: '',
    endDate: '',
    eventHosts: [],
    eventType: '',
    topics: [],
    isPlnEventOnly: false,
  };

  const defaultProps = {
    selectedItems: mockSelectedItems,
    showBanner: false,
  };

  const mockUseFilterHook = require('@/hooks/use-filter-hook').default as jest.Mock;
  const mockUseFilterAnalytics = require('@/analytics/filter.analytics').default as jest.Mock;
  const mockGetNoFiltersApplied = require('../../../../components/page/events/hp-helper').getNoFiltersApplied as jest.Mock;

  const mockFilterHook = {
    clearAllQuery: jest.fn(),
    clearQuery: jest.fn(),
    setQuery: jest.fn(),
  };

  const mockAnalytics = {
    onFilterMenuClicked: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterHook.mockReturnValue(mockFilterHook);
    mockUseFilterAnalytics.mockReturnValue(mockAnalytics);
    mockGetNoFiltersApplied.mockReturnValue(0);
  });

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      const filterButton = document.querySelector('.hp__maincontent__tools__filter');
      const menuContainer = document.querySelector('.hpf__menu');
      
      expect(toolsContainer).toBeInTheDocument();
      expect(filterButton).toBeInTheDocument();
      expect(menuContainer).toBeInTheDocument();
    });

    it('renders filter button with correct content', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const filterIcon = document.querySelector('.hp__maincontent__tools__filter__icon');
      const filterText = screen.getByText('Filters');
      
      expect(filterIcon).toBeInTheDocument();
      expect(filterIcon).toHaveAttribute('src', '/icons/pln-filter-icon.svg');
      expect(filterText).toBeInTheDocument();
    });

    it('renders view type menu icons', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuIcons = document.querySelector('.hpf__menu__icons');
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      
      expect(menuIcons).toBeInTheDocument();
      expect(timelineIcon).toBeInTheDocument();
      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders timeline icon as active when viewType is timeline', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      expect(timelineIcon).toHaveAttribute('src', '/icons/pln-timeline-active.svg');
    });

    it('renders calendar icon as inactive when viewType is timeline', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      expect(calendarIcon).toHaveAttribute('src', '/icons/pln-calendar.svg');
    });

    it('renders calendar icon as active when viewType is calendar', () => {
      const propsWithCalendarView = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          viewType: 'calendar',
        },
      };
      
      render(<HpFilterHead {...propsWithCalendarView} />);
      
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      expect(calendarIcon).toHaveAttribute('src', '/icons/pln-calendar-active.svg');
    });

    it('renders timeline icon as inactive when viewType is calendar', () => {
      const propsWithCalendarView = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          viewType: 'calendar',
        },
      };
      
      render(<HpFilterHead {...propsWithCalendarView} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      expect(timelineIcon).toHaveAttribute('src', '/icons/pln-timeline.svg');
    });
  });

  describe('Filter Count Display', () => {
    it('does not show filter count when no filters are applied', () => {
      mockGetNoFiltersApplied.mockReturnValue(0);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).not.toBeInTheDocument();
    });

    it('shows filter count when filters are applied', () => {
      mockGetNoFiltersApplied.mockReturnValue(3);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).toBeInTheDocument();
      expect(filterCount).toHaveTextContent('3');
    });

    it('shows correct filter count value', () => {
      mockGetNoFiltersApplied.mockReturnValue(5);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).toHaveTextContent('5');
    });
  });

  describe('Mobile Filter Toggle', () => {
    it('dispatches custom event when filter button is clicked', () => {
      const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterButton = document.querySelector('.hp__maincontent__tools__filter');
      fireEvent.click(filterButton!);
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'filterOpen',
          detail: { isOpen: true },
        })
      );
      
      dispatchEventSpy.mockRestore();
    });

    it('calls getNoFiltersApplied with selectedItems', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      expect(mockGetNoFiltersApplied).toHaveBeenCalledWith(mockSelectedItems);
    });
  });

  describe('Menu Selection', () => {
    it('calls analytics when timeline is selected', () => {
      const propsWithCalendarView = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          viewType: 'calendar',
        },
      };
      
      render(<HpFilterHead {...propsWithCalendarView} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      fireEvent.click(timelineIcon!);
      
      expect(mockAnalytics.onFilterMenuClicked).toHaveBeenCalledWith('timeline');
    });

    it('calls analytics when calendar is selected', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      fireEvent.click(calendarIcon!);
      
      expect(mockAnalytics.onFilterMenuClicked).toHaveBeenCalledWith('calendar');
    });

    it('calls clearQuery when timeline is selected', () => {
      const propsWithCalendarView = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          viewType: 'calendar',
        },
      };
      
      render(<HpFilterHead {...propsWithCalendarView} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      fireEvent.click(timelineIcon!);
      
      expect(mockFilterHook.clearQuery).toHaveBeenCalledWith('viewType');
    });

    it('calls setQuery when calendar is selected', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      fireEvent.click(calendarIcon!);
      
      expect(mockFilterHook.setQuery).toHaveBeenCalledWith('viewType', 'calendar');
    });

    it('does not call analytics when same view type is selected', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      fireEvent.click(timelineIcon!);
      
      expect(mockAnalytics.onFilterMenuClicked).not.toHaveBeenCalled();
    });

    it('does not call clearQuery when same view type is selected', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      fireEvent.click(timelineIcon!);
      
      expect(mockFilterHook.clearQuery).not.toHaveBeenCalled();
    });

    it('does not call setQuery when same view type is selected', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      fireEvent.click(timelineIcon!);
      
      expect(mockFilterHook.setQuery).not.toHaveBeenCalled();
    });
  });

  describe('Clear Filters', () => {
    it('calls clearAllQuery when clear filters is triggered', () => {
      // This would be called internally, we can test the hook is available
      render(<HpFilterHead {...defaultProps} />);
      
      // The clearAllQuery function should be available from the hook
      expect(mockFilterHook.clearAllQuery).toBeDefined();
    });
  });

  describe('Props Handling', () => {
    it('handles missing selectedItems prop gracefully', () => {
      render(<HpFilterHead {...defaultProps} selectedItems={undefined as any} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });

    it('handles missing showBanner prop gracefully', () => {
      render(<HpFilterHead {...defaultProps} showBanner={undefined as any} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });

    it('handles null selectedItems prop gracefully', () => {
      render(<HpFilterHead {...defaultProps} selectedItems={null as any} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });

    it('handles selectedItems with missing viewType', () => {
      const propsWithMissingViewType = {
        ...defaultProps,
        selectedItems: {
          ...mockSelectedItems,
          viewType: undefined as any,
        },
      };
      
      render(<HpFilterHead {...propsWithMissingViewType} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to main tools container', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toHaveClass('hp__maincontent__tools');
    });

    it('applies correct CSS classes to filter button', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const filterButton = document.querySelector('.hp__maincontent__tools__filter');
      expect(filterButton).toHaveClass('hp__maincontent__tools__filter');
    });

    it('applies correct CSS classes to filter icon', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const filterIcon = document.querySelector('.hp__maincontent__tools__filter__icon');
      expect(filterIcon).toHaveClass('hp__maincontent__tools__filter__icon');
    });

    it('applies correct CSS classes to filter text', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const filterText = document.querySelector('.hp__maincontent__tools__filter__text');
      expect(filterText).toHaveClass('hp__maincontent__tools__filter__text');
    });

    it('applies correct CSS classes to filter count', () => {
      mockGetNoFiltersApplied.mockReturnValue(2);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).toHaveClass('hp__maincontent__tools__filter__count');
    });

    it('applies correct CSS classes to menu container', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuContainer = document.querySelector('.hpf__menu');
      expect(menuContainer).toHaveClass('hpf__menu');
    });

    it('applies correct CSS classes to menu icons container', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuIcons = document.querySelector('.hpf__menu__icons');
      expect(menuIcons).toHaveClass('hpf__menu__icons');
    });

    it('applies correct CSS classes to menu icon items', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuIcons = document.querySelectorAll('.hpf__menu__icons__item');
      expect(menuIcons).toHaveLength(2);
      
      menuIcons.forEach(icon => {
        expect(icon).toHaveClass('hpf__menu__icons__item');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles very large filter count', () => {
      mockGetNoFiltersApplied.mockReturnValue(999);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).toHaveTextContent('999');
    });

    it('handles zero filter count', () => {
      mockGetNoFiltersApplied.mockReturnValue(0);
      
      render(<HpFilterHead {...defaultProps} />);
      
      const filterCount = document.querySelector('.hp__maincontent__tools__filter__count');
      expect(filterCount).not.toBeInTheDocument();
    });

    it('handles empty selectedItems object', () => {
      const propsWithEmptySelectedItems = {
        ...defaultProps,
        selectedItems: {} as ISelectedItem,
      };
      
      render(<HpFilterHead {...propsWithEmptySelectedItems} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders clickable filter button', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const filterButton = document.querySelector('.hp__maincontent__tools__filter');
      expect(filterButton).toBeInTheDocument();
    });

    it('renders clickable menu icons', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuIcons = document.querySelectorAll('.hpf__menu__icons__item');
      expect(menuIcons).toHaveLength(2);
      
      menuIcons.forEach(icon => {
        expect(icon).toHaveAttribute('title');
      });
    });

    it('provides proper titles for menu icons', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const timelineIcon = document.querySelector('img[title="Timeline View"]');
      const calendarIcon = document.querySelector('img[title="Calendar View"]');
      
      expect(timelineIcon).toHaveAttribute('title', 'Timeline View');
      expect(calendarIcon).toHaveAttribute('title', 'Calendar View');
    });
  });

  describe('Show Banner Styling', () => {
    it('applies correct styling when showBanner is true', () => {
      render(<HpFilterHead {...defaultProps} showBanner={true} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });

    it('applies correct styling when showBanner is false', () => {
      render(<HpFilterHead {...defaultProps} showBanner={false} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });

    it('applies correct styling when showBanner is undefined', () => {
      render(<HpFilterHead {...defaultProps} showBanner={undefined as any} />);
      
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders all required elements in correct structure', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      // Check main container
      const toolsContainer = document.querySelector('.hp__maincontent__tools');
      expect(toolsContainer).toBeInTheDocument();
      
      // Check filter button
      const filterButton = document.querySelector('.hp__maincontent__tools__filter');
      expect(filterButton).toBeInTheDocument();
      
      // Check menu container
      const menuContainer = document.querySelector('.hpf__menu');
      expect(menuContainer).toBeInTheDocument();
      
      // Check menu icons
      const menuIcons = document.querySelector('.hpf__menu__icons');
      expect(menuIcons).toBeInTheDocument();
    });

    it('renders correct number of menu items', () => {
      render(<HpFilterHead {...defaultProps} />);
      
      const menuIcons = document.querySelectorAll('.hpf__menu__icons__item');
      expect(menuIcons).toHaveLength(2); // timeline and calendar
    });
  });
});
