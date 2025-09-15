import { render, screen, fireEvent } from '@testing-library/react';
import MultiSelect from '@/components/ui/multi-select';

// Mock HostLogo component
jest.mock('@/components/ui/host-logo', () => {
  return function MockHostLogo({ firstLetter, height, width }: any) {
    return <div data-testid="host-logo" style={{ height, width }}>{firstLetter}</div>;
  };
});

describe('MultiSelect Component', () => {
  const mockOnInputChange = jest.fn();
  const mockOnItemSelected = jest.fn();
  const mockOnMultiBoxClicked = jest.fn();
  const mockOnClearSelection = jest.fn();

  const defaultProps = {
    items: [
      { name: 'item1', label: 'Item 1', value: 'item1' },
      { name: 'item2', label: 'Item 2', value: 'item2' },
      { name: 'item3', label: 'Item 3', value: 'item3' }
    ],
    tickImg: '/tick-icon.svg',
    closeImg: '/close-icon.svg',
    name: 'Test Items',
    callback: jest.fn(),
    dropdownImgUrl: '/dropdown-icon.svg',
    iconUrl: '/icon.svg',
    selectedItems: [],
    filteredItems: [
      { name: 'item1', label: 'Item 1', value: 'item1' },
      { name: 'item2', label: 'Item 2', value: 'item2' },
      { name: 'item3', label: 'Item 3', value: 'item3' }
    ],
    onInputChange: mockOnInputChange,
    onItemSelected: mockOnItemSelected,
    isPaneActive: false,
    searchIcon: '/search-icon.svg',
    itemId: 'test-id',
    onMultiBoxClicked: mockOnMultiBoxClicked,
    onClearSelection: mockOnClearSelection,
    identifierId: 'test-identifier'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<MultiSelect {...defaultProps} />);
      
      expect(screen.getByText('Select Test Items')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('renders with single selected item', () => {
      const propsWithSingleSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<MultiSelect {...propsWithSingleSelection} />);
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders with multiple selected items', () => {
      const propsWithMultipleSelection = {
        ...defaultProps,
        selectedItems: ['item1', 'item2']
      };
      
      render(<MultiSelect {...propsWithMultipleSelection} />);
      
      expect(screen.getByText('Multiple')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders with empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<MultiSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByText('Select Test Items')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onMultiBoxClicked when selection box is clicked', () => {
      render(<MultiSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(mockOnMultiBoxClicked).toHaveBeenCalledTimes(1);
    });

    it('calls onClearSelection when close button is clicked', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<MultiSelect {...propsWithSelection} />);
      
      const closeButton = document.querySelector('.ms__info__close__img');
      fireEvent.click(closeButton!);
      
      expect(mockOnClearSelection).toHaveBeenCalledWith(expect.any(Object), 'test-identifier');
    });

    it('calls onInputChange when search input changes', () => {
      const propsWithActivePane = {
        ...defaultProps,
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithActivePane} />);
      
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(mockOnInputChange).toHaveBeenCalledWith('test');
    });

    it('calls onItemSelected when item is clicked', () => {
      const propsWithActivePane = {
        ...defaultProps,
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithActivePane} />);
      
      const firstItem = screen.getByText('Item 1');
      fireEvent.click(firstItem);
      
      expect(mockOnItemSelected).toHaveBeenCalledWith('test-identifier', 'item1');
    });
  });

  describe('Pane Display', () => {
    it('shows pane when isPaneActive is true', () => {
      const propsWithActivePane = {
        ...defaultProps,
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithActivePane} />);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('hides pane when isPaneActive is false', () => {
      render(<MultiSelect {...defaultProps} />);
      
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('shows empty state when no items', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: [],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('shows empty state when no filtered items', () => {
      const propsWithEmptyFiltered = {
        ...defaultProps,
        filteredItems: [],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithEmptyFiltered} />);
      
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });
  });

  describe('Select All Feature', () => {
    it('shows select all option for locations identifier', () => {
      const propsWithLocations = {
        ...defaultProps,
        identifierId: 'locations',
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithLocations} />);
      
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('does not show select all option for non-locations identifier', () => {
      const propsWithNonLocations = {
        ...defaultProps,
        identifierId: 'hosts',
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithNonLocations} />);
      
      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
    });

    it('calls onItemSelected with select all payload when select all is clicked', () => {
      const propsWithLocations = {
        ...defaultProps,
        identifierId: 'locations',
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithLocations} />);
      
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);
      
      expect(mockOnItemSelected).toHaveBeenCalledWith('locations', {
        isSelectAll: true,
        items: ['item1', 'item2', 'item3'],
        select: true
      });
    });

    it('shows active state for select all when all items are selected', () => {
      const propsWithAllSelected = {
        ...defaultProps,
        identifierId: 'locations',
        selectedItems: ['item1', 'item2', 'item3'],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithAllSelected} />);
      
      const selectAllCheck = screen.getByText('Select All').closest('div')?.querySelector('.ms__pane__list__item__check--active');
      expect(selectAllCheck).toBeInTheDocument();
    });
  });

  describe('Item Selection States', () => {
    it('shows active state for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1'],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithSelection} />);
      
      const item1Check = document.querySelector('#test-id-ps-pane-check-0.ms__pane__list__item__check--active');
      expect(item1Check).toBeInTheDocument();
    });

    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1'],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithSelection} />);
      
      const item2Check = screen.getByText('Item 2').closest('div')?.querySelector('.ms__pane__list__item__check');
      expect(item2Check).toBeInTheDocument();
    });
  });

  describe('Host Logo Integration', () => {
    it('renders HostLogo for Hosts name', () => {
      const propsWithHosts = {
        ...defaultProps,
        name: 'Hosts',
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithHosts} />);
      
      const hostLogos = screen.getAllByTestId('host-logo');
      expect(hostLogos.length).toBeGreaterThan(0);
    });

    it('does not render HostLogo for non-Hosts name', () => {
      const propsWithNonHosts = {
        ...defaultProps,
        name: 'Locations',
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithNonHosts} />);
      
      expect(screen.queryByTestId('host-logo')).not.toBeInTheDocument();
    });

    it('renders custom image when item has img property', () => {
      const propsWithImages = {
        ...defaultProps,
        filteredItems: [
          { name: 'item1', label: 'Item 1', value: 'item1', img: '/custom-image.svg' }
        ],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithImages} />);
      
      const customImage = document.querySelector('.ms__pane__list__item__img');
      expect(customImage).toHaveAttribute('src', '/custom-image.svg');
    });
  });

  describe('Accessibility', () => {
    it('has proper title attribute for selection box', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1', 'item2']
      };
      
      render(<MultiSelect {...propsWithSelection} />);
      
      const selectionBox = document.querySelector('.ms__info');
      expect(selectionBox).toHaveAttribute('title', 'Item 1 | Item 2');
    });

    it('has proper title attribute for empty selection', () => {
      render(<MultiSelect {...defaultProps} />);
      
      const selectionBox = document.querySelector('.ms__info');
      expect(selectionBox).toHaveAttribute('title', '');
    });

    it('generates unique IDs for items', () => {
      const propsWithActivePane = {
        ...defaultProps,
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithActivePane} />);
      
      const item1 = screen.getByText('Item 1');
      expect(item1).toHaveAttribute('id', 'test-id-ps-pane-0');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        items: undefined,
        tickImg: undefined,
        closeImg: undefined,
        name: undefined,
        callback: undefined,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        selectedItems: undefined,
        filteredItems: undefined,
        onInputChange: undefined,
        onItemSelected: undefined,
        isPaneActive: undefined,
        searchIcon: undefined,
        itemId: undefined,
        onMultiBoxClicked: undefined,
        onClearSelection: undefined,
        identifierId: undefined
      };
      
      expect(() => render(<MultiSelect {...propsWithUndefined} />)).toThrow();
    });

    it('handles empty filtered items array', () => {
      const propsWithEmptyFiltered = {
        ...defaultProps,
        filteredItems: [],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithEmptyFiltered} />);
      
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('handles items with missing properties', () => {
      const propsWithIncompleteItems = {
        ...defaultProps,
        filteredItems: [
          { name: 'item1' }, // missing label and value
          { name: 'item2', label: 'Item 2' } // missing value
        ],
        isPaneActive: true
      };
      
      render(<MultiSelect {...propsWithIncompleteItems} />);
      
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});
