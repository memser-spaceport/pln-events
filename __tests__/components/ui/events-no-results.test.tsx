import { render, screen } from '@testing-library/react';
import EventsNoResults from '@/components/ui/events-no-results';

describe('EventsNoResults Component', () => {
  describe('Rendering', () => {
    it('renders with no results image', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toBeInTheDocument();
    });

    it('renders image with correct attributes', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toHaveAttribute('src', '/icons/no-results.svg');
      expect(image).toHaveAttribute('width', '300');
      expect(image).toHaveAttribute('height', '300');
    });

    it('renders with correct CSS class', () => {
      render(<EventsNoResults />);
      
      const container = screen.getByAltText('no-results').closest('div');
      expect(container).toHaveClass('noResult');
    });
  });

  describe('Structure', () => {
    it('has proper DOM structure', () => {
      render(<EventsNoResults />);
      
      const container = document.querySelector('.noResult');
      const image = screen.getByAltText('no-results');
      
      expect(container).toBeInTheDocument();
      expect(container).toContainElement(image);
    });

    it('renders as a div element', () => {
      render(<EventsNoResults />);
      
      const container = document.querySelector('.noResult');
      expect(container?.tagName).toBe('DIV');
    });
  });

  describe('Image Properties', () => {
    it('has correct alt text', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toBeInTheDocument();
    });

    it('has correct src path', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toHaveAttribute('src', '/icons/no-results.svg');
    });

    it('has correct dimensions', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toHaveAttribute('width', '300');
      expect(image).toHaveAttribute('height', '300');
    });

    it('is an img element', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image.tagName).toBe('IMG');
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for screen readers', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByAltText('no-results');
      expect(image).toBeInTheDocument();
    });

    it('is accessible to screen readers', () => {
      render(<EventsNoResults />);
      
      const image = screen.getByRole('img', { name: 'no-results' });
      expect(image).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS class to container', () => {
      render(<EventsNoResults />);
      
      const container = document.querySelector('.noResult');
      expect(container).toBeInTheDocument();
    });

    it('has proper styling structure', () => {
      render(<EventsNoResults />);
      
      const container = document.querySelector('.noResult');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders without props', () => {
      expect(() => render(<EventsNoResults />)).not.toThrow();
    });

    it('renders consistently on multiple renders', () => {
      const { rerender } = render(<EventsNoResults />);
      
      expect(screen.getByAltText('no-results')).toBeInTheDocument();
      
      rerender(<EventsNoResults />);
      
      expect(screen.getByAltText('no-results')).toBeInTheDocument();
    });

    it('renders without any external dependencies', () => {
      render(<EventsNoResults />);
      
      expect(screen.getByAltText('no-results')).toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    it('is a pure component with no state', () => {
      const { rerender } = render(<EventsNoResults />);
      
      const firstRender = screen.getByAltText('no-results');
      
      rerender(<EventsNoResults />);
      
      const secondRender = screen.getByAltText('no-results');
      
      expect(firstRender).toBe(secondRender);
    });

    it('renders the same content every time', () => {
      const { rerender } = render(<EventsNoResults />);
      
      const firstImage = screen.getByAltText('no-results');
      expect(firstImage).toHaveAttribute('src', '/icons/no-results.svg');
      
      rerender(<EventsNoResults />);
      
      const secondImage = screen.getByAltText('no-results');
      expect(secondImage).toHaveAttribute('src', '/icons/no-results.svg');
    });
  });

  describe('Integration', () => {
    it('can be rendered inside other components', () => {
      render(
        <div>
          <h1>No Events Found</h1>
          <EventsNoResults />
        </div>
      );
      
      expect(screen.getByText('No Events Found')).toBeInTheDocument();
      expect(screen.getByAltText('no-results')).toBeInTheDocument();
    });

    it('can be rendered multiple times', () => {
      render(
        <div>
          <EventsNoResults />
          <EventsNoResults />
        </div>
      );
      
      const images = screen.getAllByAltText('no-results');
      expect(images).toHaveLength(2);
    });
  });
});
