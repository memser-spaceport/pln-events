import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventType from '@/components/page/event-detail/event-detail-popup/event-type';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }: any) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

// Mock the constants
jest.mock('@/utils/constants', () => ({
  TYPE_CONSTANTS: {
    IN_PERSON: 'IN-PERSON',
    HYBRID: 'HYBRID',
    VIRTUAL: 'VIRTUAL',
  },
}));

describe('EventType Component', () => {
  const defaultProps = {
    event: {
      format: 'IN-PERSON',
    },
  };

  describe('Rendering', () => {
    it('renders nothing when event format is not provided', () => {
      const propsWithoutFormat = {
        event: {},
      };
      
      const { container } = render(<EventType {...propsWithoutFormat} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is empty string', () => {
      const propsWithEmptyFormat = {
        event: {
          format: '',
        },
      };
      
      const { container } = render(<EventType {...propsWithEmptyFormat} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is null', () => {
      const propsWithNullFormat = {
        event: {
          format: null,
        },
      };
      
      const { container } = render(<EventType {...propsWithNullFormat} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is undefined', () => {
      const propsWithUndefinedFormat = {
        event: {
          format: undefined,
        },
      };
      
      const { container } = render(<EventType {...propsWithUndefinedFormat} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('IN-PERSON Event Type', () => {
    it('renders IN-PERSON type with correct structure', () => {
      const propsWithInPerson = {
        event: {
          format: 'IN-PERSON',
        },
      };
      
      render(<EventType {...propsWithInPerson} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toBeInTheDocument();
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveTextContent('In-Person');
      
      const personIcon = document.querySelector('img[alt="in person"]');
      expect(personIcon).toHaveAttribute('src', '/icons/person-black.svg');
      expect(personIcon).toHaveAttribute('width', '14');
      expect(personIcon).toHaveAttribute('height', '14');
    });

    it('renders IN-PERSON type as span element', () => {
      const propsWithInPerson = {
        event: {
          format: 'IN-PERSON',
        },
      };
      
      render(<EventType {...propsWithInPerson} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType?.tagName).toBe('SPAN');
    });
  });

  describe('HYBRID Event Type', () => {
    it('renders HYBRID type with correct structure', () => {
      const propsWithHybrid = {
        event: {
          format: 'HYBRID',
        },
      };
      
      render(<EventType {...propsWithHybrid} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toBeInTheDocument();
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveTextContent('Hybrid');
      
      const hybridContainer = document.querySelector('.event__type__hybrid');
      expect(hybridContainer).toBeInTheDocument();
    });

    it('renders HYBRID type with both person and virtual icons', () => {
      const propsWithHybrid = {
        event: {
          format: 'HYBRID',
        },
      };
      
      render(<EventType {...propsWithHybrid} />);
      
      const personIcon = document.querySelector('img[alt="in person"]');
      expect(personIcon).toHaveAttribute('src', '/icons/person-black.svg');
      expect(personIcon).toHaveAttribute('width', '14');
      expect(personIcon).toHaveAttribute('height', '14');
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
      expect(virtualIcon).toHaveAttribute('width', '14');
      expect(virtualIcon).toHaveAttribute('height', '14');
      
      const plusSign = document.querySelector('.event__type__hybrid span');
      expect(plusSign).toHaveTextContent('+');
    });

    it('renders HYBRID type as div element', () => {
      const propsWithHybrid = {
        event: {
          format: 'HYBRID',
        },
      };
      
      render(<EventType {...propsWithHybrid} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType?.tagName).toBe('DIV');
    });
  });

  describe('VIRTUAL Event Type', () => {
    it('renders VIRTUAL type with correct structure', () => {
      const propsWithVirtual = {
        event: {
          format: 'VIRTUAL',
        },
      };
      
      render(<EventType {...propsWithVirtual} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toBeInTheDocument();
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveTextContent('Virtual');
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      expect(virtualIcon).toHaveAttribute('src', '/icons/virtual.svg');
      expect(virtualIcon).toHaveAttribute('width', '14');
      expect(virtualIcon).toHaveAttribute('height', '14');
    });

    it('renders VIRTUAL type as div element', () => {
      const propsWithVirtual = {
        event: {
          format: 'VIRTUAL',
        },
      };
      
      render(<EventType {...propsWithVirtual} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType?.tagName).toBe('DIV');
    });
  });

  describe('Unknown Event Type', () => {
    it('renders nothing when event format is unknown', () => {
      const propsWithUnknownFormat = {
        event: {
          format: 'UNKNOWN',
        },
      };
      
      const { container } = render(<EventType {...propsWithUnknownFormat} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when event format is empty string', () => {
      const propsWithEmptyFormat = {
        event: {
          format: '',
        },
      };
      
      const { container } = render(<EventType {...propsWithEmptyFormat} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop', () => {
      const { container } = render(<EventType />);
      
      expect(container.firstChild).toBeNull();
    });

    it('handles null event prop', () => {
      const propsWithNullEvent = {
        event: null,
      };
      
      const { container } = render(<EventType {...propsWithNullEvent} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('handles undefined event prop', () => {
      const propsWithUndefinedEvent = {
        event: undefined,
      };
      
      const { container } = render(<EventType {...propsWithUndefinedEvent} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Structure', () => {
    it('applies correct CSS classes for IN-PERSON type', () => {
      const propsWithInPerson = {
        event: {
          format: 'IN-PERSON',
        },
      };
      
      render(<EventType {...propsWithInPerson} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toHaveClass('event__type');
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveClass('event__type__txt');
    });

    it('applies correct CSS classes for HYBRID type', () => {
      const propsWithHybrid = {
        event: {
          format: 'HYBRID',
        },
      };
      
      render(<EventType {...propsWithHybrid} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toHaveClass('event__type');
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveClass('event__type__txt');
      
      const hybridContainer = document.querySelector('.event__type__hybrid');
      expect(hybridContainer).toHaveClass('event__type__hybrid');
    });

    it('applies correct CSS classes for VIRTUAL type', () => {
      const propsWithVirtual = {
        event: {
          format: 'VIRTUAL',
        },
      };
      
      render(<EventType {...propsWithVirtual} />);
      
      const eventType = document.querySelector('.event__type');
      expect(eventType).toHaveClass('event__type');
      
      const eventTypeTxt = document.querySelector('.event__type__txt');
      expect(eventTypeTxt).toHaveClass('event__type__txt');
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for IN-PERSON icon', () => {
      const propsWithInPerson = {
        event: {
          format: 'IN-PERSON',
        },
      };
      
      render(<EventType {...propsWithInPerson} />);
      
      const personIcon = document.querySelector('img[alt="in person"]');
      expect(personIcon).toHaveAttribute('alt', 'in person');
    });

    it('provides proper alt text for VIRTUAL icon', () => {
      const propsWithVirtual = {
        event: {
          format: 'VIRTUAL',
        },
      };
      
      render(<EventType {...propsWithVirtual} />);
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      expect(virtualIcon).toHaveAttribute('alt', 'virtual');
    });

    it('provides proper alt text for HYBRID icons', () => {
      const propsWithHybrid = {
        event: {
          format: 'HYBRID',
        },
      };
      
      render(<EventType {...propsWithHybrid} />);
      
      const personIcon = document.querySelector('img[alt="in person"]');
      expect(personIcon).toHaveAttribute('alt', 'in person');
      
      const virtualIcon = document.querySelector('img[alt="virtual"]');
      expect(virtualIcon).toHaveAttribute('alt', 'virtual');
    });
  });

  describe('Edge Cases', () => {
    it('handles event with only format property', () => {
      const propsWithMinimalEvent = {
        event: {
          format: 'IN-PERSON',
        },
      };
      
      render(<EventType {...propsWithMinimalEvent} />);
      
      expect(screen.getByText('In-Person')).toBeInTheDocument();
    });

    it('handles event with multiple properties', () => {
      const propsWithFullEvent = {
        event: {
          format: 'VIRTUAL',
          name: 'Test Event',
          description: 'Test Description',
          date: '2025-01-01',
        },
      };
      
      render(<EventType {...propsWithFullEvent} />);
      
      expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('handles case-sensitive format values', () => {
      const propsWithLowerCaseFormat = {
        event: {
          format: 'in-person', // lowercase
        },
      };
      
      const { container } = render(<EventType {...propsWithLowerCaseFormat} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('handles format with extra whitespace', () => {
      const propsWithWhitespaceFormat = {
        event: {
          format: ' IN-PERSON ', // with whitespace
        },
      };
      
      const { container } = render(<EventType {...propsWithWhitespaceFormat} />);
      
      expect(container.firstChild).toBeNull();
    });
  });
});
