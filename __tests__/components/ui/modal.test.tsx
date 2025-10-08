import { render, screen } from '@testing-library/react';
import Modal from '@/components/ui/modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(
        <Modal>
          <div data-testid="modal-content">Modal Content</div>
        </Modal>
      );
      
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('renders with default className', () => {
      render(
        <Modal>
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal');
    });

    it('renders with custom className', () => {
      render(
        <Modal className="custom-modal">
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal', 'custom-modal');
    });

    it('renders with multiple children', () => {
      render(
        <Modal>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <span data-testid="child3">Child 3</span>
        </Modal>
      );
      
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('renders with complex nested children', () => {
      render(
        <Modal>
          <div className="modal-header">
            <h1>Modal Title</h1>
          </div>
          <div className="modal-body">
            <p>Modal body content</p>
            <button>Close</button>
          </div>
        </Modal>
      );
      
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal body content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles undefined className gracefully', () => {
      render(
        <Modal className={undefined}>
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal');
    });

    it('handles empty className', () => {
      render(
        <Modal className="">
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal');
    });

    it('handles null children', () => {
      render(<Modal>{null}</Modal>);
      
      const modal = document.querySelector('.modal');
      expect(modal).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<Modal>{undefined}</Modal>);
      
      const modal = document.querySelector('.modal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies base modal class', () => {
      render(
        <Modal>
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal');
    });

    it('applies custom class alongside base class', () => {
      render(
        <Modal className="detail-view-modal">
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal', 'detail-view-modal');
    });

    it('handles multiple custom classes', () => {
      render(
        <Modal className="custom-modal another-class">
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = screen.getByText('Modal Content').closest('.modal');
      expect(modal).toHaveClass('modal', 'custom-modal', 'another-class');
    });
  });

  describe('Structure', () => {
    it('creates proper DOM structure', () => {
      render(
        <Modal>
          <div data-testid="content">Modal Content</div>
        </Modal>
      );
      
      const modal = document.querySelector('.modal');
      const content = screen.getByTestId('content');
      
      expect(modal).toBeInTheDocument();
      expect(modal).toContainElement(content);
    });

    it('renders as a div element', () => {
      render(
        <Modal>
          <div>Modal Content</div>
        </Modal>
      );
      
      const modal = document.querySelector('.modal');
      expect(modal?.tagName).toBe('DIV');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children array', () => {
      render(<Modal>{[]}</Modal>);
      
      const modal = document.querySelector('.modal');
      expect(modal).toBeInTheDocument();
    });

    it('handles boolean children', () => {
      render(
        <Modal>
          {true && <div>Conditional Content</div>}
          {false && <div>Hidden Content</div>}
        </Modal>
      );
      
      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('handles number children', () => {
      render(<Modal>{123}</Modal>);
      
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('handles string children', () => {
      render(<Modal>Simple Text</Modal>);
      
      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders without accessibility violations', () => {
      render(
        <Modal>
          <div role="dialog" aria-modal="true">
            Modal Content
          </div>
        </Modal>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('preserves children accessibility attributes', () => {
      render(
        <Modal>
          <button aria-label="Close modal">×</button>
        </Modal>
      );
      
      const button = screen.getByRole('button', { name: 'Close modal' });
      expect(button).toBeInTheDocument();
    });
  });
});
