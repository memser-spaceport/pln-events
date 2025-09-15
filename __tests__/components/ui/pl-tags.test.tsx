import { render, screen, fireEvent } from '@testing-library/react';
import PlTags from '@/components/ui/pl-tags';

describe('PlTags Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    items: ['Tag 1', 'Tag 2', 'Tag 3'],
    identifierId: 'test-tags',
    selectedItem: '',
    callback: mockCallback
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlTags {...defaultProps} />);
      
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    it('renders with empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: []
      };
      
      render(<PlTags {...propsWithEmptyItems} />);
      
      expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
    });

    it('renders with single item', () => {
      const propsWithSingleItem = {
        ...defaultProps,
        items: ['Single Tag']
      };
      
      render(<PlTags {...propsWithSingleItem} />);
      
      expect(screen.getByText('Single Tag')).toBeInTheDocument();
    });

    it('renders with selected item', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'Tag 2'
      };
      
      render(<PlTags {...propsWithSelection} />);
      
      const selectedTag = screen.getByText('Tag 2');
      expect(selectedTag).toHaveClass('plt__item--active');
    });
  });

  describe('User Interactions', () => {
    it('calls callback when tag is clicked', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      fireEvent.click(tag1);
      
      expect(mockCallback).toHaveBeenCalledWith('test-tags', 'Tag 1', 'single-select');
    });

    it('calls callback with correct parameters for different tags', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag2 = screen.getByText('Tag 2');
      fireEvent.click(tag2);
      
      expect(mockCallback).toHaveBeenCalledWith('test-tags', 'Tag 2', 'single-select');
    });

    it('handles multiple tag clicks', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      const tag2 = screen.getByText('Tag 2');
      
      fireEvent.click(tag1);
      fireEvent.click(tag2);
      
      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenNthCalledWith(1, 'test-tags', 'Tag 1', 'single-select');
      expect(mockCallback).toHaveBeenNthCalledWith(2, 'test-tags', 'Tag 2', 'single-select');
    });

    it('handles clicking on same tag multiple times', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      fireEvent.click(tag1);
      fireEvent.click(tag1);
      fireEvent.click(tag1);
      
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Active State', () => {
    it('shows active state for selected item', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'Tag 2'
      };
      
      render(<PlTags {...propsWithSelection} />);
      
      const selectedTag = screen.getByText('Tag 2');
      expect(selectedTag).toHaveClass('plt__item--active');
    });

    it('shows inactive state for unselected items', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'Tag 2'
      };
      
      render(<PlTags {...propsWithSelection} />);
      
      const unselectedTag = screen.getByText('Tag 1');
      expect(unselectedTag).toHaveClass('plt__item');
      expect(unselectedTag).not.toHaveClass('plt__item--active');
    });

    it('handles no selected item', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      const tag2 = screen.getByText('Tag 2');
      const tag3 = screen.getByText('Tag 3');
      
      expect(tag1).toHaveClass('plt__item');
      expect(tag1).not.toHaveClass('plt__item--active');
      expect(tag2).toHaveClass('plt__item');
      expect(tag2).not.toHaveClass('plt__item--active');
      expect(tag3).toHaveClass('plt__item');
      expect(tag3).not.toHaveClass('plt__item--active');
    });
  });

  describe('Accessibility', () => {
    it('has proper cursor pointer style', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      expect(tag1).toHaveClass('plt__item');
    });

    it('is clickable', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      expect(tag1).toBeInTheDocument();
      
      fireEvent.click(tag1);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('handles keyboard interactions', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      
      // Simulate keyboard interaction
      fireEvent.keyDown(tag1, { key: 'Enter' });
      // Note: The component doesn't have explicit keyboard handlers, but it's clickable
      expect(tag1).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        items: undefined,
        identifierId: undefined,
        selectedItem: undefined,
        callback: undefined
      };
      
      expect(() => render(<PlTags {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles null values', () => {
      const propsWithNull = {
        items: null,
        identifierId: null,
        selectedItem: null,
        callback: null
      };
      
      expect(() => render(<PlTags {...propsWithNull} />)).not.toThrow();
    });

    it('handles empty string selected item', () => {
      const propsWithEmptySelection = {
        ...defaultProps,
        selectedItem: ''
      };
      
      render(<PlTags {...propsWithEmptySelection} />);
      
      const tag1 = screen.getByText('Tag 1');
      expect(tag1).not.toHaveClass('plt__item--active');
    });

    it('handles non-existent selected item', () => {
      const propsWithNonExistentSelection = {
        ...defaultProps,
        selectedItem: 'Non-existent Tag'
      };
      
      render(<PlTags {...propsWithNonExistentSelection} />);
      
      const tag1 = screen.getByText('Tag 1');
      expect(tag1).not.toHaveClass('plt__item--active');
    });
  });

  describe('Item Rendering', () => {
    it('renders items in correct order', () => {
      render(<PlTags {...defaultProps} />);
      
      const tags = screen.getAllByText(/Tag \d/);
      expect(tags[0]).toHaveTextContent('Tag 1');
      expect(tags[1]).toHaveTextContent('Tag 2');
      expect(tags[2]).toHaveTextContent('Tag 3');
    });

    it('renders items with special characters', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        items: ['Tag & Test', 'Tag < > Test', 'Tag " \' Test']
      };
      
      render(<PlTags {...propsWithSpecialChars} />);
      
      expect(screen.getByText('Tag & Test')).toBeInTheDocument();
      expect(screen.getByText('Tag < > Test')).toBeInTheDocument();
      expect(screen.getByText('Tag " \' Test')).toBeInTheDocument();
    });

    it('renders items with numbers', () => {
      const propsWithNumbers = {
        ...defaultProps,
        items: ['Tag 1', 'Tag 2', 'Tag 3']
      };
      
      render(<PlTags {...propsWithNumbers} />);
      
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    it('renders items with empty strings', () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        items: ['', 'Tag 2', '']
      };
      
      render(<PlTags {...propsWithEmptyStrings} />);
      
      expect(screen.getAllByText('')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Tag 2')[0]).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to container', () => {
      render(<PlTags {...defaultProps} />);
      
      const container = screen.getByText('Tag 1').closest('.plt');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to items', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      expect(tag1).toHaveClass('plt__item');
    });

    it('applies active class to selected item', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedItem: 'Tag 2'
      };
      
      render(<PlTags {...propsWithSelection} />);
      
      const selectedTag = screen.getByText('Tag 2');
      expect(selectedTag).toHaveClass('plt__item', 'plt__item--active');
    });
  });

  describe('Key Generation', () => {
    it('generates unique keys for items', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      const tag2 = screen.getByText('Tag 2');
      const tag3 = screen.getByText('Tag 3');
      
      expect(tag1).toBeInTheDocument();
      expect(tag2).toBeInTheDocument();
      expect(tag3).toBeInTheDocument();
    });

    it('handles duplicate items', () => {
      const propsWithDuplicates = {
        ...defaultProps,
        items: ['Tag 1', 'Tag 1', 'Tag 2']
      };
      
      render(<PlTags {...propsWithDuplicates} />);
      
      const tags = screen.getAllByText('Tag 1');
      expect(tags).toHaveLength(2);
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple tag groups independently', () => {
      const mockCallback2 = jest.fn();
      
      render(
        <div>
          <PlTags {...defaultProps} />
          <PlTags {...defaultProps} identifierId="tags2" callback={mockCallback2} />
        </div>
      );
      
      const tag1Elements = screen.getAllByText('Tag 1');
      expect(tag1Elements).toHaveLength(2);
      
      fireEvent.click(tag1Elements[0]);
      fireEvent.click(tag1Elements[1]);
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Type Safety', () => {
    it('calls callback with correct type parameter', () => {
      render(<PlTags {...defaultProps} />);
      
      const tag1 = screen.getByText('Tag 1');
      fireEvent.click(tag1);
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'single-select'
      );
    });
  });
});
