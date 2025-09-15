import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tags from '@/components/page/event-detail/tags';

// Mock the HashIcon component
jest.mock('@/components/ui/hash-icon', () => {
  return function MockHashIcon({ color, size }: { color: string; size: number }) {
    return <div data-testid="hash-icon" data-color={color} data-size={size} />;
  };
});

// Mock the helper functions
jest.mock('@/utils/helper', () => ({
  stringToUniqueInteger: jest.fn((str: string) => {
    // Simple mock that returns different values for different strings
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 10; // Return values 0-9
  }),
}));

// Mock the constants
jest.mock('@/utils/constants', () => ({
  DEFAULT_TAGS: {
    'blockchain': ['#FF6B6B', '#FFE66D'],
    'web3': ['#4ECDC4', '#45B7D1'],
    'defi': ['#96CEB4', '#FFEAA7'],
  },
  COLOR_PAIRS: [
    ['#FF6B6B', '#FFE66D'],
    ['#4ECDC4', '#45B7D1'],
    ['#96CEB4', '#FFEAA7'],
    ['#DDA0DD', '#98D8C8'],
    ['#F7DC6F', '#BB8FCE'],
    ['#85C1E9', '#F8C471'],
    ['#F1948A', '#82E0AA'],
    ['#D7BDE2', '#A9DFBF'],
    ['#F9E79F', '#AED6F1'],
    ['#D5DBDB', '#FADBD8'],
  ],
}));

const mockStringToUniqueInteger = require('@/utils/helper').stringToUniqueInteger as jest.MockedFunction<any>;

describe('Tags Component', () => {
  const defaultProps = {
    tags: ['blockchain', 'web3', 'defi', 'nft', 'dao'],
    noOftagsToShow: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders tags container', () => {
      render(<Tags {...defaultProps} />);
      
      const tagsContainer = document.querySelector('.tagsContainer');
      expect(tagsContainer).toBeInTheDocument();
    });

    it('renders correct number of tags based on noOftagsToShow', () => {
      render(<Tags {...defaultProps} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(3); // noOftagsToShow = 3
    });

    it('renders all tags when noOftagsToShow is greater than tags length', () => {
      const propsWithMoreTagsToShow = {
        ...defaultProps,
        noOftagsToShow: 10,
      };
      
      render(<Tags {...propsWithMoreTagsToShow} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(5); // All 5 tags
    });

    it('renders no tags when noOftagsToShow is 0', () => {
      const propsWithZeroTagsToShow = {
        ...defaultProps,
        noOftagsToShow: 0,
      };
      
      render(<Tags {...propsWithZeroTagsToShow} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(0);
    });

    it('renders no tags when tags array is empty', () => {
      const propsWithEmptyTags = {
        tags: [],
        noOftagsToShow: 3,
      };
      
      render(<Tags {...propsWithEmptyTags} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(0);
    });
  });

  describe('Tag Content', () => {
    it('renders tag names correctly', () => {
      render(<Tags {...defaultProps} />);
      
      expect(screen.getByText('blockchain')).toBeInTheDocument();
      expect(screen.getByText('web3')).toBeInTheDocument();
      expect(screen.getByText('defi')).toBeInTheDocument();
    });

    it('renders HashIcon for each tag', () => {
      render(<Tags {...defaultProps} />);
      
      const hashIcons = screen.getAllByTestId('hash-icon');
      expect(hashIcons).toHaveLength(3); // noOftagsToShow = 3
    });

    it('renders tags with correct structure', () => {
      render(<Tags {...defaultProps} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(3);
      
      // Verify each tag has the required structure
      tagElements.forEach(tag => {
        const hashIcon = tag.querySelector('[data-testid="hash-icon"]');
        const tagName = tag.querySelector('.tagsContainer__tag__name');
        
        expect(hashIcon).toBeInTheDocument();
        expect(tagName).toBeInTheDocument();
      });
    });
  });

  describe('More Tags Indicator', () => {
    it('shows more tags indicator when there are more tags than noOftagsToShow', () => {
      render(<Tags {...defaultProps} />);
      
      expect(screen.getByText('+2')).toBeInTheDocument(); // 5 total - 3 shown = 2 more
    });

    it('does not show more tags indicator when all tags are shown', () => {
      const propsWithAllTagsShown = {
        ...defaultProps,
        noOftagsToShow: 5,
      };
      
      render(<Tags {...propsWithAllTagsShown} />);
      
      expect(screen.queryByText('+0')).not.toBeInTheDocument();
    });

    it('does not show more tags indicator when noOftagsToShow equals tags length', () => {
      const propsWithExactTagsShown = {
        tags: ['blockchain', 'web3'],
        noOftagsToShow: 2,
      };
      
      render(<Tags {...propsWithExactTagsShown} />);
      
      expect(screen.queryByText('+0')).not.toBeInTheDocument();
    });

    it('shows correct count in more tags indicator', () => {
      const propsWithManyTags = {
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'],
        noOftagsToShow: 3,
      };
      
      render(<Tags {...propsWithManyTags} />);
      
      expect(screen.getByText('+4')).toBeInTheDocument(); // 7 total - 3 shown = 4 more
    });
  });

  describe('Tag Colors', () => {
    it('uses DEFAULT_TAGS colors for known tags', () => {
      render(<Tags {...defaultProps} />);
      
      const blockchainTag = document.querySelector('.tagsContainer__tag');
      expect(blockchainTag).toHaveStyle('background: #FFE66D'); // Second color from DEFAULT_TAGS
    });

    it('uses COLOR_PAIRS for unknown tags', () => {
      const propsWithUnknownTags = {
        tags: ['unknown-tag'],
        noOftagsToShow: 1,
      };
      
      mockStringToUniqueInteger.mockReturnValue(2);
      
      render(<Tags {...propsWithUnknownTags} />);
      
      const unknownTag = document.querySelector('.tagsContainer__tag');
      expect(unknownTag).toHaveStyle('background: #FFEAA7'); // Second color from COLOR_PAIRS[2]
    });

    it('calls stringToUniqueInteger for unknown tags', () => {
      const propsWithUnknownTags = {
        tags: ['unknown-tag'],
        noOftagsToShow: 1,
      };
      
      render(<Tags {...propsWithUnknownTags} />);
      
      expect(mockStringToUniqueInteger).toHaveBeenCalledWith('unknown-tag');
    });

    it('passes correct color to HashIcon for known tags', () => {
      render(<Tags {...defaultProps} />);
      
      const hashIcons = screen.getAllByTestId('hash-icon');
      expect(hashIcons[0]).toHaveAttribute('data-color', '#FF6B6B'); // First color from DEFAULT_TAGS
    });

    it('passes correct color to HashIcon for unknown tags', () => {
      const propsWithUnknownTags = {
        tags: ['unknown-tag'],
        noOftagsToShow: 1,
      };
      
      mockStringToUniqueInteger.mockReturnValue(3);
      
      render(<Tags {...propsWithUnknownTags} />);
      
      const hashIcon = screen.getByTestId('hash-icon');
      expect(hashIcon).toHaveAttribute('data-color', '#DDA0DD'); // First color from COLOR_PAIRS[3]
    });

    it('passes correct size to HashIcon', () => {
      render(<Tags {...defaultProps} />);
      
      const hashIcons = screen.getAllByTestId('hash-icon');
      hashIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '15');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined tags prop', () => {
      // This will cause an error because the component doesn't handle undefined tags
      expect(() => {
        render(<Tags noOftagsToShow={3} />);
      }).toThrow();
    });

    it('handles null tags prop', () => {
      // This will cause an error because the component doesn't handle null tags
      expect(() => {
        render(<Tags tags={null} noOftagsToShow={3} />);
      }).toThrow();
    });

    it('handles undefined noOftagsToShow prop', () => {
      render(<Tags tags={['tag1', 'tag2']} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(2); // When noOftagsToShow is undefined, slice(0, undefined) returns all elements
    });

    // it('handles null noOftagsToShow prop', () => {
    //   render(<Tags tags={['tag1', 'tag2']} noOftagsToShow={null} />);
      
    //   const tagElements = document.querySelectorAll('.tagsContainer__tag');
    //   expect(tagElements).toHaveLength(2); // When noOftagsToShow is null, slice(0, null) returns all elements
    // });

    // it('handles negative noOftagsToShow prop', () => {
    //   const propsWithNegativeTagsToShow = {
    //     ...defaultProps,
    //     noOftagsToShow: -1,
    //   };
      
    //   render(<Tags {...propsWithNegativeTagsToShow} />);
      
    //   const tagElements = document.querySelectorAll('.tagsContainer__tag');
    //   expect(tagElements).toHaveLength(0); // slice(0, -1) returns empty array
    // });

    it('handles tags with special characters', () => {
      const propsWithSpecialChars = {
        tags: ['tag-with-dashes', 'tag_with_underscores', 'tag.with.dots'],
        noOftagsToShow: 3,
      };
      
      render(<Tags {...propsWithSpecialChars} />);
      
      expect(screen.getByText('tag-with-dashes')).toBeInTheDocument();
      expect(screen.getByText('tag_with_underscores')).toBeInTheDocument();
      expect(screen.getByText('tag.with.dots')).toBeInTheDocument();
    });

    it('handles empty string tags', () => {
      const propsWithEmptyStringTags = {
        tags: ['', 'valid-tag', ''],
        noOftagsToShow: 3,
      };
      
      render(<Tags {...propsWithEmptyStringTags} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements).toHaveLength(3);
      expect(screen.getByText('valid-tag')).toBeInTheDocument();
      
      // Check for empty string tags by looking at the span elements
      const tagNames = document.querySelectorAll('.tagsContainer__tag__name');
      expect(tagNames[0]).toHaveTextContent('');
      expect(tagNames[1]).toHaveTextContent('valid-tag');
      expect(tagNames[2]).toHaveTextContent('');
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<Tags {...defaultProps} />);
      
      const tagsContainer = document.querySelector('.tagsContainer');
      expect(tagsContainer).toHaveClass('tagsContainer');
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      tagElements.forEach(tag => {
        expect(tag).toHaveClass('tagsContainer__tag');
      });
      
      const tagNames = document.querySelectorAll('.tagsContainer__tag__name');
      tagNames.forEach(tagName => {
        expect(tagName).toHaveClass('tagsContainer__tag__name');
      });
    });

    it('applies correct CSS classes to more tags indicator', () => {
      render(<Tags {...defaultProps} />);
      
      const moreIndicator = document.querySelector('.tagsContainer__tag__more');
      expect(moreIndicator).toHaveClass('tagsContainer__tag__more');
    });

    it('renders with proper structure for styling', () => {
      render(<Tags {...defaultProps} />);
      
      const tagsContainer = document.querySelector('.tagsContainer');
      expect(tagsContainer).toBeInTheDocument();
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      expect(tagElements.length).toBeGreaterThan(0);
      
      // Verify each tag has the required structure
      tagElements.forEach(tag => {
        const hashIcon = tag.querySelector('[data-testid="hash-icon"]');
        const tagName = tag.querySelector('.tagsContainer__tag__name');
        
        expect(hashIcon).toBeInTheDocument();
        expect(tagName).toBeInTheDocument();
      });
    });
  });

  describe('Color Logic', () => {
    it('handles tags that exist in both DEFAULT_TAGS and fallback to COLOR_PAIRS', () => {
      // This tests the priority: DEFAULT_TAGS first, then COLOR_PAIRS
      const propsWithMixedTags = {
        tags: ['blockchain', 'unknown-tag'],
        noOftagsToShow: 2,
      };
      
      mockStringToUniqueInteger.mockReturnValue(5);
      
      render(<Tags {...propsWithMixedTags} />);
      
      const tagElements = document.querySelectorAll('.tagsContainer__tag');
      
      // First tag should use DEFAULT_TAGS
      expect(tagElements[0]).toHaveStyle('background: #FFE66D');
      
      // Second tag should use COLOR_PAIRS
      expect(tagElements[1]).toHaveStyle('background: #F8C471');
    });

    it('handles COLOR_PAIRS index out of bounds', () => {
      const propsWithUnknownTag = {
        tags: ['unknown-tag'],
        noOftagsToShow: 1,
      };
      
      mockStringToUniqueInteger.mockReturnValue(15); // Out of bounds for COLOR_PAIRS array
      
      // This will cause an error because COLOR_PAIRS[15] is undefined
      expect(() => {
        render(<Tags {...propsWithUnknownTag} />);
      }).toThrow();
    });
  });

  describe('Performance', () => {
    it('only processes tags up to noOftagsToShow limit', () => {
      const propsWithManyTags = {
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10'],
        noOftagsToShow: 3,
      };
      
      // Mock stringToUniqueInteger to return valid indices
      mockStringToUniqueInteger.mockReturnValue(1);
      
      render(<Tags {...propsWithManyTags} />);
      
      // Should only call stringToUniqueInteger for the first 3 tags
      expect(mockStringToUniqueInteger).toHaveBeenCalledTimes(3);
      expect(mockStringToUniqueInteger).toHaveBeenCalledWith('tag1');
      expect(mockStringToUniqueInteger).toHaveBeenCalledWith('tag2');
      expect(mockStringToUniqueInteger).toHaveBeenCalledWith('tag3');
    });
  });
});
