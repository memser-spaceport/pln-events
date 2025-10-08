import { renderHook } from '@testing-library/react';
import useFilterHook from '@/hooks/use-filter-hook';

// Mock next/navigation
const mockPush = jest.fn();
let mockSearchParams: URLSearchParams;

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/test-path'),
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: jest.fn(() => mockSearchParams),
}));

// Mock console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParams = new URLSearchParams('?test=value&viewType=calendar');
});

afterEach(() => {
  mockConsoleError.mockClear();
});

describe('useFilterHook Hook', () => {
  it('returns correct initial values', () => {
    const { result } = renderHook(() => useFilterHook());
    
    expect(result.current.setQuery).toBeDefined();
    expect(result.current.clearQuery).toBeDefined();
    expect(result.current.clearAllQuery).toBeDefined();
    expect(result.current.searchParams).toBe(mockSearchParams);
  });

  describe('setQuery', () => {
    it('sets single key-value pair', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('newKey', 'newValue');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?test=value&viewType=calendar&newKey=newValue',
        { scroll: false }
      );
    });

    it('sets multiple key-value pairs', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?test=value&viewType=calendar&key1=value1&key2=value2&key3=value3',
        { scroll: false }
      );
    });

    it('handles different value types', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('stringKey', 'stringValue');
      result.current.setQuery('numberKey', 123);
      result.current.setQuery('booleanKey', true);
      
      expect(mockPush).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenNthCalledWith(1, '/test-path?test=value&viewType=calendar&stringKey=stringValue', { scroll: false });
      expect(mockPush).toHaveBeenNthCalledWith(2, '/test-path?test=value&viewType=calendar&stringKey=stringValue&numberKey=123', { scroll: false });
      expect(mockPush).toHaveBeenNthCalledWith(3, '/test-path?test=value&viewType=calendar&stringKey=stringValue&numberKey=123&booleanKey=true', { scroll: false });
    });

    it('handles null and undefined values in object', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery({
        validKey: 'validValue',
        nullKey: null,
        undefinedKey: undefined,
        emptyStringKey: '',
      });
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?test=value&viewType=calendar&validKey=validValue&emptyStringKey=',
        { scroll: false }
      );
    });

    it('overwrites existing key', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('test', 'newValue');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?test=newValue&viewType=calendar',
        { scroll: false }
      );
    });

    it('handles invalid arguments', () => {
      const { result } = renderHook(() => useFilterHook());
      
      // @ts-ignore - Testing invalid arguments
      result.current.setQuery('key');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error setting query parameters:',
        expect.any(Error)
      );
    });

    it('handles push errors gracefully', () => {
      mockPush.mockImplementation(() => {
        throw new Error('Push error');
      });
      
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('key', 'value');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error setting query parameters:',
        expect.any(Error)
      );
    });
  });

  describe('clearQuery', () => {
    it('removes specified key', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearQuery('test');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?viewType=calendar',
        { scroll: false }
      );
    });

    it('handles non-existent key', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearQuery('nonExistentKey');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?test=value&viewType=calendar',
        { scroll: false }
      );
    });

    it('handles clear errors gracefully', () => {
      mockPush.mockImplementation(() => {
        throw new Error('Push error');
      });
      
      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearQuery('test');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error clearing query parameter:',
        expect.any(Error)
      );
    });
  });

  describe('clearAllQuery', () => {
    it('clears all parameters except viewType', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearAllQuery();
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?viewType=calendar',
        { scroll: false }
      );
    });

    it('clears all parameters when no viewType', () => {
      mockSearchParams = new URLSearchParams('?test=value');

      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearAllQuery();
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path',
        { scroll: false }
      );
    });

    it('handles clearAll errors gracefully', () => {
      mockPush.mockImplementation(() => {
        throw new Error('Push error');
      });
      
      const { result } = renderHook(() => useFilterHook());
      
      result.current.clearAllQuery();
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error clearing all query parameters:',
        expect.any(Error)
      );
    });
  });

  describe('edge cases', () => {
    it('handles empty search params', () => {
      const mockEmptySearchParams = new URLSearchParams();
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue(mockEmptySearchParams);
      
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('key', 'value');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?key=value',
        { scroll: false }
      );
    });

    it('handles special characters in values', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('special', 'value with spaces & symbols');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?special=value+with+spaces+%26+symbols',
        { scroll: false }
      );
    });

    it('handles very long values', () => {
      const { result } = renderHook(() => useFilterHook());
      
      const longValue = 'a'.repeat(1000);
      result.current.setQuery('longKey', longValue);
      
      expect(mockPush).toHaveBeenCalledWith(
        `/test-path?longKey=${longValue}`,
        { scroll: false }
      );
    });

    it('handles multiple calls in sequence', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('key1', 'value1');
      result.current.setQuery('key2', 'value2');
      result.current.clearQuery('key1');
      result.current.clearAllQuery();
      
      expect(mockPush).toHaveBeenCalledTimes(4);
    });

    it('handles object with mixed valid and invalid values', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery({
        validString: 'valid',
        validNumber: 42,
        validBoolean: false,
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zeroValue: 0,
        falseValue: false,
      });
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?validString=valid&validNumber=42&validBoolean=false&emptyString=&zeroValue=0&falseValue=false',
        { scroll: false }
      );
    });
  });

  describe('URLSearchParams behavior', () => {
    it('maintains parameter order', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('zKey', 'zValue');
      result.current.setQuery('aKey', 'aValue');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?zKey=zValue&aKey=aValue',
        { scroll: false }
      );
    });

    it('handles duplicate keys correctly', () => {
      const { result } = renderHook(() => useFilterHook());
      
      result.current.setQuery('duplicate', 'first');
      result.current.setQuery('duplicate', 'second');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?duplicate=second',
        { scroll: false }
      );
    });
  });

  describe('error handling', () => {
    it('continues to work after errors', () => {
      const { result } = renderHook(() => useFilterHook());
      
      // First call with error
      mockPush.mockImplementationOnce(() => {
        throw new Error('First error');
      });
      
      result.current.setQuery('key1', 'value1');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error setting query parameters:',
        expect.any(Error)
      );
      
      // Second call should work
      mockPush.mockImplementation(() => {});
      
      result.current.setQuery('key2', 'value2');
      
      expect(mockPush).toHaveBeenCalledWith(
        '/test-path?key1=value1&key2=value2',
        { scroll: false }
      );
    });
  });
});
