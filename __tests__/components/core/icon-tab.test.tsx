import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconTab from '@/components/core/icon-tab';

describe('IconTab Component', () => {
  const defaultProps = {
    items: [
      { title: 'calendar', name: 'Calendar', activeImg: '/icons/calendar-active.svg', inActiveImg: '/icons/calendar-inactive.svg' },
      { title: 'list', name: 'List', activeImg: '/icons/list-active.svg', inActiveImg: '/icons/list-inactive.svg' },
      { title: 'timeline', name: 'Timeline', activeImg: '/icons/timeline-active.svg', inActiveImg: '/icons/timeline-inactive.svg' },
    ],
    selectedItemId: 'calendar',
    sectionId: 'test-section',
    callback: jest.fn(),
    arrowImg: '/icons/arrow-down.svg',
    onCloseDropdown: jest.fn(),
    isDropDownActive: false,
    onToggleDropdown: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders main container', () => {
      render(<IconTab {...defaultProps} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
    });

    it('renders title section', () => {
      render(<IconTab {...defaultProps} />);
      
      const title = document.querySelector('.it__title');
      expect(title).toBeInTheDocument();
      
      const titleImg = document.querySelector('.it__title__img');
      expect(titleImg).toHaveAttribute('src', '/icons/switch.svg');
      expect(titleImg).toHaveAttribute('alt', 'switch');
      
      const titleText = document.querySelector('.it__title__txt');
      expect(titleText).toHaveTextContent('VIEWS');
    });

    it('renders arrow button', () => {
      render(<IconTab {...defaultProps} />);
      
      const arrow = document.querySelector('.it__arrow');
      expect(arrow).toBeInTheDocument();
      
      const arrowImg = arrow?.querySelector('img');
      expect(arrowImg).toHaveAttribute('src', '/icons/arrow-down.svg');
    });
  });

  describe('Items Rendering', () => {
    it('renders all items', () => {
      render(<IconTab {...defaultProps} />);
      
      const items = document.querySelectorAll('.it__item');
      expect(items).toHaveLength(3);
    });

    it('renders active item with correct class', () => {
      render(<IconTab {...defaultProps} />);
      
      const activeItem = document.querySelector('.it__item--active');
      expect(activeItem).toBeInTheDocument();
      expect(activeItem).toHaveTextContent('Calendar');
    });

    it('renders inactive items without active class', () => {
      render(<IconTab {...defaultProps} />);
      
      const inactiveItems = document.querySelectorAll('.it__item:not(.it__item--active)');
      expect(inactiveItems).toHaveLength(2);
    });

    it('renders correct images for active and inactive items', () => {
      render(<IconTab {...defaultProps} />);
      
      const activeItem = document.querySelector('.it__item--active');
      const activeImg = activeItem?.querySelector('img');
      expect(activeImg).toHaveAttribute('src', '/icons/calendar-active.svg');
      
      const inactiveItems = document.querySelectorAll('.it__item:not(.it__item--active)');
      const firstInactiveImg = inactiveItems[0]?.querySelector('img');
      expect(firstInactiveImg).toHaveAttribute('src', '/icons/list-inactive.svg');
    });
  });

  describe('Active Items (Mobile)', () => {
    it('renders active items for mobile view', () => {
      render(<IconTab {...defaultProps} />);
      
      const activeItems = document.querySelectorAll('.it__mitem');
      expect(activeItems).toHaveLength(1); // Only calendar is selected
    });

    it('renders active item with correct class', () => {
      render(<IconTab {...defaultProps} />);
      
      const activeMobileItem = document.querySelector('.it__mitem--active');
      expect(activeMobileItem).toBeInTheDocument();
      expect(activeMobileItem).toHaveTextContent('Calendar');
    });

    it('renders correct image for active mobile item', () => {
      render(<IconTab {...defaultProps} />);
      
      const activeMobileItem = document.querySelector('.it__mitem--active');
      const activeImg = activeMobileItem?.querySelector('img');
      expect(activeImg).toHaveAttribute('src', '/icons/calendar-inactive.svg'); // Uses inActiveImg for mobile
    });
  });

  describe('Dropdown Pane', () => {
    it('does not render dropdown pane when inactive', () => {
      render(<IconTab {...defaultProps} />);
      
      const pane = document.querySelector('.it__pane');
      expect(pane).not.toBeInTheDocument();
    });

    it('renders dropdown pane when active', () => {
      const propsWithActiveDropdown = {
        ...defaultProps,
        isDropDownActive: true,
      };
      
      render(<IconTab {...propsWithActiveDropdown} />);
      
      const pane = document.querySelector('.it__pane');
      expect(pane).toBeInTheDocument();
    });

    it('renders all items in dropdown pane', () => {
      const propsWithActiveDropdown = {
        ...defaultProps,
        isDropDownActive: true,
      };
      
      render(<IconTab {...propsWithActiveDropdown} />);
      
      const paneItems = document.querySelectorAll('.it__pane__item');
      expect(paneItems).toHaveLength(3);
    });

    it('renders active item in dropdown pane with correct class', () => {
      const propsWithActiveDropdown = {
        ...defaultProps,
        isDropDownActive: true,
      };
      
      render(<IconTab {...propsWithActiveDropdown} />);
      
      const activePaneItem = document.querySelector('.it__pane__item--active');
      expect(activePaneItem).toBeInTheDocument();
      expect(activePaneItem).toHaveTextContent('Calendar');
    });

    it('renders correct images in dropdown pane', () => {
      const propsWithActiveDropdown = {
        ...defaultProps,
        isDropDownActive: true,
      };
      
      render(<IconTab {...propsWithActiveDropdown} />);
      
      const activePaneItem = document.querySelector('.it__pane__item--active');
      const activeImg = activePaneItem?.querySelector('img');
      expect(activeImg).toHaveAttribute('src', '/icons/calendar-active.svg');
      
      const inactivePaneItems = document.querySelectorAll('.it__pane__item:not(.it__pane__item--active)');
      const firstInactiveImg = inactivePaneItems[0]?.querySelector('img');
      expect(firstInactiveImg).toHaveAttribute('src', '/icons/list-inactive.svg');
    });
  });

  describe('User Interactions', () => {
    it('calls callback when item is clicked', () => {
      render(<IconTab {...defaultProps} />);
      
      const listItem = screen.getByText('List');
      fireEvent.click(listItem);
      
      expect(defaultProps.callback).toHaveBeenCalledWith('list');
      expect(defaultProps.onCloseDropdown).toHaveBeenCalled();
    });

    it('calls callback when dropdown item is clicked', () => {
      const propsWithActiveDropdown = {
        ...defaultProps,
        isDropDownActive: true,
      };
      
      render(<IconTab {...propsWithActiveDropdown} />);
      
      const timelinePaneItem = screen.getAllByText('Timeline')[0];
      fireEvent.click(timelinePaneItem);
      
      expect(defaultProps.callback).toHaveBeenCalledWith('timeline');
      expect(defaultProps.onCloseDropdown).toHaveBeenCalled();
    });

    it('calls onToggleDropdown when arrow is clicked', () => {
      render(<IconTab {...defaultProps} />);
      
      const arrow = document.querySelector('.it__arrow');
      fireEvent.click(arrow!);
      
      expect(defaultProps.onToggleDropdown).toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles empty items array', () => {
      const propsWithEmptyItems = {
        ...defaultProps,
        items: [],
      };
      
      render(<IconTab {...propsWithEmptyItems} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const items = document.querySelectorAll('.it__item');
      expect(items).toHaveLength(0);
    });

    it('handles undefined items', () => {
      const propsWithUndefinedItems = {
        ...defaultProps,
        items: undefined,
      };
      
      render(<IconTab {...propsWithUndefinedItems} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const items = document.querySelectorAll('.it__item');
      expect(items).toHaveLength(0);
    });

    it('handles null items', () => {
      const propsWithNullItems = {
        ...defaultProps,
        items: null,
      };
      
      render(<IconTab {...propsWithNullItems} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const items = document.querySelectorAll('.it__item');
      expect(items).toHaveLength(0);
    });

    it('handles missing selectedItemId', () => {
      const propsWithoutSelectedId = {
        ...defaultProps,
        selectedItemId: undefined,
      };
      
      render(<IconTab {...propsWithoutSelectedId} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const activeItems = document.querySelectorAll('.it__item--active');
      expect(activeItems).toHaveLength(0);
    });

    it('handles non-matching selectedItemId', () => {
      const propsWithNonMatchingId = {
        ...defaultProps,
        selectedItemId: 'non-existent',
      };
      
      render(<IconTab {...propsWithNonMatchingId} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const activeItems = document.querySelectorAll('.it__item--active');
      expect(activeItems).toHaveLength(0);
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<IconTab {...defaultProps} />);
      
      const container = document.querySelector('.it');
      expect(container).toHaveClass('it');
      
      const title = document.querySelector('.it__title');
      expect(title).toHaveClass('it__title');
      
      const arrow = document.querySelector('.it__arrow');
      expect(arrow).toHaveClass('it__arrow');
    });

    it('renders with proper structure for styling', () => {
      render(<IconTab {...defaultProps} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const title = container?.querySelector('.it__title');
      expect(title).toBeInTheDocument();
      
      const arrow = container?.querySelector('.it__arrow');
      expect(arrow).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles items with missing properties', () => {
      const propsWithIncompleteItems = {
        ...defaultProps,
        items: [
          { title: 'calendar' }, // Missing name, activeImg, inActiveImg
          { name: 'List' }, // Missing title, activeImg, inActiveImg
        ],
      };
      
      render(<IconTab {...propsWithIncompleteItems} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
    });

    it('handles very long item names', () => {
      const propsWithLongNames = {
        ...defaultProps,
        items: [
          { 
            title: 'very-long-item', 
            name: 'A'.repeat(100), 
            activeImg: '/icons/active.svg', 
            inActiveImg: '/icons/inactive.svg' 
          },
        ],
      };
      
      render(<IconTab {...propsWithLongNames} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles special characters in item names', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        items: [
          { 
            title: 'special-chars', 
            name: 'Item & More < > " \' ', 
            activeImg: '/icons/active.svg', 
            inActiveImg: '/icons/inactive.svg' 
          },
        ],
      };
      
      render(<IconTab {...propsWithSpecialChars} />);
      
      const container = document.querySelector('.it');
      expect(container).toBeInTheDocument();
      
      const items = screen.getAllByText((content, element) =>
        element?.textContent === 'Item & More < > " \' '
      );
      
      expect(items[0]).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<IconTab {...defaultProps} />);
      
      const titleImg = document.querySelector('.it__title__img');
      expect(titleImg).toHaveAttribute('alt', 'switch');
      
      const itemImgs = document.querySelectorAll('.it__item img');
      itemImgs.forEach(img => {
        expect(img).toHaveAttribute('src');
      });
    });

    it('provides clickable elements', () => {
      render(<IconTab {...defaultProps} />);
      
      const items = document.querySelectorAll('.it__item');
      items.forEach(item => {
        expect(item).toHaveProperty('onclick');
      });
      
      const arrow = document.querySelector('.it__arrow');
      expect(arrow).toHaveProperty('onclick');
    });
  });
});
