import { renderHook, act, waitFor } from '@testing-library/react';
import { useHash } from '@/hooks/use-hash';

// Mock window.location
let mockHash = '#test-hash';
const mockLocation = {
  get hash() {
    return mockHash;
  },
  set hash(value) {
    mockHash = value;
  },
  href: 'https://example.com#test-hash',
};

// Helper function to simulate hash change
const simulateHashChange = (newHash: string) => {
  mockHash = newHash;
};

// Mock window methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockHash = '#test-hash';
  
  // Mock window.location
  delete (window as any).location;
  window.location = mockLocation as any;
  
  // Mock window methods
  window.addEventListener = mockAddEventListener;
  window.removeEventListener = mockRemoveEventListener;
});

describe('useHash Hook', () => {
  it('returns initial hash value', () => {
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#test-hash');
  });

  it('adds hashchange event listener on mount', () => {
    renderHook(() => useHash());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });

  it('removes hashchange event listener on unmount', () => {
    const { unmount } = renderHook(() => useHash());
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });

  it('updates hash when hashchange event fires', () => {
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Debug: Check initial state
    console.log('Initial hashes:', result.current);
    console.log('Mock location hash:', mockLocation.hash);
    
    // Simulate hash change by updating the mock location
    act(() => {
      mockLocation.hash = '#new-hash';
      console.log('After setting hash:', mockLocation.hash);
      eventHandler();
      console.log('After event handler:', result.current);
    });
    
    console.log('Final hash:', result.current);
    expect(result.current).toBe('#new-hash');
  });

  it('handles multiple hash changes', () => {
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate multiple hash changes
    act(() => {
      mockLocation.hash = '#hash1';
      eventHandler();
    });
    expect(result.current).toBe('#hash1');
    
    act(() => {
      mockLocation.hash = '#hash2';
      eventHandler();
    });
    expect(result.current).toBe('#hash2');
    
    act(() => {
      mockLocation.hash = '#hash3';
      eventHandler();
    });
    expect(result.current).toBe('#hash3');
  });

  it('handles empty hash', () => {
    mockLocation.hash = '';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('');
  });

  it('handles hash with special characters', () => {
    mockLocation.hash = '#test-hash-with-special-chars-!@#$%^&*()';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#test-hash-with-special-chars-!@#$%^&*()');
  });

  it('handles hash with spaces', () => {
    mockLocation.hash = '#test hash with spaces';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#test hash with spaces');
  });

  it('handles hash with unicode characters', () => {
    mockLocation.hash = '#test-hash-中文-🚀-émojis';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#test-hash-中文-🚀-émojis');
  });

  it('handles very long hash', () => {
    const longHash = '#test-hash-' + 'a'.repeat(1000);
    mockLocation.hash = longHash;
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe(longHash);
  });

  it('maintains correct event listener reference for cleanup', () => {
    const { unmount } = renderHook(() => useHash());
    
    // Verify the add call
    const addCall = mockAddEventListener.mock.calls[0];
    expect(addCall[0]).toBe('hashchange');
    expect(typeof addCall[1]).toBe('function');
    
    unmount();
    
    // Verify the remove call after unmount
    const removeCall = mockRemoveEventListener.mock.calls[0];
    expect(removeCall[0]).toBe('hashchange');
    expect(typeof removeCall[1]).toBe('function');
    
    // Should have been called once each
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('handles rapid hash changes', () => {
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate rapid hash changes
    const hashes = ['#hash1', '#hash2', '#hash3', '#hash4', '#hash5'];
    
    act(() => {
      hashes.forEach((hash) => {
        mockLocation.hash = hash;
        eventHandler();
      });
    });
    
    expect(result.current).toBe('#hash5');
  });

  it('handles hash change to same value', () => {
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Change to same hash
    act(() => {
      mockLocation.hash = '#test-hash';
      eventHandler();
    });
    
    expect(result.current).toBe('#test-hash');
  });

  it('handles hash change from empty to non-empty', () => {
    mockLocation.hash = '';
    
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Change from empty to non-empty
    act(() => {
      mockLocation.hash = '#new-hash';
      eventHandler();
    });
    
    expect(result.current).toBe('#new-hash');
  });

  it('handles hash change from non-empty to empty', () => {
    const { result } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Change from non-empty to empty
    act(() => {
      mockLocation.hash = '';
      eventHandler();
    });
    
    expect(result.current).toBe('');
  });

  it('handles multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useHash());
    const { result: result2 } = renderHook(() => useHash());
    
    // Both should register event listeners
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    
    // Get both event handlers
    const eventHandler1 = mockAddEventListener.mock.calls[0][1];
    const eventHandler2 = mockAddEventListener.mock.calls[1][1];
    
    // Simulate hash change
    act(() => {
      mockLocation.hash = '#new-hash';
      eventHandler1();
      eventHandler2();
    });
    
    expect(result1.current).toBe('#new-hash');
    expect(result2.current).toBe('#new-hash');
  });

  it('handles hash with query parameters', () => {
    mockLocation.hash = '#section?param1=value1&param2=value2';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#section?param1=value1&param2=value2');
  });

  it('handles hash with fragment identifier', () => {
    mockLocation.hash = '#section#fragment';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#section#fragment');
  });

  it('handles hash with encoded characters', () => {
    mockLocation.hash = '#test%20hash%20with%20encoded%20spaces';
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe('#test%20hash%20with%20encoded%20spaces');
  });

  it('handles hash change during component lifecycle', () => {
    const { result, rerender, unmount } = renderHook(() => useHash());
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Change hash during component lifecycle
    act(() => {
      mockLocation.hash = '#during-lifecycle';
      eventHandler();
    });
    expect(result.current).toBe('#during-lifecycle');
    
    // Rerender component
    rerender();
    expect(result.current).toBe('#during-lifecycle');
    
    // Change hash after rerender
    act(() => {
      mockLocation.hash = '#after-rerender';
      eventHandler();
    });
    expect(result.current).toBe('#after-rerender');
    
    // Unmount component
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('handles edge case with undefined hash', () => {
    // @ts-ignore - Testing edge case
    mockLocation.hash = undefined as any;
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe(undefined);
  });

  it('handles edge case with null hash', () => {
    // @ts-ignore - Testing edge case
    mockLocation.hash = null as any;
    
    const { result } = renderHook(() => useHash());
    
    expect(result.current).toBe(null);
  });
});
