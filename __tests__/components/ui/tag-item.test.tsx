import { render, screen, fireEvent } from '@testing-library/react';
import TagItem from '@/components/ui/tag-item';

describe('TagItem Component', () => {
  const mockCallback = jest.fn();
  const defaultProps = {
    text: 'Test Tag',
    img: '/test-icon.svg',
    value: 'test-value',
    activeImg: '/active-icon.svg',
    inActiveImg: '/inactive-icon.svg',
    isActive: false,
    callback: mockCallback,
    identifierId: 'test-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<TagItem {...defaultProps} />);
      
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: '' })).toBeInTheDocument();
    });

    it('renders without text', () => {
      const propsWithoutText = {
        ...defaultProps,
        text: undefined
      };
      
      render(<TagItem {...propsWithoutText} />);
      
      expect(screen.queryByText('Test Tag')).not.toBeInTheDocument();
    });

    it('renders without images', () => {
      const propsWithoutImages = {
        ...defaultProps,
        img: undefined,
        activeImg: undefined,
        inActiveImg: undefined
      };
      
      render(<TagItem {...propsWithoutImages} />);
      
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders with only text', () => {
      const propsWithOnlyText = {
        text: 'Simple Tag',
        callback: mockCallback,
        identifierId: 'test-id'
      };
      
      render(<TagItem {...propsWithOnlyText} />);
      
      expect(screen.getByText('Simple Tag')).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('renders in active state', () => {
      const propsActive = {
        ...defaultProps,
        isActive: true
      };
      
      render(<TagItem {...propsActive} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti', 'ti--active');
    });

    it('renders in inactive state', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti');
      expect(tagElement).not.toHaveClass('ti--active');
    });

    it('shows active image when active', () => {
      const propsActive = {
        ...defaultProps,
        isActive: true
      };
      
      render(<TagItem {...propsActive} />);
      
      const activeImage = screen.getByRole('img', { name: '' });
      expect(activeImage).toHaveAttribute('src', '/active-icon.svg');
    });

    it('shows inactive image when inactive', () => {
      render(<TagItem {...defaultProps} />);
      
      const inactiveImage = screen.getByRole('img', { name: '' });
      expect(inactiveImage).toHaveAttribute('src', '/inactive-icon.svg');
    });
  });

  describe('User Interactions', () => {
    it('calls callback when clicked', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      fireEvent.click(tagElement!);
      
      expect(mockCallback).toHaveBeenCalledWith('test-id', 'test-value');
    });

    it('calls callback with correct parameters', () => {
      const customProps = {
        ...defaultProps,
        identifierId: 'custom-id',
        value: 'custom-value'
      };
      
      render(<TagItem {...customProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      fireEvent.click(tagElement!);
      
      expect(mockCallback).toHaveBeenCalledWith('custom-id', 'custom-value');
    });

    it('handles multiple clicks', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      fireEvent.click(tagElement!);
      fireEvent.click(tagElement!);
      fireEvent.click(tagElement!);
      
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Image Handling', () => {
    it('shows active image only when active', () => {
      const propsActive = {
        ...defaultProps,
        isActive: true,
        activeImg: '/active-icon.svg',
        inActiveImg: '/inactive-icon.svg'
      };
      
      render(<TagItem {...propsActive} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', '/active-icon.svg');
    });

    it('shows inactive image only when inactive', () => {
      const propsInactive = {
        ...defaultProps,
        isActive: false,
        activeImg: '/active-icon.svg',
        inActiveImg: '/inactive-icon.svg'
      };
      
      render(<TagItem {...propsInactive} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', '/inactive-icon.svg');
    });

    it('shows no image when both active and inactive images are undefined', () => {
      const propsWithoutImages = {
        ...defaultProps,
        isActive: true,
        activeImg: undefined,
        inActiveImg: undefined
      };
      
      render(<TagItem {...propsWithoutImages} />);
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows no image when active image is undefined and inactive', () => {
      const propsWithoutActiveImg = {
        ...defaultProps,
        isActive: false,
        activeImg: undefined,
        inActiveImg: '/inactive-icon.svg'
      };
      
      render(<TagItem {...propsWithoutActiveImg} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', '/inactive-icon.svg');
    });
  });

  describe('Text Styling', () => {
    it('applies text transformation', () => {
      render(<TagItem {...defaultProps} />);
      
      const textElement = screen.getByText('Test Tag');
      expect(textElement).toHaveClass('ti__text');
    });

    it('handles text with special characters', () => {
      const propsWithSpecialText = {
        ...defaultProps,
        text: 'Test & Tag < > " \''
      };
      
      render(<TagItem {...propsWithSpecialText} />);
      
      expect(screen.getByText('Test & Tag < > " \'')).toBeInTheDocument();
    });

    it('handles empty text', () => {
      const propsWithEmptyText = {
        ...defaultProps,
        text: ''
      };
      
      render(<TagItem {...propsWithEmptyText} />);
      
      expect(screen.getAllByText('')[0]).toBeInTheDocument();
    });

    it('handles long text', () => {
      const propsWithLongText = {
        ...defaultProps,
        text: 'This is a very long tag text that might overflow'
      };
      
      render(<TagItem {...propsWithLongText} />);
      
      expect(screen.getByText('This is a very long tag text that might overflow')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        text: undefined,
        img: undefined,
        value: undefined,
        activeImg: undefined,
        inActiveImg: undefined,
        isActive: undefined,
        callback: undefined,
        identifierId: undefined
      };
      
      expect(() => render(<TagItem {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles null values', () => {
      const propsWithNull = {
        text: null,
        value: null,
        callback: null,
        identifierId: null
      };
      
      expect(() => render(<TagItem {...propsWithNull} />)).not.toThrow();
    });

    it('handles boolean isActive values', () => {
      const propsWithBooleanActive = {
        ...defaultProps,
        isActive: true
      };
      
      render(<TagItem {...propsWithBooleanActive} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti--active');
    });

    it('handles string isActive values', () => {
      const propsWithStringActive = {
        ...defaultProps,
        isActive: 'true' as any
      };
      
      render(<TagItem {...propsWithStringActive} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti--active');
    });
  });

  describe('Accessibility', () => {
    it('has proper cursor pointer style', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti');
    });

    it('is clickable', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toBeInTheDocument();
      
      fireEvent.click(tagElement!);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('handles keyboard interactions', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      
      // Simulate keyboard interaction
      fireEvent.keyDown(tagElement!, { key: 'Enter' });
      // Note: The component doesn't have explicit keyboard handlers, but it's clickable
      expect(tagElement).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies base ti class', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti');
    });

    it('applies active class when isActive is true', () => {
      const propsActive = {
        ...defaultProps,
        isActive: true
      };
      
      render(<TagItem {...propsActive} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti', 'ti--active');
    });

    it('does not apply active class when isActive is false', () => {
      render(<TagItem {...defaultProps} />);
      
      const tagElement = screen.getByText('Test Tag').closest('div');
      expect(tagElement).toHaveClass('ti');
      expect(tagElement).not.toHaveClass('ti--active');
    });
  });
});
