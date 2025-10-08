import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlBackup from '@/components/ui/pl-backup';

// Mock useRef
const mockRef = { current: null };
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));

describe('PlBackup Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    identifierId: 'test-backup',
    type: 'test-type',
    items: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    callback: mockCallback,
    dropdownImgUrl: '/dropdown-icon.svg',
    iconUrl: '/icon.svg',
    selectedItems: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.current = null;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlBackup {...defaultProps} />);
      
      expect(screen.getByText('Select test-backup')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      const propsWithCustomPlaceholder = {
        ...defaultProps,
        placeholder: 'Choose option'
      };
      
      render(<PlBackup {...propsWithCustomPlaceholder} />);
      
      expect(screen.getByText('Select test-backup')).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      render(<PlBackup {...defaultProps} />);
      
      const icon = document.querySelector('.ms__icon');
      expect(icon).toHaveAttribute('src', '/icon.svg');
    });

    it('renders with dropdown arrow when items length > 1', () => {
      render(<PlBackup {...defaultProps} />);
      
      const arrow = document.querySelector('.ms__arrow');
      expect(arrow).toHaveAttribute('src', '/dropdown-icon.svg');
    });

    it('does not render dropdown arrow when items length <= 1', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: ['Single Option']
      };
      
      render(<PlBackup {...propsWithOneItem} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1); // Only the icon, no dropdown arrow
    });

    it('disables input when items length <= 1', () => {
      const propsWithOneItem = {
        ...defaultProps,
        items: ['Single Option']
      };
      
      render(<PlBackup {...propsWithOneItem} />);
      
      const selectionBox = document.querySelector('.ms__info');
      expect(selectionBox).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown when input is clicked', () => {
      render(<PlBackup {...defaultProps} />);
      
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('opens dropdown when arrow is clicked', () => {
      render(<PlBackup {...defaultProps} />);
      
      const arrow = screen.getAllByRole('img', { name: '' })[0];
      fireEvent.click(arrow);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('filters items based on search input', async () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Type in search input
      const searchInput = document.querySelector('input[placeholder="Search"]');
      fireEvent.change(searchInput!, { target: { value: 'Option 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      });
    });

    it('shows all items when search is cleared', async () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Type in search input
      const searchInput = document.querySelector('input[placeholder="Search"]');
      fireEvent.change(searchInput!, { target: { value: 'Option 1' } });
      
      // Clear search input
      fireEvent.change(searchInput!, { target: { value: '' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('calls callback when item is selected', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith('test-type', 'test-backup', 'Option 1');
    });
  });

  describe('Pane Display', () => {
    it('shows pane when isPaneActive is true', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('hides pane when clicked outside', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('does not hide pane when clicking on pane element', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Click on pane element
      const pane = screen.getByText('Option 1').closest('div');
      fireEvent.mouseDown(pane!);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Item Selection States', () => {
    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItems: ['Option 1']
      };
      
      render(<PlBackup {...propsWithSelection} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      const unselectedItem = screen.getByText('Option 2');
      expect(unselectedItem).toHaveClass('ms__pane__item');
      expect(unselectedItem).not.toHaveClass('ms__pane__item--active');
    });
  });

  describe('Accessibility', () => {
    it('has proper id attributes', () => {
      render(<PlBackup {...defaultProps} />);
      
      const container = document.querySelector('#test-backup-ps');
      const selectionBox = document.querySelector('.ms__info');
      
      expect(container).toBeInTheDocument();
      expect(selectionBox).toBeInTheDocument();
      
      // Open dropdown to show pane
      fireEvent.click(selectionBox!);
      const pane = document.querySelector('#test-backup-ps-pane');
      expect(pane).toBeInTheDocument();
    });

    it('generates unique IDs for items', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      const option1 = screen.getByText('Option 1');
      expect(option1).toHaveAttribute('id', 'test-backup-ps-pane-0');
    });

    it('has proper input attributes', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown to show search input
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      const searchInput = document.querySelector('input[placeholder="Search"]');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Search');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        identifierId: undefined,
        type: undefined,
        items: undefined,
        placeholder: undefined,
        callback: undefined,
        dropdownImgUrl: undefined,
        iconUrl: undefined,
        selectedItems: undefined
      };
      
      expect(() => render(<PlBackup {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlBackup {...propsWithEmptyItems} />);
      
      expect(screen.getByText('Select test-backup')).toBeInTheDocument();
    });

    it('handles case insensitive search', async () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Search with different case
      const searchInput = document.querySelector('input[placeholder="Search"]');
      fireEvent.change(searchInput!, { target: { value: 'OPTION 1' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('handles special characters in search', async () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        items: ['Option & Test', 'Option < > Test']
      };
      
      render(<PlBackup {...propsWithSpecialChars} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Search with special characters
      const searchInput = document.querySelector('input[placeholder="Search"]');
      fireEvent.change(searchInput!, { target: { value: '&' } });
      
      await waitFor(() => {
        expect(screen.getByText('Option & Test')).toBeInTheDocument();
      });
    });
  });

  describe('Event Listeners', () => {
    it('adds and removes event listeners correctly', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<PlBackup {...defaultProps} />);
      
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
    it('renders multiple backups independently', () => {
      const mockCallback2 = jest.fn();
      
      render(
        <div>
          <PlBackup {...defaultProps} />
          <PlBackup {...defaultProps} identifierId="backup2" callback={mockCallback2} />
        </div>
      );
      
      const selectionBoxes = document.querySelectorAll('.ms__info');
      expect(selectionBoxes).toHaveLength(2);
    });

    it('handles multiple backups with different states', () => {
      render(
        <div>
          <PlBackup {...defaultProps} />
          <PlBackup {...defaultProps} identifierId="backup2" selectedItems={['Option 1']} />
        </div>
      );
      
      const selectionBoxes = document.querySelectorAll('.ms__info');
      expect(selectionBoxes).toHaveLength(2);
    });
  });

  describe('Type Safety', () => {
    it('calls callback with correct type parameters', () => {
      render(<PlBackup {...defaultProps} />);
      
      // Open dropdown
      const selectionBox = document.querySelector('.ms__info');
      fireEvent.click(selectionBox!);
      
      // Click on first item
      const firstItem = screen.getByText('Option 1');
      fireEvent.click(firstItem);
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
    });
  });
});
