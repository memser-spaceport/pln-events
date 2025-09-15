import React from 'react';
import { render, screen } from '@testing-library/react';
import DescriptionTemplate from '../../../../components/page/event-detail/description-template';

// Mock SocialLinks component
jest.mock('../../../../components/page/event-detail/social-links', () => {
  return function MockSocialLinks(props: any) {
    return <div data-testid="social-links">Mock Social Links</div>;
  };
});

// Mock styled-jsx
jest.mock('styled-jsx', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('DescriptionTemplate Component', () => {
  const mockEvent = {
    id: 'event1',
    name: 'Test Event',
    description: '<p>This is a <strong>test</strong> event description with <em>HTML</em> content.</p>',
    contactInfos: {
      twitter: 'https://twitter.com/test',
      linkedin: 'https://linkedin.com/in/test',
    },
  };

  const mockEventWithoutSocial = {
    id: 'event2',
    name: 'Test Event 2',
    description: 'This is a simple text description without HTML.',
    contactInfos: null,
  };

  const mockEventWithEmptySocial = {
    id: 'event3',
    name: 'Test Event 3',
    description: 'This is another test description.',
    contactInfos: {},
  };

  describe('Rendering', () => {
    it('renders with correct structure', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toBeInTheDocument();
      expect(descContent).toBeInTheDocument();
      expect(descText).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toHaveClass('desc');
      expect(descContent).toHaveClass('desc__content');
      expect(descText).toHaveClass('desc__content__text');
    });

    it('renders description content', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('renders social links section when contactInfos has data', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      const socialContainer = document.querySelector('.desc__social');
      const socialText = document.querySelector('.desc__social__text');
      
      expect(socialWrapper).toBeInTheDocument();
      expect(socialContainer).toBeInTheDocument();
      expect(socialText).toBeInTheDocument();
      expect(socialText).toHaveTextContent('Social handles :');
    });

    it('renders SocialLinks component when contactInfos has data', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });

    it('does not render social links section when contactInfos is null', () => {
      render(<DescriptionTemplate event={mockEventWithoutSocial} />);
      
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      expect(socialWrapper).not.toBeInTheDocument();
    });

    it('does not render social links section when contactInfos is empty object', () => {
      render(<DescriptionTemplate event={mockEventWithEmptySocial} />);
      
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      expect(socialWrapper).not.toBeInTheDocument();
    });

    it('does not render social links section when contactInfos is undefined', () => {
      const eventWithoutContactInfos = {
        id: 'event4',
        name: 'Test Event 4',
        description: 'Test description',
      };
      
      render(<DescriptionTemplate event={eventWithoutContactInfos} />);
      
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      expect(socialWrapper).not.toBeInTheDocument();
    });
  });

  describe('Description Content', () => {
    it('renders HTML description using dangerouslySetInnerHTML', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('This is a test event description with HTML content.');
    });

    it('renders plain text description', () => {
      render(<DescriptionTemplate event={mockEventWithoutSocial} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('This is a simple text description without HTML.');
    });

    it('handles empty description', () => {
      const eventWithEmptyDescription = {
        id: 'event5',
        name: 'Test Event 5',
        description: '',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithEmptyDescription} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toBeInTheDocument();
      expect(descText).toHaveTextContent('');
    });

    it('handles undefined description', () => {
      const eventWithUndefinedDescription = {
        id: 'event6',
        name: 'Test Event 6',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithUndefinedDescription} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toBeInTheDocument();
      expect(descText).toHaveTextContent('');
    });

    it('handles null description', () => {
      const eventWithNullDescription = {
        id: 'event7',
        name: 'Test Event 7',
        description: null,
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithNullDescription} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toBeInTheDocument();
      expect(descText).toHaveTextContent('');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to all elements', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      const socialContainer = document.querySelector('.desc__social');
      const socialText = document.querySelector('.desc__social__text');
      
      expect(descContainer).toHaveClass('desc');
      expect(descContent).toHaveClass('desc__content');
      expect(descText).toHaveClass('desc__content__text');
      expect(socialWrapper).toHaveClass('desc__social__wrpr');
      expect(socialContainer).toHaveClass('desc__social');
      expect(socialText).toHaveClass('desc__social__text');
    });

    it('applies correct CSS classes when no social links', () => {
      render(<DescriptionTemplate event={mockEventWithoutSocial} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toHaveClass('desc');
      expect(descContent).toHaveClass('desc__content');
      expect(descText).toHaveClass('desc__content__text');
    });
  });

  describe('Component Structure', () => {
    it('renders with proper HTML structure when social links are present', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descContainer = document.querySelector('.desc');
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toContainElement(socialWrapper as HTMLElement);
      expect(descContainer).toContainElement(descContent as HTMLElement);
      expect(descContent).toContainElement(descText as HTMLElement);
    });

    it('renders with proper HTML structure when no social links', () => {
      render(<DescriptionTemplate event={mockEventWithoutSocial} />);
      
      const descContainer = document.querySelector('.desc');
      const descContent = document.querySelector('.desc__content');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toContainElement(descContent as HTMLElement);
      expect(descContent).toContainElement(descText as HTMLElement);
    });

    it('renders styled-jsx styles', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      // Check if the component renders without errors
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop gracefully', () => {
      render(<DescriptionTemplate />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });

    it('handles null event prop gracefully', () => {
      render(<DescriptionTemplate event={null} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });

    it('handles undefined event prop gracefully', () => {
      render(<DescriptionTemplate event={undefined} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });

    it('handles event with missing properties', () => {
      const incompleteEvent = {
        id: 'event8',
      };
      
      render(<DescriptionTemplate event={incompleteEvent} />);
      
      const descContainer = document.querySelector('.desc');
      expect(descContainer).toBeInTheDocument();
    });
  });

  describe('HTML Content Rendering', () => {
    it('renders HTML content with strong tags', () => {
      const eventWithStrong = {
        id: 'event9',
        name: 'Test Event 9',
        description: '<p>This is <strong>bold</strong> text.</p>',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithStrong} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('This is bold text.');
    });

    it('renders HTML content with em tags', () => {
      const eventWithEm = {
        id: 'event10',
        name: 'Test Event 10',
        description: '<p>This is <em>italic</em> text.</p>',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithEm} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('This is italic text.');
    });

    it('renders HTML content with links', () => {
      const eventWithLinks = {
        id: 'event11',
        name: 'Test Event 11',
        description: '<p>Visit <a href="https://example.com">our website</a> for more info.</p>',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithLinks} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('Visit our website for more info.');
    });

    it('renders HTML content with lists', () => {
      const eventWithLists = {
        id: 'event12',
        name: 'Test Event 12',
        description: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithLists} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent('Item 1Item 2');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long description', () => {
      const longDescription = 'This is a very long description. '.repeat(100);
      const eventWithLongDescription = {
        id: 'event13',
        name: 'Test Event 13',
        description: longDescription,
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithLongDescription} />);
      
      const descText = document.querySelector('.desc__content__text');
      // Check that the description is rendered (text content normalization may differ)
      expect(descText).toBeInTheDocument();
      expect(descText?.textContent).toContain('This is a very long description.');
    });

    it('handles description with special characters', () => {
      const specialDescription = 'Description with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const eventWithSpecialDescription = {
        id: 'event14',
        name: 'Test Event 14',
        description: specialDescription,
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithSpecialDescription} />);
      
      const descText = document.querySelector('.desc__content__text');
      expect(descText).toHaveTextContent(specialDescription);
    });

    it('handles description with newlines and whitespace', () => {
      const descriptionWithNewlines = 'Line 1\nLine 2\nLine 3\n';
      const eventWithNewlines = {
        id: 'event15',
        name: 'Test Event 15',
        description: descriptionWithNewlines,
        contactInfos: null,
      };
      
      render(<DescriptionTemplate event={eventWithNewlines} />);
      
      const descText = document.querySelector('.desc__content__text');
      // Normalize the content to match how the browser renders it (newlines become spaces)
      const normalizedDescription = descriptionWithNewlines.replace(/\n/g, ' ').trim();
      expect(descText).toHaveTextContent(normalizedDescription);
    });

    it('handles contactInfos with various data types', () => {
      const eventWithVariousContactInfos = {
        id: 'event16',
        name: 'Test Event 16',
        description: 'Test description',
        contactInfos: {
          twitter: 'https://twitter.com/test',
          linkedin: 'https://linkedin.com/in/test',
          facebook: 'https://facebook.com/test',
          instagram: 'https://instagram.com/test',
        },
      };
      
      render(<DescriptionTemplate event={eventWithVariousContactInfos} />);
      
      const socialWrapper = document.querySelector('.desc__social__wrpr');
      expect(socialWrapper).toBeInTheDocument();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper structure for screen readers', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const descContainer = document.querySelector('.desc');
      const descText = document.querySelector('.desc__content__text');
      
      expect(descContainer).toBeInTheDocument();
      expect(descText).toBeInTheDocument();
    });

    it('renders social handles text with proper structure', () => {
      render(<DescriptionTemplate event={mockEvent} />);
      
      const socialText = document.querySelector('.desc__social__text');
      expect(socialText).toHaveTextContent('Social handles :');
    });
  });
});
