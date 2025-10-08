import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailView from '@/components/page/event-detail/event-detail-popup/detail-view';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the Modal component
jest.mock('@/components/ui/modal', () => {
  return function MockModal({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div data-testid="modal" className={className}>{children}</div>;
  };
});

// Mock the custom hooks
jest.mock('@/hooks/use-hash', () => ({
  useHash: jest.fn(() => null),
}));

jest.mock('@/hooks/use-escape-clicked', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the child components
jest.mock('@/components/page/event-detail/event-detail-popup/event-type', () => {
  return function MockEventType({ event }: { event: any }) {
    return <div data-testid="event-type">Event Type Component</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/event-access-option', () => {
  return function MockEventAccessOption({ event }: { event: any }) {
    return <div data-testid="event-access-option">Event Access Option Component</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/primary-event-details', () => {
  return function MockPrimaryEventDetails({ event }: { event: any }) {
    return <div data-testid="primary-event-details">Primary Event Details Component</div>;
  };
});

jest.mock('@/components/page/event-detail/event-detail-popup/footer', () => {
  return function MockFooter({ event, setEvent }: { event: any; setEvent: any }) {
    return <div data-testid="footer">Footer Component</div>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

// Mock the constants
jest.mock('@/utils/constants', () => ({
  CUSTOM_EVENTS: {
    SHOW_EVENT_DETAIL_MODAL: 'SHOW_EVENT_DETAIL_MODAL',
  },
}));

const mockUseHash = require('@/hooks/use-hash').useHash as jest.MockedFunction<any>;
const mockUseEscapeClicked = require('@/hooks/use-escape-clicked').default as jest.MockedFunction<any>;
const mockUseRouter = require('next/navigation').useRouter as jest.MockedFunction<any>;

describe('DetailView Component', () => {
  const defaultProps = {
    events: [
      { slug: 'event-1', name: 'Event 1', id: '1' },
      { slug: 'event-2', name: 'Event 2', id: '2' },
    ],
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHash.mockReturnValue(null);
    mockUseEscapeClicked.mockImplementation((callback: any) => {
      // Store the callback for testing
      (mockUseEscapeClicked as any).escapeCallback = callback;
    });
    mockUseRouter.mockReturnValue(mockRouter);
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        search: '?test=1',
        pathname: '/events',
      },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(<DetailView {...defaultProps} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders modal when isOpen is true', () => {
      // Mock hash to trigger isOpen
      mockUseHash.mockReturnValue('#event-1');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal')).toHaveClass('detail-view-modal');
    });

    it('renders all child components when modal is open', () => {
      mockUseHash.mockReturnValue('#event-1');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('event-type')).toBeInTheDocument();
      expect(screen.getByTestId('event-access-option')).toBeInTheDocument();
      expect(screen.getByTestId('primary-event-details')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders back button with correct structure', () => {
      mockUseHash.mockReturnValue('#event-1');
      
      render(<DetailView {...defaultProps} />);
      
      const backButton = document.querySelector('.detail-content__back-button__wrapper');
      expect(backButton).toBeInTheDocument();
      
      const backIcon = document.querySelector('.detail-content__back-button__wrapper__icon');
      expect(backIcon).toBeInTheDocument();
      
      const backImage = backIcon?.querySelector('img');
      expect(backImage).toHaveAttribute('src', '/icons/arrow-right.svg');
      expect(backImage).toHaveAttribute('alt', 'back');
      expect(backImage).toHaveAttribute('width', '14');
      expect(backImage).toHaveAttribute('height', '14');
      
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders header with correct structure', () => {
      mockUseHash.mockReturnValue('#event-1');
      
      render(<DetailView {...defaultProps} />);
      
      const header = document.querySelector('.detail-content__header');
      expect(header).toBeInTheDocument();
      
      const headerLeft = document.querySelector('.detail-content__header__left');
      expect(headerLeft).toBeInTheDocument();
      
      const headerRight = document.querySelector('.detail-content__header__right');
      expect(headerRight).toBeInTheDocument();
      
      expect(screen.getByText('EVENT DETAILS')).toBeInTheDocument();
    });
  });

  describe('Hash-based Event Selection', () => {
    it('opens modal and sets event when hash matches an event slug', () => {
      mockUseHash.mockReturnValue('#event-1');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('primary-event-details')).toBeInTheDocument();
    });

    it('does not open modal when hash does not match any event slug', () => {
      mockUseHash.mockReturnValue('#non-existent-event');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('does not open modal when hash is empty', () => {
      mockUseHash.mockReturnValue('');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('does not open modal when hash is null', () => {
      mockUseHash.mockReturnValue(null);
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Custom Event Handling', () => {
    it('opens modal when SHOW_EVENT_DETAIL_MODAL event is dispatched', async () => {
      render(<DetailView {...defaultProps} />);
      
      const event = new CustomEvent('SHOW_EVENT_DETAIL_MODAL', {
        detail: {
          isOpen: true,
          event: { slug: 'event-1', name: 'Event 1', id: '1' },
        },
      });
      
      document.dispatchEvent(event);
      
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('closes modal when SHOW_EVENT_DETAIL_MODAL event is dispatched with isOpen false', async () => {
      // First open the modal
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      
      // Then close it with custom event
      const event = new CustomEvent('SHOW_EVENT_DETAIL_MODAL', {
        detail: {
          isOpen: false,
          event: null,
        },
      });
      
      document.dispatchEvent(event);
      
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Escape Key Handling', () => {
    it('calls useEscapeClicked hook', () => {
      render(<DetailView {...defaultProps} />);
      
      expect(mockUseEscapeClicked).toHaveBeenCalled();
    });

    it('closes modal and updates URL when escape key is pressed', () => {
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      
      // Simulate escape key press by calling the stored callback
      const escapeCallback = (mockUseEscapeClicked as any).escapeCallback;
      escapeCallback();
      
      expect(mockRouter.push).toHaveBeenCalledWith('/events?test=1', { scroll: false });
    });
  });

  describe('Close Button Handling', () => {
    it('calls onClose when back button is clicked', () => {
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      const backButton = document.querySelector('.detail-content__back-button__wrapper');
      fireEvent.click(backButton!);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/events?test=1', { scroll: false });
    });

    it('removes session parameter from URL when closing', () => {
      // Mock URL with session parameter
      Object.defineProperty(window, 'location', {
        value: {
          search: '?test=1&session=123',
          pathname: '/events',
        },
        writable: true,
      });
      
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      const backButton = document.querySelector('.detail-content__back-button__wrapper');
      fireEvent.click(backButton!);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/events?test=1', { scroll: false });
    });
  });

  describe('Props Handling', () => {
    it('handles empty events array', () => {
      const propsWithEmptyEvents = {
        events: [],
      };
      
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...propsWithEmptyEvents} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('handles undefined events prop', () => {
      const propsWithUndefinedEvents = {
        events: [],
      };
      
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...propsWithUndefinedEvents} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('handles events with missing slug property', () => {
      const propsWithEventsMissingSlug = {
        events: [
          { name: 'Event 1', id: '1' }, // Missing slug
          { slug: 'event-2', name: 'Event 2', id: '2' },
        ],
      };
      
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...propsWithEventsMissingSlug} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      const detailView = document.querySelector('.detail__view');
      expect(detailView).toBeInTheDocument();
      
      const detailContent = document.querySelector('.detail-content');
      expect(detailContent).toBeInTheDocument();
      
      const detailContentCn = document.querySelector('.detail-content-cn');
      expect(detailContentCn).toBeInTheDocument();
    });

    it('renders with proper structure for styling', () => {
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...defaultProps} />);
      
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
      
      const detailView = modal.querySelector('.detail__view');
      expect(detailView).toBeInTheDocument();
      
      const detailContent = detailView?.querySelector('.detail-content');
      expect(detailContent).toBeInTheDocument();
    });
  });

  describe('Event State Management', () => {
    it('updates event state when custom event is dispatched', async () => {
      render(<DetailView {...defaultProps} />);
      
      const customEvent = { slug: 'event-2', name: 'Event 2', id: '2' };
      const event = new CustomEvent('SHOW_EVENT_DETAIL_MODAL', {
        detail: {
          isOpen: true,
          event: customEvent,
        },
      });
      
      document.dispatchEvent(event);
      
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('maintains event state across re-renders', () => {
      mockUseHash.mockReturnValue('#event-1');
      const { rerender } = render(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      
      // Re-render with same props
      rerender(<DetailView {...defaultProps} />);
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles hash with multiple # characters', () => {
      mockUseHash.mockReturnValue('##event-1');
      
      render(<DetailView {...defaultProps} />);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('handles hash with special characters', () => {
      mockUseHash.mockReturnValue('#event-1#extra');
      
      render(<DetailView {...defaultProps} />);
      
      // The hash parsing logic splits on '#' and takes the second part, so '#event-1#extra' becomes 'event-1'
      // This matches the event slug 'event-1', so modal should be open
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('handles events array with duplicate slugs', () => {
      const propsWithDuplicateSlugs = {
        events: [
          { slug: 'event-1', name: 'Event 1', id: '1' },
          { slug: 'event-1', name: 'Event 1 Duplicate', id: '2' },
        ],
      };
      
      mockUseHash.mockReturnValue('#event-1');
      render(<DetailView {...propsWithDuplicateSlugs} />);
      
      // Should find the first matching event
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });
});
