import { useEffect, useState } from "react";

const useEventsScrollObserver = (elements: any, events: any, clickedMenuId: any) => {
  const [activeEventId, setActiveEventId] = useState("");
  let debounceTimer: any;
  // intersection observer setup

  function calculateMarginAndThreshold(days: any, clickedMenuId: string) {
    if (days[clickedMenuId]?.length === 1 || window.innerWidth < 1024) {
      return [ "-30% 0% -70% 0%" ];
    }
    return [];
  }

  useEffect(() => {
    const [ margin ] = calculateMarginAndThreshold(events, clickedMenuId);
    const observerOptions = {
      root: null,
      rootMargin: margin || "-40% 0% -60% 0%",
      threshold: 0,
    };
    function observerCallback(entries: any) {
      entries.forEach((entry: any, index: number) => {
        if (entry.isIntersecting) {
          clearTimeout(debounceTimer);
          // Set the value after 500ms
          debounceTimer = setTimeout(() => {
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
    };
  }, [elements, clickedMenuId, events]);

  return activeEventId;
};

export default useEventsScrollObserver;
