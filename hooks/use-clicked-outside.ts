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
      const clickedOutside = ref.current && !ref.current.contains(e.target as Node);

      if (clickedOutside) {
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
