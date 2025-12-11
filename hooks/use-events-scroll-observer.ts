import { useEffect, useState, useRef } from "react";

const useEventsScrollObserver = (elements: any, events: any, clickedMenuId: any) => {
  const [activeEventId, setActiveEventId] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // intersection observer setup

  function calculateMarginAndThreshold(days: any, clickedMenuId: string) {
   if (days[clickedMenuId]?.length === 1 || window.innerWidth < 1024) {
      return [ "-30% 0% -70% 0%" ];
    }
    return [];
  }

  useEffect(() => {
    const [margin] = calculateMarginAndThreshold(events, clickedMenuId);
    const observerOptions = {
      root: null,
      rootMargin: margin || "-150px 0px -50% 0px",
      threshold: 0,
    };

    function observerCallback(entries: any) {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }
          debounceTimer.current = setTimeout(() => {
            setActiveEventId(entry.target.id);
          }, 700);
        }
      });
    }

    const sections = [...elements]
      .map((e) => document.getElementById(e))
      .filter((section) => section);

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sections.forEach((sec) => {
      observer?.observe(sec as HTMLElement);
    });

    return () => {
      observer.disconnect();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [elements, clickedMenuId, events]);

  return activeEventId;
};

export default useEventsScrollObserver;
