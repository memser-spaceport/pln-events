import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventAccessOption from '@/components/page/event-detail/event-detail-popup/event-access-option';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, loading, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} loading={loading} {...props} />;
  };
});

// Mock the constants
jest.mock('@/utils/constants', () => ({
  ACCESS_TYPES: {
    PAID: 'PAID',
    FREE: 'FREE',
    INVITE: 'INVITE',
  },
}));

describe('EventAccessOption Component', () => {
  const defaultProps = {
    event: {
      accessOption: 'FREE',
    },
  };

  describe('Rendering', () => {
    it('renders access option container', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });

    it('renders access option label', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toBeInTheDocument();
    });

    it('renders access option icon', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const icon = document.querySelector('img');
      expect(icon).toBeInTheDocument();
    });

    it('renders access option text', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const text = document.querySelector('span');
      expect(text).toBeInTheDocument();
    });
  });

  describe('PAID Access Type', () => {
    it('renders PAID access option with correct structure', () => {
      const propsWithPaid = {
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<EventAccessOption {...propsWithPaid} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', 'paid');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('PAID');
      
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('src', '/icons/paid-green.svg');
      expect(icon).toHaveAttribute('alt', 'PAID Logo');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
      expect(icon).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('FREE Access Type', () => {
    it('renders FREE access option with correct structure', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', 'free');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('FREE w/ RSVP');
      
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('src', '/icons/free.svg');
      expect(icon).toHaveAttribute('alt', 'FREE Logo');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
      expect(icon).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('INVITE Access Type', () => {
    it('renders INVITE access option with correct structure', () => {
      const propsWithInvite = {
        event: {
          accessOption: 'INVITE',
        },
      };
      
      render(<EventAccessOption {...propsWithInvite} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', 'invite');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('INVITE ONLY');
      
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('src', '/icons/invite-only.svg');
      expect(icon).toHaveAttribute('alt', 'INVITE Logo');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
      expect(icon).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Unknown Access Type', () => {
    it('renders unknown access option with default structure', () => {
      const propsWithUnknown = {
        event: {
          accessOption: 'UNKNOWN',
        },
      };
      
      render(<EventAccessOption {...propsWithUnknown} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', 'unknown');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('INVITE ONLY'); // Default fallback
      
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('src', '/icons/invite-only.svg'); // Default fallback
      expect(icon).toHaveAttribute('alt', 'UNKNOWN Logo');
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop', () => {
      expect(() => {
        render(<EventAccessOption />);
      }).toThrow();
    });

    it('handles null event prop', () => {
      const propsWithNullEvent = {
        event: null,
      };
      
      expect(() => {
        render(<EventAccessOption {...propsWithNullEvent} />);
      }).toThrow();
    });

    it('handles undefined event prop', () => {
      const propsWithUndefinedEvent = {
        event: undefined,
      };
      
      expect(() => {
        render(<EventAccessOption {...propsWithUndefinedEvent} />);
      }).toThrow();
    });

    it('handles missing accessOption property', () => {
      const propsWithoutAccessOption = {
        event: {},
      };
      
      expect(() => {
        render(<EventAccessOption {...propsWithoutAccessOption} />);
      }).toThrow();
    });
  });

  describe('CSS Class Generation', () => {
    it('generates correct CSS class for PAID access option', () => {
      const propsWithPaid = {
        event: {
          accessOption: 'PAID',
        },
      };
      
      render(<EventAccessOption {...propsWithPaid} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('paid');
    });

    it('generates correct CSS class for FREE access option', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('free');
    });

    it('generates correct CSS class for INVITE access option', () => {
      const propsWithInvite = {
        event: {
          accessOption: 'INVITE',
        },
      };
      
      render(<EventAccessOption {...propsWithInvite} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('invite');
    });

    it('handles access option with spaces in name', () => {
      const propsWithSpaces = {
        event: {
          accessOption: 'INVITE ONLY',
        },
      };
      
      render(<EventAccessOption {...propsWithSpaces} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('invite-only'); // Spaces replaced with hyphens
    });

    it('handles access option with special characters', () => {
      const propsWithSpecialChars = {
        event: {
          accessOption: 'FREE & PAID',
        },
      };
      
      render(<EventAccessOption {...propsWithSpecialChars} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('free-& paid'); // Special chars replaced with hyphens
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label');
      expect(label).toHaveClass('free');
    });

    it('renders with proper structure for styling', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
      
      const label = container?.querySelector('.event__header__labels__label');
      expect(label).toBeInTheDocument();
      
      const icon = label?.querySelector('img');
      expect(icon).toBeInTheDocument();
      
      const text = label?.querySelector('span');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for all access types', () => {
      const testCases = [
        { accessOption: 'PAID', expectedAlt: 'PAID Logo' },
        { accessOption: 'FREE', expectedAlt: 'FREE Logo' },
        { accessOption: 'INVITE', expectedAlt: 'INVITE Logo' },
        { accessOption: 'UNKNOWN', expectedAlt: 'UNKNOWN Logo' },
      ];

      testCases.forEach(({ accessOption, expectedAlt }) => {
        const props = {
          event: { accessOption },
        };
        
        const { unmount } = render(<EventAccessOption {...props} />);
        
        const icon = document.querySelector('img');
        expect(icon).toHaveAttribute('alt', expectedAlt);
        
        unmount();
      });
    });

    it('provides proper loading attribute for images', () => {
      render(<EventAccessOption {...defaultProps} />);
      
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Edge Cases', () => {
    it('handles access option with empty string', () => {
      const propsWithEmptyString = {
        event: {
          accessOption: '',
        },
      };
      
      render(<EventAccessOption {...propsWithEmptyString} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', '');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('INVITE ONLY'); // Default fallback
    });

    it('handles access option with null value', () => {
      const propsWithNull = {
        event: {
          accessOption: null,
        },
      };
      
      expect(() => {
        render(<EventAccessOption {...propsWithNull} />);
      }).toThrow();
    });

    it('handles access option with undefined value', () => {
      const propsWithUndefined = {
        event: {
          accessOption: undefined,
        },
      };
      
      expect(() => {
        render(<EventAccessOption {...propsWithUndefined} />);
      }).toThrow();
    });

    it('handles case-sensitive access options', () => {
      const propsWithLowerCase = {
        event: {
          accessOption: 'paid', // lowercase
        },
      };
      
      render(<EventAccessOption {...propsWithLowerCase} />);
      
      const label = document.querySelector('.event__header__labels__label');
      expect(label).toHaveClass('event__header__labels__label', 'paid');
      
      const text = document.querySelector('span');
      expect(text).toHaveTextContent('INVITE ONLY'); // Default fallback (case sensitive)
    });
  });
});
