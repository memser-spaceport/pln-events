import useEventsScrollObserver from "@/hooks/use-events-scroll-observer";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { ABBREVIATED_MONTH_NAMES } from "@/utils/constants";
import React, { useEffect, useState } from "react";

const SideBar = (props: any) => {
  const events = props?.events;

  const [clickedMenuId, setClickedMenuId] = useState("");
  const activeEventId = useEventsScrollObserver(Object.keys(events), events, clickedMenuId);

  

  const onItemClicked = (item: any) => {
    setClickedMenuId(item);
    const element = document.getElementById(item);
    if (element) {
      const headerOffset = 120;
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
        <div className="sidebar__dates">
          {ABBREVIATED_MONTH_NAMES.map((val, i) => {
            return (
              <div
                id={`agenda-${val}`}
                key={`agenda-${val}`}
                className="sidebar__dates__date"
                onClick={() => onItemClicked(val)}
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
                  {val}
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

        .sidebar__dates {
          position: relative;
          width: 100%;
          padding-top: 10px;
          max-height: calc(100vh - 112px);
          overflow-y: auto;
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
