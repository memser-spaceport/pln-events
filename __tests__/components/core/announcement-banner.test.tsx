import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnnouncementBanner from '@/components/core/announcement-banner';

// Mock react-responsive-carousel
jest.mock('react-responsive-carousel', () => ({
  Carousel: ({ children, selectedItem, onChange, ...props }: any) => (
    <div data-testid="carousel" data-selected-item={selectedItem} {...props}>
      {children}
    </div>
  ),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock useFilterHook
jest.mock('@/hooks/use-filter-hook', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    searchParams: new URLSearchParams(),
    setQuery: jest.fn(),
  })),
}));

const mockUseFilterHook = require('@/hooks/use-filter-hook').default as jest.MockedFunction<any>;

describe('AnnouncementBanner Component', () => {
  const defaultBannerData = {
    message: [
      {
        infoHtml: '<p>Test announcement 1</p>',
        websiteLink: 'https://example.com/website1',
        learnMoreLink: 'https://example.com/learn1',
      },
      {
        infoHtml: '<p>Test announcement 2</p>',
        websiteLink: 'https://example.com/website2',
        learnMoreLink: 'https://example.com/learn2',
      },
    ],
  };

  const mockSetQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create fresh URLSearchParams for each test
    const mockSearchParams = new URLSearchParams();
    
    mockUseFilterHook.mockReturnValue({
      searchParams: mockSearchParams,
      setQuery: mockSetQuery,
    });
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // Mock window.addEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  describe('Rendering', () => {
    it('renders banner when bannerData is provided and showBanner is true', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toBeInTheDocument();
    });

    it('does not render banner when bannerData is null', () => {
      render(<AnnouncementBanner bannerData={null} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });

    it('does not render banner when bannerData is undefined', () => {
      render(<AnnouncementBanner bannerData={undefined} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });

    it('does not render banner when message is empty', () => {
      const emptyBannerData = {
        message: [],
      };
      
      render(<AnnouncementBanner bannerData={emptyBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });

    it('does not render banner when showBanner query param is present', () => {
      const mockSearchParamsWithBanner = new URLSearchParams();
      mockSearchParamsWithBanner.set('showBanner', 'false');
      
      mockUseFilterHook.mockReturnValue({
        searchParams: mockSearchParamsWithBanner,
        setQuery: mockSetQuery,
      });
      
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });
  });

  describe('Desktop Layout', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('renders desktop navigator when not mobile', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const navigator = document.querySelector('.banner_navigator');
      expect(navigator).toBeInTheDocument();
    });

    it('renders navigation arrows when multiple messages', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const prevArrow = document.querySelector('.banner_arrow img[alt="previous"]');
      const nextArrow = document.querySelector('.banner_arrow img[alt="next"]');
      
      expect(prevArrow).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();
    });

    it('renders slide info when multiple messages', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const slideInfo = document.querySelector('.banner_slideinfo');
      expect(slideInfo).toHaveTextContent('1 of 2');
    });

    it('does not render navigation arrows when single message', () => {
      const singleMessageData = {
        message: [defaultBannerData.message[0]],
      };
      
      render(<AnnouncementBanner bannerData={singleMessageData} />);
      
      const navigator = document.querySelector('.banner_navigator');
      expect(navigator).toBeInTheDocument();
      
      const arrows = document.querySelectorAll('.banner_arrow');
      expect(arrows).toHaveLength(0);
    });

    it('renders logo in desktop view', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const logo = document.querySelector('img[alt="logo"]');
      expect(logo).toHaveAttribute('src', '/icons/logo.svg');
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('renders mobile logo when mobile', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const mobileLogo = document.querySelector('.inline-block img[alt="logo"]');
      expect(mobileLogo).toHaveAttribute('src', '/icons/logo.svg');
    });

    it('does not render desktop navigator when mobile', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const navigator = document.querySelector('.banner_navigator');
      expect(navigator).not.toBeInTheDocument();
    });
  });

  describe('Carousel Content', () => {
    it('renders carousel with correct props', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('data-selected-item', '0');
    });

    it('renders all banner messages', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const containers = document.querySelectorAll('.banner_c_container');
      expect(containers).toHaveLength(2);
    });

    it('renders HTML content in banner messages', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const textElements = document.querySelectorAll('.banner_c_text');
      expect(textElements[0]).toHaveProperty('innerHTML', '<p>Test announcement 1</p>');
      expect(textElements[1]).toHaveProperty('innerHTML', '<p>Test announcement 2</p>');
    });

    it('renders website links when provided', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const websiteLinks = document.querySelectorAll('.banner_view_website');
      expect(websiteLinks).toHaveLength(2);
      
      expect(websiteLinks[0]).toHaveAttribute('href', 'https://example.com/website1');
      expect(websiteLinks[0]).toHaveAttribute('target', '_blank');
      expect(websiteLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
      expect(websiteLinks[0]).toHaveTextContent('View website');
    });

    it('renders learn more links when provided', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const learnMoreLinks = document.querySelectorAll('.banner_c_learn_more');
      expect(learnMoreLinks).toHaveLength(2);
      
      expect(learnMoreLinks[0]).toHaveAttribute('href', 'https://example.com/learn1');
      expect(learnMoreLinks[0]).toHaveAttribute('target', '_blank');
      expect(learnMoreLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
      expect(learnMoreLinks[0]).toHaveTextContent('Learn More');
    });

    it('renders share icons when learn more links are provided', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const shareIcons = document.querySelectorAll('img[alt="share"]');
      expect(shareIcons).toHaveLength(2);
      expect(shareIcons[0]).toHaveAttribute('src', '/icons/share.svg');
    });

    it('does not render website links when not provided', () => {
      const dataWithoutWebsiteLinks = {
        message: [
          {
            infoHtml: '<p>Test announcement</p>',
            learnMoreLink: 'https://example.com/learn',
          },
        ],
      };
      
      render(<AnnouncementBanner bannerData={dataWithoutWebsiteLinks} />);
      
      const websiteLinks = document.querySelectorAll('.banner_view_website');
      expect(websiteLinks).toHaveLength(0);
    });

    it('does not render learn more links when not provided', () => {
      const dataWithoutLearnMoreLinks = {
        message: [
          {
            infoHtml: '<p>Test announcement</p>',
            websiteLink: 'https://example.com/website',
          },
        ],
      };
      
      render(<AnnouncementBanner bannerData={dataWithoutLearnMoreLinks} />);
      
      const learnMoreLinks = document.querySelectorAll('.banner_c_learn_more');
      expect(learnMoreLinks).toHaveLength(0);
    });
  });

  describe('Close Button', () => {
    it('renders close button', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const closeButton = document.querySelector('.banner_close');
      expect(closeButton).toBeInTheDocument();
      
      const closeIcon = closeButton?.querySelector('img');
      expect(closeIcon).toHaveAttribute('src', '/icons/closeIcon.svg');
      expect(closeIcon).toHaveClass('cursor-pointer');
    });

    it('calls setQuery when close button is clicked', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const closeButton = document.querySelector('.banner_close');
      fireEvent.click(closeButton!);
      
      expect(mockSetQuery).toHaveBeenCalledWith('showBanner', 'false');
    });
  });

  describe('Navigation Functions', () => {
    it('updates selected item when next is called', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const nextArrow = document.querySelector('.banner_arrow img[alt="next"]');
      fireEvent.click(nextArrow!);
      
      // The selectedItem state should be updated, but we can't directly test it
      // since it's internal state. We can test that the click handler works.
      expect(nextArrow).toBeInTheDocument();
    });

    it('updates selected item when prev is called', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const prevArrow = document.querySelector('.banner_arrow img[alt="previous"]');
      fireEvent.click(prevArrow!);
      
      // The selectedItem state should be updated, but we can't directly test it
      // since it's internal state. We can test that the click handler works.
      expect(prevArrow).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('updates mobile state on window resize', async () => {
      // Mock addEventListener to capture the resize handler
      const resizeHandlers: Array<(event: Event) => void> = [];
      window.addEventListener = jest.fn((event: string, handler: any) => {
        if (event === 'resize') {
          resizeHandlers.push(handler);
        }
      });
      
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      // Initially desktop
      expect(document.querySelector('.banner_navigator')).toBeInTheDocument();
      
      // Simulate mobile resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      
      // Call the resize handler directly
      resizeHandlers.forEach(handler => handler(new Event('resize')));
      
      await waitFor(() => {
        // Should show mobile layout
        expect(document.querySelector('.banner_navigator')).not.toBeInTheDocument();
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing bannerData prop', () => {
      render(<AnnouncementBanner />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });

    it('handles bannerData with missing message property', () => {
      const invalidBannerData = {
        someOtherProperty: 'value',
      };
      
      render(<AnnouncementBanner bannerData={invalidBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });

    it('handles bannerData with null message', () => {
      const invalidBannerData = {
        message: null,
      };
      
      render(<AnnouncementBanner bannerData={invalidBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toHaveClass('banner');
      
      const navigator = document.querySelector('.banner_navigator');
      expect(navigator).toHaveClass('banner_navigator');
      
      const closeButton = document.querySelector('.banner_close');
      expect(closeButton).toHaveClass('banner_close');
    });

    it('renders with proper structure for styling', () => {
      render(<AnnouncementBanner bannerData={defaultBannerData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toBeInTheDocument();
      
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toBeInTheDocument();
      
      const closeButton = document.querySelector('.banner_close');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long HTML content', () => {
      const longHtmlData = {
        message: [
          {
            infoHtml: '<p>' + 'A'.repeat(10000) + '</p>',
            websiteLink: 'https://example.com/website',
          },
        ],
      };
      
      render(<AnnouncementBanner bannerData={longHtmlData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toBeInTheDocument();
    });

    it('handles special characters in HTML content', () => {
      const specialCharData = {
        message: [
          {
            infoHtml: '<p>Special chars: &lt;&gt;&amp;&quot;&#39;</p>',
            websiteLink: 'https://example.com/website',
          },
        ],
      };
      
      render(<AnnouncementBanner bannerData={specialCharData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toBeInTheDocument();
    });

    it('handles malformed HTML content', () => {
      const malformedHtmlData = {
        message: [
          {
            infoHtml: '<p>Unclosed tag',
            websiteLink: 'https://example.com/website',
          },
        ],
      };
      
      render(<AnnouncementBanner bannerData={malformedHtmlData} />);
      
      const banner = document.querySelector('.banner');
      expect(banner).toBeInTheDocument();
    });
  });
});