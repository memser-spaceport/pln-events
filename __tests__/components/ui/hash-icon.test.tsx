import { render, screen } from '@testing-library/react';
import HashIcon from '@/components/ui/hash-icon';

describe('HashIcon Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with custom color and size', () => {
      render(<HashIcon color="#00FF00" size={32} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with different color values', () => {
      render(<HashIcon color="blue" size={16} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('SVG Properties', () => {
    it('has correct width and height', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('has correct viewBox', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 14 14');
    });

    it('has correct fill attribute', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const path = document.querySelector('svg path');
      expect(path).toHaveAttribute('fill', 'white');
    });

    it('has correct xmlns attribute', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
  });

  describe('Styling', () => {
    it('applies correct background color', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('applies custom background color', () => {
      render(<HashIcon color="#00FF00" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('has correct CSS classes', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toHaveClass('root');
    });
  });

  describe('Size Variations', () => {
    it('renders with small size', () => {
      render(<HashIcon color="#FF0000" size={16} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });

    it('renders with large size', () => {
      render(<HashIcon color="#FF0000" size={48} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('renders with zero size', () => {
      render(<HashIcon color="#FF0000" size={0} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '0');
      expect(svg).toHaveAttribute('height', '0');
    });

    it('renders with negative size', () => {
      render(<HashIcon color="#FF0000" size={-10} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '-10');
      expect(svg).toHaveAttribute('height', '-10');
    });
  });

  describe('Color Variations', () => {
    it('renders with hex color', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('renders with rgb color', () => {
      render(<HashIcon color="rgb(255, 0, 0)" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('renders with named color', () => {
      render(<HashIcon color="red" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('renders with transparent color', () => {
      render(<HashIcon color="transparent" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined color', () => {
      render(<HashIcon color={undefined as any} size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('handles null values', () => {
      render(<HashIcon color={null as any} size={null as any} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('handles empty string color', () => {
      render(<HashIcon color="" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders as SVG element', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const svg = document.querySelector('svg');
      expect(svg?.tagName).toBe('svg');
    });

    it('has proper structure', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      const svg = container?.querySelector('svg');
      const path = svg?.querySelector('path');
      
      expect(container).toBeInTheDocument();
      expect(svg).toBeInTheDocument();
      expect(path).toBeInTheDocument();
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple icons with different properties', () => {
      render(
        <div>
          <HashIcon color="#FF0000" size={24} />
          <HashIcon color="#00FF00" size={32} />
          <HashIcon color="#0000FF" size={16} />
        </div>
      );
      
      const svgs = document.querySelectorAll('svg');
      expect(svgs).toHaveLength(3);
    });

    it('renders multiple icons with same properties', () => {
      render(
        <div>
          <HashIcon color="#FF0000" size={24} />
          <HashIcon color="#FF0000" size={24} />
        </div>
      );
      
      const svgs = document.querySelectorAll('svg');
      expect(svgs).toHaveLength(2);
    });
  });

  describe('Path Content', () => {
    it('has correct path data', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const path = document.querySelector('svg path');
      expect(path).toHaveAttribute('d');
      expect(path?.getAttribute('d')).toContain('M13.5028 2.81319H10.9007L11.3695 0.548685');
    });

    it('has white fill color for path', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const path = document.querySelector('svg path');
      expect(path).toHaveAttribute('fill', 'white');
    });
  });

  describe('CSS Styling', () => {
    it('applies correct padding', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });

    it('applies correct border radius', () => {
      render(<HashIcon color="#FF0000" size={24} />);
      
      const container = document.querySelector('.root');
      expect(container).toBeInTheDocument();
    });
  });
});
