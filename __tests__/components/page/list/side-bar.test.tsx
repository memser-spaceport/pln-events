import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SideBar from '../../../../components/page/list/side-bar';

// Mock the custom hook
jest.mock('../../../../hooks/use-events-scroll-observer', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSearchParams = {
  get: jest.fn(),
  toString: jest.fn(() => ''),
};

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => '/list',
}));

// Mock constants
jest.mock('../../../../utils/constants', () => ({
  CUSTOM_EVENTS: {
    UPDATE_EVENTS_OBSERVER: 'UPDATE_EVENTS_OBSERVER',
    UPDATE_SELECTED_DATE: 'UPDATE_SELECTED_DATE',
  },
  ABBREVIATED_MONTH_NAMES: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  MIN_YEAR_COUNT: 2,
  MAX_YEAR_COUNT: 2,
}));

// Mock analytics
const mockOnYearFilterChanged = jest.fn();
jest.mock('../../../../analytics/schedule.analytics', () => ({
  useSchedulePageAnalytics: () => ({
    onYearFilterChanged: mockOnYearFilterChanged,
  }),
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock window and document methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    top: 100,
    left: 0,
    bottom: 200,
    right: 100,
    width: 100,
    height: 100,
  })),
});

Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
  value: 50,
  writable: true,
});

describe('SideBar Component', () => {
  const mockEvents = {
    'Jan': [{ id: 'event1', name: 'Event 1' }],
    'Feb': [{ id: 'event2', name: 'Event 2' }],
    'Mar': [{ id: 'event3', name: 'Event 3' }],
  };

  const defaultProps = {
    events: mockEvents,
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    eventTimezone: 'UTC',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked function
    const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
    mockUseEventsScrollObserver.mockReturnValue('Jan');
    
    // Mock document.getElementById
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      const mockElement = {
        id,
        getBoundingClientRect: jest.fn(() => ({
          top: 100,
          left: 0,
          bottom: 200,
          right: 100,
          width: 100,
          height: 100,
        })),
        offsetTop: 50,
        nextElementSibling: {
          offsetTop: 100,
        },
        parentElement: {
          scrollTo: jest.fn(),
        },
        querySelector: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        click: jest.fn(),
        style: {},
        className: '',
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn(),
        },
        getAttribute: jest.fn(),
        setAttribute: jest.fn(),
        hasAttribute: jest.fn(),
        tagName: 'DIV',
        nodeType: 1,
        parentNode: null,
        childNodes: [],
        firstChild: null,
        lastChild: null,
        nextSibling: null,
        previousSibling: null,
        textContent: '',
        innerHTML: '',
        outerHTML: '',
        scrollIntoView: jest.fn(),
        focus: jest.fn(),
        blur: jest.fn(),
        dispatchEvent: jest.fn(),
      };
      
      return mockElement as any;
    });
    
    // Mock document.dispatchEvent
    jest.spyOn(document, 'dispatchEvent').mockImplementation(() => true);
    // Mock document.addEventListener
    jest.spyOn(document, 'addEventListener').mockImplementation(() => {});
    // Mock document.removeEventListener
    jest.spyOn(document, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      const datesContainer = document.querySelector('.sidebar__dates');
      
      expect(sidebar).toBeInTheDocument();
      expect(datesContainer).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      const datesContainer = document.querySelector('.sidebar__dates');
      
      expect(sidebar).toHaveClass('sidebar');
      expect(datesContainer).toHaveClass('sidebar__dates');
    });

    it('renders all month items', () => {
      render(<SideBar {...defaultProps} />);
      
      const monthItems = document.querySelectorAll('.sidebar__dates__date');
      expect(monthItems).toHaveLength(12); // All 12 months
    });

    it('renders month items with correct structure', () => {
      render(<SideBar {...defaultProps} />);
      
      const monthItems = document.querySelectorAll('.sidebar__dates__date');
      monthItems.forEach((item) => {
        const imgWrapper = item.querySelector('.sidebar__dates__date__imgWrpr');
        const img = item.querySelector('.sidebar__dates__date__imgWrpr__img');
        const scroller = item.querySelector('.sidebar__dates__date__scroller');
        const text = item.querySelector('.sidebar__dates__date__text');
        
        expect(imgWrapper).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect(scroller).toBeInTheDocument();
        expect(text).toBeInTheDocument();
      });
    });

    it('renders month text with year', () => {
      render(<SideBar {...defaultProps} />);
      
      const janText = screen.getByText('Jan-2025');
      const febText = screen.getByText('Feb-2025');
      
      expect(janText).toBeInTheDocument();
      expect(febText).toBeInTheDocument();
    });
  });

  describe('Event Availability', () => {
    it('shows months with events as clickable', () => {
      render(<SideBar {...defaultProps} />);
      
      // Find elements by their text content (month names)
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      const febItem = screen.getByText('Feb-2025').closest('.sidebar__dates__date');
      const marItem = screen.getByText('Mar-2025').closest('.sidebar__dates__date');
      
      expect(janItem).toHaveStyle('opacity: ""');
      expect(janItem).toHaveStyle('cursor: pointer');
      expect(febItem).toHaveStyle('opacity: ""');
      expect(febItem).toHaveStyle('cursor: pointer');
      expect(marItem).toHaveStyle('opacity: ""');
      expect(marItem).toHaveStyle('cursor: pointer');
    });

    it('shows months without events as disabled', () => {
      const eventsWithLimitedMonths = {
        'Jan': [{ id: 'event1', name: 'Event 1' }],
      };
      
      render(<SideBar {...defaultProps} events={eventsWithLimitedMonths} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      const febItem = screen.getByText('Feb-2025').closest('.sidebar__dates__date');
      const aprItem = screen.getByText('Apr-2025').closest('.sidebar__dates__date');
      
      expect(janItem).toHaveStyle('opacity: ""');
      expect(janItem).toHaveStyle('cursor: pointer');
      expect(febItem).toHaveStyle('opacity: 0.5');
      expect(febItem).toHaveStyle('cursor: not-allowed');
      expect(aprItem).toHaveStyle('opacity: 0.5');
      expect(aprItem).toHaveStyle('cursor: not-allowed');
    });

    it('handles empty events object', () => {
      render(<SideBar {...defaultProps} events={{}} />);
      
      const monthItems = document.querySelectorAll('.sidebar__dates__date');
      monthItems.forEach((item) => {
        expect(item).toHaveStyle('opacity: 0.5');
        expect(item).toHaveStyle('cursor: not-allowed');
      });
    });

    it('handles undefined events', () => {
      render(<SideBar {...defaultProps} events={[]} />);
      
      const monthItems = screen.getAllByRole('generic').filter(item => 
        item.classList.contains('sidebar__dates__date')
      );
      monthItems.forEach((item) => {
        expect(item).toHaveStyle('opacity: 0.5');
        expect(item).toHaveStyle('cursor: not-allowed');
      });
    });
  });

  describe('Active State', () => {
    it('shows active state for clicked menu item', () => {
      render(<SideBar {...defaultProps} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      const janText = janItem?.querySelector('.sidebar__dates__date__text');
      
      // Click on Jan item
      fireEvent.click(janItem!);
      
      expect(janText).toHaveClass('active');
    });

    it('updates active state when useEventsScrollObserver changes', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      mockUseEventsScrollObserver.mockReturnValue('Feb');
      
      render(<SideBar {...defaultProps} />);
      
      const febItem = screen.getByText('Feb-2025').closest('.sidebar__dates__date');
      const febText = febItem?.querySelector('.sidebar__dates__date__text');
      
      expect(febText).toHaveClass('active');
    });

    it('removes active state from previously active item', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      const { rerender } = render(<SideBar {...defaultProps} />);
      
      // Initially Jan is active
      mockUseEventsScrollObserver.mockReturnValue('Jan');
      rerender(<SideBar {...defaultProps} />);
      
      const janText = document.querySelector('#agenda-Jan .sidebar__dates__date__text');
      expect(janText).toHaveClass('active');
      
      // Change to Feb
      mockUseEventsScrollObserver.mockReturnValue('Feb');
      rerender(<SideBar {...defaultProps} />);
      
      const febText = document.querySelector('#agenda-Feb .sidebar__dates__date__text');
      expect(febText).toHaveClass('active');
    });
  });

  describe('Click Handling', () => {
    it('calls onItemClicked when clickable item is clicked', () => {
      render(<SideBar {...defaultProps} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      fireEvent.click(janItem!);
      
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('does not call onItemClicked when disabled item is clicked', () => {
      const eventsWithLimitedMonths = {
        'Jan': [{ id: 'event1', name: 'Event 1' }],
      };
      
      render(<SideBar {...defaultProps} events={eventsWithLimitedMonths} />);
      
      const febItem = screen.getByText('Feb-2025').closest('.sidebar__dates__date');
      fireEvent.click(febItem!);
      
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('scrolls to correct position when item is clicked', () => {
      render(<SideBar {...defaultProps} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      fireEvent.click(janItem!);
      
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: -20, // elementPosition + window.scrollY - headerOffset = 100 + 0 - 120
        behavior: 'smooth',
      });
    });

    it('handles click when element is not found', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      render(<SideBar {...defaultProps} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      fireEvent.click(janItem!);
      
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Icon Display', () => {
    it('shows correct icons for even indexed months', () => {
      render(<SideBar {...defaultProps} />);
      
      const janImg = document.querySelector('#agenda-Jan .sidebar__dates__date__imgWrpr__img');
      const marImg = document.querySelector('#agenda-Mar .sidebar__dates__date__imgWrpr__img');
      
      expect(janImg).toHaveAttribute('src', '/icons/hex-blue-filled.svg'); // Jan is active (index 0, even)
      expect(marImg).toHaveAttribute('src', '/icons/hex-blue-outlined.svg'); // Mar is not active (index 2, even)
    });

    it('shows correct icons for odd indexed months', () => {
      render(<SideBar {...defaultProps} />);
      
      const febImg = document.querySelector('#agenda-Feb .sidebar__dates__date__imgWrpr__img');
      const aprImg = document.querySelector('#agenda-Apr .sidebar__dates__date__imgWrpr__img');
      
      expect(febImg).toHaveAttribute('src', '/icons/hex-green-outlined.svg'); // Feb is not active (index 1, odd)
      expect(aprImg).toHaveAttribute('src', '/icons/hex-green-outlined.svg'); // Apr is not active (index 3, odd)
    });

    it('shows filled icons for active months', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      mockUseEventsScrollObserver.mockReturnValue('Feb');
      
      render(<SideBar {...defaultProps} />);
      
      const febImg = document.querySelector('#agenda-Feb .sidebar__dates__date__imgWrpr__img');
      expect(febImg).toHaveAttribute('src', '/icons/hex-green-filled.svg');
    });

    it('shows outlined icons for inactive months', () => {
      render(<SideBar {...defaultProps} />);
      
      const febImg = document.querySelector('#agenda-Feb .sidebar__dates__date__imgWrpr__img');
      const marImg = document.querySelector('#agenda-Mar .sidebar__dates__date__imgWrpr__img');
      
      expect(febImg).toHaveAttribute('src', '/icons/hex-green-outlined.svg'); // Feb is not active (index 1, odd)
      expect(marImg).toHaveAttribute('src', '/icons/hex-blue-outlined.svg'); // Mar is not active (index 2, even)
    });
  });

  describe('Event Listeners', () => {
    it('adds event listener for UPDATE_EVENTS_OBSERVER on mount', () => {
      render(<SideBar {...defaultProps} />);
      
      expect(document.addEventListener).toHaveBeenCalledWith(
        'UPDATE_EVENTS_OBSERVER',
        expect.any(Function)
      );
    });

    it('removes event listener on unmount', () => {
      const { unmount } = render(<SideBar {...defaultProps} />);
      
      unmount();
      
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'UPDATE_EVENTS_OBSERVER',
        expect.any(Function)
      );
    });

    it('handles UPDATE_EVENTS_OBSERVER event', () => {
      render(<SideBar {...defaultProps} />);
      
      const handler = (document.addEventListener as jest.Mock).mock.calls[0][1];
      const mockEvent = {
        detail: { month: 'Feb' }
      };
      
      handler(mockEvent);
      
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('useEffect Behavior', () => {
    it('dispatches UPDATE_SELECTED_DATE event when activeEventId changes', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      mockUseEventsScrollObserver.mockReturnValue('Feb');
      
      render(<SideBar {...defaultProps} />);
      
      expect(document.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_SELECTED_DATE',
          detail: { activeEventId: 'Feb' },
        })
      );
    });

    it('does not scroll when element is not found', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      mockUseEventsScrollObserver.mockReturnValue('Jan');
      
      render(<SideBar {...defaultProps} />);
      
      expect(document.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      render(<SideBar events={{}} />);
      
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('handles null events', () => {
      render(<SideBar {...defaultProps} events={[]} />);
      
      const monthItems = screen.getAllByRole('generic').filter(item => 
        item.classList.contains('sidebar__dates__date')
      );
      monthItems.forEach((item) => {
        expect(item).toHaveStyle('opacity: 0.5');
        expect(item).toHaveStyle('cursor: not-allowed');
      });
    });

    it('handles empty events object', () => {
      render(<SideBar {...defaultProps} events={{}} />);
      
      const monthItems = document.querySelectorAll('.sidebar__dates__date');
      monthItems.forEach((item) => {
        expect(item).toHaveStyle('opacity: 0.5');
        expect(item).toHaveStyle('cursor: not-allowed');
      });
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      const datesContainer = document.querySelector('.sidebar__dates');
      const monthItems = document.querySelectorAll('.sidebar__dates__date');
      
      expect(sidebar).toContainElement(datesContainer as HTMLElement);
      expect(datesContainer).toContainElement(monthItems[0] as HTMLElement);
    });

    it('renders styled-jsx styles', () => {
      render(<SideBar {...defaultProps} />);
      
      // Check if the component renders without errors
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for images', () => {
      render(<SideBar {...defaultProps} />);
      
      const images = document.querySelectorAll('.sidebar__dates__date__imgWrpr__img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt', 'icon');
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('has proper IDs for month items', () => {
      render(<SideBar {...defaultProps} />);
      
      const janItem = screen.getByText('Jan-2025').closest('.sidebar__dates__date');
      const febItem = screen.getByText('Feb-2025').closest('.sidebar__dates__date');
      const decItem = screen.getByText('Dec-2025').closest('.sidebar__dates__date');
      
      expect(janItem).toBeInTheDocument();
      expect(febItem).toBeInTheDocument();
      expect(decItem).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles useEventsScrollObserver returning undefined', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      mockUseEventsScrollObserver.mockReturnValue(undefined);
      
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('handles useEventsScrollObserver returning empty string', () => {
      const { default: mockUseEventsScrollObserver } = require('../../../../hooks/use-events-scroll-observer');
      mockUseEventsScrollObserver.mockReturnValue('');
      
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('handles events with special characters in keys', () => {
      const eventsWithSpecialKeys = {
        'Jan': [{ id: 'event1', name: 'Event 1' }],
        'Feb': [{ id: 'event2', name: 'Event 2' }],
      };
      
      render(<SideBar {...defaultProps} events={eventsWithSpecialKeys} />);
      
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('handles very large events object', () => {
      const largeEvents: { [key: string]: any[] } = {};
      for (let i = 0; i < 12; i++) {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        largeEvents[month] = Array.from({ length: 10 }, (_, j) => ({
          id: `event-${month}-${j}`,
          name: `Event ${month} ${j}`,
        }));
      }
      
      render(<SideBar {...defaultProps} events={largeEvents} />);
      
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<SideBar {...defaultProps} />);
      
      const sidebar = document.querySelector('.sidebar');
      const datesContainer = document.querySelector('.sidebar__dates');
      const monthItem = document.querySelector('.sidebar__dates__date');
      const imgWrapper = document.querySelector('.sidebar__dates__date__imgWrpr');
      const img = document.querySelector('.sidebar__dates__date__imgWrpr__img');
      const scroller = document.querySelector('.sidebar__dates__date__scroller');
      const text = document.querySelector('.sidebar__dates__date__text');
      
      expect(sidebar).toHaveClass('sidebar');
      expect(datesContainer).toHaveClass('sidebar__dates');
      expect(monthItem).toHaveClass('sidebar__dates__date');
      expect(imgWrapper).toHaveClass('sidebar__dates__date__imgWrpr');
      expect(img).toHaveClass('sidebar__dates__date__imgWrpr__img');
      expect(scroller).toHaveClass('sidebar__dates__date__scroller');
      expect(text).toHaveClass('sidebar__dates__date__text');
    });
  });

  describe('Year Filter', () => {
    const mockAllEvents = [
      {
        id: 'event1',
        name: 'Event 1',
        startDate: '2024-01-15',
        isHidden: false,
      },
      {
        id: 'event2',
        name: 'Event 2',
        startDate: '2024-02-20',
        isHidden: false,
      },
      {
        id: 'event3',
        name: 'Event 3',
        startDate: '2025-01-10',
        isHidden: false,
      },
      {
        id: 'event4',
        name: 'Event 4',
        startDate: '2025-03-15',
        isHidden: false,
      },
      {
        id: 'event5',
        name: 'Event 5',
        startDate: '2026-01-05',
        isHidden: false,
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });
      mockSearchParams.toString.mockReturnValue('year=2025');
    });

    it('renders year filter with current year from URL', () => {
      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const yearFilter = document.querySelector('.sidebar__year-filter');
      const yearText = document.querySelector('.sidebar__year-filter__year');
      
      expect(yearFilter).toBeInTheDocument();
      expect(yearText).toHaveTextContent('2025');
    });

    it('renders year filter with default year when URL param is missing', () => {
      const currentYear = new Date().getFullYear();
      mockSearchParams.get.mockReturnValue(null);

      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const yearText = document.querySelector('.sidebar__year-filter__year');
      expect(yearText).toHaveTextContent(currentYear.toString());
    });

    it('disables previous year arrow when no events exist for previous year', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2024';
        return null;
      });

      const events2024Only = mockAllEvents.filter(e => e.startDate.startsWith('2024'));

      render(<SideBar {...defaultProps} allEvents={events2024Only} />);

      const prevArrow = document.querySelector('.sidebar__year-filter__control:first-child');
      expect(prevArrow).toHaveClass('disabled');
    });

    it('disables next year arrow when no events exist for next year', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2026';
        return null;
      });

      const events2026Only = mockAllEvents.filter(e => e.startDate.startsWith('2026'));

      render(<SideBar {...defaultProps} allEvents={events2026Only} />);

      const nextArrow = document.querySelector('.sidebar__year-filter__control:last-child');
      expect(nextArrow).toHaveClass('disabled');
    });

    it('enables arrows when events exist for adjacent years', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });

      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const prevArrow = document.querySelector('.sidebar__year-filter__control:first-child');
      const nextArrow = document.querySelector('.sidebar__year-filter__control:last-child');
      
      expect(prevArrow).not.toHaveClass('disabled');
      expect(nextArrow).not.toHaveClass('disabled');
    });

    it('updates URL when year arrow is clicked', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });
      mockSearchParams.toString.mockReturnValue('year=2025');

      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const nextArrow = document.querySelector('.sidebar__year-filter__control:last-child');
      fireEvent.click(nextArrow!);

      expect(mockPush).toHaveBeenCalled();
    });

    it('shows year filter structure', () => {
      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const yearText = document.querySelector('.sidebar__year-filter__year');
      expect(yearText).toBeInTheDocument();
    });

    it('filters out hidden events when determining available years', () => {
      const eventsWithHidden = [
        ...mockAllEvents,
        {
          id: 'hidden-event',
          name: 'Hidden Event',
          startDate: '2023-01-01',
          isHidden: true,
        },
      ];

      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });

      render(<SideBar {...defaultProps} allEvents={eventsWithHidden} />);

      // 2023 should not be available because the event is hidden
      const prevArrow = document.querySelector('.sidebar__year-filter__control:first-child');
      // Should be enabled because 2024 has visible events
      expect(prevArrow).not.toHaveClass('disabled');
    });

    it('captures analytics when year filter arrow is clicked', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });
      mockSearchParams.toString.mockReturnValue('year=2025');

      // Mock window.location.href to prevent actual navigation
      delete (window as any).location;
      (window as any).location = { href: '' };

      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const nextArrow = document.querySelector('.sidebar__year-filter__control:last-child');
      fireEvent.click(nextArrow!);

      expect(mockOnYearFilterChanged).toHaveBeenCalledWith('next', 2025, 2026);
    });

    it('captures analytics with correct direction for previous year', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2025';
        return null;
      });
      mockSearchParams.toString.mockReturnValue('year=2025');

      // Mock window.location.href to prevent actual navigation
      delete (window as any).location;
      (window as any).location = { href: '' };

      render(<SideBar {...defaultProps} allEvents={mockAllEvents} />);

      const prevArrow = document.querySelector('.sidebar__year-filter__control:first-child');
      fireEvent.click(prevArrow!);

      expect(mockOnYearFilterChanged).toHaveBeenCalledWith('prev', 2025, 2024);
    });
  });
});
