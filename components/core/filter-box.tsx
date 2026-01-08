"use client";

import { getFilterCount } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterItem from "../page/filter/filter-item";
import FilterStrip from "../page/filter/filter-strip";
import { CUSTOM_EVENTS, VIEW_TYPE } from "@/utils/constants";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";

const FilterBox = (props: any) => {
  const rawFilters = { ...props.rawFilters };
  const searchParams = { ...props.searchParams };
  const initialFilters = props.initialFilters;
  const filteredEvents = [...props.filteredEvents];
  const type = props.type;
  const from = props?.from;
  const viewType = props?.viewType;
  const selectedFilterValues = { ...props.selectedFilterValues };
  const router = useRouter();
  const filteredEventsCount = filteredEvents?.length;
  
  // Start expanded on desktop for all views (including map view, like program view)
  const [isExpand, setIsExpand] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const { onFilterClearAllBtnClicked, onFilterMenuClicked } =
    useSchedulePageAnalytics();

  const toggleSidebar = () => {
    onFilterMenuClicked(viewType);
    setIsExpand(!isExpand);
  };

  const onClearAllFilter = () => {
    onFilterClearAllBtnClicked();
    const pathname = window.location.pathname;
    router.push(`${pathname}`);
  };

  const onCloseMobileFilter = () => {
    // const pathname = window.location.pathname;
    // router.push(`${pathname}`);
    setIsExpand(!isExpand);
  };

  const selectedFilterValuesWithYear = {
    ...selectedFilterValues,
    year: searchParams.year || new Date().getFullYear().toString()
  };

  const filterCount = getFilterCount(selectedFilterValuesWithYear);

  const filterValues = [
    {
      name: "Show featured events",
      type: "toggle",
      isChecked: selectedFilterValues.isFeatured,
      identifierId: "isFeatured",
      items: [],
    },
    // {
    //   name: "Year",
    //   type: "single-select",
    //   items: rawFilters.years,
    //   selectedItem: selectedFilterValues.year ?? new Date().getFullYear()?.toString(),
    //   placeholder: "Filter by year",
    //   dropdownImgUrl: "/icons/pln-arrow-down.svg",
    //   identifierId: "year",
    //   iconUrl: "/icons/pl-calender-icon.svg",
    // },
    {
      name: "Modes",
      type: "tag",
      items: rawFilters.modes,
      selectedItems: selectedFilterValues.modes,
      placeholder: "Filter by year",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "modes",
      iconUrl: "",
    },
    {
      name: "Access Types",
      type: "multi-select",
      items: rawFilters.accessOption,
      selectedItems: selectedFilterValues.accessOption,
      placeholder: "Filter by Access type",
      dropdownImgUrl: "/icons/down_arrow_filled.svg",
      searchIcon: "/icons/search.svg",
      identifierId: "accessType",
      iconUrl: "/icons/accesstype.svg",
    },
    {
      name: "Gatherings",
      type: "single-select",
      items: rawFilters.location,
      selectedItem: selectedFilterValues.location,
      placeholder: "Filter by location",
      dropdownImgUrl: "/icons/down_arrow_filled.svg",
      searchIcon: "/icons/search.svg",
      identifierId: "location",
      iconUrl: "/icons/location_icon.svg",
    },

    {
      name: "Hosts",
      type: "multi-select",
      items: rawFilters.allHost,
      selectedItems: selectedFilterValues.allHost,
      placeholder: "Filter by location",
      dropdownImgUrl: "/icons/down_arrow_filled.svg",
      searchIcon: "/icons/search.svg",
      identifierId: "host",
      iconUrl: "/icons/host_icon.svg",
    },
    {
      name: "Tags",
      type: "open-multi-select",
      items: rawFilters.tags,
      selectedItems: selectedFilterValues.tags,
      placeholder: "Filter by Host Name",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "tags",
      searchIcon: "/icons/search.svg",
    },
  ];

  useEffect(() => {
    const handler = (e: any) => {
      const isOpen = e.detail.isOpen;
      setIsExpand(isOpen);
    };

    document.addEventListener(CUSTOM_EVENTS.SHOW_FILTER_MENU, handler);

    return () => {
      document.removeEventListener(CUSTOM_EVENTS.SHOW_FILTER_MENU, handler);
    };
  }, []);

  return (
    <>
      {/* Filter strip (collapsed state) - for calendar, program, and map views */}
      {!isExpand && (viewType === VIEW_TYPE.calendar.name || viewType === VIEW_TYPE.program.name || viewType === VIEW_TYPE.map.name) && (
        <div className="cp__cn__filterstrip">
          <FilterStrip onStripClicked={toggleSidebar} filterCount={filterCount} onClear={onClearAllFilter} />
        </div>
      )}
      <div className="fb">
        <div className="fb__head">
          <div className="fb__head__title">
            {/* Show collapse button for calendar, program, and map views */}
            {(viewType === VIEW_TYPE.calendar.name || viewType === VIEW_TYPE.program.name || viewType === VIEW_TYPE.map.name) && (
              <button className="fb__head__title__arrowbtn" onClick={toggleSidebar}>
                <img className="fb__head__title__img" src="/icons/double_arrow_left.svg" />
              </button>
            )}
            <div className="fb__head__title__text">
              <p>Filters</p>
              {filterCount > 0 && <div className="fb__head__title__count">{filterCount}</div>}
            </div>
          </div>
          <p onClick={onClearAllFilter} className="fb__head__clear">
            Clear All
          </p>
          <img onClick={onCloseMobileFilter} className="fb__head__close" src="/icons/close_black.svg" />
        </div>
        {filterValues.map((f) => (
          <div className="fb__item" key={`filter-${f.name}`}>
            <FilterItem
              {...f}
              searchParams={searchParams}
              selectedFilterValues={selectedFilterValues}
              initialFilters={initialFilters}
              from={from}
            />
          </div>
        ))}
        <div className="fb__footer">
          <button onClick={onClearAllFilter} className="fb__footer__clear">
            Clear All
          </button>
          <button
            onClick={onCloseMobileFilter}
            className="fb__footer__view"
          >{`View ${filteredEventsCount} event(s)`}</button>
        </div>
      </div>
      <style jsx>
        {`
          .fbo {
            width: 37px;
          }

          .cp__cn__filterstrip {
            display: none;
            width: 37px;
            height: 100vh;
          }

          .fb {
            display: ${isExpand ? "block" : "none"};
            position: fixed;
            top: 60px;
            z-index: 5;
            height: 100svh;
            overflow: auto;
            background: white;
            width: 100vw;

            padding-bottom: 48px;
          }
          .fb__head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #cbd5e1;
            position: sticky;
            top: 0;
            left: 0;
            background: white;
            z-index: 2;
          }

          .fb__head__title__arrowbtn {
            display: none;
          }

          .fb__footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            z-index: 3;
            padding: 12px 16px;
            box-shadow: 0px -2px 4px#e2e8f0;
          }
          .fb__footer__clear {
            border: 1px solid #cbd5e1;
            margin-right: 16px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 100px;
          }
          .fb__head__close {
            cursor: pointer;
            display: inline-block;
          }
          .fb__footer__view {
            background: #156ff7;
            color: white;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 100px;
          }
          .fb__head__title {
            display: flex;
            align-items: center;
          }
          .fb__head__title__count {
            background: #156ff7;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            margin-left: 8px;
          }
          .fb__head__title__text {
            color: #0f172a;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
          }
          .fb__item {
            margin: 16px 0;
          }
          .fb__item__title {
            margin-bottom: 12px;
            font-size: #0f172a;
            font-weight: 600;
          }
          .fb__head__clear {
            color: #156ff7;
            font-size: 13px;
            cursor: pointer;
            display: none;
          }
          .fb__head__title__img {
            display: inline-block;
            cursor: pointer;
          }
          @media (min-width: 1024px) {
            .fb__head__title__arrowbtn {
              display: unset;
            }

            .filterBtnStrip__btn {
              display: flex;
              flex-direction: column;
              gap: 15px;
              width: inherit;
              align-items: center;
            }

            .cp__cn__filterstrip {
              display: block;
              height: calc(100svh - 59px);
              position: sticky;
              top: 60px;
            }

            .fb {
              display: ${viewType === VIEW_TYPE.list.name || isExpand ? "block" : "none"};
              height: calc(100svh - 112px);
              transition: width 0.3s ease;
              position: sticky;
              width: 260px;
              top: 112px;
              border: 1px solid #cbd5e1;
              z-index: 1;
            }
            .fb {
              padding-bottom: 0;
            }
            .fb__footer {
              display: none;
            }
            .fb__head__clear {
              display: inline-block;
            }
            .fb__head__close {
              display: none;
            }
            .fb__footer__clear {
              font-size: 16px;
            }
            .fb__footer__ {
              font-size: 16px;
            }
          }
        `}
      </style>

      {
        <style global>
          {`
          html {
            overflow: ${isExpand ? "hidden" : ""};
          }

          @media(min-width: 1024px) {
            html {
              overflow: auto;
            }
          }
          `}
        </style>
      }
    </>
  );
};

export default FilterBox;
