"use client";

import { CUSTOM_EVENTS } from "@/utils/constants";
import { getFilterCount, getQueryParams, groupByStartDate } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Tab from "@/components/core/tab";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";

const Toolbar = (props: any) => {
  const selectedFilterValues = props.selectedFilterValues;
  const initialFilters = props.initialFilters;
  const searchParams = props.searchParams;
  const isEmbed = props.isEmbed ?? false;
  const type = props.type;
  const router = useRouter();
  const dayFilter = selectedFilterValues.dayFilter;
  const filterCount = getFilterCount(selectedFilterValues);
  const events = props?.events ?? [];

  const [filteredTabItems, setFilteredTabItems] = useState<any[]>([]);

  const abbreviatedMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayOptions = [
    { name: "All Events", value: "all" },
    { name: "Single Day", value: "single" },
    { name: "Multi-Day", value: "multi" },
  ];

  const tabItems = [
    {
      title: "program",
      name: "Program",
      activeImg: "/icons/clock-white.svg",
      inActiveImg: "/icons/clock.svg",
    },
    {
      title: "list",
      name: "List",
      activeImg: "/icons/list-view-white.svg",
      inActiveImg: "/icons/list-view.svg",
    },
  ];

  const {
    onFilterMenuClicked,
    onFilterClearAllBtnClicked,
    onLegendInfoClicked,
    onSchduleViewClicked,
    onScheduleFilterClicked,
  } = useSchedulePageAnalytics();

  // Events are already sorted server-side (consistent with filtering pattern)
  const groupedEvents = groupByStartDate(events);
  const totalEventCount = events.filter((event: any) => !event.isHidden).length;

  const onItemClicked = (key: string, value: string) => {
    onScheduleFilterClicked(key, value, type);
    searchParams[key] = value;
    if (initialFilters[key] === searchParams[key]) {
      delete searchParams[key];
    }
    const query = getQueryParams(searchParams);
    const pathname = window.location.pathname;
    router.push(`${pathname}?${query}`);
  };

  const onTabClicked = (item: string) => {
    const basePath = isEmbed ? '/embed' : '';
    onSchduleViewClicked(item);
    router.push(`${basePath}/${item}`);
  };

  const onLegendModalOpen = () => {
    onLegendInfoClicked(type);
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, {
        detail: { isOpen: true },
      })
    );
  };

  const [isDropDownPaneActive, setDropDownStatus] = useState(false);
  const [clickedMenuId, setClickedMenuId] = useState(Object.keys(groupedEvents)[0]);

  const onToggleDropDown = () => {
    setDropDownStatus(!isDropDownPaneActive);
  };

  const onSelectDate = (month: any, hasDate: boolean) => {
    if (hasDate) {
      document.dispatchEvent(
        new CustomEvent(CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER, {
          detail: { month },
        })
      );
      onToggleDropDown();
    }
  };

  const onOpenFilterMenu = () => {
    onFilterMenuClicked(type);
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.SHOW_FILTER_MENU, {
        detail: { isOpen: true },
      })
    );
  };

  const onClearAllFilter = (e: any) => {
    e.stopPropagation();
    onFilterClearAllBtnClicked();
    const pathname = window.location.pathname;
    router.push(`${pathname}`);
  };

  useEffect(() => {
    const handler = (e: any) => {
      const date = e.detail.activeEventId;
      if (date) {
        setClickedMenuId(date);
      }
    };

    document.addEventListener(CUSTOM_EVENTS.UPDATE_SELECTED_DATE, handler);

    return () => {
      document.removeEventListener(CUSTOM_EVENTS.UPDATE_SELECTED_DATE, handler);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // Example: 1024px as a mobile breakpoint
      if (isMobile) {
        // Remove "calendar" from tab items on mobile
        setFilteredTabItems(tabItems.filter((item) => item.title !== "calendar"));
      } else {
        setFilteredTabItems([...tabItems]);
      }
    };

    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize); // Listen to window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  return (
    <>
      <div className="toolbar__wrapper">
        {type === "list" && (
          <div className="toolbar__notch">
            <img src="/icons/notch.svg" alt="" className="toolbar__notch__bg" />
            <p className="toolbar__notch__text">
              {totalEventCount} {totalEventCount === 1 ? 'Event' : 'Events'}
            </p>
          </div>
        )}
        <div className="toolbar">
          <div className="toolbar__left">
            <div className="toolbar__dayFilter">
              {dayOptions.map((item) => (
                <span
                  className={`toolbar__dayFilter__item
              ${dayFilter === item.value ? "toolbar__dayFilter__item--active" : ""}
            `}
                  onClick={() => onItemClicked("dayFilter", item?.value)}
                  key={item.value}
                >
                  {item.name}
                </span>
              ))}
            </div>

            <div onClick={onOpenFilterMenu} className="toolbar__fb">
              <img width={20} height={20} src="/icons/filter-white.svg" alt="filter" />
              {filterCount > 0 && (
                <div className="toolbar__fb__count">
                  <p>{filterCount}</p>
                </div>
              )}
              {filterCount > 0 && (
                <button className="toolbar__fb__close" onClick={onClearAllFilter}>
                  <img width={16} height={16} src="/icons/close-white-filter.svg" alt="close" />
                </button>
              )}
            </div>

            {type === "list" && (
              <div className="toolbarDate__wrpr">
                <button className="toolbarDate" onClick={onToggleDropDown}>
                  <span>{`${clickedMenuId}-2025`}</span>
                  {/* hardcoded year for now need to change once year filter is implemented */}
                  <img src="/icons/down_arrow_filled.svg" alt="down arrow" />
                </button>
                {isDropDownPaneActive && (
                  <div className="toolbarDate__dropdown">
                    {abbreviatedMonthNames.map((val, i) => {
                      const hasDate = Object.keys(groupedEvents).includes(val);

                      return (
                        <div
                          onClick={() => onSelectDate(val, hasDate)}
                          key={`month-list-${i}`}
                          className={` toolbarDate__dropdown__item ${hasDate ? "" : "disabled"}`}
                        >
                          {`${val}-2025`}
                          {/* hardcoded year for now need to change once year filter is implemented */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="toolbar__pageView">
            <button onClick={onLegendModalOpen} title="Legends" className="toolbar__pageView__legends">
              <img src="/icons/info-blue.svg" alt="legend" />
            </button>
            <div className="toolbar__pageView__tabs">
              <Tab
                callback={onTabClicked}
                selectedItemId={type}
                sectionId={`schedule-header-tab`}
                items={filteredTabItems}
                arrowImg="/icons/arrow-down-blue.svg"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .toolbar__wrapper {
            position: relative;
          }

          .toolbar {
            position: relative;
            display: flex;
            justify-content: space-between;
            z-index: 3;
            background: linear-gradient(90.06deg, #4ce78f 0.61%, #88f9b9 100%);
            padding: 6px;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
          }

          .toolbar__notch {
            position: absolute;
            bottom: -32px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 161px;
            height: 36px;
          }

          .toolbar__notch__bg {
            position: absolute;
            width: 161px;
            height: 36px;
            filter: drop-shadow(0px 2px 4px rgba(21, 111, 247, 0.15));
          }

          .toolbar__notch__text {
            position: relative;
            z-index: 1;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            font-weight: 600;
            line-height: 24px;
            color: #156ff7;
            white-space: nowrap;
            margin: 0;
            padding-top: 2px;
          }

          .toolbar__dayFilter {
            display: none;
            font-size: 14px;
            height: 32px;
            align-items: center;
            background: white;
            border-radius: 50px;
            width: fit-content;
            padding: 2px 3px;
          }

          .toolbar__dayFilter__item {
            padding: 6px 16px;
            font-size: 12px;
            color: #156ff7;
            cursor: pointer;
          }

          .toolbar__dayFilter__item--active {
            background: #156ff7;
            color: white;
            border-radius: 60px;
          }

          .toolbar__middle {
            align-items: center;
            display: flex;
            position: absolute;
            right: 0;
            left: 0;
            margin: auto;
            width: fit-content;
          }

          .toolbar__middle__navigation {
            display: none;
            border-radius: 8px;
            border: 1px #36cf79 solid;
          }

          .toolbar__middle__navigation__previous {
            font-weight: 600;
            color: #156ff7;
            display: flex;
          }

          .toolbar__middle__navigation__next {
            font-weight: 600;
            color: #156ff7;
            display: flex;
          }

          .toolbar__middle__navigation__content {
            font-weight: 600;
            color: #156ff7;
          }

          .toolbarDate {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            width: 100px;
            height: 35px;
            border: 1px solid #156ff7;
            border-radius: 100px;
            padding: 4px;
            background-color: #ffffff;
          }

          .toolbarDate__dropdown {
            position: absolute;
            top: 40px;
            border-radius: 8px;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
            background-color: #ffffff;
            left: 0px;
            width: 100%;
          }

          .toolbarDate__dropdown__item {
            padding: 10px;
            text-align: start;
            font-size: 13px;
          }

          .toolbar__pageView {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .toolbar__pageView__legends {
            display: flex;
            width: 36px;
            height: 36px;
            align-items: center;
            justify-content: center;
            align-items: center;
            gap: 4px;
            background: white;
            border-radius: 35px;
            border: 1px solid #36cf79;
            // margin-right: 4px;
          }

          .toolbar__dayFilter__legends {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            align-items: center;
            gap: 4px;
            background: white;
            border-radius: 9px;
            border: 1px solid #36cf79;
            margin-right: 4px;
          }

          .toolbar__fb {
            display: flex;
            background: #156ff7;
            padding: 0px 8px;
            align-items: center;
            color: white;
            height: 32px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 9px;
            cursor: pointer;
          }

          .toolbar__fb__count {
            background: white;
            color: #156ff7;
            display: flex;
            width: 20px;
            height: 20px;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-size: 11px;
            margin: 0 4px;
          }

          .toolbar__left {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          // .toolbar__pageView__tabs {
          //   display: none;
          // }

          .toolbar__fb__close {
            display: flex;
          }

          .disabled {
            opacity: 0.5;
          }

          .toolbarDate__wrpr {
            position: relative;
            width: 100px;
          }

          @media (orientation: landscape) {
            .toolbarDate__dropdown {
              max-height: calc(100vh - 112px);
            }
          }

          @media (min-width: 1024px) {
            .toolbar__middle__navigation {
              display: flex;
              gap: 4px;
              height: 35px;
              align-items: center;
              border-radius: 100px;
              justify-content: center;
              padding: 6px 10px;
              background: #fff;
            }
            .toolbar__middle__text {
              font-weight: 600;
              font-size: 13px;
              line-height: 24.3px;
              color: #16161f;
            }
            .toolbar__dayFilter {
              display: flex;
            }

            .toolbar__dayFilter__legends {
              display: none;
            }

            .toolbar__pageView__legends {
              display: flex;
            }

            .toolbarDate__wrpr {
              display: none;
            }

            .toolbar__fb {
              display: none;
            }

            .toolbar__pageView__tabs {
              display: block;
              height: 36px;
            }

            .toolbar__notch {
              left: calc(50% + 50px);
            }
          }
        `}
      </style>
    </>
  );
};

export default Toolbar;
