import { render, screen } from '@testing-library/react';
import StyledJsxRegistry from '@/app/registry';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useServerInsertedHTML: jest.fn()
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  StyleRegistry: ({ children, registry }: { children: React.ReactNode; registry: any }) => (
    <div data-testid="style-registry" data-registry={registry ? 'mocked' : 'null'}>
      {children}
    </div>
  ),
  createStyleRegistry: jest.fn(() => ({
    styles: jest.fn(() => 'mocked-styles'),
    flush: jest.fn()
  }))
}));

// Mock AppHeader component
jest.mock('@/components/core/app-header', () => {
  return function MockAppHeader() {
    return <div data-testid="app-header">Mocked App Header</div>;
  };
});

describe('StyledJsxRegistry Component', () => {
  const mockUseServerInsertedHTML = require('next/navigation').useServerInsertedHTML;
  const mockCreateStyleRegistry = require('styled-jsx').createStyleRegistry;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseServerInsertedHTML.mockImplementation((callback: () => React.ReactNode) => {
      // Simulate server-side rendering behavior
      const result = callback();
      return result;
    });
  });

  describe('Rendering', () => {
    it('renders children within StyleRegistry', () => {
      const testChildren = <div data-testid="test-child">Test Content</div>;
      
      render(<StyledJsxRegistry>{testChildren}</StyledJsxRegistry>);
      
      expect(screen.getByTestId('style-registry')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      const testChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </>
      );
      
      render(<StyledJsxRegistry>{testChildren}</StyledJsxRegistry>);
      
      expect(screen.getByTestId('style-registry')).toBeInTheDocument();
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('renders with no children', () => {
      render(<StyledJsxRegistry>{null}</StyledJsxRegistry>);
      
      expect(screen.getByTestId('style-registry')).toBeInTheDocument();
    });

    it('renders with empty children', () => {
      render(<StyledJsxRegistry>{undefined}</StyledJsxRegistry>);
      
      expect(screen.getByTestId('style-registry')).toBeInTheDocument();
    });
  });

  describe('Style Registry Integration', () => {
    it('creates a style registry on mount', () => {
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      expect(mockCreateStyleRegistry).toHaveBeenCalledTimes(1);
    });

    it('passes the created registry to StyleRegistry component', () => {
      const mockRegistry = { styles: jest.fn(), flush: jest.fn() };
      mockCreateStyleRegistry.mockReturnValue(mockRegistry);
      
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      const styleRegistryElement = screen.getByTestId('style-registry');
      expect(styleRegistryElement).toHaveAttribute('data-registry', 'mocked');
    });

    it('maintains the same registry instance across re-renders', () => {
      const { rerender } = render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      const firstCallCount = mockCreateStyleRegistry.mock.calls.length;
      
      rerender(<StyledJsxRegistry><div>Test 2</div></StyledJsxRegistry>);
      
      // Should not create a new registry on re-render
      expect(mockCreateStyleRegistry).toHaveBeenCalledTimes(firstCallCount);
    });
  });

  describe('Server-Side Rendering', () => {
    it('calls useServerInsertedHTML with a function', () => {
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      expect(mockUseServerInsertedHTML).toHaveBeenCalledWith(expect.any(Function));
    });

    it('server inserted HTML function returns styles', () => {
      const mockRegistry = { 
        styles: jest.fn(() => 'mocked-styles'),
        flush: jest.fn()
      };
      mockCreateStyleRegistry.mockReturnValue(mockRegistry);
      
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      // Get the callback function passed to useServerInsertedHTML
      const callback = mockUseServerInsertedHTML.mock.calls[0][0];
      const result = callback();
      
      expect(mockRegistry.styles).toHaveBeenCalled();
      expect(mockRegistry.flush).toHaveBeenCalled();
      // The function returns a React Fragment containing the styles
      expect(result).toEqual(expect.objectContaining({
        type: Symbol.for('react.fragment'),
        props: { children: 'mocked-styles' }
      }));
    });

    it('handles multiple server inserted HTML calls', () => {
      const mockRegistry = { 
        styles: jest.fn(() => 'mocked-styles'),
        flush: jest.fn()
      };
      mockCreateStyleRegistry.mockReturnValue(mockRegistry);
      
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      const callback = mockUseServerInsertedHTML.mock.calls[0][0];
      
      // Reset mock call counts before testing multiple calls
      mockRegistry.styles.mockClear();
      mockRegistry.flush.mockClear();
      
      // Call the callback multiple times
      callback();
      callback();
      
      expect(mockRegistry.styles).toHaveBeenCalledTimes(2);
      expect(mockRegistry.flush).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Structure', () => {
    it('renders as a client component', () => {
      // The component should render without errors, indicating it's properly set up as a client component
      expect(() => {
        render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('maintains proper component hierarchy', () => {
      render(
        <StyledJsxRegistry>
          <div data-testid="parent">
            <span data-testid="child">Nested Content</span>
          </div>
        </StyledJsxRegistry>
      );
      
      const styleRegistry = screen.getByTestId('style-registry');
      const parent = screen.getByTestId('parent');
      const child = screen.getByTestId('child');
      
      expect(styleRegistry).toContainElement(parent);
      expect(parent).toContainElement(child);
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      expect(() => {
        render(<StyledJsxRegistry>{undefined}</StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('handles null children gracefully', () => {
      expect(() => {
        render(<StyledJsxRegistry>{null}</StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('handles empty string children', () => {
      expect(() => {
        render(<StyledJsxRegistry>{''}</StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('handles boolean children', () => {
      expect(() => {
        render(<StyledJsxRegistry>{true}</StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('handles number children', () => {
      expect(() => {
        render(<StyledJsxRegistry>{42}</StyledJsxRegistry>);
      }).not.toThrow();
    });
  });

  describe('Props Validation', () => {
    it('accepts children prop', () => {
      const testChildren = <div data-testid="test">Test</div>;
      
      expect(() => {
        render(<StyledJsxRegistry>{testChildren}</StyledJsxRegistry>);
      }).not.toThrow();
    });

    it('requires children prop', () => {
      // TypeScript would catch this, but we test runtime behavior
      expect(() => {
        render(<StyledJsxRegistry children={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Integration with Styled-JSX', () => {
    it('integrates with styled-jsx StyleRegistry', () => {
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      expect(screen.getByTestId('style-registry')).toBeInTheDocument();
    });

    it('passes registry to StyleRegistry component', () => {
      const mockRegistry = { styles: jest.fn(), flush: jest.fn() };
      mockCreateStyleRegistry.mockReturnValue(mockRegistry);
      
      render(<StyledJsxRegistry><div>Test</div></StyledJsxRegistry>);
      
      // Verify that the registry was created and passed to StyleRegistry
      expect(mockCreateStyleRegistry).toHaveBeenCalled();
    });
  });
});
