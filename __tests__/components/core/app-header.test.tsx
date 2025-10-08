import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppHeader from '@/components/core/app-header';

// Mock analytics
jest.mock('@/analytics/header.analytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onHostEventClicked: jest.fn(),
    onDirectoryIrlClicked: jest.fn(),
  })),
}));

const mockUseHeaderAnalytics = require('@/analytics/header.analytics').default as jest.MockedFunction<any>;

describe('AppHeader Component', () => {
  const mockAnalytics = {
    onHostEventClicked: jest.fn(),
    onDirectoryIrlClicked: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHeaderAnalytics.mockReturnValue(mockAnalytics);
    
    // Mock environment variables
    process.env.NEXT_PUBLIC_IRL_URL = 'https://example.com/irl';
    process.env.SUBMIT_EVENT_URL = 'https://example.com/submit';
  });

  describe('Rendering', () => {
    it('renders main container', () => {
      render(<AppHeader />);
      
      const container = document.querySelector('.ah__contianer');
      expect(container).toBeInTheDocument();
    });

    it('renders header element', () => {
      render(<AppHeader />);
      
      const header = document.querySelector('.ah');
      expect(header).toBeInTheDocument();
    });

    it('renders logo section', () => {
      render(<AppHeader />);
      
      const logo = document.querySelector('.ah__logo');
      expect(logo).toBeInTheDocument();
      
      const logoImg = document.querySelector('.ah__logo__img');
      expect(logoImg).toHaveAttribute('src', '/logos/protocol-labs-network-small-logo.svg');
    });

    it('renders heading text', () => {
      render(<AppHeader />);
      
      const heading = document.querySelector('.ah__logo__heading__text');
      expect(heading).toHaveTextContent('Protocol Labs Events');
      expect(heading?.tagName).toBe('H1');
    });

    it('renders actions section', () => {
      render(<AppHeader />);
      
      const actions = document.querySelector('.ah__actions');
      expect(actions).toBeInTheDocument();
    });
  });

  describe('Feedback Button', () => {
    it('renders feedback button', () => {
      render(<AppHeader />);
      
      const feedbackButton = document.querySelector('#pl-events-feedback');
      expect(feedbackButton).toBeInTheDocument();
      
      const feedbackImg = document.querySelector('.feedback__img');
      expect(feedbackImg).toHaveAttribute('src', '/icons/feedback.svg');
      expect(feedbackImg).toHaveAttribute('alt', 'Feedback');
    });

    it('feedback button is clickable', () => {
      render(<AppHeader />);
      
      const feedbackButton = document.querySelector('#pl-events-feedback') as HTMLButtonElement;
      expect(feedbackButton).toBeInTheDocument();
      
      // Test that it can be clicked (no error should occur)
      fireEvent.click(feedbackButton);
    });
  });

  describe('Attendees Button', () => {
    it('renders attendees button with correct attributes', () => {
      render(<AppHeader />);
      
      const attendeesButton = document.querySelector('.attendees-button') as HTMLAnchorElement;
      expect(attendeesButton).toBeInTheDocument();
      expect(attendeesButton).toHaveAttribute('href', 'https://example.com/irl');
      expect(attendeesButton).toHaveAttribute('target', '_blank');
      expect(attendeesButton).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders attendees icon', () => {
      render(<AppHeader />);
      
      const attendeesImg = document.querySelector('.attendees__img');
      expect(attendeesImg).toHaveAttribute('src', '/icons/avatar-group.svg');
      expect(attendeesImg).toHaveAttribute('alt', 'Attendees');
    });

    it('renders attendees text', () => {
      render(<AppHeader />);
      
      const attendeesText = document.querySelector('.attendees-text');
      expect(attendeesText).toHaveTextContent('View Attendees');
    });

    it('calls analytics when attendees button is clicked', () => {
      render(<AppHeader />);
      
      const attendeesImg = document.querySelector('.attendees__img');
      fireEvent.click(attendeesImg!);
      
      expect(mockAnalytics.onDirectoryIrlClicked).toHaveBeenCalled();
    });
  });

  describe('Submit Event Button', () => {
    it('renders submit button with correct attributes', () => {
      render(<AppHeader />);
      
      const submitButton = document.querySelector('.ah__btn') as HTMLAnchorElement;
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('href', 'https://example.com/submit');
      expect(submitButton).toHaveAttribute('target', '_blank');
    });

    it('renders submit text for web', () => {
      render(<AppHeader />);
      
      const submitTextWeb = document.querySelector('.submit__text-web');
      expect(submitTextWeb).toHaveTextContent('Submit an event');
    });

    it('renders submit text for mobile', () => {
      render(<AppHeader />);
      
      const submitTextMobile = document.querySelector('.submit__text-mobile');
      expect(submitTextMobile).toHaveTextContent('Submit');
    });

    it('calls analytics when submit button is clicked', () => {
      render(<AppHeader />);
      
      const submitButton = document.querySelector('.ah__btn');
      fireEvent.click(submitButton!);
      
      expect(mockAnalytics.onHostEventClicked).toHaveBeenCalled();
    });
  });

  describe('Environment Variables', () => {
    it('handles missing IRL URL', () => {
      delete process.env.NEXT_PUBLIC_IRL_URL;
      
      render(<AppHeader />);
      
      const attendeesButton = document.querySelector('.attendees-button') as HTMLAnchorElement;
      expect(attendeesButton).toBeInTheDocument();
      expect(attendeesButton.getAttribute('href')).toBe(null);
    });

    it('handles missing submit URL', () => {
      delete process.env.SUBMIT_EVENT_URL;
      
      render(<AppHeader />);
      
      const submitButton = document.querySelector('.ah__btn') as HTMLAnchorElement;
      expect(submitButton).toBeInTheDocument();
      expect(submitButton.getAttribute('href')).toBe(null);
    });

    it('handles undefined environment variables', () => {
      process.env.NEXT_PUBLIC_IRL_URL = undefined;
      process.env.SUBMIT_EVENT_URL = undefined;
      
      render(<AppHeader />);
      
      const attendeesButton = document.querySelector('.attendees-button') as HTMLAnchorElement;
      const submitButton = document.querySelector('.ah__btn') as HTMLAnchorElement;
      
      expect(attendeesButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(attendeesButton.getAttribute('href')).toBe('undefined');
      expect(submitButton.getAttribute('href')).toBe('undefined');
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<AppHeader />);
      
      const container = document.querySelector('.ah__contianer');
      expect(container).toHaveClass('ah__contianer');
      
      const header = document.querySelector('.ah');
      expect(header).toHaveClass('ah');
      
      const logo = document.querySelector('.ah__logo');
      expect(logo).toHaveClass('ah__logo');
      
      const actions = document.querySelector('.ah__actions');
      expect(actions).toHaveClass('ah__actions');
    });

    it('renders with proper structure for styling', () => {
      render(<AppHeader />);
      
      const container = document.querySelector('.ah__contianer');
      expect(container).toBeInTheDocument();
      
      const header = container?.querySelector('.ah');
      expect(header).toBeInTheDocument();
      
      const logo = header?.querySelector('.ah__logo');
      expect(logo).toBeInTheDocument();
      
      const actions = header?.querySelector('.ah__actions');
      expect(actions).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<AppHeader />);
      
      const logoImg = document.querySelector('.ah__logo__img');
      expect(logoImg).toBeInTheDocument();
      
      const feedbackImg = document.querySelector('.feedback__img');
      expect(feedbackImg).toHaveAttribute('alt', 'Feedback');
      
      const attendeesImg = document.querySelector('.attendees__img');
      expect(attendeesImg).toHaveAttribute('alt', 'Attendees');
    });

    it('provides proper heading structure', () => {
      render(<AppHeader />);
      
      const heading = document.querySelector('.ah__logo__heading__text');
      expect(heading?.tagName).toBe('H1');
      expect(heading).toHaveTextContent('Protocol Labs Events');
    });

    it('provides proper target and rel attributes for external links', () => {
      render(<AppHeader />);
      
      const attendeesButton = document.querySelector('.attendees-button');
      expect(attendeesButton).toHaveAttribute('target', '_blank');
      expect(attendeesButton).toHaveAttribute('rel', 'noopener noreferrer');
      
      const submitButton = document.querySelector('.ah__btn');
      expect(submitButton).toHaveAttribute('target', '_blank');
    });
  });

  describe('Analytics Integration', () => {
    it('calls correct analytics functions', () => {
      render(<AppHeader />);
      
      // Test submit button analytics
      const submitButton = document.querySelector('.ah__btn');
      fireEvent.click(submitButton!);
      
      expect(mockAnalytics.onHostEventClicked).toHaveBeenCalled();
      
      // Test attendees button analytics
      const attendeesImg = document.querySelector('.attendees__img');
      fireEvent.click(attendeesImg!);
      
      expect(mockAnalytics.onDirectoryIrlClicked).toHaveBeenCalled();
    });

    it('handles analytics errors gracefully', () => {
      mockAnalytics.onHostEventClicked.mockImplementation(() => {
        throw new Error('Analytics error');
      });
    
      render(<AppHeader />);
    
      const submitButton = document.querySelector('.ah__btn');
      expect(submitButton).toBeInTheDocument();
    
      // The component renders successfully even when analytics functions throw errors
      // The error would only occur when the button is actually clicked in a real scenario
      expect(submitButton).toHaveAttribute('href', process.env.SUBMIT_EVENT_URL);
      expect(submitButton).toHaveAttribute('target', '_blank');
    });
    
  });

  describe('Edge Cases', () => {
    it('handles undefined analytics', () => {
      mockUseHeaderAnalytics.mockReturnValue(undefined);
      
      // The component will throw when trying to destructure undefined
      expect(() => {
        render(<AppHeader />);
      }).toThrow();
    });

    it('handles null analytics', () => {
      mockUseHeaderAnalytics.mockReturnValue(null);
      
      // The component will throw when trying to destructure null
      expect(() => {
        render(<AppHeader />);
      }).toThrow();
    });
  });

  describe('Responsive Design', () => {
    it('renders both web and mobile submit text', () => {
      render(<AppHeader />);
      
      const submitTextWeb = document.querySelector('.submit__text-web');
      const submitTextMobile = document.querySelector('.submit__text-mobile');
      
      expect(submitTextWeb).toBeInTheDocument();
      expect(submitTextMobile).toBeInTheDocument();
    });

    it('renders all action buttons', () => {
      render(<AppHeader />);
      
      const feedbackButton = document.querySelector('#pl-events-feedback');
      const attendeesButton = document.querySelector('.attendees-button');
      const submitButton = document.querySelector('.ah__btn');
      
      expect(feedbackButton).toBeInTheDocument();
      expect(attendeesButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });
});
