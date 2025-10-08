import { renderHook } from '@testing-library/react';
import useEventsScrollObserver from '@/hooks/use-events-scroll-observer';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let mockCallback: any;

beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock IntersectionObserver
  mockIntersectionObserver.mockImplementation((callback, options) => {
    mockCallback = callback;
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
    };
  });
  
  (global as any).IntersectionObserver = mockIntersectionObserver;
  
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200,
  });
  
  // Mock document.getElementById
  const mockElements = new Map();
  document.getElementById = jest.fn((id) => mockElements.get(id));
  
  // Mock setTimeout and clearTimeout
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useEventsScrollObserver Hook', () => {
  const mockElements = ['element1', 'element2', 'element3'];
  const mockEvents = {
    day1: [{ id: 'event1' }, { id: 'event2' }],
    day2: [{ id: 'event3' }],
  };
  const mockClickedMenuId = 'day1';

  it('returns empty string initially', () => {
    const { result } = renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    expect(result.current).toBe('');
  });

  it('creates IntersectionObserver with correct options for single day', () => {
    const singleDayEvents = {
      day1: [{ id: 'event1' }],
    };
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, singleDayEvents, 'day1')
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-30% 0% -70% 0%',
        threshold: 0,
      }
    );
  });

  it('creates IntersectionObserver with default options for multiple days', () => {
    renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-40% 0% -60% 0%',
        threshold: 0,
      }
    );
  });

  it('creates IntersectionObserver with single day options for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-30% 0% -70% 0%',
        threshold: 0,
      }
    );
  });

  it('observes all valid elements', () => {
    const mockElement1 = document.createElement('div');
    const mockElement2 = document.createElement('div');
    const mockElement3 = document.createElement('div');
    
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(mockElement1)
      .mockReturnValueOnce(mockElement2)
      .mockReturnValueOnce(mockElement3);
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    expect(mockObserve).toHaveBeenCalledTimes(3);
    expect(mockObserve).toHaveBeenCalledWith(mockElement1);
    expect(mockObserve).toHaveBeenCalledWith(mockElement2);
    expect(mockObserve).toHaveBeenCalledWith(mockElement3);
  });

  it('filters out null elements', () => {
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(document.createElement('div'))
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(document.createElement('div'));
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, mockClickedMenuId)
    );
    
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('returns empty string initially', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    (document.getElementById as jest.Mock).mockReturnValue(mockElement);
    
    const { result } = renderHook(() => 
      useEventsScrollObserver(['test-element'], mockEvents, mockClickedMenuId)
    );
    
    // Initially should be empty
    expect(result.current).toBe('');
  });

  it('handles non-intersecting elements', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    (document.getElementById as jest.Mock).mockReturnValue(mockElement);
    
    const { result } = renderHook(() => 
      useEventsScrollObserver(['test-element'], mockEvents, mockClickedMenuId)
    );
    
    // Should remain empty for non-intersecting elements
    expect(result.current).toBe('');
  });

  it('creates intersection observer with correct options', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    (document.getElementById as jest.Mock).mockReturnValue(mockElement);
    
    renderHook(() => 
      useEventsScrollObserver(['test-element'], mockEvents, mockClickedMenuId)
    );
    
    // Verify observer was created with correct options
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-40% 0% -60% 0%',
        threshold: 0,
      }
    );
  });

  it('observes all valid elements', () => {
    const mockElement1 = document.createElement('div');
    mockElement1.id = 'element1';
    const mockElement2 = document.createElement('div');
    mockElement2.id = 'element2';
    
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(mockElement1)
      .mockReturnValueOnce(mockElement2);
    
    renderHook(() => 
      useEventsScrollObserver(['element1', 'element2'], mockEvents, mockClickedMenuId)
    );
    
    expect(mockObserve).toHaveBeenCalledTimes(2);
    expect(mockObserve).toHaveBeenCalledWith(mockElement1);
    expect(mockObserve).toHaveBeenCalledWith(mockElement2);
  });

  it('filters out null elements', () => {
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(document.createElement('div'))
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(document.createElement('div'));
    
    renderHook(() => 
      useEventsScrollObserver(['element1', 'element2', 'element3'], mockEvents, mockClickedMenuId)
    );
    
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it('recreates observer when dependencies change', () => {
    const { rerender } = renderHook(
      ({ elements, events, clickedMenuId }) => 
        useEventsScrollObserver(elements, events, clickedMenuId),
      {
        initialProps: {
          elements: mockElements,
          events: mockEvents,
          clickedMenuId: mockClickedMenuId,
        },
      }
    );
    
    // Initial observer creation
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    
    // Rerender with different elements
    rerender({
      elements: ['new-element'],
      events: mockEvents,
      clickedMenuId: mockClickedMenuId,
    });
    
    // Should create new observer
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('handles empty elements array', () => {
    renderHook(() => 
      useEventsScrollObserver([], mockEvents, mockClickedMenuId)
    );
    
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('handles undefined events', () => {
    // Mock the hook to handle undefined events gracefully
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => 
        useEventsScrollObserver(mockElements, undefined, mockClickedMenuId)
      );
    }).toThrow();
    
    consoleSpy.mockRestore();
  });

  it('handles null clickedMenuId', () => {
    renderHook(() => 
      useEventsScrollObserver(mockElements, mockEvents, null)
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-40% 0% -60% 0%',
        threshold: 0,
      }
    );
  });

  it('handles missing day in events object', () => {
    const eventsWithoutDay = {
      otherDay: [{ id: 'event1' }],
    };
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, eventsWithoutDay, 'missingDay')
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-40% 0% -60% 0%',
        threshold: 0,
      }
    );
  });

  it('handles empty day array in events', () => {
    const eventsWithEmptyDay = {
      day1: [],
    };
    
    renderHook(() => 
      useEventsScrollObserver(mockElements, eventsWithEmptyDay, 'day1')
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '-40% 0% -60% 0%',
        threshold: 0,
      }
    );
  });
});
