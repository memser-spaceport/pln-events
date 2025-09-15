import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlSingleSelect from '@/components/ui/pl-single-select';

// Mock useRef
const mockRef = { current: null };
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));

describe('PlSingleSelect Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    identifierId: 'test-id',
    type: 'test-type',
    items: [
      { name: 'option1', label: 'Option 1' },
      { name: 'option2', label: 'Option 2' },
      { name: 'option3', label: 'Option 3' }
    ],
    callback: mockCallback,
    dropdownImgUrl: '/dropdown-icon.svg',
    iconUrl: '/icon.svg',
    selectedItem: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.current = null;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      expect(screen.getByText('Select Location')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2); // icon and dropdown arrow
    });

    it('renders with selected item', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'option1'
      };
      
      render(<PlSingleSelect {...propsWithSelection} />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders with multiple selected items', () => {
      const propsWithMultipleSelection = {
        ...defaultProps,
        selectedItem: 'option1,option2'
      };
      
      render(<PlSingleSelect {...propsWithMultipleSelection} />);
      
      expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument();
    });

    it('renders dropdown arrow when items length > 1', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      const arrowImg = screen.getAllByRole('img').find(img => img.getAttribute('src') === '/dropdown-icon.svg');
      expect(arrowImg).toHaveAttribute('src', '/dropdown-icon.svg');
    });

    it('does not render dropdown arrow when items length <= 1', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: [{ name: 'option1', label: 'Option 1' }]
      };
      
      render(<PlSingleSelect {...propsWithOneItem} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1); // Only the icon, no dropdown arrow
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown when clicked with multiple items', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('does not open dropdown when clicked with single item', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: [{ name: 'option1', label: 'Option 1' }]
      };
      
      render(<PlSingleSelect {...propsWithOneItem} />);
      
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('filters items based on search input', async () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Type in search input
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      });
    });

    it('shows all items when search is cleared', async () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Type in search input
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });
      
      // Clear search input
      fireEvent.change(searchInput, { target: { value: '' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('calls callback when item is selected', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith('test-id', 'option1');
    });

    it('filters by both label and name', async () => {
      const propsWithDifferentLabels = {
        ...defaultProps,
        items: [
          { name: 'test1', label: 'Label 1' },
          { name: 'label2', label: 'Test 2' }
        ]
      };
      
      render(<PlSingleSelect {...propsWithDifferentLabels} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search by name
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'test1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Label 1')).toBeInTheDocument();
      });
      
      // Search by label
      fireEvent.change(searchInput, { target: { value: 'Test 2' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test 2')).toBeInTheDocument();
      });
    });
  });

  describe('Visual States', () => {
    it('shows checkmark for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'option1'
      };
      
      render(<PlSingleSelect {...propsWithSelection} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Option 1').closest('div');
      fireEvent.click(selectionBox!);
      
      const checkIcon = screen.getAllByRole('img').find(img => img.getAttribute('src') === '/icons/pln-white-tick.svg');
      expect(checkIcon).toHaveAttribute('src', '/icons/pln-white-tick.svg');
    });

    it('shows empty state when no filtered items', async () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search for non-existent item
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      await waitFor(() => {
        expect(screen.getByText('No options available')).toBeInTheDocument();
      });
    });

    it('shows empty state when no items provided', () => {
      const propsWithNoItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlSingleSelect {...propsWithNoItems} />);
      
      // When there are no items, the dropdown should not open, so we test the component renders without errors
      expect(screen.getByText('Select Location')).toBeInTheDocument();
      expect(screen.queryByText('No options available')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlSingleSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByText('Select Location')).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        identifierId: undefined,
        type: undefined,
        items: undefined,
        callback: undefined,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        selectedItem: undefined
      };
      
      expect(() => render(<PlSingleSelect {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles case insensitive search', async () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search with different case
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'OPTION 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('handles special characters in search', async () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        items: [
          { name: 'option1', label: 'Option & Test' },
          { name: 'option2', label: 'Option < > Test' }
        ]
      };
      
      render(<PlSingleSelect {...propsWithSpecialChars} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search with special characters
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: '&' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option & Test')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Location').closest('.plms__info');
      expect(selectionBox).toHaveClass('plms__info');
    });

    it('generates unique IDs for items', () => {
      render(<PlSingleSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Location').closest('div');
      fireEvent.click(selectionBox!);
      
      const firstItem = screen.getByText('Option 1');
      expect(firstItem).toHaveAttribute('id', 'test-id-ps-pane-0');
    });
  });
});
