import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LegendsModal from '@/components/page/event-detail/legends-modal';
import { CUSTOM_EVENTS, CALENDAR_LEGENDS } from '@/utils/constants';

// Mock the useEscapeClicked hook
jest.mock('@/hooks/use-escape-clicked', () => {
  return jest.fn();
});

// Mock the Modal component
jest.mock('@/components/ui/modal', () => {
  return function MockModal({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div data-testid="modal" className={`modal ${className || ''}`}>
        {children}
      </div>
    );
  };
});

// Get the mocked function
const mockUseEscapeClicked = require('@/hooks/use-escape-clicked') as jest.MockedFunction<any>;

describe('LegendsModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('renders nothing when modal is closed', () => {
      const { container } = render(<LegendsModal />);
      expect(container.firstChild).toBeNull();
    });

    it('does not render modal content when isOpen is false', () => {
      render(<LegendsModal />);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Legend')).not.toBeInTheDocument();
    });
  });

  describe('Modal Opening', () => {
    it('opens modal when SHOW_LEGEND_MODAL event is dispatched', async () => {
      render(<LegendsModal />);

      // Initially modal should be closed
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

      // Dispatch the custom event to open modal
      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Legend')).toBeInTheDocument();
      });
    });

    it('opens modal with correct event detail structure', async () => {
      render(<LegendsModal />);

      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Content', () => {
    beforeEach(async () => {
      render(<LegendsModal />);
      
      // Open the modal
      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('renders modal header with correct content', () => {
      const headerImg = document.querySelector('.lm__head__img');
      const headerText = screen.getByText('Legend');

      expect(headerImg).toHaveAttribute('src', '/icons/info-blue.svg');
      expect(headerImg).toHaveClass('lm__head__img');
      expect(headerText).toHaveClass('lm__head__text');
    });

    it('renders all calendar legends', () => {
      CALENDAR_LEGENDS.forEach((legend, index) => {
        const legendItem = screen.getByText(legend.name);
        const legendImgs = screen.getAllByRole('img');
        const legendImg = legendImgs.find(img => img.getAttribute('src') === legend.img);

        expect(legendItem).toBeInTheDocument();
        expect(legendItem).toHaveClass('lm__body__item__text');
        expect(legendImg).toHaveAttribute('src', legend.img);
        expect(legendImg).toHaveAttribute('width', '20');
        expect(legendImg).toHaveAttribute('height', '20');
        expect(legendImg).toHaveClass('lm__body__item__img');
      });
    });

    it('renders correct number of legend items', () => {
      const legendItems = document.querySelectorAll('.lm__body__item');
      expect(legendItems).toHaveLength(CALENDAR_LEGENDS.length);
    });

    it('renders each legend item with correct structure', () => {
      const legendItems = document.querySelectorAll('.lm__body__item');
      
      legendItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const text = item.querySelector('p');
        
        expect(img).toHaveAttribute('src', CALENDAR_LEGENDS[index].img);
        expect(img).toHaveAttribute('width', '20');
        expect(img).toHaveAttribute('height', '20');
        expect(text).toHaveTextContent(CALENDAR_LEGENDS[index].name);
        expect(text).toHaveClass('lm__body__item__text');
      });
    });
  });

  describe('Modal Closing', () => {
    beforeEach(async () => {
      render(<LegendsModal />);
      
      // Open the modal first
      const openEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('closes modal when close button is clicked', async () => {
      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal when escape key is pressed', async () => {
      // Get the callback that was passed to useEscapeClicked
      const escapeCallback = mockUseEscapeClicked.mock.calls[0][0];
      
      // Call the escape callback directly
      escapeCallback();

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal when SHOW_LEGEND_MODAL event with isOpen false is dispatched', async () => {
      const closeEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: false }
      });
      document.dispatchEvent(closeEvent);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Event Listeners', () => {
    it('adds event listener for SHOW_LEGEND_MODAL on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      render(<LegendsModal />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        CUSTOM_EVENTS.SHOW_LEGEND_MODAL,
        expect.any(Function)
      );
    });

    it('removes event listener for SHOW_LEGEND_MODAL on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      const { unmount } = render(<LegendsModal />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        CUSTOM_EVENTS.SHOW_LEGEND_MODAL,
        expect.any(Function)
      );
    });

    it('handles multiple open/close events correctly', async () => {
      render(<LegendsModal />);

      // Open modal
      const openEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Close modal
      const closeEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: false }
      });
      document.dispatchEvent(closeEvent);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });

      // Open again
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    beforeEach(async () => {
      render(<LegendsModal />);
      
      // Open the modal
      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('renders with correct CSS classes', () => {
      const wrapper = document.querySelector('.lm__wrpr');
      const closeButton = screen.getByRole('button');
      const modal = document.querySelector('.lm');
      const header = document.querySelector('.lm__head');
      const body = document.querySelector('.lm__body');

      expect(wrapper).toBeInTheDocument();
      expect(closeButton).toHaveClass('lm__close__btn');
      expect(modal).toHaveClass('lm');
      expect(header).toHaveClass('lm__head');
      expect(body).toHaveClass('lm__body');
    });

    it('renders close button with correct attributes', () => {
      const closeButton = screen.getByRole('button');
      const closeIcon = closeButton.querySelector('img');

      expect(closeButton).toHaveClass('lm__close__btn');
      expect(closeIcon).toHaveAttribute('src', '/icons/close-white.svg');
      expect(closeIcon).toHaveAttribute('alt', 'close');
    });

    it('renders header with correct structure', () => {
      const header = document.querySelector('.lm__head');
      const headerImg = header?.querySelector('img');
      const headerText = header?.querySelector('p');

      expect(header).toBeInTheDocument();
      expect(headerImg).toHaveClass('lm__head__img');
      expect(headerImg).toHaveAttribute('src', '/icons/info-blue.svg');
      expect(headerText).toHaveClass('lm__head__text');
      expect(headerText).toHaveTextContent('Legend');
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      render(<LegendsModal />);
      
      // Open the modal
      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('has proper button element for close functionality', () => {
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('lm__close__btn');
    });

    it('has proper alt text for close icon', () => {
      const closeIcon = screen.getByAltText('close');
      expect(closeIcon).toHaveAttribute('src', '/icons/close-white.svg');
    });

    it('has proper structure for legend items', () => {
      const legendItems = document.querySelectorAll('.lm__body__item');
      
      legendItems.forEach(item => {
        const img = item.querySelector('img');
        const text = item.querySelector('p');
        
        expect(img).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(text?.textContent).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles event with undefined isOpen property', async () => {
      render(<LegendsModal />);

      const event = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: undefined }
      });
      document.dispatchEvent(event);

      // Should not crash and modal should remain closed
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('handles rapid open/close events', async () => {
      render(<LegendsModal />);

      // Rapidly dispatch open and close events
      const openEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      const closeEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: false }
      });

      document.dispatchEvent(openEvent);
      document.dispatchEvent(closeEvent);
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('useEscapeClicked Integration', () => {
    it('calls useEscapeClicked with onClose callback', () => {
      render(<LegendsModal />);
      
      expect(mockUseEscapeClicked).toHaveBeenCalledWith(expect.any(Function));
    });

    it('escape key callback closes the modal', async () => {
      render(<LegendsModal />);
      
      // Open modal first
      const openEvent = new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true }
      });
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Get the callback that was passed to useEscapeClicked
      const escapeCallback = mockUseEscapeClicked.mock.calls[0][0];
      
      // Call the escape callback
      escapeCallback();

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });
});
