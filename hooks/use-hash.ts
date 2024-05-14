// useHash.js
'use client'
import { useState, useEffect } from 'react';

export const useHash = () => {
  const [hash, setHash] = useState<string>();
  useEffect(() => {
    setHash(window.location.hash)
    const onHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return hash;
};