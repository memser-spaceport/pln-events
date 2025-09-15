import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterStrip from '../../../../components/page/filter/filter-strip';

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('FilterStrip Component', () => {
  const defaultProps = {
    filterCount: 0,
    onStripClicked: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<FilterStrip {...defaultProps} />);
      
      const container = document.querySelector('.fs');
      const innerContainer = document.querySelector('.fs__cn');
      const image = document.querySelector('.fs__cn__img');
      const text = screen.getByText('Filters');
      
      expect(container).toBeInTheDocument();
      expect(innerContainer).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<FilterStrip {...defaultProps} />);
      
      const container = document.querySelector('.fs');
      const innerContainer = document.querySelector('.fs__cn');
      const image = document.querySelector('.fs__cn__img');
      const text = document.querySelector('.fs__cn__text');
      
      expect(container).toHaveClass('fs');
      expect(innerContainer).toHaveClass('fs__cn');
      expect(image).toHaveClass('fs__cn__img');
      expect(text).toHaveClass('fs__cn__text');
    });

    it('renders image with correct src attribute', () => {
      render(<FilterStrip {...defaultProps} />);
      
      const image = document.querySelector('.fs__cn__img');
      expect(image).toHaveAttribute('src', '/icons/double_arrow_left.svg');
    });

    it('renders text with correct content', () => {
      render(<FilterStrip {...defaultProps} />);
      
      const text = screen.getByText('Filters');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Filters');
    });
  });

  describe('Filter Count Display', () => {
    it('does not render count when filterCount is 0', () => {
      render(<FilterStrip {...defaultProps} filterCount={0} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('does not render count when filterCount is undefined', () => {
      render(<FilterStrip {...defaultProps} filterCount={undefined} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('does not render count when filterCount is null', () => {
      render(<FilterStrip {...defaultProps} filterCount={null} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('renders count when filterCount is greater than 0', () => {
      render(<FilterStrip {...defaultProps} filterCount={3} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      const countText = document.querySelector('.fs__cn__count__text');
      const closeImage = document.querySelector('.fs__cn__count__close');
      
      expect(countContainer).toBeInTheDocument();
      expect(countText).toBeInTheDocument();
      expect(closeImage).toBeInTheDocument();
    });

    it('displays correct filter count', () => {
      render(<FilterStrip {...defaultProps} filterCount={5} />);
      
      const countText = screen.getByText('5');
      expect(countText).toBeInTheDocument();
    });

    it('renders count with correct CSS classes', () => {
      render(<FilterStrip {...defaultProps} filterCount={2} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      const countText = document.querySelector('.fs__cn__count__text');
      const closeImage = document.querySelector('.fs__cn__count__close');
      
      expect(countContainer).toHaveClass('fs__cn__count');
      expect(countText).toHaveClass('fs__cn__count__text');
      expect(closeImage).toHaveClass('fs__cn__count__close');
    });

    it('renders close image with correct src attribute', () => {
      render(<FilterStrip {...defaultProps} filterCount={1} />);
      
      const closeImage = document.querySelector('.fs__cn__count__close');
      expect(closeImage).toHaveAttribute('src', '/icons/close_white.svg');
    });
  });

  describe('Click Handlers', () => {
    it('calls onStripClicked when image is clicked', () => {
      const mockOnStripClicked = jest.fn();
      render(<FilterStrip {...defaultProps} onStripClicked={mockOnStripClicked} />);
      
      const image = document.querySelector('.fs__cn__img');
      fireEvent.click(image!);
      
      expect(mockOnStripClicked).toHaveBeenCalledTimes(1);
    });

    it('calls onStripClicked when text is clicked', () => {
      const mockOnStripClicked = jest.fn();
      render(<FilterStrip {...defaultProps} onStripClicked={mockOnStripClicked} />);
      
      const text = screen.getByText('Filters');
      fireEvent.click(text);
      
      expect(mockOnStripClicked).toHaveBeenCalledTimes(1);
    });

    it('calls onClear when count container is clicked', () => {
      const mockOnClear = jest.fn();
      render(<FilterStrip {...defaultProps} filterCount={3} onClear={mockOnClear} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      fireEvent.click(countContainer!);
      
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('calls onClear when count text is clicked', () => {
      const mockOnClear = jest.fn();
      render(<FilterStrip {...defaultProps} filterCount={2} onClear={mockOnClear} />);
      
      const countText = screen.getByText('2');
      fireEvent.click(countText);
      
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('calls onClear when close image is clicked', () => {
      const mockOnClear = jest.fn();
      render(<FilterStrip {...defaultProps} filterCount={1} onClear={mockOnClear} />);
      
      const closeImage = document.querySelector('.fs__cn__count__close');
      fireEvent.click(closeImage!);
      
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('does not call onClear when count is not displayed', () => {
      const mockOnClear = jest.fn();
      render(<FilterStrip {...defaultProps} filterCount={0} onClear={mockOnClear} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
      expect(mockOnClear).not.toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      render(<FilterStrip />);
      
      const container = document.querySelector('.fs');
      expect(container).toBeInTheDocument();
    });

    it('handles undefined filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={undefined} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('handles null filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={null} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('handles undefined onStripClicked', () => {
      render(<FilterStrip {...defaultProps} onStripClicked={undefined} />);
      
      const image = document.querySelector('.fs__cn__img');
      const text = screen.getByText('Filters');
      
      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(image!);
        fireEvent.click(text);
      }).not.toThrow();
    });

    it('handles undefined onClear', () => {
      render(<FilterStrip {...defaultProps} filterCount={1} onClear={undefined} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      
      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(countContainer!);
      }).not.toThrow();
    });

    it('handles negative filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={-1} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('handles zero filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={0} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).not.toBeInTheDocument();
    });

    it('handles large filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={999} />);
      
      const countText = screen.getByText('999');
      expect(countText).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<FilterStrip {...defaultProps} filterCount={2} />);
      
      const container = document.querySelector('.fs');
      const innerContainer = document.querySelector('.fs__cn');
      const image = document.querySelector('.fs__cn__img');
      const text = screen.getByText('Filters');
      const countContainer = document.querySelector('.fs__cn__count');
      const countText = screen.getByText('2');
      const closeImage = document.querySelector('.fs__cn__count__close');
      
      expect(container).toContainElement(innerContainer);
      expect(innerContainer).toContainElement(image);
      expect(innerContainer).toContainElement(text);
      expect(innerContainer).toContainElement(countContainer);
      expect(countContainer).toContainElement(countText);
      expect(countContainer).toContainElement(closeImage);
    });

    it('renders styled-jsx styles', () => {
      render(<FilterStrip {...defaultProps} />);
      
      // Check if the component renders without errors
      const container = document.querySelector('.fs');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has clickable elements', () => {
      render(<FilterStrip {...defaultProps} filterCount={1} />);
      
      const image = document.querySelector('.fs__cn__img');
      const text = screen.getByText('Filters');
      const countContainer = document.querySelector('.fs__cn__count');
      
      expect(image).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(countContainer).toBeInTheDocument();
    });

    it('maintains proper semantic structure', () => {
      render(<FilterStrip {...defaultProps} filterCount={3} />);
      
      const container = document.querySelector('.fs');
      const innerContainer = document.querySelector('.fs__cn');
      
      expect(container).toContainElement(innerContainer);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty props object', () => {
      render(<FilterStrip />);
      
      const container = document.querySelector('.fs');
      expect(container).toBeInTheDocument();
    });

    it('handles props with only filterCount', () => {
      render(<FilterStrip filterCount={5} />);
      
      const container = document.querySelector('.fs');
      const countText = screen.getByText('5');
      
      expect(container).toBeInTheDocument();
      expect(countText).toBeInTheDocument();
    });

    it('handles props with only onStripClicked', () => {
      const mockOnStripClicked = jest.fn();
      render(<FilterStrip onStripClicked={mockOnStripClicked} />);
      
      const container = document.querySelector('.fs');
      const image = document.querySelector('.fs__cn__img');
      
      expect(container).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      
      fireEvent.click(image!);
      expect(mockOnStripClicked).toHaveBeenCalled();
    });

    it('handles props with only onClear', () => {
      const mockOnClear = jest.fn();
      render(<FilterStrip filterCount={2} onClear={mockOnClear} />);
      
      const container = document.querySelector('.fs');
      const countContainer = document.querySelector('.fs__cn__count');
      
      expect(container).toBeInTheDocument();
      expect(countContainer).toBeInTheDocument();
      
      fireEvent.click(countContainer!);
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('handles string filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount="3" as any />);
      
      const countText = screen.getByText('3');
      expect(countText).toBeInTheDocument();
    });

    it('handles boolean filterCount', () => {
      render(<FilterStrip {...defaultProps} filterCount={true as any} />);
      
      const countContainer = document.querySelector('.fs__cn__count');
      expect(countContainer).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<FilterStrip {...defaultProps} filterCount={1} />);
      
      const container = document.querySelector('.fs');
      const innerContainer = document.querySelector('.fs__cn');
      const image = document.querySelector('.fs__cn__img');
      const text = document.querySelector('.fs__cn__text');
      const countContainer = document.querySelector('.fs__cn__count');
      const countText = document.querySelector('.fs__cn__count__text');
      const closeImage = document.querySelector('.fs__cn__count__close');
      
      expect(container).toHaveClass('fs');
      expect(innerContainer).toHaveClass('fs__cn');
      expect(image).toHaveClass('fs__cn__img');
      expect(text).toHaveClass('fs__cn__text');
      expect(countContainer).toHaveClass('fs__cn__count');
      expect(countText).toHaveClass('fs__cn__count__text');
      expect(closeImage).toHaveClass('fs__cn__count__close');
    });
  });
});
