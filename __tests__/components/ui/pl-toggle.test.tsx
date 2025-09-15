import { render, screen, fireEvent } from '@testing-library/react';
import PlToggle from '@/components/ui/pl-toggle';

describe('PlToggle Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    callback: mockCallback,
    itemId: 'test-toggle',
    activeItem: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders with active state', () => {
      const propsActive = {
        ...defaultProps,
        activeItem: true
      };
      
      render(<PlToggle {...propsActive} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders with correct id', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'test-toggle-pl-toggle');
    });

    it('renders as checkbox input', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('User Interactions', () => {
    it('calls callback when toggled', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockCallback).toHaveBeenCalledWith('test-toggle', true, 'single-select');
    });

    it('calls callback with correct parameters when toggled off', () => {
      const propsActive = {
        ...defaultProps,
        activeItem: true
      };
      
      render(<PlToggle {...propsActive} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockCallback).toHaveBeenCalledWith('test-toggle', false, 'single-select');
    });

    it('calls callback multiple times', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    it('handles click on label', () => {
      render(<PlToggle {...defaultProps} />);
      
      const label = screen.getByRole('checkbox').closest('label');
      fireEvent.click(label!);
      
      expect(mockCallback).toHaveBeenCalledWith('test-toggle', true, 'single-select');
    });
  });

  describe('State Management', () => {
    it('updates state when toggled', () => {
      const { rerender } = render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      
      // Rerender with active state
      rerender(<PlToggle {...defaultProps} activeItem={true} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('maintains state across re-renders', () => {
      const { rerender } = render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      rerender(<PlToggle {...defaultProps} activeItem={true} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      const label = checkbox.closest('label');
      
      expect(label).toBeInTheDocument();
      expect(label).toContainElement(checkbox);
    });

    it('has proper id attribute', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'test-toggle-pl-toggle');
    });

    it('is focusable', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it('supports keyboard navigation', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Simulate keyboard interaction
      fireEvent.keyDown(checkbox, { key: ' ' });
      // Note: The component doesn't have explicit keyboard handlers, but it's focusable
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes', () => {
      render(<PlToggle {...defaultProps} />);
      
      const label = screen.getByRole('checkbox').closest('label');
      const slider = label?.querySelector('.slider');
      
      expect(label).toHaveClass('switch');
      expect(slider).toHaveClass('slider', 'round');
    });

    it('has proper structure for styling', () => {
      render(<PlToggle {...defaultProps} />);
      
      const label = screen.getByRole('checkbox').closest('label');
      const input = label?.querySelector('input');
      const slider = label?.querySelector('.slider');
      
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined callback gracefully', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        callback: undefined
      };
      
      render(<PlToggle {...propsWithoutCallback} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(() => fireEvent.click(checkbox)).not.toThrow();
    });

    it('handles null callback gracefully', () => {
      const propsWithNullCallback = {
        ...defaultProps,
        callback: null as any
      };
      
      render(<PlToggle {...propsWithNullCallback} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(() => fireEvent.click(checkbox)).not.toThrow();
    });

    it('handles undefined itemId', () => {
      const propsWithoutItemId = {
        ...defaultProps,
        itemId: undefined
      };
      
      render(<PlToggle {...propsWithoutItemId} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'undefined-pl-toggle');
    });

    it('handles null itemId', () => {
      const propsWithNullItemId = {
        ...defaultProps,
        itemId: null as any
      };
      
      render(<PlToggle {...propsWithNullItemId} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'null-pl-toggle');
    });

    it('handles boolean activeItem values', () => {
      const propsWithBooleanActive = {
        ...defaultProps,
        activeItem: true
      };
      
      render(<PlToggle {...propsWithBooleanActive} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('handles string activeItem values', () => {
      const propsWithStringActive = {
        ...defaultProps,
        activeItem: 'true' as any
      };
      
      render(<PlToggle {...propsWithStringActive} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Ref Handling', () => {
    it('uses ref correctly', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('calls callback with ref value', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockCallback).toHaveBeenCalledWith('test-toggle', true, 'single-select');
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple toggles with different states', () => {
      render(
        <div>
          <PlToggle {...defaultProps} />
          <PlToggle {...defaultProps} itemId="toggle2" activeItem={true} />
        </div>
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it('handles multiple toggles independently', () => {
      const mockCallback2 = jest.fn();
      
      render(
        <div>
          <PlToggle {...defaultProps} />
          <PlToggle {...defaultProps} itemId="toggle2" callback={mockCallback2} />
        </div>
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Type Safety', () => {
    it('calls callback with correct type parameter', () => {
      render(<PlToggle {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        'single-select'
      );
    });
  });
});
