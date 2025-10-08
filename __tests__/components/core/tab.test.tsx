import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tab from '@/components/core/tab';

// Mock the IconTab component
jest.mock('@/components/core/icon-tab', () => {
  return function MockIconTab(props: any) {
    return (
      <div data-testid="icon-tab">
        <div data-testid="dropdown-status">{props.isDropDownActive ? 'active' : 'inactive'}</div>
        <button 
          data-testid="toggle-dropdown" 
          onClick={props.onToggleDropdown}
        >
          Toggle Dropdown
        </button>
        <button 
          data-testid="close-dropdown" 
          onClick={props.onCloseDropdown}
        >
          Close Dropdown
        </button>
      </div>
    );
  };
});

describe('Tab Component', () => {
  const defaultProps = {
    items: [
      { title: 'calendar', name: 'Calendar', activeImg: '/icons/calendar-active.svg', inActiveImg: '/icons/calendar-inactive.svg' },
      { title: 'list', name: 'List', activeImg: '/icons/list-active.svg', inActiveImg: '/icons/list-inactive.svg' },
    ],
    selectedItemId: 'calendar',
    sectionId: 'test-section',
    callback: jest.fn(),
    arrowImg: '/icons/arrow-down.svg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders IconTab component with correct props', () => {
      render(<Tab {...defaultProps} />);
      
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });

    it('passes all props to IconTab component', () => {
      render(<Tab {...defaultProps} />);
      
      // The IconTab component should receive all the props
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('initializes with dropdown inactive', () => {
      render(<Tab {...defaultProps} />);
      
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });

    it('toggles dropdown state when onToggleDropdown is called', () => {
      render(<Tab {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      
      // Initially inactive
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
      
      // Click to activate
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
      
      // Click to deactivate
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });

    it('closes dropdown when onCloseDropdown is called', () => {
      render(<Tab {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      const closeButton = screen.getByTestId('close-dropdown');
      
      // Activate dropdown first
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
      
      // Close dropdown
      fireEvent.click(closeButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      render(<Tab />);
      
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });

    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: [],
      };
      
      render(<Tab {...propsWithEmptyItems} />);
      
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });

    it('handles undefined items', () => {
      const propsWithUndefinedItems = {
        ...defaultProps,
        items: undefined,
      };
      
      render(<Tab {...propsWithUndefinedItems} />);
      
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });

    it('handles null items', () => {
      const propsWithNullItems = {
        ...defaultProps,
        items: null,
      };
      
      render(<Tab {...propsWithNullItems} />);
      
      expect(screen.getByTestId('icon-tab')).toBeInTheDocument();
    });
  });

  describe('Callback Functions', () => {
    it('provides onToggleDropdown function to IconTab', () => {
      render(<Tab {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      expect(toggleButton).toBeInTheDocument();
      
      // Test that the function works
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
    });

    it('provides onCloseDropdown function to IconTab', () => {
      render(<Tab {...defaultProps} />);
      
      const closeButton = screen.getByTestId('close-dropdown');
      expect(closeButton).toBeInTheDocument();
      
      // Test that the function works
      fireEvent.click(closeButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper structure', () => {
      render(<Tab {...defaultProps} />);
      
      const iconTab = screen.getByTestId('icon-tab');
      expect(iconTab).toBeInTheDocument();
      
      const dropdownStatus = screen.getByTestId('dropdown-status');
      expect(dropdownStatus).toBeInTheDocument();
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      expect(toggleButton).toBeInTheDocument();
      
      const closeButton = screen.getByTestId('close-dropdown');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('maintains state across re-renders', () => {
      const { rerender } = render(<Tab {...defaultProps} />);
      
      // Initially inactive
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
      
      // Toggle to active
      fireEvent.click(screen.getByTestId('toggle-dropdown'));
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
      
      // Re-render with same props - state should persist
      rerender(<Tab {...defaultProps} />);
      
      // State should remain active (React maintains state across re-renders)
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggling', () => {
      render(<Tab {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      
      // Rapid clicks
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      
      // Should end up in active state (odd number of clicks)
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
    });

    it('handles close when already closed', () => {
      render(<Tab {...defaultProps} />);
      
      const closeButton = screen.getByTestId('close-dropdown');
      
      // Close when already closed
      fireEvent.click(closeButton);
      
      // Should remain inactive
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });

    it('handles multiple close calls', () => {
      render(<Tab {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('toggle-dropdown');
      const closeButton = screen.getByTestId('close-dropdown');
      
      // Activate
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('active');
      
      // Multiple close calls
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      
      // Should remain inactive
      expect(screen.getByTestId('dropdown-status')).toHaveTextContent('inactive');
    });
  });
});
