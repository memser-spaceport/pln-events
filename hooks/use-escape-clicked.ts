import { useEffect, useCallback } from 'react';

type CallbackFunction = () => void;

function useEscapeClicked(callback: CallbackFunction): void {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}

export default useEscapeClicked