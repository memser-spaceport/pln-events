import { render, screen } from '@testing-library/react';
import HostLogo, { HOST_LOGO_COLOR_CODES } from '@/components/ui/host-logo';

describe('HostLogo Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<HostLogo firstLetter="A" />);
      
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
      render(<HostLogo firstLetter="B" height="32px" width="32px" />);
      
      const logo = screen.getByText('B');
      expect(logo).toBeInTheDocument();
    });

    it('renders with custom font size', () => {
      render(<HostLogo firstLetter="C" fontSize="18px" />);
      
      const logo = screen.getByText('C');
      expect(logo).toBeInTheDocument();
    });

    it('renders with all custom props', () => {
      render(<HostLogo firstLetter="D" height="40px" width="40px" fontSize="20px" />);
      
      const logo = screen.getByText('D');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Color Assignment', () => {
    it('assigns correct color for letter A', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863
    });

    it('assigns correct color for letter B', () => {
      render(<HostLogo firstLetter="B" />);
      
      const logo = screen.getByText('B');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863 (same segment as A)
    });

    it('assigns correct color for letter C', () => {
      render(<HostLogo firstLetter="C" />);
      
      const logo = screen.getByText('C');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863 (same segment as A)
    });

    it('assigns correct color for letter D', () => {
      render(<HostLogo firstLetter="D" />);
      
      const logo = screen.getByText('D');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863 (same segment as A)
    });

    it('assigns correct color for letter E', () => {
      render(<HostLogo firstLetter="E" />);
      
      const logo = screen.getByText('E');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(119, 116, 255)'); // #7774FF (second segment)
    });

    it('assigns correct color for letter F', () => {
      render(<HostLogo firstLetter="F" />);
      
      const logo = screen.getByText('F');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(119, 116, 255)'); // #7774FF (same segment as E)
    });

    it('assigns correct color for letter G', () => {
      render(<HostLogo firstLetter="G" />);
      
      const logo = screen.getByText('G');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(119, 116, 255)'); // #7774FF (same segment as E)
    });

    it('assigns correct color for letter H', () => {
      render(<HostLogo firstLetter="H" />);
      
      const logo = screen.getByText('H');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(119, 116, 255)'); // #7774FF (same segment as E)
    });

    it('wraps around for letter Z', () => {
      render(<HostLogo firstLetter="Z" />);
      
      const logo = screen.getByText('Z');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(127, 194, 16)'); // #7FC210 (last color)
    });
  });

  describe('Case Handling', () => {
    it('handles lowercase letters', () => {
      render(<HostLogo firstLetter="a" />);
      
      const logo = screen.getByText('a');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863 (same as uppercase A)
    });

    it('handles mixed case letters', () => {
      render(<HostLogo firstLetter="AbC" />);
      
      const logo = screen.getByText('AbC');
      const style = window.getComputedStyle(logo);
      expect(style.backgroundColor).toBe('rgb(255, 136, 99)'); // #FF8863 (uses first character)
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string', () => {
      render(<HostLogo firstLetter="" />);
      
      const logo = document.querySelector('.logo');
      expect(logo).toBeInTheDocument();
      expect(logo?.textContent).toBe('');
    });

    it('handles whitespace', () => {
      render(<HostLogo firstLetter=" " />);
      
      const logo = document.querySelector('.logo');
      expect(logo).toBeInTheDocument();
      expect(logo?.textContent).toBe(' ');
    });

    it('handles special characters', () => {
      render(<HostLogo firstLetter="@" />);
      
      const logo = screen.getByText('@');
      expect(logo).toBeInTheDocument();
    });

    it('handles numbers', () => {
      render(<HostLogo firstLetter="1" />);
      
      const logo = screen.getByText('1');
      expect(logo).toBeInTheDocument();
    });

    it('handles undefined firstLetter', () => {
      expect(() => render(<HostLogo firstLetter={undefined as any} />)).toThrow();
    });

    it('handles null firstLetter', () => {
      expect(() => render(<HostLogo firstLetter={null as any} />)).toThrow();
    });
  });

  describe('Default Values', () => {
    it('uses default height when not provided', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.height).toBe('24px');
    });

    it('uses default width when not provided', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.width).toBe('24px');
    });

    it('uses default font size when not provided', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.fontSize).toBe('14px');
    });

    it('uses provided height over default', () => {
      render(<HostLogo firstLetter="A" height="32px" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.height).toBe('32px');
    });

    it('uses provided width over default', () => {
      render(<HostLogo firstLetter="A" width="32px" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.width).toBe('32px');
    });

    it('uses provided font size over default', () => {
      render(<HostLogo firstLetter="A" fontSize="18px" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.fontSize).toBe('18px');
    });
  });

  describe('Color Codes Constant', () => {
    it('has correct number of color codes', () => {
      expect(HOST_LOGO_COLOR_CODES).toHaveLength(7);
    });

    it('has correct color codes', () => {
      expect(HOST_LOGO_COLOR_CODES).toEqual([
        "#FF8863", "#7774FF", "#FF6CC4", "#E26CFF", "#FFB647", "#35B6FF", "#7FC210"
      ]);
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      expect(logo).toHaveClass('logo');
    });

    it('has white text color', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.color).toBe('rgb(255, 255, 255)');
    });

    it('has flex display', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.display).toBe('flex');
    });

    it('has center alignment', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      const style = window.getComputedStyle(logo);
      expect(style.justifyContent).toBe('center');
      expect(style.alignItems).toBe('center');
    });
  });

  describe('Accessibility', () => {
    it('renders as a div element', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      expect(logo.tagName).toBe('DIV');
    });

    it('is visible to screen readers', () => {
      render(<HostLogo firstLetter="A" />);
      
      const logo = screen.getByText('A');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Multiple Instances', () => {
    it('renders multiple logos with different letters', () => {
      render(
        <div>
          <HostLogo firstLetter="A" />
          <HostLogo firstLetter="B" />
          <HostLogo firstLetter="C" />
        </div>
      );
      
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('assigns different colors to different letters', () => {
      render(
        <div>
          <HostLogo firstLetter="A" />
          <HostLogo firstLetter="E" />
        </div>
      );
      
      const logoA = screen.getByText('A');
      const logoE = screen.getByText('E');
      
      const styleA = window.getComputedStyle(logoA);
      const styleE = window.getComputedStyle(logoE);
      
      expect(styleA.backgroundColor).not.toBe(styleE.backgroundColor);
    });
  });
});
