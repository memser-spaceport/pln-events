import { renderHook } from '@testing-library/react';
import useEscapeClicked from '@/hooks/use-escape-clicked';

// Mock document methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  document.addEventListener = mockAddEventListener;
  document.removeEventListener = mockRemoveEventListener;
});

describe('useEscapeClicked Hook', () => {
  it('adds keydown event listener on mount', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes keydown event listener on unmount', () => {
    const callback = jest.fn();
    
    const { unmount } = renderHook(() => useEscapeClicked(callback));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('calls callback when Escape key is pressed', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with Escape key
    const mockEvent = {
      key: 'Escape',
    } as KeyboardEvent;
    
    eventHandler(mockEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when other keys are pressed', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Test various non-Escape keys
    const nonEscapeKeys = ['Enter', 'Space', 'Tab', 'ArrowUp', 'ArrowDown', 'a', '1', 'F1'];
    
    nonEscapeKeys.forEach((key) => {
      const mockEvent = { key } as KeyboardEvent;
      eventHandler(mockEvent);
    });
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('handles multiple Escape key presses', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate multiple Escape key presses
    for (let i = 0; i < 5; i++) {
      const mockEvent = { key: 'Escape' } as KeyboardEvent;
      eventHandler(mockEvent);
    }
    
    expect(callback).toHaveBeenCalledTimes(5);
  });

  it('handles case sensitivity correctly', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Test different cases of Escape
    const escapeVariations = ['Escape', 'escape', 'ESCAPE', 'Esc'];
    
    escapeVariations.forEach((key) => {
      const mockEvent = { key } as KeyboardEvent;
      eventHandler(mockEvent);
    });
    
    // Only 'Escape' should trigger the callback
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('works with different callback functions', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    const { rerender } = renderHook(
      ({ callback }) => useEscapeClicked(callback),
      { initialProps: { callback: callback1 } }
    );
    
    // Get the event handler that was registered
    const eventHandler1 = mockAddEventListener.mock.calls[0][1];
    
    // Test with first callback
    const mockEvent = { key: 'Escape' } as KeyboardEvent;
    eventHandler1(mockEvent);
    
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
    
    // Rerender with different callback
    rerender({ callback: callback2 });
    
    // Get the new event handler
    const eventHandler2 = mockAddEventListener.mock.calls[1][1];
    
    // Test with second callback
    eventHandler2(mockEvent);
    
    expect(callback1).toHaveBeenCalledTimes(1); // Should not change
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('handles rapid key presses', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate rapid key presses
    const keys = ['a', 'Escape', 'b', 'Escape', 'c', 'Escape', 'd'];
    
    keys.forEach((key) => {
      const mockEvent = { key } as KeyboardEvent;
      eventHandler(mockEvent);
    });
    
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('maintains correct event listener reference for cleanup', () => {
    const callback = jest.fn();
    
    const { unmount } = renderHook(() => useEscapeClicked(callback));
    
    // Verify addEventListener was called
    const addCall = mockAddEventListener.mock.calls[0];
    expect(addCall[0]).toBe('keydown');
    expect(typeof addCall[1]).toBe('function');
    
    // Unmount to trigger removeEventListener
    unmount();
    
    // Verify removeEventListener was called
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    const removeCall = mockRemoveEventListener.mock.calls[0];
    expect(removeCall[0]).toBe('keydown');
    expect(typeof removeCall[1]).toBe('function');
    
    // Should have been called once for add, once for remove
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('handles callback that throws an error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const callback = jest.fn(() => {
      throw new Error('Callback error');
    });
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with Escape key
    const mockEvent = { key: 'Escape' } as KeyboardEvent;
    
    // The callback will throw, but we need to catch it
    expect(() => {
      eventHandler(mockEvent);
    }).toThrow('Callback error');
    
    expect(callback).toHaveBeenCalledTimes(1);
    
    consoleSpy.mockRestore();
  });

  it('works with arrow function callbacks', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    const mockEvent = { key: 'Escape' } as KeyboardEvent;
    eventHandler(mockEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles undefined callback gracefully', () => {
    const callback = undefined as any;
    
    // Should not throw when callback is undefined
    expect(() => {
      renderHook(() => useEscapeClicked(callback));
    }).not.toThrow();
  });

  it('handles null callback gracefully', () => {
    const callback = null as any;
    
    // Should not throw when callback is null
    expect(() => {
      renderHook(() => useEscapeClicked(callback));
    }).not.toThrow();
  });

  it('works with different event properties', () => {
    const callback = jest.fn();
    
    renderHook(() => useEscapeClicked(callback));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Test with different event properties
    const mockEvent = {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
    } as KeyboardEvent;
    
    eventHandler(mockEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles multiple hook instances', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    renderHook(() => useEscapeClicked(callback1));
    renderHook(() => useEscapeClicked(callback2));
    
    // Both should register event listeners
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    
    // Get both event handlers
    const eventHandler1 = mockAddEventListener.mock.calls[0][1];
    const eventHandler2 = mockAddEventListener.mock.calls[1][1];
    
    const mockEvent = { key: 'Escape' } as KeyboardEvent;
    
    eventHandler1(mockEvent);
    eventHandler2(mockEvent);
    
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
