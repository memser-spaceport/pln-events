import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScheduleTemplate from '@/components/page/event-detail/schedule-template';
import { AGENDA_COMING_SOON } from '@/utils/constants';

// Mock the formatDateTime helper function
jest.mock('@/utils/helper', () => ({
  formatDateTime: jest.fn((date, timezone, format) => {
    if (format === 'Do MMM') {
      return '1st Jan';
    }
    if (format === 'YYYY-MM-DDTHH:mm:ssZ') {
      return '2025-01-01T10:00:00Z';
    }
    if (format === 'h:mm A') {
      // Handle null/undefined dates
      if (!date) {
        return '12:00 PM';
      }
      // Return different times based on the input date to simulate different session times
      if (date.includes('11:00:00Z')) {
        return '11:00 AM';
      }
      if (date.includes('12:30:00Z')) {
        return '12:30 PM';
      }
      if (date.includes('16:00:00Z')) {
        return '4:00 PM';
      }
      return '10:00 AM';
    }
    return '2025-01-01T10:00:00Z';
  }),
}));

const mockFormatDateTime = require('@/utils/helper').formatDateTime as jest.MockedFunction<any>;

describe('ScheduleTemplate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when no sessions are provided', () => {
      const props = {
        event: { sessions: [] },
        eventDateRange: 'Jan 1-3, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      expect(screen.getByText(AGENDA_COMING_SOON)).toBeInTheDocument();
      expect(screen.getByText(AGENDA_COMING_SOON)).toHaveClass('schedule__empty');
    });

    it('renders empty state when sessions is undefined', () => {
      const props = {
        event: {},
        eventDateRange: 'Jan 1-3, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      expect(screen.getByText(AGENDA_COMING_SOON)).toBeInTheDocument();
    });

    it('renders empty state when sessions is null', () => {
      const props = {
        event: { sessions: null },
        eventDateRange: 'Jan 1-3, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      expect(screen.getByText(AGENDA_COMING_SOON)).toBeInTheDocument();
    });
  });

  describe('Schedule Header', () => {
    it('renders schedule header with event date range', () => {
      const props = {
        event: { sessions: [] },
        eventDateRange: 'Jan 1-3, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const filterIcon = screen.getByAltText('filter icon');
      const dateText = screen.getByText('Jan 1-3, 2025');

      expect(filterIcon).toHaveAttribute('src', '/icons/filter-blue.svg');
      expect(dateText).toHaveClass('schedule__date__text');
    });

    it('renders schedule header with empty event date range', () => {
      const props = {
        event: { sessions: [] },
        eventDateRange: '',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const dateText = document.querySelector('.schedule__date__text');
      expect(dateText).toHaveClass('schedule__date__text');
      expect(dateText).toHaveTextContent('');
    });
  });

  describe('Sessions Display', () => {
    const mockSessions = [
      {
        name: 'Opening Keynote',
        startDate: '2025-01-01T10:00:00Z',
        endDate: '2025-01-01T11:00:00Z',
        description: 'Welcome to the conference'
      },
      {
        name: 'Panel Discussion',
        startDate: '2025-01-01T11:30:00Z',
        endDate: '2025-01-01T12:30:00Z',
        description: 'Discussion about future trends'
      },
      {
        name: 'Workshop Session',
        startDate: '2025-01-01T14:00:00Z',
        endDate: '2025-01-01T16:00:00Z',
        description: 'Hands-on workshop'
      }
    ];

    it('renders sessions with correct structure', () => {
      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      // Check that all session titles are rendered
      expect(screen.getByText('Opening Keynote')).toBeInTheDocument();
      expect(screen.getByText('Panel Discussion')).toBeInTheDocument();
      expect(screen.getByText('Workshop Session')).toBeInTheDocument();

      // Check that time information is rendered
      expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 12:30 PM')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 4:00 PM')).toBeInTheDocument();

      // Check that date is rendered
      const dateElements = screen.getAllByText('1st Jan');
      expect(dateElements).toHaveLength(3);
    });

    it('renders sessions with correct CSS classes', () => {
      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const meetingElements = document.querySelectorAll('.schedule__list__meeting');
      expect(meetingElements).toHaveLength(3);

      meetingElements.forEach(element => {
        expect(element).toHaveClass('schedule__list__meeting');
      });
    });

    it('renders time information with correct structure', () => {
      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const timeIcons = screen.getAllByAltText('time logo');
      expect(timeIcons).toHaveLength(3);

      timeIcons.forEach(icon => {
        expect(icon).toHaveAttribute('src', '/icons/clock.svg');
        expect(icon).toHaveAttribute('width', '16');
        expect(icon).toHaveAttribute('height', '16');
      });
    });
  });

  describe('Session Descriptions', () => {
    const mockSessionsWithDescriptions = [
      {
        name: 'Session with Description',
        startDate: '2025-01-01T10:00:00Z',
        endDate: '2025-01-01T11:00:00Z',
        description: 'This is a detailed description of the session'
      },
      {
        name: 'Session without Description',
        startDate: '2025-01-01T11:30:00Z',
        endDate: '2025-01-01T12:30:00Z'
      }
    ];

    it('shows description when session is clicked and has description', () => {
      const props = {
        event: { sessions: mockSessionsWithDescriptions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const sessionWithDescription = screen.getByText('Session with Description');
      const sessionElement = sessionWithDescription.closest('.schedule__list__meeting');

      // Initially description should not be visible
      expect(screen.queryByText('This is a detailed description of the session')).not.toBeInTheDocument();

      // Click on the session
      fireEvent.click(sessionElement!);

      // Description should now be visible
      expect(screen.getByText('This is a detailed description of the session')).toBeInTheDocument();
      expect(screen.getByText('This is a detailed description of the session')).toHaveClass('schedule__list__meeting__desc');
    });

    it('toggles description visibility when clicked multiple times', () => {
      const props = {
        event: { sessions: mockSessionsWithDescriptions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const sessionWithDescription = screen.getByText('Session with Description');
      const sessionElement = sessionWithDescription.closest('.schedule__list__meeting');

      // Click to show description
      fireEvent.click(sessionElement!);
      expect(screen.getByText('This is a detailed description of the session')).toBeInTheDocument();

      // Click again to hide description
      fireEvent.click(sessionElement!);
      expect(screen.queryByText('This is a detailed description of the session')).not.toBeInTheDocument();

      // Click again to show description
      fireEvent.click(sessionElement!);
      expect(screen.getByText('This is a detailed description of the session')).toBeInTheDocument();
    });

    it('does not show description when session has no description', () => {
      const props = {
        event: { sessions: mockSessionsWithDescriptions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const sessionWithoutDescription = screen.getByText('Session without Description');
      const sessionElement = sessionWithoutDescription.closest('.schedule__list__meeting');

      // Click on session without description
      fireEvent.click(sessionElement!);

      // No description should be shown
      expect(screen.queryByText('This is a detailed description of the session')).not.toBeInTheDocument();
    });

    it('handles multiple sessions with descriptions independently', () => {
      const mockSessions = [
        {
          name: 'Session 1',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z',
          description: 'Description 1'
        },
        {
          name: 'Session 2',
          startDate: '2025-01-01T11:30:00Z',
          endDate: '2025-01-01T12:30:00Z',
          description: 'Description 2'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const session1 = screen.getByText('Session 1').closest('.schedule__list__meeting');
      const session2 = screen.getByText('Session 2').closest('.schedule__list__meeting');

      // Click on first session
      fireEvent.click(session1!);
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.queryByText('Description 2')).not.toBeInTheDocument();

      // Click on second session
      fireEvent.click(session2!);
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();

      // Click on first session again to hide its description
      fireEvent.click(session1!);
      expect(screen.queryByText('Description 1')).not.toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  describe('Date Grouping', () => {
    it('groups sessions by date correctly', () => {
      const mockSessions = [
        {
          name: 'Morning Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        },
        {
          name: 'Afternoon Session',
          startDate: '2025-01-01T14:00:00Z',
          endDate: '2025-01-01T15:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      // formatDateTime should be called for grouping
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T10:00:00Z', 'America/New_York', 'Do MMM');
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T14:00:00Z', 'America/New_York', 'Do MMM');
    });

    it('sorts sessions within each date group', () => {
      const mockSessions = [
        {
          name: 'Later Session',
          startDate: '2025-01-01T14:00:00Z',
          endDate: '2025-01-01T15:00:00Z'
        },
        {
          name: 'Earlier Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      // formatDateTime should be called for sorting
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T14:00:00Z', 'America/New_York', 'YYYY-MM-DDTHH:mm:ssZ');
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T10:00:00Z', 'America/New_York', 'YYYY-MM-DDTHH:mm:ssZ');
    });
  });

  describe('Time Formatting', () => {
    it('formats time range correctly', () => {
      const mockSessions = [
        {
          name: 'Test Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      // formatDateTime should be called for time formatting
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T10:00:00Z', 'America/New_York', 'h:mm A');
      expect(mockFormatDateTime).toHaveBeenCalledWith('2025-01-01T11:00:00Z', 'America/New_York', 'h:mm A');
    });
  });

  describe('Component Structure', () => {
    it('renders with correct CSS classes', () => {
      const props = {
        event: { sessions: [] },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const scheduleElement = document.querySelector('.schedule');
      const dateElement = document.querySelector('.schedule__date');
      const listElement = document.querySelector('.schedule__list');

      expect(scheduleElement).toBeInTheDocument();
      expect(dateElement).toBeInTheDocument();
      expect(listElement).toBeInTheDocument();
    });

    it('renders session elements with correct structure', () => {
      const mockSessions = [
        {
          name: 'Test Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const meetingElement = document.querySelector('.schedule__list__meeting');
      const titleElement = document.querySelector('.schedule__list__meeting__title');
      const infoElement = document.querySelector('.schedule__list__meeting__info');
      const timeElement = document.querySelector('.schedule__list__meeting__info__time');
      const dateElement = document.querySelector('.schedule__list__meeting__info__date');

      expect(meetingElement).toBeInTheDocument();
      expect(titleElement).toBeInTheDocument();
      expect(infoElement).toBeInTheDocument();
      expect(timeElement).toBeInTheDocument();
      expect(dateElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing event prop', () => {
      const props = {
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      expect(screen.getByText(AGENDA_COMING_SOON)).toBeInTheDocument();
    });

    it('handles missing eventDateRange prop', () => {
      const props = {
        event: { sessions: [] },
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const dateText = document.querySelector('.schedule__date__text');
      expect(dateText).toHaveClass('schedule__date__text');
      expect(dateText).toHaveTextContent('');
    });

    it('handles missing eventTimezone prop', () => {
      const mockSessions = [
        {
          name: 'Test Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025'
      };

      render(<ScheduleTemplate {...props} />);

      // Should still render sessions even without timezone
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });

    it('handles sessions with missing properties', () => {
      const mockSessions = [
        {
          name: 'Session with missing dates',
          startDate: null,
          endDate: null
        },
        {
          name: 'Session with missing name',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      // Should still render the session names
      expect(screen.getByText('Session with missing dates')).toBeInTheDocument();
      expect(screen.getByText('Session with missing name')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for icons', () => {
      const props = {
        event: { sessions: [] },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const filterIcon = screen.getByAltText('filter icon');
      expect(filterIcon).toHaveAttribute('src', '/icons/filter-blue.svg');
    });

    it('has proper heading structure for session titles', () => {
      const mockSessions = [
        {
          name: 'Test Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const titleElement = screen.getByRole('heading', { level: 6 });
      expect(titleElement).toHaveTextContent('Test Session');
      expect(titleElement).toHaveClass('schedule__list__meeting__title');
    });

    it('has clickable session elements', () => {
      const mockSessions = [
        {
          name: 'Clickable Session',
          startDate: '2025-01-01T10:00:00Z',
          endDate: '2025-01-01T11:00:00Z',
          description: 'This session is clickable'
        }
      ];

      const props = {
        event: { sessions: mockSessions },
        eventDateRange: 'Jan 1, 2025',
        eventTimezone: 'America/New_York'
      };

      render(<ScheduleTemplate {...props} />);

      const meetingElement = document.querySelector('.schedule__list__meeting');
      expect(meetingElement).toHaveClass('schedule__list__meeting');
      expect(meetingElement).toHaveStyle('cursor: pointer');
    });
  });
});
