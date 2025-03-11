"use client";
import { RefObject, useEffect } from "react";

interface ClickedOutsideProps {
  callback: () => void;
  ref: RefObject<HTMLElement>;
}

const useClickedOutside = (props: ClickedOutsideProps) => {
  const ref = props.ref;
  const callback = props.callback;

  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useClickedOutside;