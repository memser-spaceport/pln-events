import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import useClickedOutside from '@/hooks/use-clicked-outside';

// Mock document methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  document.addEventListener = mockAddEventListener;
  document.removeEventListener = mockRemoveEventListener;
});

describe('useClickedOutside Hook', () => {
  it('adds click event listener on mount', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('removes click event listener on unmount', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    const { unmount } = renderHook(() => useClickedOutside({ callback, ref }));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('calls callback when clicking outside the ref element', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with a target outside the ref element
    const outsideElement = document.createElement('span');
    const mockEvent = {
      target: outsideElement,
    } as MouseEvent;
    
    // Simulate clicking outside
    eventHandler(mockEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when clicking inside the ref element', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    const childElement = document.createElement('span');
    ref.current.appendChild(childElement);
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with a target inside the ref element
    const mockEvent = {
      target: childElement,
    } as MouseEvent;
    
    // Simulate clicking inside
    eventHandler(mockEvent);
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call callback when ref.current is null', () => {
    const callback = jest.fn();
    const ref = { current: null };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event
    const outsideElement = document.createElement('span');
    const mockEvent = {
      target: outsideElement,
    } as MouseEvent;
    
    // Simulate clicking
    eventHandler(mockEvent);
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('handles multiple clicks correctly', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create mock events
    const outsideElement1 = document.createElement('span');
    const outsideElement2 = document.createElement('button');
    
    const mockEvent1 = { target: outsideElement1 } as MouseEvent;
    const mockEvent2 = { target: outsideElement2 } as MouseEvent;
    
    // Simulate multiple clicks outside
    eventHandler(mockEvent1);
    eventHandler(mockEvent2);
    
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('handles clicking on the ref element itself', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with the ref element as target
    const mockEvent = {
      target: ref.current,
    } as MouseEvent;
    
    // Simulate clicking on the ref element itself
    eventHandler(mockEvent);
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('works with nested elements inside ref', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    // Create nested structure
    const child1 = document.createElement('span');
    const child2 = document.createElement('button');
    const grandchild = document.createElement('strong');
    
    child1.appendChild(grandchild);
    ref.current.appendChild(child1);
    ref.current.appendChild(child2);
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Test clicking on nested elements
    const mockEvent1 = { target: child1 } as MouseEvent;
    const mockEvent2 = { target: child2 } as MouseEvent;
    const mockEvent3 = { target: grandchild } as MouseEvent;
    
    eventHandler(mockEvent1);
    eventHandler(mockEvent2);
    eventHandler(mockEvent3);
    
    // None should trigger callback as they're all inside ref
    expect(callback).not.toHaveBeenCalled();
  });

  it('handles rapid successive clicks', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate rapid clicks
    for (let i = 0; i < 10; i++) {
      const outsideElement = document.createElement('span');
      const mockEvent = { target: outsideElement } as MouseEvent;
      eventHandler(mockEvent);
    }
    
    expect(callback).toHaveBeenCalledTimes(10);
  });

  it('maintains correct event listener reference for cleanup', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    const { unmount } = renderHook(() => useClickedOutside({ callback, ref }));
    
    // Verify addEventListener was called
    const addCall = mockAddEventListener.mock.calls[0];
    expect(addCall[0]).toBe('click');
    expect(typeof addCall[1]).toBe('function');
    
    // Unmount to trigger removeEventListener
    unmount();
    
    // Verify removeEventListener was called
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    const removeCall = mockRemoveEventListener.mock.calls[0];
    expect(removeCall[0]).toBe('click');
    expect(typeof removeCall[1]).toBe('function');
    
    // Should have been called once for add, once for remove
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('works with different element types', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('section') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Test with different element types outside
    const elements = [
      document.createElement('div'),
      document.createElement('span'),
      document.createElement('button'),
      document.createElement('input'),
      document.createElement('p'),
    ];
    
    elements.forEach((element) => {
      const mockEvent = { target: element } as MouseEvent;
      eventHandler(mockEvent);
    });
    
    expect(callback).toHaveBeenCalledTimes(elements.length);
  });

  it('handles edge case with document body as target', () => {
    const callback = jest.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickedOutside({ callback, ref }));
    
    // Get the event handler that was registered
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Create a mock event with document.body as target
    const mockEvent = {
      target: document.body,
    } as MouseEvent;
    
    eventHandler(mockEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
