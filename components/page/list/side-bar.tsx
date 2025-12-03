"use client";

import useEventsScrollObserver from "@/hooks/use-events-scroll-observer";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { ABBREVIATED_MONTH_NAMES } from "@/utils/constants";
import { formatDateTime } from "@/utils/helper";
import { useEffect, useState, useMemo, startTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SideBar = (props: any) => {
  const events = props?.events;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [clickedMenuId, setClickedMenuId] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const activeEventId = useEventsScrollObserver(Object.keys(events), events, clickedMenuId);

  // Get current year from URL params or default to current year
  const currentYear = useMemo(() => {
    const yearParam = searchParams.get("year");
    if (yearParam) {
      return parseInt(yearParam, 10);
    }
    return new Date().getFullYear();
  }, [searchParams]);

  const MIN_YEAR = 2020;
  const MAX_YEAR = 2030;

  // Check if previous/next year is within valid range
  const hasPreviousYear = useMemo(() => {
    return currentYear - 1 >= MIN_YEAR;
  }, [currentYear]);

  const hasNextYear = useMemo(() => {
    return currentYear + 1 <= MAX_YEAR;
  }, [currentYear]);

  // Handle year navigation
  const handleYearChange = (direction: "prev" | "next") => {
    const targetYear = direction === "prev" ? currentYear - 1 : currentYear + 1;
    
    if (targetYear < MIN_YEAR || targetYear > MAX_YEAR || isNavigating) {
      return;
    }

    setIsNavigating(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", targetYear.toString());
    
    // Use startTransition for smooth navigation
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setIsNavigating(false);
    });
  };

  const onItemClicked = (item: any) => {
    setClickedMenuId(item);
    const element = document.getElementById(item);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const element = document.getElementById(`agenda-${activeEventId}`);
    setClickedMenuId(activeEventId);
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.UPDATE_SELECTED_DATE, {
        detail: { activeEventId },
      })
    );

    if (element) {
      const parentContainer = element.parentElement;
      const nextItem = element.nextElementSibling;
      if (nextItem && nextItem instanceof HTMLElement && parentContainer) {
        const topPosition = nextItem?.offsetTop - 80;
        parentContainer.scrollTo({
          top: topPosition,
          behavior: "smooth",
        });
      }
    }
  }, [activeEventId]);

  // Initialize year in URL if not present
  useEffect(() => {
    const yearParam = searchParams.get("year");
    if (!yearParam) {
      const currentYear = new Date().getFullYear();
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", currentYear.toString());
      
      // Only update URL if year is not set
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const handler = (e: any) => {
      const date = e.detail.month;
      onItemClicked(date);
    };
    document.addEventListener(CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER, handler);

    return () => {
      document.removeEventListener(
        CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER,
        handler
      );
    };
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__year-filter">
          <span
            className={`sidebar__year-filter__control ${
              !hasPreviousYear ? "disabled" : ""
            }`}
            onClick={() => hasPreviousYear && handleYearChange("prev")}
            aria-label="Previous year"
            role="button"
            tabIndex={hasPreviousYear ? 0 : -1}
          >
            <img src="/icons/lesser-than.svg" alt="Previous year" />
          </span>
          <span className={`sidebar__year-filter__year ${isNavigating ? "loading" : ""}`}>
            {currentYear}
          </span>
          <span
            className={`sidebar__year-filter__control ${
              !hasNextYear ? "disabled" : ""
            }`}
            onClick={() => hasNextYear && handleYearChange("next")}
            aria-label="Next year"
            role="button"
            tabIndex={hasNextYear ? 0 : -1}
          >
            <img src="/icons/greater-than.svg" alt="Next year" />
          </span>
        </div>
        <div className="sidebar__dates">
          <div className="sidebar__dates__gradient-overlay"></div>
          {ABBREVIATED_MONTH_NAMES.map((val, i) => {
            const hasDate = Object.keys(events).includes(val);
            return (
              <div
              style={{
                opacity: hasDate ? "" : "0.5",
                cursor: hasDate ? "pointer" : "not-allowed",
              }}
                id={`agenda-${val}`}
                key={`agenda-${val}`}
                className="sidebar__dates__date"
                onClick={hasDate ? () => onItemClicked(val) : () => {}}
              >
                <div className="sidebar__dates__date__imgWrpr">
                  <img
                    className="sidebar__dates__date__imgWrpr__img"
                    src={
                      i % 2 === 0
                        ? clickedMenuId !== val
                          ? "/icons/hex-blue-outlined.svg"
                          : "/icons/hex-blue-filled.svg"
                        : clickedMenuId !== val
                        ? "/icons/hex-green-outlined.svg"
                        : "/icons/hex-green-filled.svg"
                    }
                    alt="icon"
                    loading="lazy"
                  />
                  <div
                    style={{ marginInline: "5px" }}
                    className="sidebar__dates__date__scroller"
                  ></div>
                </div>
                <span
                  className={`sidebar__dates__date__text ${
                    clickedMenuId === val ? "active" : ""
                  } `}
                >
                  {`${val}-${currentYear}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .sidebar {
          position: sticky;
          top: 112px;
        }

        .sidebar__year-filter {
          position: sticky;
          top: 0;
          width: 138px;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          padding-left: 0;
          opacity: 1;
          font-size: 14px;
          line-height: 16px;
          z-index: 10;
          margin-top: 10px;
          margin-bottom: 0px;
          margin-left: -10px;
          background: transparent;
        }

        .sidebar__year-filter__control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .sidebar__year-filter__control:hover:not(.disabled) {
          opacity: 0.7;
        }

        .sidebar__year-filter__control.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .sidebar__year-filter__control img {
          width: 16px;
          height: 16px;
        }

        .sidebar__year-filter__year {
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
          transition: opacity 0.2s ease;
        }

        .sidebar__year-filter__year.loading {
          opacity: 0.5;
        }

        .sidebar__dates {
          position: relative;
          width: 100%;
          padding-top: 0px;
          max-height: calc(100vh - 112px - 80px);
          overflow-y: auto;
        }

        .sidebar__dates__gradient-overlay {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 1) 0%, 
            rgba(255, 255, 255, 0.98) 20%, 
            rgba(255, 255, 255, 0.85) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 9;
          margin-bottom: -50px;
        }

        .sidebar__dates__date {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 48px;
          cursor: pointer;
          padding-inline: 6px;
        }

        .sidebar__dates__date__scroller {
          height: 48px;
          border-left: 1px solid #cbd5e1;
        }

        .sidebar__dates__date__text {
          font-size: 13px;
          line-height: 22px;
        }

        .sidebar__dates__date__imgWrpr {
          position: relative;
        }

        .sidebar__dates__date__imgWrpr__img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-48%, -50%);
          z-index: 1;
        }

        .active {
          font-weight: 700;
          font-size: 16px !important;
          color: #0f172a;
        }
      `}</style>
    </>
  );
};

export default SideBar;
