import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlMultiSelect from '@/components/ui/pl-multi-select';

// Mock useRef
const mockRef = { current: null };
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));

describe('PlMultiSelect Component', () => {
  const mockCallback = jest.fn();
  const mockOnClearMultiSelect = jest.fn();
  const mockOnMultiSelectClicked = jest.fn();

  const defaultProps = {
    identifierId: 'test-id',
    type: 'test-type',
    items: ['Option 1', 'Option 2', 'Option 3'],
    name: 'Test Items',
    callback: mockCallback,
    dropdownImgUrl: '/dropdown-icon.svg',
    iconUrl: '/icon.svg',
    selectedItems: [],
    onClearMultiSelect: mockOnClearMultiSelect,
    onMultiSelectClicked: mockOnMultiSelectClicked
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.current = null;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      expect(screen.getByText('Select Test Items')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2); // icon and arrow
    });

    it('renders with single selected item', () => {
      const propsWithSingleSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSingleSelection} />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders with multiple selected items', () => {
      const propsWithMultipleSelection = {
        ...defaultProps,
        selectedItems: ['Option 1', 'Option 2']
      };
      
      render(<PlMultiSelect {...propsWithMultipleSelection} />);
      
      expect(screen.getByText('Multiple')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders with empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlMultiSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByText('Select Test Items')).toBeInTheDocument();
    });

    it('renders close button when items are selected', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      const closeButton = screen.getAllByRole('img')[1]; // Second img is the close button
      expect(closeButton).toHaveAttribute('src', '/icons/pln-white-close.svg');
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown when clicked', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('calls onMultiSelectClicked when clicked and pane is not active', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(mockOnMultiSelectClicked).toHaveBeenCalledWith('Test Items');
    });

    it('filters items based on search input', async () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
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
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
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
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith('test-id', 'Option 1', 'test-type');
    });

    it('calls onClearMultiSelect when close button is clicked', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      const closeButton = screen.getAllByRole('img')[1]; // Second img is the close button
      fireEvent.click(closeButton);
      
      expect(mockOnClearMultiSelect).toHaveBeenCalledWith('test-id');
    });

    // it('stops propagation when close button is clicked', () => {
    //   const propsWithSelection = {
    //     ...defaultProps,
    //     selectedItems: ['Option 1']
    //   };
      
    //   render(<PlMultiSelect {...propsWithSelection} />);
      
    //   const closeButton = screen.getAllByRole('img').find(img => img.getAttribute('src') === '/icons/pln-white-close.svg');
    //   const closeButtonDiv = closeButton?.closest('.plms__info__close');
    //   const mockEvent = { stopPropagation: jest.fn() };
    //   fireEvent.click(closeButtonDiv!, mockEvent);
      
    //   expect(mockEvent.stopPropagation).toHaveBeenCalled();
    // });
  });

  describe('Pane Display', () => {
    it('shows pane when isPaneActive is true', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('hides pane when clicked outside', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('does not hide pane when clicking on pane element', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      // Click on pane element
      const pane = screen.getByPlaceholderText('Search').closest('div');
      fireEvent.mouseDown(pane!);
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('shows empty state when no items', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlMultiSelect {...propsWithEmptyItems} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByText('No Items to Select')).toBeInTheDocument();
    });

    it('shows empty state when no filtered items', async () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search for non-existent item
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      });
    });
  });

  describe('Item Selection States', () => {
    it('shows active state for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Option 1').closest('div');
      fireEvent.click(selectionBox!);
      
      const checkIcon = screen.getAllByRole('img').find(img => img.getAttribute('src') === '/icons/pln-white-tick.svg');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveAttribute('src', '/icons/pln-white-tick.svg');
    });

    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Option 1').closest('div');
      fireEvent.click(selectionBox!);
      
      const option2 = screen.getByText('Option 2');
      const checkBox = option2.closest('div')?.querySelector('.plms__pane__list__item__check');
      expect(checkBox).toBeInTheDocument();
    });

    it('applies active class to selected item text', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Option 1').closest('div');
      fireEvent.click(selectionBox!);
      
      const option1Text = screen.getByText('Option 1', { selector: '.plms__pane__list__item__text' });
      expect(option1Text).toHaveClass('ps__pane__item--active');
    });
  });

  describe('Accessibility', () => {
    it('has proper title attribute for selection box', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1', 'Option 2']
      };
      
      render(<PlMultiSelect {...propsWithSelection} />);
      
      const selectionBox = screen.getByText('Multiple').closest('.plms__info');
      expect(selectionBox).toHaveAttribute('title', 'Option 1|Option 2');
    });

    it('has proper title attribute for empty selection', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('.plms__info');
      expect(selectionBox).toHaveAttribute('title', '');
    });

    it('generates unique IDs for items', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      const option1 = screen.getByText('Option 1');
      expect(option1).toHaveAttribute('id', 'test-id-ps-pane-0');
    });

    it('has proper id for selection box', () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('.plms__info');
      expect(selectionBox).toHaveAttribute('id', 'tesssst');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        identifierId: undefined,
        type: undefined,
        items: undefined,
        name: undefined,
        callback: undefined,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        selectedItems: undefined,
        onClearMultiSelect: undefined,
        onMultiSelectClicked: undefined
      };
      
      expect(() => render(<PlMultiSelect {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlMultiSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByText('Select Test Items')).toBeInTheDocument();
    });

    it('handles case insensitive search', async () => {
      render(<PlMultiSelect {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
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
        items: ['Option & Test', 'Option < > Test']
      };
      
      render(<PlMultiSelect {...propsWithSpecialChars} />);
      
      // Open dropdown
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      fireEvent.click(selectionBox!);
      
      // Search with special characters
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: '&' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option & Test')).toBeInTheDocument();
      });
    });

    it('handles onClearMultiSelect when not provided', () => {
      const propsWithoutClear = {
        ...defaultProps,
        onClearMultiSelect: undefined,
        selectedItems: ['Option 1']
      };
      
      render(<PlMultiSelect {...propsWithoutClear} />);
      
      const closeButton = screen.getAllByRole('img')[1]; // Second img is the close button
      expect(() => fireEvent.click(closeButton)).not.toThrow();
    });

    it('handles onMultiSelectClicked when not provided', () => {
      const propsWithoutClick = {
        ...defaultProps,
        onMultiSelectClicked: undefined
      };
      
      render(<PlMultiSelect {...propsWithoutClick} />);
      
      const selectionBox = screen.getByText('Select Test Items').closest('div');
      expect(() => fireEvent.click(selectionBox!)).not.toThrow();
    });
  });

  describe('Event Listeners', () => {
    it('adds and removes event listeners correctly', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<PlMultiSelect {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
