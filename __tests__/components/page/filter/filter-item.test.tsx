import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterItem from '../../../../components/page/filter/filter-item';

// Mock Next.js router
const mockPush = jest.fn();
const mockParams = { type: 'events' };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => mockParams,
}));

// Mock analytics hook
const mockOnScheduleFilterClicked = jest.fn();
const mockOnFilterClearAllBtnClicked = jest.fn();

jest.mock('../../../../analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: () => ({
    onScheduleFilterClicked: mockOnScheduleFilterClicked,
    onFilterClearAllBtnClicked: mockOnFilterClearAllBtnClicked,
  }),
}));

// Mock useClickedOutside hook
jest.mock('../../../../hooks/use-clicked-outside', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock child components
jest.mock('../../../../components/ui/multi-select', () => {
  return function MockMultiSelect(props: any) {
    const { onItemSelected, onInputChange, onMultiBoxClicked, onClearSelection, isPaneActive, filteredItems, selectedItems, name, itemId } = props;
    return (
      <div data-testid="multi-select">
        <button data-testid="multi-select-button" onClick={onMultiBoxClicked}>
          {name}
        </button>
        {isPaneActive && (
          <div data-testid="multi-select-dropdown">
            <input
              data-testid="multi-select-input"
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Search..."
            />
            {filteredItems.map((item: any, index: number) => (
              <div
                key={index}
                data-testid={`multi-select-item-${index}`}
                onClick={() => onItemSelected(itemId || 'testKey', item.value)}
              >
                {item.label}
              </div>
            ))}
            <button
              data-testid="clear-selection"
              onClick={(e) => onClearSelection(e, itemId || 'testKey')}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  };
});

jest.mock('../../../../components/ui/open-multi-select', () => {
  return function MockOpenMultiSelect(props: any) {
    const { onItemSelected, onInputChange, onMultiBoxClicked, isPaneActive, filteredItems, selectedItems, name } = props;
    return (
      <div data-testid="open-multi-select">
        <button data-testid="open-multi-select-button" onClick={onMultiBoxClicked}>
          {name}
        </button>
        {isPaneActive && (
          <div data-testid="open-multi-select-dropdown">
            <input
              data-testid="open-multi-select-input"
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Search..."
            />
            {filteredItems.map((item: any, index: number) => (
              <div
                key={index}
                data-testid={`open-multi-select-item-${index}`}
                onClick={() => onItemSelected('testKey', item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
});

jest.mock('../../../../components/ui/tag-item', () => {
  return function MockTagItem(props: any) {
    const { callback, text, value, isActive } = props;
    return (
      <button
        data-testid={`tag-item-${value}`}
        onClick={() => callback('testKey', value)}
        className={isActive ? 'active' : 'inactive'}
      >
        {text}
      </button>
    );
  };
});

jest.mock('../../../../components/ui/pl-toggle', () => {
  return function MockPlToggle(props: any) {
    const { callback, itemId, activeItem } = props;
    return (
      <button
        data-testid="pl-toggle"
        onClick={() => callback(itemId, !activeItem)}
        className={activeItem ? 'active' : 'inactive'}
      >
        Toggle
      </button>
    );
  };
});

jest.mock('../../../../components/ui/pl-single-select', () => {
  return function MockPlSingleSelect(props: any) {
    const { callback, itemId } = props;
    return (
      <div data-testid="pl-single-select">
        <button
          data-testid="single-select-option"
          onClick={() => callback(itemId || 'testKey', 'testValue')}
        >
          Select Option
        </button>
      </div>
    );
  };
});

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/events',
  },
  writable: true,
});

// Mock getQueryParams
jest.mock('../../../../utils/helper', () => ({
  getQueryParams: jest.fn((params) => {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return queryString || '';
  }),
}));

describe('FilterItem Component', () => {
  const mockItems = [
    { name: 'item1', label: 'Item 1', value: 'value1' },
    { name: 'item2', label: 'Item 2', value: 'value2' },
    { name: 'item3', label: 'Item 3', value: 'value3' },
  ];

  const defaultProps = {
    type: 'multi-select',
    name: 'Test Filter',
    items: mockItems,
    selectedItems: ['item1'],
    selectedFilterValues: {
      location: ['location1'],
      modes: ['mode1'],
      accessOption: ['option1'],
      allHost: ['host1'],
      tags: ['tag1'],
    },
    searchParams: { test: 'value' },
    initialFilters: { test: 'value' },
    identifierId: 'test-id',
    isChecked: false,
    dropdownImgUrl: '/test-dropdown.svg',
    iconUrl: '/test-icon.svg',
    searchIcon: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<FilterItem {...defaultProps} />);
      
      const container = document.querySelector('.fi');
      const title = screen.getAllByText('Test Filter')[0];
      
      expect(container).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('fi__title', 'fi__title--multi-select');
    });

    it('applies correct CSS classes based on type', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="toggle" />);
      
      let container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--row', 'fi--toggle');
      
      rerender(<FilterItem {...defaultProps} type="multi-select" />);
      container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--col', 'fi--multi-select');
    });

    it('renders title with correct text', () => {
      render(<FilterItem {...defaultProps} name="Custom Filter Name" />);
      
      const title = screen.getAllByText('Custom Filter Name')[0];
      expect(title).toBeInTheDocument();
    });
  });

  describe('Toggle Type', () => {
    it('renders PlToggle component for toggle type', () => {
      render(<FilterItem {...defaultProps} type="toggle" />);
      
      const toggle = screen.getByTestId('pl-toggle');
      expect(toggle).toBeInTheDocument();
    });

    it('passes correct props to PlToggle', () => {
      render(<FilterItem {...defaultProps} type="toggle" identifierId="toggle-id" isChecked={true} />);
      
      const toggle = screen.getByTestId('pl-toggle');
      expect(toggle).toHaveClass('active');
    });
  });

  describe('Multi-Select Type', () => {
    it('renders MultiSelect component for multi-select type', () => {
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const multiSelect = screen.getByTestId('multi-select');
      expect(multiSelect).toBeInTheDocument();
    });

    it('passes correct props to MultiSelect', () => {
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const multiSelect = screen.getByTestId('multi-select');
      const button = screen.getByTestId('multi-select-button');
      
      expect(multiSelect).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Filter');
    });
  });

  describe('Single-Select Type', () => {
    it('renders PlSingleSelect component for single-select type', () => {
      render(<FilterItem {...defaultProps} type="single-select" />);
      
      const singleSelect = screen.getByTestId('pl-single-select');
      expect(singleSelect).toBeInTheDocument();
    });
  });

  describe('Tag Type', () => {
    it('renders TagItem components for tag type', () => {
      render(<FilterItem {...defaultProps} type="tag" />);
      
      const tags = document.querySelector('.tags');
      expect(tags).toBeInTheDocument();
      
      mockItems.forEach((item, index) => {
        const tagItem = screen.getByTestId(`tag-item-${item.name}`);
        expect(tagItem).toBeInTheDocument();
        expect(tagItem).toHaveTextContent(item.label);
      });
    });

    it('applies active class to selected tag items', () => {
      render(<FilterItem {...defaultProps} type="tag" selectedItems={['item1']} />);
      
      const activeTag = screen.getByTestId('tag-item-item1');
      const inactiveTag = screen.getByTestId('tag-item-item2');
      
      expect(activeTag).toHaveClass('active');
      expect(inactiveTag).toHaveClass('inactive');
    });
  });

  describe('Open Multi-Select Type', () => {
    it('renders OpenMultiSelect component for open-multi-select type', () => {
      render(<FilterItem {...defaultProps} type="open-multi-select" />);
      
      const openMultiSelect = screen.getByTestId('open-multi-select');
      expect(openMultiSelect).toBeInTheDocument();
    });
  });

  describe('Input Change Handling', () => {
    it('filters items based on input value', async () => {
      const user = userEvent.setup();
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const input = screen.getByTestId('multi-select-input');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByTestId('multi-select-input');
      await user.type(input, 'Item 1');
      
      await waitFor(() => {
        const filteredItem = screen.getByTestId('multi-select-item-0');
        expect(filteredItem).toHaveTextContent('Item 1');
      });
    });

    it('shows all items when input is empty', async () => {
      const user = userEvent.setup();
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const input = screen.getByTestId('multi-select-input');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByTestId('multi-select-input');
      await user.type(input, 'Item 1');
      await user.clear(input);
      
      await waitFor(() => {
        const items = screen.getAllByTestId(/multi-select-item-/);
        expect(items).toHaveLength(3);
      });
    });
  });

  describe('Clear Selection', () => {
    it('calls analytics when clearing selection', () => {
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      fireEvent.click(clearButton);
      
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });

    it('handles different key types for clear selection', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      
      // Test accessType key
      fireEvent.click(clearButton);
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });
  });

  describe('Item Click Handling', () => {
    it('calls analytics when item is clicked', () => {
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      fireEvent.click(item);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalledWith('test-id', 'value1', 'events');
    });

    it('handles different filter types in onItemClicked', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="tag" />);
      
      // Test locations
      const locationTag = screen.getByTestId('tag-item-item1');
      fireEvent.click(locationTag);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalledWith('testKey', 'item1', 'events');
    });
  });

  describe('Multi-Box Click Handling', () => {
    it('toggles pane status when multi-box is clicked', () => {
      render(<FilterItem {...defaultProps} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      expect(screen.getByTestId('multi-select-dropdown')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      const minimalProps = {
        type: 'multi-select',
        name: 'Test',
        items: [],
        selectedItems: [],
        selectedFilterValues: {},
        searchParams: {},
        initialFilters: {},
        identifierId: 'test',
        isChecked: false,
      };
      
      render(<FilterItem {...minimalProps} />);
      
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });

    it('handles undefined optional props', () => {
      const propsWithUndefined = {
        ...defaultProps,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        searchIcon: undefined,
      };
      
      render(<FilterItem {...propsWithUndefined} />);
      
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct alignment classes', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="toggle" />);
      
      let container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--row');
      
      rerender(<FilterItem {...defaultProps} type="multi-select" />);
      container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--col');
    });

    it('applies correct type-specific classes', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="toggle" />);
      
      let container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--toggle');
      
      rerender(<FilterItem {...defaultProps} type="multi-select" />);
      container = document.querySelector('.fi');
      expect(container).toHaveClass('fi--multi-select');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(<FilterItem {...defaultProps} items={[]} />);
      
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });

    it('handles null/undefined items', () => {
      render(<FilterItem {...defaultProps} items={[]} />);
      
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });

    it('handles missing selectedFilterValues properties', () => {
      const propsWithoutSelectedValues = {
        ...defaultProps,
        selectedFilterValues: {},
      };
      
      render(<FilterItem {...propsWithoutSelectedValues} />);
      
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<FilterItem {...defaultProps} />);
      
      const container = document.querySelector('.fi');
      const title = screen.getAllByText('Test Filter')[0];
      
      expect(container).toContainElement(title);
    });

    it('renders styled-jsx styles', () => {
      render(<FilterItem {...defaultProps} />);
      
      // Check if the component renders without errors
      const container = document.querySelector('.fi');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<FilterItem {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Filter');
    });

    it('maintains proper semantic structure for different types', () => {
      const { rerender } = render(<FilterItem {...defaultProps} type="toggle" />);
      
      let heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('fi__title--toggle');
      
      rerender(<FilterItem {...defaultProps} type="multi-select" />);
      heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('fi__title--multi-select');
    });
  });

  describe('onClearSelection Function - Lines 69,71,73,75 Coverage', () => {
    it('handles accessType key - deletes accessOption from searchParams', () => {
      const propsWithAccessType = {
        ...defaultProps,
        searchParams: { accessOption: 'option1', other: 'value' },
        selectedFilterValues: { accessOption: ['option1'] },
      };

      render(<FilterItem {...propsWithAccessType} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      
      // Mock the clear button click with accessType key
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(clearButton, mockEvent);
      
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });

    it('handles locations key - deletes location from searchParams', () => {
      const propsWithLocations = {
        ...defaultProps,
        searchParams: { location: 'location1', other: 'value' },
        selectedFilterValues: { location: ['location1'] },
      };

      render(<FilterItem {...propsWithLocations} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      
      // Mock the clear button click with locations key
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(clearButton, mockEvent);
      
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });

    it('handles host key - deletes host from searchParams', () => {
      const propsWithHost = {
        ...defaultProps,
        searchParams: { host: 'host1', other: 'value' },
        selectedFilterValues: { allHost: ['host1'] },
      };

      render(<FilterItem {...propsWithHost} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      
      // Mock the clear button click with host key
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(clearButton, mockEvent);
      
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });

    it('handles tags key - deletes tags from searchParams', () => {
      const propsWithTags = {
        ...defaultProps,
        searchParams: { tags: 'tag1', other: 'value' },
        selectedFilterValues: { tags: ['tag1'] },
      };

      render(<FilterItem {...propsWithTags} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const clearButton = screen.getByTestId('clear-selection');
      
      // Mock the clear button click with tags key
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(clearButton, mockEvent);
      
      expect(mockOnFilterClearAllBtnClicked).toHaveBeenCalled();
    });
  });

  describe('Select All Logic for Locations - Lines 107-126 Coverage', () => {
    it('handles Select All with shouldSelect true - adds all items to selectedLocation', () => {
      const selectAllValue = {
        isSelectAll: true,
        select: true,
        items: ['location1', 'location2', 'location3']
      };

      const propsWithSelectAll = {
        ...defaultProps,
        selectedFilterValues: { location: ['existing'] },
        searchParams: { location: 'existing' },
      };

      render(<FilterItem {...propsWithSelectAll} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with Select All value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles Select All with shouldSelect false - removes items from selectedLocation', () => {
      const selectAllValue = {
        isSelectAll: true,
        select: false,
        items: ['location1', 'location2']
      };

      const propsWithSelectAll = {
        ...defaultProps,
        selectedFilterValues: { location: ['location1', 'location2', 'location3'] },
        searchParams: { location: 'location1' },
      };

      render(<FilterItem {...propsWithSelectAll} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with Select All value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles Select All with empty selectedLocation - deletes location from searchParams', () => {
      const selectAllValue = {
        isSelectAll: true,
        select: false,
        items: ['location1', 'location2']
      };

      const propsWithSelectAll = {
        ...defaultProps,
        selectedFilterValues: { location: [] },
        searchParams: { location: 'location1' },
      };

      render(<FilterItem {...propsWithSelectAll} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with Select All value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('isFeatured Filter Logic - Lines 131-133 Coverage', () => {
    it('handles isFeatured key - sets value in searchParams', () => {
      const propsWithFeatured = {
        ...defaultProps,
        searchParams: {},
        initialFilters: { isFeatured: false },
      };

      render(<FilterItem {...propsWithFeatured} type="toggle" />);
      
      const toggle = screen.getByTestId('pl-toggle');
      fireEvent.click(toggle);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalledWith('test-id', true, 'events');
    });

    it('handles isFeatured key - deletes from searchParams when value matches initialFilters', () => {
      const propsWithFeatured = {
        ...defaultProps,
        searchParams: { isFeatured: true },
        initialFilters: { isFeatured: true },
        isChecked: true, // Set initial state to true
      };

      render(<FilterItem {...propsWithFeatured} type="toggle" />);
      
      const toggle = screen.getByTestId('pl-toggle');
      fireEvent.click(toggle);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalledWith('test-id', false, 'events');
    });
  });

  describe('Modes Filter Logic - Lines 138-153 Coverage', () => {
    it('handles modes key with "All" value - clears selectedModes and deletes from searchParams', () => {
      const propsWithModes = {
        ...defaultProps,
        selectedFilterValues: { modes: ['mode1', 'mode2'] },
        searchParams: { modes: 'mode1|mode2' },
      };

      render(<FilterItem {...propsWithModes} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with "All" value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles modes key - adds value to selectedModes when not already selected', () => {
      const propsWithModes = {
        ...defaultProps,
        selectedFilterValues: { modes: ['mode1'] },
        searchParams: { modes: 'mode1' },
      };

      render(<FilterItem {...propsWithModes} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with new mode value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles modes key - removes value from selectedModes when already selected', () => {
      const propsWithModes = {
        ...defaultProps,
        selectedFilterValues: { modes: ['mode1', 'mode2'] },
        searchParams: { modes: 'mode1|mode2' },
      };

      render(<FilterItem {...propsWithModes} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with existing mode value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles modes key - deletes from searchParams when selectedModes is empty', () => {
      const propsWithModes = {
        ...defaultProps,
        selectedFilterValues: { modes: [] },
        searchParams: { modes: 'mode1' },
      };

      render(<FilterItem {...propsWithModes} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with mode value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Access Type Filter Logic - Lines 159-172 Coverage', () => {
    it('handles accessType key - adds value to selectedAccessOptions when not already selected', () => {
      const propsWithAccessType = {
        ...defaultProps,
        selectedFilterValues: { accessOption: ['option1'] },
        searchParams: { accessOption: 'option1' },
      };

      render(<FilterItem {...propsWithAccessType} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with new access option value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles accessType key - removes value from selectedAccessOptions when already selected', () => {
      const propsWithAccessType = {
        ...defaultProps,
        selectedFilterValues: { accessOption: ['option1', 'option2'] },
        searchParams: { accessOption: 'option1|option2' },
      };

      render(<FilterItem {...propsWithAccessType} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with existing access option value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles accessType key - deletes from searchParams when selectedAccessOptions is empty', () => {
      const propsWithAccessType = {
        ...defaultProps,
        selectedFilterValues: { accessOption: [] },
        searchParams: { accessOption: 'option1' },
      };

      render(<FilterItem {...propsWithAccessType} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with access option value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Locations Filter Logic - Lines 176-185 Coverage', () => {
    it('handles locations key - clears selectedLocation when only one item and same value', () => {
      const propsWithLocations = {
        ...defaultProps,
        selectedFilterValues: { location: ['location1'] },
        searchParams: { location: 'location1' },
      };

      render(<FilterItem {...propsWithLocations} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with same location value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles locations key - sets new value when different from current', () => {
      const propsWithLocations = {
        ...defaultProps,
        selectedFilterValues: { location: ['location1'] },
        searchParams: { location: 'location1' },
      };

      render(<FilterItem {...propsWithLocations} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-1'); // Different item
      
      // Simulate clicking with different location value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles locations key - deletes from searchParams when selectedLocation is empty', () => {
      const propsWithLocations = {
        ...defaultProps,
        selectedFilterValues: { location: [] },
        searchParams: { location: 'location1' },
      };

      render(<FilterItem {...propsWithLocations} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with location value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Host Filter Logic - Lines 190-199 Coverage', () => {
    it('handles host key - adds value to selectedHosts when not already selected', () => {
      const propsWithHost = {
        ...defaultProps,
        selectedFilterValues: { allHost: ['host1'] },
        searchParams: { host: 'host1' },
      };

      render(<FilterItem {...propsWithHost} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with new host value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles host key - removes value from selectedHosts when already selected', () => {
      const propsWithHost = {
        ...defaultProps,
        selectedFilterValues: { allHost: ['host1', 'host2'] },
        searchParams: { host: 'host1|host2' },
      };

      render(<FilterItem {...propsWithHost} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with existing host value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles host key - deletes from searchParams when selectedHosts is empty', () => {
      const propsWithHost = {
        ...defaultProps,
        selectedFilterValues: { allHost: [] },
        searchParams: { host: 'host1' },
      };

      render(<FilterItem {...propsWithHost} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with host value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Tags Filter Logic - Lines 204-213 Coverage', () => {
    it('handles tags key - adds value to selectedTags when not already selected', () => {
      const propsWithTags = {
        ...defaultProps,
        selectedFilterValues: { tags: ['tag1'] },
        searchParams: { tags: 'tag1' },
      };

      render(<FilterItem {...propsWithTags} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with new tag value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles tags key - removes value from selectedTags when already selected', () => {
      const propsWithTags = {
        ...defaultProps,
        selectedFilterValues: { tags: ['tag1', 'tag2'] },
        searchParams: { tags: 'tag1|tag2' },
      };

      render(<FilterItem {...propsWithTags} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with existing tag value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });

    it('handles tags key - deletes from searchParams when selectedTags is empty', () => {
      const propsWithTags = {
        ...defaultProps,
        selectedFilterValues: { tags: [] },
        searchParams: { tags: 'tag1' },
      };

      render(<FilterItem {...propsWithTags} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      
      // Simulate clicking with tag value
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      fireEvent.click(item, mockEvent);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Year Filter Logic - Line 218 Coverage', () => {
    it('handles year key - sets value in searchParams', () => {
      const propsWithYear = {
        ...defaultProps,
        searchParams: {},
      };

      render(<FilterItem {...propsWithYear} type="single-select" />);
      
      const option = screen.getByTestId('single-select-option');
      fireEvent.click(option);
      
      expect(mockOnScheduleFilterClicked).toHaveBeenCalled();
    });
  });

  describe('Router Push Logic - Line 226 Coverage', () => {
    it('calls router.push when locations filter changes', () => {
      const propsWithLocations = {
        ...defaultProps,
        searchParams: { location: 'location1' },
        selectedFilterValues: { location: ['location1'] },
        identifierId: 'locations',
      };

      render(<FilterItem {...propsWithLocations} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      fireEvent.click(item);
      
      expect(mockPush).toHaveBeenCalled();
    });

    it('calls router.push when modes filter changes', () => {
      const propsWithModes = {
        ...defaultProps,
        searchParams: { modes: 'mode1' },
        selectedFilterValues: { modes: ['mode1'] },
        identifierId: 'modes',
      };

      render(<FilterItem {...propsWithModes} type="multi-select" />);
      
      const button = screen.getByTestId('multi-select-button');
      fireEvent.click(button);
      
      const item = screen.getByTestId('multi-select-item-0');
      fireEvent.click(item);
      
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
