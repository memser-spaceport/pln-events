import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollapsibleContent from '../../../../components/page/event-detail/collapsible-content';

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('CollapsibleContent Component', () => {
  const longContent = 'This is a very long description that should be truncated because it exceeds the 250 character limit. '.repeat(5); // ~300 characters
  const shortContent = 'This is a short description.'; // ~30 characters
  const mediumContent = 'This is a medium length description that is exactly 250 characters long and should not be truncated because it hits the limit exactly. This content is designed to test the boundary condition where the length equals the truncation threshold.';

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      
      expect(descContainer).toBeInTheDocument();
      expect(descContent).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      
      expect(descContainer).toHaveClass('desc');
      expect(descContent).toHaveClass('desc__content');
    });

    it('renders content when provided', () => {
      render(<CollapsibleContent content={shortContent} />);
      
      expect(screen.getByText(shortContent)).toBeInTheDocument();
    });

    it('does not render when content is not provided', () => {
      render(<CollapsibleContent />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });

    it('does not render when content is empty string', () => {
      render(<CollapsibleContent content="" />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });

    it('does not render when content is null', () => {
      render(<CollapsibleContent content={null} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });

    it('does not render when content is undefined', () => {
      render(<CollapsibleContent content={undefined} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });
  });

  describe('Content Truncation', () => {
    it('truncates content longer than 250 characters', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const truncatedContent = longContent.substring(0, 250);
      expect(screen.getByText(truncatedContent)).toBeInTheDocument();
      expect(screen.queryByText(longContent)).not.toBeInTheDocument();
    });

    it('shows ellipsis and read more button for truncated content', () => {
      render(<CollapsibleContent content={longContent} />);
      
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    it('does not truncate content exactly 250 characters', () => {
      render(<CollapsibleContent content={mediumContent} />);
      
      expect(screen.getByText(mediumContent)).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });

    it('does not truncate content shorter than 250 characters', () => {
      render(<CollapsibleContent content={shortContent} />);
      
      expect(screen.getByText(shortContent)).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('shows read more button when content is truncated', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const readMoreButton = screen.getByText('Read more');
      expect(readMoreButton).toBeInTheDocument();
      expect(readMoreButton).toHaveClass('desc__content__toggle');
    });

    it('expands content when read more is clicked', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const readMoreButton = screen.getByText('Read more');
      fireEvent.click(readMoreButton);
      
      // Check that the full content is displayed (not truncated)
      const descContent = document.querySelector('.desc__content');
      expect(descContent).toHaveTextContent(longContent);
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });

    it('shows read less button when content is expanded', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const readMoreButton = screen.getByText('Read more');
      fireEvent.click(readMoreButton);
      
      const readLessButton = screen.getByText('Read less');
      expect(readLessButton).toBeInTheDocument();
      expect(readLessButton).toHaveClass('desc__content__toggle');
    });

    it('collapses content when read less is clicked', () => {
      render(<CollapsibleContent content={longContent} />);
      
      // First expand
      const readMoreButton = screen.getByText('Read more');
      fireEvent.click(readMoreButton);
      
      // Then collapse
      const readLessButton = screen.getByText('Read less');
      fireEvent.click(readLessButton);
      
      const truncatedContent = longContent.substring(0, 250);
      expect(screen.getByText(truncatedContent)).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Read more')).toBeInTheDocument();
      expect(screen.queryByText('Read less')).not.toBeInTheDocument();
    });

    it('toggles between read more and read less correctly', () => {
      render(<CollapsibleContent content={longContent} />);
      
      // Initially should show read more
      expect(screen.getByText('Read more')).toBeInTheDocument();
      expect(screen.queryByText('Read less')).not.toBeInTheDocument();
      
      // Click read more
      fireEvent.click(screen.getByText('Read more'));
      
      // Should now show read less
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
      expect(screen.getByText('Read less')).toBeInTheDocument();
      
      // Click read less
      fireEvent.click(screen.getByText('Read less'));
      
      // Should show read more again
      expect(screen.getByText('Read more')).toBeInTheDocument();
      expect(screen.queryByText('Read less')).not.toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('applies correct CSS classes to toggle buttons', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const readMoreButton = screen.getByText('Read more');
      expect(readMoreButton).toHaveClass('desc__content__toggle');
    });

    it('applies correct CSS classes to read less button', () => {
      render(<CollapsibleContent content={longContent} />);
      
      // Expand first
      fireEvent.click(screen.getByText('Read more'));
      
      const readLessButton = screen.getByText('Read less');
      expect(readLessButton).toHaveClass('desc__content__toggle');
    });
  });

  describe('Edge Cases', () => {
    it('handles content with exactly 250 characters', () => {
      const exact250Content = 'a'.repeat(250);
      render(<CollapsibleContent content={exact250Content} />);
      
      expect(screen.getByText(exact250Content)).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });

    it('handles content with 251 characters', () => {
      const content251 = 'a'.repeat(251);
      render(<CollapsibleContent content={content251} />);
      
      const truncatedContent = content251.substring(0, 250);
      expect(screen.getByText(truncatedContent)).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    it('handles content with special characters', () => {
      const specialContent = 'Content with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~`'.repeat(10);
      render(<CollapsibleContent content={specialContent} />);
      
      const truncatedContent = specialContent.substring(0, 250);
      expect(screen.getByText(truncatedContent)).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    it('handles content with newlines and whitespace', () => {
      const contentWithNewlines = 'Line 1\nLine 2\nLine 3\n'.repeat(20);
      render(<CollapsibleContent content={contentWithNewlines} />);
      
      const truncatedContent = contentWithNewlines.substring(0, 250);
      // Normalize the content to match how the browser renders it (newlines become spaces)
      const normalizedTruncatedContent = truncatedContent.replace(/\n/g, ' ');
      const descContent = document.querySelector('.desc__content');
      expect(descContent).toHaveTextContent(normalizedTruncatedContent);
    });

    it('handles very long content', () => {
      const veryLongContent = 'This is a very long content. '.repeat(100); // ~3000 characters
      render(<CollapsibleContent content={veryLongContent} />);
      
      const truncatedContent = veryLongContent.substring(0, 250);
      expect(screen.getByText(truncatedContent)).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains truncated state on re-render with same content', () => {
      const { rerender } = render(<CollapsibleContent content={longContent} />);
      
      expect(screen.getByText('Read more')).toBeInTheDocument();
      
      // Re-render with same content
      rerender(<CollapsibleContent content={longContent} />);
      
      // Should still be truncated
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    // it('resets state when content changes', () => {
    //   const { rerender } = render(<CollapsibleContent content={longContent} />);
      
    //   // Expand the content
    //   fireEvent.click(screen.getByText('Read more'));
    //   expect(screen.getByText('Read less')).toBeInTheDocument();
      
    //   // Change content to short content
    //   rerender(<CollapsibleContent content={shortContent} />);
      
    //   // The component resets its state when content changes,
    //   // so it will show the new content without truncation
    //   expect(screen.getByText(shortContent)).toBeInTheDocument();
    //   expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    //   expect(screen.queryByText('Read less')).not.toBeInTheDocument();
    // });
  });

  describe('Accessibility', () => {
    it('has proper button elements for toggles', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const readMoreButton = screen.getByText('Read more');
      expect(readMoreButton.tagName).toBe('BUTTON');
    });

    it('has proper button elements for read less', () => {
      render(<CollapsibleContent content={longContent} />);
      
      // Expand first
      fireEvent.click(screen.getByText('Read more'));
      
      const readLessButton = screen.getByText('Read less');
      expect(readLessButton.tagName).toBe('BUTTON');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure', () => {
      render(<CollapsibleContent content={longContent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const toggleButton = document.querySelector('.desc__content__toggle');
      
      expect(descContainer).toContainElement(descContent as HTMLElement);
      expect(descContent).toContainElement(toggleButton as HTMLElement);
    });

    it('renders styled-jsx styles', () => {
      render(<CollapsibleContent content={longContent} />);
      
      // Check if the component renders without errors
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing props gracefully', () => {
      render(<CollapsibleContent />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });

    it('handles props with content property', () => {
      render(<CollapsibleContent content={shortContent} />);
      
      expect(screen.getByText(shortContent)).toBeInTheDocument();
    });

    it('handles props with undefined content property', () => {
      render(<CollapsibleContent content={undefined} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).not.toBeInTheDocument();
    });
  });
});
