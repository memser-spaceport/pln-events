'use client';
import { RefObject, useEffect } from 'react';

interface useOutsideClickProps {
  callback: () => void;
  ref: RefObject<HTMLElement | null>;
}

const useOutsideClick = (props: useOutsideClickProps) => {
  const { ref, callback } = props;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // If ref.current is the backdrop/modal container, check if the click target is the backdrop itself
      if (ref.current && e.target === ref.current) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
