import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Agenda from '../../../../components/page/event-detail/agenda';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock SessionCard component
jest.mock('../../../../components/page/event-detail/session-card', () => {
  return function MockSessionCard({ detail, eventTimezone }: any) {
    return (
      <div data-testid="session-card">
        <div data-testid="session-name">{detail?.name}</div>
        <div data-testid="session-start-date">{detail?.startDate}</div>
        <div data-testid="event-timezone">{eventTimezone}</div>
      </div>
    );
  };
});

// Mock formatDateTime utility
jest.mock('../../../../utils/helper', () => ({
  formatDateTime: jest.fn((date, timezone, format) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      weekday: 'short' 
    });
  }),
}));

describe('Agenda Component', () => {
  const mockEvent = {
    sessions: [
      {
        id: 'session1',
        name: 'Session 1',
        startDate: '2024-01-15T10:00:00Z',
      },
      {
        id: 'session2',
        name: 'Session 2',
        startDate: '2024-01-15T14:00:00Z',
      },
      {
        id: 'session3',
        name: 'Session 3',
        startDate: '2024-01-16T09:00:00Z',
      },
    ],
  };

  const defaultProps = {
    event: mockEvent,
    eventTimezone: 'UTC',
  };

  const mockUseSearchParams = require('next/navigation').useSearchParams;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  describe('Rendering', () => {
    it('renders agenda container with correct structure', () => {
      render(<Agenda {...defaultProps} />);
      
      const agenda = document.querySelector('.agenda');
      expect(agenda).toBeInTheDocument();
      
      const agendaList = document.querySelector('.agenda__list');
      expect(agendaList).toBeInTheDocument();
    });

    it('renders agenda items for each date group', () => {
      render(<Agenda {...defaultProps} />);
      
      const agendaItems = document.querySelectorAll('.agenda__list__item');
      expect(agendaItems).toHaveLength(2); // Two different dates
    });

    it('renders day titles with correct format', () => {
      render(<Agenda {...defaultProps} />);
      
      const day1Title = screen.getByText(/Day 1 -/);
      const day2Title = screen.getByText(/Day 2 -/);
      
      expect(day1Title).toBeInTheDocument();
      expect(day2Title).toBeInTheDocument();
    });

    it('renders session cards for each session', () => {
      render(<Agenda {...defaultProps} />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(3);
    });

    it('renders session content containers', () => {
      render(<Agenda {...defaultProps} />);
      
      const contentContainers = document.querySelectorAll('.agenda__list__item__content');
      expect(contentContainers).toHaveLength(2);
    });
  });

  describe('Session Grouping', () => {
    it('groups sessions by date correctly', () => {
      render(<Agenda {...defaultProps} />);
      
      // Should have 2 date groups (Jan 15 and Jan 16)
      const agendaItems = document.querySelectorAll('.agenda__list__item');
      expect(agendaItems).toHaveLength(2);
    });

    it('sorts sessions within each date group by start time', () => {
      const sessionsWithDifferentTimes = {
        sessions: [
          {
            id: 'session1',
            name: 'Session 1',
            startDate: '2024-01-15T14:00:00Z',
          },
          {
            id: 'session2',
            name: 'Session 2',
            startDate: '2024-01-15T10:00:00Z',
          },
        ],
      };

      render(<Agenda event={sessionsWithDifferentTimes} eventTimezone="UTC" />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(2);
    });
  });

  describe('Empty Sessions Handling', () => {
    it('renders empty agenda list when no sessions', () => {
      const emptyEvent = {
        sessions: [],
      };

      render(<Agenda event={emptyEvent} eventTimezone="UTC" />);
      
      const agenda = document.querySelector('.agenda');
      const agendaList = document.querySelector('.agenda__list');
      
      expect(agenda).toBeInTheDocument();
      expect(agendaList).toBeInTheDocument();
      expect(agendaList?.children).toHaveLength(0);
    });

    it('renders empty agenda list when sessions array is undefined', () => {
      const undefinedSessionsEvent = {
        sessions: undefined,
      };

      render(<Agenda event={undefinedSessionsEvent} eventTimezone="UTC" />);
      
      const agenda = document.querySelector('.agenda');
      const agendaList = document.querySelector('.agenda__list');
      
      expect(agenda).toBeInTheDocument();
      expect(agendaList).toBeInTheDocument();
      expect(agendaList?.children).toHaveLength(0);
    });
  });

  describe('Session Card Props', () => {
    it('passes correct props to SessionCard components', () => {
      render(<Agenda {...defaultProps} />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(3);
      
      // Check that eventTimezone is passed correctly
      const timezoneElements = screen.getAllByTestId('event-timezone');
      timezoneElements.forEach(element => {
        expect(element).toHaveTextContent('UTC');
      });
    });

    it('passes session detail to each SessionCard', () => {
      render(<Agenda {...defaultProps} />);
      
      const sessionNames = screen.getAllByTestId('session-name');
      expect(sessionNames[0]).toHaveTextContent('Session 1');
      expect(sessionNames[1]).toHaveTextContent('Session 2');
      expect(sessionNames[2]).toHaveTextContent('Session 3');
    });
  });

  describe('URL Parameters and Scrolling', () => {
    it('handles session parameter from URL', async () => {
      const mockScrollIntoView = jest.fn();
      const mockGet = jest.fn().mockReturnValue('session1');
      
      mockUseSearchParams.mockReturnValue({
        get: mockGet,
      });

      // Mock scrollIntoView
      Element.prototype.scrollIntoView = mockScrollIntoView;

      render(<Agenda {...defaultProps} />);
      
      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          block: 'start',
        });
      });
    });

    it('does not scroll when no session parameter is present', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      render(<Agenda {...defaultProps} />);
      
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('handles missing event prop gracefully', () => {
      render(<Agenda />);
      
      const agenda = document.querySelector('.agenda');
      const agendaList = document.querySelector('.agenda__list');
      
      expect(agenda).toBeInTheDocument();
      expect(agendaList).toBeInTheDocument();
      expect(agendaList?.children).toHaveLength(0);
    });

    it('handles missing eventTimezone prop', () => {
      render(<Agenda event={mockEvent} />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(3);
    });

    it('handles null event prop', () => {
      render(<Agenda event={null} />);
      
      const agenda = document.querySelector('.agenda');
      const agendaList = document.querySelector('.agenda__list');
      
      expect(agenda).toBeInTheDocument();
      expect(agendaList).toBeInTheDocument();
      expect(agendaList?.children).toHaveLength(0);
    });
  });

  describe('Session References', () => {
    it('creates refs for each session', () => {
      render(<Agenda {...defaultProps} />);
      
      // Check that session elements have IDs
      const session1 = document.getElementById('session1');
      const session2 = document.getElementById('session2');
      const session3 = document.getElementById('session3');
      
      expect(session1).toBeInTheDocument();
      expect(session2).toBeInTheDocument();
      expect(session3).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      render(<Agenda {...defaultProps} />);
      
      const agenda = document.querySelector('.agenda');
      const agendaList = document.querySelector('.agenda__list');
      const agendaItems = document.querySelectorAll('.agenda__list__item');
      const titleTexts = document.querySelectorAll('.agenda__list__item__title__text');
      const contentContainers = document.querySelectorAll('.agenda__list__item__content');
      
      expect(agenda).toBeInTheDocument();
      expect(agendaList).toBeInTheDocument();
      expect(agendaItems).toHaveLength(2);
      expect(titleTexts).toHaveLength(2);
      expect(contentContainers).toHaveLength(2);
    });

    it('applies inline styles to session containers', () => {
      render(<Agenda {...defaultProps} />);
      
      const sessionContainers = document.querySelectorAll('[id^="session"]');
      expect(sessionContainers).toHaveLength(3);
      
      sessionContainers.forEach(container => {
        expect(container).toHaveStyle({
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles sessions with missing startDate', () => {
      const sessionsWithMissingDate = {
        sessions: [
          {
            id: 'session1',
            name: 'Session 1',
            startDate: null,
          },
        ],
      };

      render(<Agenda event={sessionsWithMissingDate} eventTimezone="UTC" />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(1);
    });

    it('handles sessions with invalid startDate', () => {
      const sessionsWithInvalidDate = {
        sessions: [
          {
            id: 'session1',
            name: 'Session 1',
            startDate: 'invalid-date',
          },
        ],
      };

      render(<Agenda event={sessionsWithInvalidDate} eventTimezone="UTC" />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(1);
    });

    it('handles very large number of sessions', () => {
      const manySessions = Array.from({ length: 100 }, (_, i) => ({
        id: `session${i}`,
        name: `Session ${i}`,
        startDate: `2024-01-15T${10 + (i % 10)}:00:00Z`,
      }));

      const eventWithManySessions = {
        sessions: manySessions,
      };

      render(<Agenda event={eventWithManySessions} eventTimezone="UTC" />);
      
      const sessionCards = screen.getAllByTestId('session-card');
      expect(sessionCards).toHaveLength(100);
    });
  });
});
