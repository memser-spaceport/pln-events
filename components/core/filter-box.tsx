"use client";

import { getFilterCount, getQueryParams } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterItem from "../page/filter/filter-item";
import FilterStrip from "../page/filter/filter-strip";
import { CUSTOM_EVENTS, URL_QUERY_VALUE_SEPARATOR, VIEW_TYPE } from "@/utils/constants";
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
  const [isExpand, setIsExpand] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const {onScheduleFilterClicked, onFilterClearAllBtnClicked, onFilterMenuClicked } =
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

  const filterCount = getFilterCount(selectedFilterValues);

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
      name: "Locations",
      type: "single-select",
      items: rawFilters.location,
      selectedItem: selectedFilterValues.location,
      placeholder: "Filter by location",
      dropdownImgUrl: "/icons/down_arrow_filled.svg",
      searchIcon: "/icons/search.svg",
      identifierId: "locations",
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

  const onItemClicked = (key: any, value: any) => {
    onScheduleFilterClicked(key, value, viewType);

    // --- Start: Logic to update searchParams ---
    let newSearchParams = { ...searchParams };

    // Handle the "Select All" case *only* for locations
    if (
      value &&
      typeof value === "object" &&
      value.isSelectAll &&
      key === "locations"
    ) {
      const selectAllItems = value.items;
      const shouldSelect = value.select;
      let selectedLocation = [...selectedFilterValues.location];

      if (shouldSelect) {
        selectAllItems.forEach((item: any) => {
          if (!selectedLocation.includes(item)) {
            selectedLocation.push(item);
          }
        });
      } else {
        selectedLocation = selectedLocation.filter(
          (option) => !selectAllItems.includes(option)
        );
      }

      if (selectedLocation.length > 0) {
        newSearchParams["location"] = selectedLocation[0];
      } else {
        delete newSearchParams["location"];
      }
    }
    // Featured
    else if (key === "isFeatured") {
      newSearchParams[key] = value;
      if (initialFilters[key] === newSearchParams[key]) {
        delete newSearchParams[key];
      }
    }
    // Modes
    else if (key === "modes") {
      let selectedModes = [...selectedFilterValues.modes];
      if (value === "All") {
        selectedModes = [];
        delete newSearchParams[key];
      } else {
        selectedModes = selectedModes.filter((mode: any) => mode !== "All");
        if (selectedModes.includes(value)) {
          selectedModes = selectedModes.filter((mode: any) => mode !== value);
        } else {
          selectedModes.push(value);
        }

        if (selectedModes.length > 0) {
           newSearchParams[key] = selectedModes.join(URL_QUERY_VALUE_SEPARATOR);
        } else {
           delete newSearchParams[key];
        }
      }
    }
    // Access type (individual selection)
    else if (key === "accessType") {
      let selectedAccessOptions = [...selectedFilterValues.accessOption];
      if (selectedAccessOptions.includes(value)) {
        selectedAccessOptions = selectedAccessOptions.filter(
          (option: any) => option !== value
        );
      } else {
        selectedAccessOptions.push(value);
      }
      if (selectedAccessOptions.length > 0) {
        newSearchParams["accessOption"] = selectedAccessOptions.join(
          URL_QUERY_VALUE_SEPARATOR
        );
      } else {
        delete newSearchParams["accessOption"];
      }
    }
    else if (key === "locations") {
      let selectedLocation = [...selectedFilterValues.location];
      if (selectedLocation.length === 1 && selectedLocation[0] === value) {
        selectedLocation = [];
      } else {
        selectedLocation = [value];
      }
      if (selectedLocation.length > 0) {
        newSearchParams["location"] = selectedLocation[0];
      } else {
        delete newSearchParams["location"];
      }
    }
    // Host (individual selection)
    else if (key === "host") {
      let selectedHosts = [...selectedFilterValues.allHost];
      if (selectedHosts.includes(value)) {
        selectedHosts = selectedHosts.filter((option: any) => option !== value);
      } else {
        selectedHosts.push(value);
      }
      if (selectedHosts.length > 0) {
        newSearchParams[key] = selectedHosts.join(URL_QUERY_VALUE_SEPARATOR);
      } else {
        delete newSearchParams[key];
      }
    }
    // Tags (individual selection)
    else if (key === "tags") {
      let selectedTags = [...selectedFilterValues.tags];
      if (selectedTags.includes(value)) {
        selectedTags = selectedTags.filter((option: any) => option !== value);
      } else {
        selectedTags.push(value);
      }
      if (selectedTags.length > 0) {
        newSearchParams[key] = selectedTags.join(URL_QUERY_VALUE_SEPARATOR);
      } else {
        delete newSearchParams[key];
      }
    }
    // Year
    else if (key === "year") {
      newSearchParams[key] = value;
    }

    const query = getQueryParams(newSearchParams);
    const pathname = window.location.pathname;
    const currentQuery = getQueryParams(searchParams);

    if (query !== currentQuery) {
       router.push(query ? `${pathname}?${query}` : pathname);
    }

  };
  

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
      {!isExpand && (viewType === VIEW_TYPE.calendar.name || viewType === VIEW_TYPE.program.name) && (
        <div className="cp__cn__filterstrip">
          <FilterStrip onStripClicked={toggleSidebar} filterCount={filterCount} onClear={onClearAllFilter} />
        </div>
      )}
      <div className="fb">
        <div className="fb__head">
          <div className="fb__head__title">
            {(viewType === VIEW_TYPE.calendar.name || viewType === VIEW_TYPE.program.name) && (
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
              onItemClicked={onItemClicked}
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
              height: calc(100svh - 60px);
              transition: width 0.3s ease;
              position: sticky;
              width: 260px;
              top: 60px;
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
