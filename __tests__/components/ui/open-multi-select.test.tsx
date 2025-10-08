import { render, screen, fireEvent } from '@testing-library/react';
import OpenMultiSelect from '@/components/ui/open-multi-select';

describe('OpenMultiSelect Component', () => {
  const mockOnInputChange = jest.fn();
  const mockOnItemSelected = jest.fn();

  const defaultProps = {
    items: [
      { name: 'item1', label: 'Item 1' },
      { name: 'item2', label: 'Item 2' },
      { name: 'item3', label: 'Item 3' }
    ],
    selectedItems: [],
    filteredItems: [
      { name: 'item1', label: 'Item 1' },
      { name: 'item2', label: 'Item 2' },
      { name: 'item3', label: 'Item 3' }
    ],
    onInputChange: mockOnInputChange,
    onItemSelected: mockOnItemSelected,
    searchIcon: '/search-icon.svg',
    itemId: 'test-id',
    tickImg: '/tick-icon.svg',
    identifierId: 'test-identifier'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders with empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: [],
        filteredItems: []
      };
      
      render(<OpenMultiSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('renders with empty filtered items', () => {
      const propsWithEmptyFiltered = {
        ...defaultProps,
        filteredItems: []
      };
      
      render(<OpenMultiSelect {...propsWithEmptyFiltered} />);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('renders search icon', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const searchIcon = screen.getByRole('img', { name: '' });
      expect(searchIcon).toHaveAttribute('src', '/search-icon.svg');
    });
  });

  describe('User Interactions', () => {
    it('calls onInputChange when search input changes', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(mockOnInputChange).toHaveBeenCalledWith('test');
    });

    it('calls onItemSelected when item is clicked', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const firstItem = screen.getByText('Item 1');
      fireEvent.click(firstItem);
      
      expect(mockOnItemSelected).toHaveBeenCalledWith('test-identifier', 'item1');
    });

    it('calls onItemSelected with correct parameters for different items', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const secondItem = screen.getByText('Item 2');
      fireEvent.click(secondItem);
      
      expect(mockOnItemSelected).toHaveBeenCalledWith('test-identifier', 'item2');
    });

    it('handles multiple item clicks', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const firstItem = screen.getByText('Item 1');
      const secondItem = screen.getByText('Item 2');
      
      fireEvent.click(firstItem);
      fireEvent.click(secondItem);
      
      expect(mockOnItemSelected).toHaveBeenCalledTimes(2);
      expect(mockOnItemSelected).toHaveBeenNthCalledWith(1, 'test-identifier', 'item1');
      expect(mockOnItemSelected).toHaveBeenNthCalledWith(2, 'test-identifier', 'item2');
    });
  });

  describe('Item Selection States', () => {
    it('shows active state for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<OpenMultiSelect {...propsWithSelection} />);
      
      const item1Text = screen.getByText('Item 1');
      expect(item1Text).toHaveClass('ps__pane__item--active');
    });

    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<OpenMultiSelect {...propsWithSelection} />);
      
      const item2Text = screen.getByText('Item 2');
      expect(item2Text).not.toHaveClass('ps__pane__item--active');
    });

    it('shows checkmark for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<OpenMultiSelect {...propsWithSelection} />);
      
      const checkIcon = screen.getAllByRole('img').find(img => img.getAttribute('src') === '/tick-icon.svg');
      expect(checkIcon).toHaveAttribute('src', '/tick-icon.svg');
    });

    it('shows empty checkbox for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['item1']
      };
      
      render(<OpenMultiSelect {...propsWithSelection} />);
      
      const item2 = screen.getByText('Item 2');
      const checkBox = item2.closest('div')?.querySelector('.ms__pane__list__item__check');
      expect(checkBox).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper title attribute for items', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const item1 = screen.getByText('Item 1');
      expect(item1).toHaveAttribute('title', 'item1');
    });

    it('generates unique IDs for items', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const item1 = screen.getByText('Item 1');
      expect(item1).toHaveAttribute('id', 'test-id-ps-pane-0');
    });

    it('has proper key attributes for items', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const item1 = screen.getByText('Item 1');
      const itemElement = item1.closest('div');
      // React doesn't render key attributes in the DOM, so we test for the presence of the item instead
      expect(itemElement).toBeInTheDocument();
      expect(item1).toHaveAttribute('id', 'test-id-ps-pane-0');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        items: undefined,
        selectedItems: undefined,
        filteredItems: undefined,
        onInputChange: undefined,
        onItemSelected: undefined,
        searchIcon: undefined,
        itemId: undefined,
        tickImg: undefined,
        identifierId: undefined
      };
      
      expect(() => render(<OpenMultiSelect {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles empty filtered items array', () => {
      const propsWithEmptyFiltered = {
        ...defaultProps,
        filteredItems: []
      };
      
      render(<OpenMultiSelect {...propsWithEmptyFiltered} />);
      
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('handles items with missing properties', () => {
      const propsWithIncompleteItems = {
        ...defaultProps,
        filteredItems: [
          { name: 'item1' }, // missing label
          { name: 'item2', label: 'Item 2' }
        ]
      };
      
      render(<OpenMultiSelect {...propsWithIncompleteItems} />);
      
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('handles null values', () => {
      const propsWithNull = {
        ...defaultProps,
        items: null,
        selectedItems: null,
        filteredItems: null
      };
      
      expect(() => render(<OpenMultiSelect {...propsWithNull} />)).not.toThrow();
    });
  });

  describe('Search Functionality', () => {
    it('calls onInputChange with special characters', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'test & search < > " \'' } });
      
      expect(mockOnInputChange).toHaveBeenCalledWith('test & search < > " \'');
    });

    it('calls onInputChange with long text', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search');
      const longText = 'a'.repeat(1000);
      fireEvent.change(searchInput, { target: { value: longText } });
      
      expect(mockOnInputChange).toHaveBeenCalledWith(longText);
    });
  });

  describe('Item Rendering', () => {
    it('renders items in correct order', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const items = screen.getAllByText(/Item \d/);
      expect(items[0]).toHaveTextContent('Item 1');
      expect(items[1]).toHaveTextContent('Item 2');
      expect(items[2]).toHaveTextContent('Item 3');
    });

    it('renders items with proper text transformation', () => {
      const propsWithLowerCase = {
        ...defaultProps,
        filteredItems: [
          { name: 'item1', label: 'item one' },
          { name: 'item2', label: 'item two' }
        ]
      };
      
      render(<OpenMultiSelect {...propsWithLowerCase} />);
      
      const item1 = screen.getByText('item one');
      const item2 = screen.getByText('item two');
      
      expect(item1).toHaveClass('ms__pane__list__item__text');
      expect(item2).toHaveClass('ms__pane__list__item__text');
    });

    it('handles items with special characters in labels', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        filteredItems: [
          { name: 'item1', label: 'Item & Test' },
          { name: 'item2', label: 'Item < > Test' }
        ]
      };
      
      render(<OpenMultiSelect {...propsWithSpecialChars} />);
      
      expect(screen.getByText('Item & Test')).toBeInTheDocument();
      expect(screen.getByText('Item < > Test')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to container', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const container = screen.getByPlaceholderText('Search').closest('.ms');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to pane', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const pane = screen.getByPlaceholderText('Search').closest('.ms__pane');
      expect(pane).toBeInTheDocument();
    });

    it('applies correct CSS classes to items', () => {
      render(<OpenMultiSelect {...defaultProps} />);
      
      const item1 = screen.getByText('Item 1');
      const itemElement = item1.closest('.ms__pane__list__item');
      expect(itemElement).toBeInTheDocument();
    });
  });
});
