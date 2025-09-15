import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HpMonthBox from '../../../../components/page/events/hp-month-box';
import { IMonthwiseEvent } from '@/types/events.type';

// Mock the useEventsAnalytics hook
jest.mock('@/analytics/events.analytics', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('HpMonthBox Component', () => {
  const mockAllData: IMonthwiseEvent[] = [
    { index: 0, name: 'January', events: [] },
    { index: 1, name: 'February', events: [] },
    { index: 2, name: 'March', events: [] },
    { index: 3, name: 'April', events: [] },
    { index: 4, name: 'May', events: [] },
    { index: 5, name: 'June', events: [] },
    { index: 6, name: 'July', events: [] },
    { index: 7, name: 'August', events: [] },
    { index: 8, name: 'September', events: [] },
    { index: 9, name: 'October', events: [] },
    { index: 10, name: 'November', events: [] },
    { index: 11, name: 'December', events: [] },
  ];

  const defaultProps = {
    name: 'March',
    currentIndex: 2,
    allData: mockAllData,
  };

  const mockUseEventsAnalytics = require('@/analytics/events.analytics').default as jest.Mock;

  const mockAnalytics = {
    onMonthSelected: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEventsAnalytics.mockReturnValue(mockAnalytics);
    
    // Mock getElementById for scrollIntoView tests
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id.startsWith('m-')) {
        return {
          scrollIntoView: jest.fn(),
        } as any;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with basic props', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const mainContainer = document.querySelector('.hpmp');
      const monthText = screen.getByText('March');
      
      expect(mainContainer).toBeInTheDocument();
      expect(monthText).toBeInTheDocument();
    });

    it('renders month name correctly', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthText = screen.getByText('March');
      expect(monthText).toHaveClass('hpmp__month__text');
    });

    it('renders down arrow when allData has items', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const downArrow = document.querySelector('.hpmp__month__img');
      expect(downArrow).toBeInTheDocument();
      expect(downArrow).toHaveAttribute('src', '/icons/pln-down-arrow.svg');
    });

    it('does not render down arrow when allData is empty', () => {
      const propsWithEmptyData = {
        ...defaultProps,
        allData: [],
      };
      
      render(<HpMonthBox {...propsWithEmptyData} />);
      
      const downArrow = document.querySelector('.hpmp__month__img');
      expect(downArrow).not.toBeInTheDocument();
    });

    it('renders pane when isPaneActive is true', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const pane = document.querySelector('.hpmp__pane');
      expect(pane).toBeInTheDocument();
    });

    it('renders months pane when isMonthsPaneActive is true', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const specificMonthButton = document.querySelector('.hpmp__pane__item.desktopOnly');
      fireEvent.click(specificMonthButton!);
      
      const monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).toBeInTheDocument();
    });
  });

  describe('Pane Content', () => {
    beforeEach(() => {
      render(<HpMonthBox {...defaultProps} />);
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
    });

    it('renders "Jump to" header', () => {
      const header = document.querySelector('.hpmp__pane__head');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Jump to');
    });

    it('renders Previous Month button', () => {
      const prevButton = screen.getByText('Previous Month');
      expect(prevButton).toBeInTheDocument();
      expect(prevButton).toHaveClass('hpmp__pane__item');
    });

    it('renders Current Month button', () => {
      const currentButton = screen.getByText('Current Month');
      expect(currentButton).toBeInTheDocument();
      expect(currentButton).toHaveClass('hpmp__pane__item');
    });

    it('renders Next Month button', () => {
      const nextButton = screen.getByText('Next Month');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).toHaveClass('hpmp__pane__item');
    });

    it('renders Specific Month button for desktop', () => {
      const specificButton = document.querySelector('.hpmp__pane__item.desktopOnly');
      expect(specificButton).toBeInTheDocument();
      expect(specificButton).toHaveTextContent('Specific Month');
    });

    it('renders border separator', () => {
      const border = document.querySelector('.bordertop.onlyMobile');
      expect(border).toBeInTheDocument();
    });

    it('renders all months in mobile view', () => {
      const monthItems = document.querySelectorAll('.hpmp__pane__item.onlyMobile');
      expect(monthItems).toHaveLength(12); // All 12 months
    });
  });

  describe('Month Navigation', () => {
    it('toggles pane when month button is clicked', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      
      // Initially pane should not be visible
      let pane = document.querySelector('.hpmp__pane');
      expect(pane).not.toBeInTheDocument();
      
      // Click to open pane
      fireEvent.click(monthButton!);
      pane = document.querySelector('.hpmp__pane');
      expect(pane).toBeInTheDocument();
      
      // Click again to close pane
      fireEvent.click(monthButton!);
      pane = document.querySelector('.hpmp__pane');
      expect(pane).not.toBeInTheDocument();
    });

    it('does not toggle pane when allData is empty', () => {
      const propsWithEmptyData = {
        ...defaultProps,
        allData: [],
      };
      
      render(<HpMonthBox {...propsWithEmptyData} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const pane = document.querySelector('.hpmp__pane');
      expect(pane).not.toBeInTheDocument();
    });

    it('handles previous month navigation', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const prevButton = screen.getByText('Previous Month');
      fireEvent.click(prevButton);
      
      expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('static', 'previous');
    });

    it('handles next month navigation', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const nextButton = screen.getByText('Next Month');
      fireEvent.click(nextButton);
      
      expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('static', 'next');
    });

     it('handles current month navigation', () => {
       // Mock current month to be in the data
       const currentMonthId = new Date().getMonth();
       const propsWithCurrentMonth = {
         ...defaultProps,
         allData: [
           { index: currentMonthId, name: 'Current Month', events: [] },
         ],
       };
      
      render(<HpMonthBox {...propsWithCurrentMonth} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const currentButton = screen.getAllByText('Current Month');
      fireEvent.click(currentButton[0]);
      
      expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('static', 'current');
    });

    it('handles direct month navigation', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const monthItems = document.querySelectorAll('.hpmp__pane__item.onlyMobile');
      const firstMonth = monthItems[0];
      fireEvent.click(firstMonth);
      
      expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('dynamic', 'January');
    });

    it('handles specific month navigation from desktop view', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const specificButton = document.querySelector('.hpmp__pane__item.desktopOnly');
      fireEvent.click(specificButton!);
      
      const monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).toBeInTheDocument();
      
      const monthItems = document.querySelectorAll('.hpmp__monthspane__item');
      const firstMonth = monthItems[0];
      fireEvent.click(firstMonth);
      
      expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('dynamic', 'January');
    });
  });

  describe('Navigation Edge Cases', () => {
    it('does not navigate when currentIndex is 0 and previous is clicked', () => {
      const propsAtStart = {
        ...defaultProps,
        currentIndex: 0,
      };
      
      render(<HpMonthBox {...propsAtStart} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const prevButton = screen.getByText('Previous Month');
      fireEvent.click(prevButton);
      
      expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
    });

    it('does not navigate when currentIndex is 11 and next is clicked', () => {
      const propsAtEnd = {
        ...defaultProps,
        currentIndex: 11,
      };
      
      render(<HpMonthBox {...propsAtEnd} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const nextButton = screen.getByText('Next Month');
      fireEvent.click(nextButton);
      
      expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
    });

    it('does not navigate when previous month is not available', () => {
       const propsWithGap = {
         ...defaultProps,
         currentIndex: 2,
         allData: [
           { index: 0, name: 'January', events: [] },
           { index: 2, name: 'March', events: [] }, // Missing February
         ],
       };
      
      render(<HpMonthBox {...propsWithGap} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const prevButton = screen.getByText('Previous Month');
      fireEvent.click(prevButton);
      
      expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
    });

    it('does not navigate when next month is not available', () => {
       const propsWithGap = {
         ...defaultProps,
         currentIndex: 2,
         allData: [
           { index: 2, name: 'March', events: [] },
           { index: 4, name: 'May', events: [] }, // Missing April
         ],
       };
      
      render(<HpMonthBox {...propsWithGap} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const nextButton = screen.getByText('Next Month');
      fireEvent.click(nextButton);
      
      expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
    });

     it('does not navigate to current month when no events available', () => {
       const currentMonthId = new Date().getMonth();
       const propsWithoutCurrentMonth = {
         ...defaultProps,
         allData: [
           { index: 0, name: 'January', events: [] },
           { index: 1, name: 'February', events: [] },
         ],
       };
      
      render(<HpMonthBox {...propsWithoutCurrentMonth} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const currentButton = screen.getByText('Current Month');
      fireEvent.click(currentButton);
      
      expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to main container', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const mainContainer = document.querySelector('.hpmp');
      expect(mainContainer).toHaveClass('hpmp');
    });

    it('applies correct CSS classes to month button', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      expect(monthButton).toHaveClass('hpmp__month');
    });

    it('applies correct CSS classes to month text', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthText = document.querySelector('.hpmp__month__text');
      expect(monthText).toHaveClass('hpmp__month__text');
    });

    it('applies correct CSS classes to month image', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthImage = document.querySelector('.hpmp__month__img');
      expect(monthImage).toHaveClass('hpmp__month__img');
    });

    it('applies correct CSS classes to pane', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const pane = document.querySelector('.hpmp__pane');
      expect(pane).toHaveClass('hpmp__pane');
    });

    it('applies correct CSS classes to pane items', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const paneItems = document.querySelectorAll('.hpmp__pane__item');
      expect(paneItems.length).toBeGreaterThan(0);
      
      paneItems.forEach(item => {
        expect(item).toHaveClass('hpmp__pane__item');
      });
    });

    it('applies not-active class when navigation is disabled', () => {
      const propsAtStart = {
        ...defaultProps,
        currentIndex: 0,
      };
      
      render(<HpMonthBox {...propsAtStart} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const prevButton = screen.getByText('Previous Month');
      expect(prevButton).toHaveClass('not-active');
    });

     it('applies not-active class when current month has no events', () => {
       const currentMonthId = new Date().getMonth();
       const propsWithoutCurrentMonth = {
         ...defaultProps,
         allData: [
           { index: 0, name: 'January', events: [] },
           { index: 1, name: 'February', events: [] },
         ],
       };
      
      render(<HpMonthBox {...propsWithoutCurrentMonth} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const currentButton = screen.getByText('Current Month');
      expect(currentButton).toHaveClass('not-active');
    });
  });

  describe('Event Listeners', () => {
    it('adds mousedown event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<HpMonthBox {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('adds touchstart event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<HpMonthBox {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<HpMonthBox {...defaultProps} />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('closes pane when clicking outside', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      let pane = document.querySelector('.hpmp__pane');
      expect(pane).toBeInTheDocument();
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      pane = document.querySelector('.hpmp__pane');
      expect(pane).not.toBeInTheDocument();
    });

    it('does not close pane when clicking inside pane', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const pane = document.querySelector('.hpmp__pane');
      fireEvent.mouseDown(pane!);
      
      expect(pane).toBeInTheDocument();
    });

    it('closes months pane when clicking outside', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const specificButton = document.querySelector('.hpmp__pane__item.desktopOnly');
      fireEvent.click(specificButton!);
      
      let monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).toBeInTheDocument();
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing name prop gracefully', () => {
      const propsWithoutName = {
        ...defaultProps,
        name: undefined,
      };
      
      render(<HpMonthBox {...propsWithoutName} />);
      
      const monthText = document.querySelector('.hpmp__month__text');
      expect(monthText).toHaveTextContent('');
    });

    it('handles missing currentIndex prop gracefully', () => {
      const propsWithoutCurrentIndex = {
        ...defaultProps,
        currentIndex: undefined,
      };
      
      render(<HpMonthBox {...propsWithoutCurrentIndex} />);
      
      const mainContainer = document.querySelector('.hpmp');
      expect(mainContainer).toBeInTheDocument();
    });

    it('handles missing allData prop gracefully', () => {
      const propsWithoutAllData = {
        ...defaultProps,
        allData: undefined,
      };
      
      render(<HpMonthBox {...propsWithoutAllData} />);
      
      const mainContainer = document.querySelector('.hpmp');
      expect(mainContainer).toBeInTheDocument();
    });

    it('handles empty allData array', () => {
      const propsWithEmptyData = {
        ...defaultProps,
        allData: [],
      };
      
      render(<HpMonthBox {...propsWithEmptyData} />);
      
      const mainContainer = document.querySelector('.hpmp');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('useEffect Dependencies', () => {
    it('closes months pane when pane becomes inactive', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const specificButton = document.querySelector('.hpmp__pane__item.desktopOnly');
      fireEvent.click(specificButton!);
      
      let monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).toBeInTheDocument();
      
      // Close pane
      fireEvent.click(monthButton!);
      
      monthsPane = document.querySelector('.hpmp__monthspane');
      expect(monthsPane).not.toBeInTheDocument();
    });
  });

  describe('ScrollIntoView Functionality', () => {
    it('calls scrollIntoView for previous month navigation', () => {
      const scrollIntoViewSpy = jest.fn();
      jest.spyOn(document, 'getElementById').mockReturnValue({
        scrollIntoView: scrollIntoViewSpy,
      } as any);
      
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const prevButton = screen.getByText('Previous Month');
      fireEvent.click(prevButton);
      
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('calls scrollIntoView for next month navigation', () => {
      const scrollIntoViewSpy = jest.fn();
      jest.spyOn(document, 'getElementById').mockReturnValue({
        scrollIntoView: scrollIntoViewSpy,
      } as any);
      
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const nextButton = screen.getByText('Next Month');
      fireEvent.click(nextButton);
      
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('calls scrollIntoView for current month navigation', () => {
      const scrollIntoViewSpy = jest.fn();
      const currentMonthId = new Date().getMonth();
      jest.spyOn(document, 'getElementById').mockReturnValue({
        scrollIntoView: scrollIntoViewSpy,
      } as any);
      
       const propsWithCurrentMonth = {
         ...defaultProps,
         allData: [
         { index: currentMonthId, name: 'Current Month', events: [] },
         ],
       };
      
      render(<HpMonthBox {...propsWithCurrentMonth} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const currentButton = screen.getAllByText('Current Month');
      fireEvent.click(currentButton[0]);
      
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('calls scrollIntoView for direct month navigation', () => {
      const scrollIntoViewSpy = jest.fn();
      jest.spyOn(document, 'getElementById').mockReturnValue({
        scrollIntoView: scrollIntoViewSpy,
      } as any);
      
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      const monthItems = document.querySelectorAll('.hpmp__pane__item.onlyMobile');
      const firstMonth = monthItems[0];
      fireEvent.click(firstMonth);
      
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
  });

   describe('Edge Cases', () => {
     it('handles navigation with index -1', () => {
       // Create a scenario where previous month navigation should not work
       const propsAtStart = {
         ...defaultProps,
         currentIndex: 0, // At start, so previous should not work
       };
       
       render(<HpMonthBox {...propsAtStart} />);
       
       const monthButton = document.querySelector('.hpmp__month');
       fireEvent.click(monthButton!);
       
       // Click previous month button when at start
       const prevButton = screen.getByText('Previous Month');
       fireEvent.click(prevButton);
       
       // Should not call analytics
       expect(mockAnalytics.onMonthSelected).not.toHaveBeenCalled();
     });

     it('handles missing scroll element gracefully', () => {
       jest.spyOn(document, 'getElementById').mockReturnValue(null);
       
       render(<HpMonthBox {...defaultProps} />);
       
       const monthButton = document.querySelector('.hpmp__month');
       fireEvent.click(monthButton!);
       
       const prevButton = screen.getByText('Previous Month');
       fireEvent.click(prevButton);
       
       // Should not throw error and should call analytics
       expect(mockAnalytics.onMonthSelected).toHaveBeenCalledWith('static', 'previous');
     });

    it('handles special target id in event listener', () => {
      render(<HpMonthBox {...defaultProps} />);
      
      const monthButton = document.querySelector('.hpmp__month');
      fireEvent.click(monthButton!);
      
      let pane = document.querySelector('.hpmp__pane');
      expect(pane).toBeInTheDocument();
      
      // Create element with special id
      const specialElement = document.createElement('div');
      specialElement.id = 'tesssst';
      document.body.appendChild(specialElement);
      
      fireEvent.mouseDown(specialElement);
      
      // Pane should still be open
      pane = document.querySelector('.hpmp__pane');
      expect(pane).toBeInTheDocument();
      
      document.body.removeChild(specialElement);
    });
  });
});
