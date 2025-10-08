import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlSelect from '@/components/ui/pl-select';

// Mock useRef
const mockRef = { current: null };
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));

describe('PlSelect Component', () => {
  const mockCallback = jest.fn();
  const mockOnItemChange = jest.fn();
  const defaultProps = {
    identifierId: 'test-select',
    items: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    defaultValue: '',
    callback: mockCallback,
    dropdownImgUrl: '/dropdown-icon.svg',
    iconUrl: '/icon.svg',
    selectedItems: [],
    onItemChange: mockOnItemChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.current = null;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlSelect {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      const propsWithCustomPlaceholder = {
        ...defaultProps,
        placeholder: 'Choose option'
      };
      
      render(<PlSelect {...propsWithCustomPlaceholder} />);
      
      expect(screen.getByPlaceholderText('Choose option')).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      render(<PlSelect {...defaultProps} />);
      
      const icon = screen.getAllByRole('img')[0]; // First img is the icon
      expect(icon).toHaveAttribute('src', '/icon.svg');
    });

    it('renders with dropdown arrow when items length > 1', () => {
      render(<PlSelect {...defaultProps} />);
      
      const arrow = screen.getAllByRole('img')[1]; // Second img is the arrow
      expect(arrow).toHaveAttribute('src', '/dropdown-icon.svg');
    });

    it('does not render dropdown arrow when items length <= 1', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: ['Single Option']
      };
      
      render(<PlSelect {...propsWithOneItem} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1); // Only the icon, no dropdown arrow
    });

    it('disables input when items length <= 1', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: ['Single Option']
      };
      
      render(<PlSelect {...propsWithOneItem} />);
      
      const input = screen.getByPlaceholderText('Select an option');
      expect(input).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown when input is clicked', () => {
      render(<PlSelect {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('opens dropdown when arrow is clicked', () => {
      render(<PlSelect {...defaultProps} />);
      
      const arrow = screen.getAllByRole('img')[1]; // Second img is the arrow
      fireEvent.click(arrow);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('filters items based on search input', async () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Type in search input
      fireEvent.change(input, { target: { value: 'Option 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      });
    });

    it('shows all items when search is cleared', async () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Type in search input
      fireEvent.change(input, { target: { value: 'Option 1' } });
      
      // Clear search input
      fireEvent.change(input, { target: { value: '' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('calls callback when item is selected', () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith('test-select', 'Option 1', 0);
    });

    it('calls onItemChange when search is cleared', async () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Type in search input
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Clear search input
      fireEvent.change(input, { target: { value: '' } });
      
      await waitFor(() => {
        expect(mockOnItemChange).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Pane Display', () => {
    it('shows pane when isPaneActive is true', () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('hides pane when clicked outside', () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Item Selection States', () => {
    it('shows active state for selected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlSelect {...propsWithSelection} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      const selectedItem = screen.getByText('Option 1');
      expect(selectedItem).toHaveClass('ps__pane__item--active');
    });

    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlSelect {...propsWithSelection} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      const unselectedItem = screen.getByText('Option 2');
      expect(unselectedItem).toHaveClass('ps__pane__item');
      expect(unselectedItem).not.toHaveClass('ps__pane__item--active');
    });
  });

  describe('Accessibility', () => {
    it('has proper id attributes', () => {
      render(<PlSelect {...defaultProps} />);
      
      const container = document.querySelector('#test-select-ps');
      const input = screen.getByPlaceholderText('Select an option');
      
      expect(container).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-select-ps-input');
      
      // Open dropdown to check pane exists
      const arrow = screen.getAllByRole('img')[1]; // Second img is the arrow
      fireEvent.click(arrow);
      
      const pane = document.querySelector('#test-select-ps-pane');
      expect(pane).toBeInTheDocument();
    });

    it('generates unique IDs for items', () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      const option1 = screen.getByText('Option 1');
      expect(option1).toHaveAttribute('id', 'test-select-ps-pane-0');
    });

    it('has proper input attributes', () => {
      render(<PlSelect {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Select an option');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        identifierId: undefined,
        items: undefined,
        placeholder: undefined,
        defaultValue: undefined,
        callback: undefined,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        selectedItems: undefined,
        onItemChange: undefined
      };
      
      expect(() => render(<PlSelect {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlSelect {...propsWithEmptyItems} />);
      
      expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
    });

    it('handles case insensitive search', async () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Search with different case
      fireEvent.change(input, { target: { value: 'OPTION 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('handles special characters in search', async () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        items: ['Option & Test', 'Option < > Test']
      };
      
      render(<PlSelect {...propsWithSpecialChars} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Search with special characters
      fireEvent.change(input, { target: { value: '&' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option & Test')).toBeInTheDocument();
      });
    });
  });

  describe('Event Listeners', () => {
    it('adds and removes event listeners correctly', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<PlSelect {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple selects independently', () => {
      const mockCallback2 = jest.fn();
      
      render(
        <div>
          <PlSelect {...defaultProps} />
          <PlSelect {...defaultProps} identifierId="select2" callback={mockCallback2} />
        </div>
      );
      
      const inputs = screen.getAllByPlaceholderText('Select an option');
      expect(inputs).toHaveLength(2);
    });

    it('handles multiple selects with different states', () => {
      render(
        <div>
          <PlSelect {...defaultProps} />
          <PlSelect {...defaultProps} identifierId="select2" selectedItems={['Option 1']} />
        </div>
      );
      
      const inputs = screen.getAllByPlaceholderText('Select an option');
      expect(inputs).toHaveLength(2);
    });
  });

  describe('Type Safety', () => {
    it('calls callback with correct type parameters', () => {
      render(<PlSelect {...defaultProps} />);
      
      // Open dropdown
      const input = screen.getByPlaceholderText('Select an option');
      fireEvent.click(input);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Number)
      );
    });
  });
});
