import useFilterHook from "@/hooks/use-filter-hook";
import PlDateRange from "../ui/pl-date-range";
import PlMultiSelect from "../ui/pl-multi-select";
import PlSingleSelect from "../ui/pl-single-select";
import PlTags from "../ui/pl-tags";
import PlToggle from "../ui/pl-toggle";
import { CUSTOM_EVENTS, URL_QUERY_VALUE_SEPARATOR } from "@/utils/constants";
import { getNoFiltersApplied } from "../page/events/hp-helper";
import useFilterAnalytics from "@/analytics/filter.analytics";
import { IEvent, IFilterValue, ISelectedItem } from "@/types/events.type";
import { IViewTypeMenu } from "@/types/shared.type";

interface IFilter {
  filterValues: IFilterValue[];
  selectedItems: ISelectedItem;
  events: IEvent[];
}

const Filter = (props: IFilter) => {
  const filterValues = props?.filterValues;
  const selectedItems = props?.selectedItems;
  const events = props?.events;

  const viewType = selectedItems?.viewType;

  const { setQuery, clearQuery, clearAllQuery } = useFilterHook();
  const { onFiltersApplied, onFilterMenuClicked, onClearFiltersClicked } =
    useFilterAnalytics();

  const filterCount = getNoFiltersApplied(selectedItems);
  const filteredCount = events?.length ?? 0;

  const onClearFilters = () => {
    if (filterCount > 0) {
      onClearFiltersClicked();
      clearAllQuery();
    }
  };

  const onClosePopup = () => {
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.FILTEROPEN, {
        detail: { isOpen: false },
      })
    );
  };

  const onMenuSelection = (key: string, value: string) => {
    if (viewType !== value) {
      onFilterMenuClicked(value);
      if (value === "timeline") {
        clearQuery(key);
        return;
      }
      setQuery(key, value);
    }
  };

  const onClearMultiSelect = (key: string) => {
    clearQuery(key);
  };

  const onFilterChange = (
    key: string,
    value: string | boolean | any,
    type: string
  ) => {
    const formattedSelectetItems = {
      ...selectedItems,
      dateRange: {
        start: (key !== "start") ? getUtcDateString(selectedItems?.startDate) : getUtcDateString(value) ,
        end: (key !== "end") ? getUtcDateString(selectedItems.endDate) :  getUtcDateString(value) ,
      },
      viewType: viewType,
    };
    
    onFiltersApplied({ ...formattedSelectetItems }, type, key, value);
    if (key === "isPlnEventOnly" || key === "year") {
      if (key === "year") {
        const startDate = new Date(selectedItems.startDate);
        const endDate = new Date(selectedItems.endDate);
        setQuery(
          "start",
          `${startDate.getMonth() + 1}/${startDate.getDate()}/${value}`
        );
        setQuery(
          "end",
          `${endDate.getMonth() + 1}/${endDate.getDate()}/${value}`
        );
      }
      if (key === "isPlnEventOnly") {
        if (!value) {
          clearQuery("isPlnEventOnly");
          return;
        }
      }
      setQuery(key, value);
      return;
    } else if (key == "locations" || key === "eventHosts" || key === "topics") {
      const itemsChoosen = Array.isArray(selectedItems[key])
        ? [...selectedItems[key]]
        : [];
      let updatedItems = [...itemsChoosen];
      if (itemsChoosen.includes(value)) {
        updatedItems = itemsChoosen.filter((item: string) => item !== value);
      } else {
        updatedItems.push(value);
      }
      if (updatedItems.length === 0) {
        clearQuery(key);
        return;
      }
      setQuery(key, updatedItems.join(URL_QUERY_VALUE_SEPARATOR));
      return;
    } else if (key === "eventType") {
      if(selectedItems?.eventType === value) {
        clearQuery("eventType")
        return;
      }
      setQuery(key, value);
      return;
    }
    setQuery(key, value);
  };

  const getUtcDateString = (dateString: string) => {
    try {
      const [month, day, year]:any = dateString.split('/');
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      return utcDate.toISOString();
    } catch (error) {
      console.error(error);
    }
  };

  const onMultiSelectClicked = (type: string) => {
    if (type === "Topics") {
      setTimeout(() => {
        let filterContainer;
        if (window.innerWidth < 1200) {
          filterContainer = document.getElementById("mfiltercn");
          if (filterContainer) {
            filterContainer.scrollTo(0, filterContainer.scrollHeight);
          }
        } else {
          filterContainer = document.getElementById("filtercn");
          if (filterContainer) {
            filterContainer.scrollTo(0, filterContainer.scrollHeight);
          }
        }
      }, 50);
    }
  };

  const menus = [
    {
      name: "timeline",
      img: "/icons/pln-timeline.svg",
      title: "Timeline View",
      imgActive: "/icons/pln-timeline-active.svg",
    },
    {
      name: "calendar",
      img: "/icons/pln-calendar.svg",
      title: "Calendar View",
      imgActive: "/icons/pln-calendar-active.svg",
    },
    /*  {name: 'map', img: '/icons/pln-map-view.svg', title: "Map View", imgActive: '/icons/pln-map-view-active.svg'} */
  ];

  return (
    <>
      <div id="filtercn" className="hpf">
        <div className="hpf__menu">
          <h3 className="hpf__menu__view">VIEW</h3>
          <div className="hpf__menu__icons">
            {menus.map((m: IViewTypeMenu, index: number) => (
              <img
                key={`${m} + ${index}`}
                onClick={() => onMenuSelection("viewType", m.name)}
                title={m.title}
                className="hpf__menu__icons__item"
                src={viewType === m.name ? m.imgActive : m.img}
              />
            ))}
          </div>
        </div>
        <div className="hpf__head">
          <h3 className="hpf__head__title">{`Filters`}</h3>
          {filterCount > 0 && <p className="hpf__head__count">{filterCount}</p>}
          <p onClick={onClearFilters} className="hpf__head__clear">
            Clear All
          </p>
          <img
            onClick={onClosePopup}
            src="/icons/pln-close-black.svg"
            className="hpf__head__close"
          />
          <p className="hpf__head__counttext">{`Showing ${filteredCount} event(s)`}</p>
        </div>
        <div className="hpf__pln">
          <p className="hpf__pln__title">Show PL Events only</p>
          <PlToggle
            itemId="isPlnEventOnly"
            activeItem={selectedItems?.isPlnEventOnly}
            callback={onFilterChange}
          />
        </div>
        {filterValues.map((filter: IFilterValue, index: number) => (
          <div key={`${filter} + ${index}`} className="hpf__filters">
            <h4 className="hpf__filters__title">{filter?.name}</h4>
            {filter?.type === "date-range" && (
              <PlDateRange
                selectedYear={selectedItems.year}
                callback={onFilterChange}
                {...filter}
              />
            )}
            {filter?.type === "single-select" && (
              <PlSingleSelect showSearch={true} callback={onFilterChange} {...filter} />
            )}
            {filter?.type === "multi-select" && (
              <PlMultiSelect
                onMultiSelectClicked={onMultiSelectClicked}
                onClearMultiSelect={onClearMultiSelect}
                callback={onFilterChange}
                {...filter}
              />
            )}
            {filter?.type === "tags" && (
              <PlTags callback={onFilterChange} {...filter} />
            )}
          </div>
        ))}
      </div>

      <style jsx>
        {`
          .hpf {
            width: 100%;
            height: 100svh;
          }

          .hpf__year {
            padding: 16px 24px 0 24px;
          }
          .hpf__year__title {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .hpf__head {
            padding: 16px 24px;
            border-bottom: 1px solid #cbd5e1;
            display: flex;
            position: relative;
            justify-content: space-between;
            align-items: center;
          }
          .hpf__head__count {
            background: #156ff7;
            color: white;
            position: absolute;
            top: 16px;
            left: 80px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
          }
          .hpf__head__title {
            font-size: 16px;
          }
          .hpf__head__clear {
            display: none;
          }
          .hpf__pln {
            padding: 24px;
            border-bottom: 1px solid #cbd5e1;
            align-items: center;
            display: flex;
            justify-content: space-between;
          }
          .hpf__pln__title {
            color: #475569;
            font-size: 14px;
          }

          .hpf__menu {
            display: none;
            border-bottom: 1px solid #cbd5e1;
            padding: 12px 24px;
            height: 48px;
            align-items: center;
            justify-content: space-between;
          }
          .hpf__menu__view {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
          }
          .hpf__menu__icons {
            display: flex;
            gap: 0 16px;
          }
          .hpf__menu__icons__item {
            cursor: pointer;
            width: 20px;
            height: 24px;
          }
          .hpf__filters {
            padding: 20px 24px 0 24px;
          }
          .hpf__filters__title {
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: 600;
          }

          .hpf__eventtype {
            padding: 16px 24px 0 24px;
          }
          .hpf__eventtype__title {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .hpf__head__close {
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
          .hpf__head__counttext {
            display: none;
          }
          @media (min-width: 1200px) {
            .hpf {
              height: 100%;
              padding-bottom: 30px;
              overflow-y: scroll;
            }
            .hpf__head {
              height: 74px;
              align-items: flex-start;
            }
            .hpf__mtools {
              display: none;
            }
            .hpf__head__clear {
              display: block;
              font-size: 13px;
              color: #156ff7;
              cursor: pointer;
            }
            .hpf__head__close {
              display: none;
            }
            .hpf__head__counttext {
              display: flex;
              position: absolute;
              bottom: 16px;
              left: 24px;
              color: #475569;
              font-size: 12px;
            }
            .hpf__menu {
              display: flex;
            }
          }
        `}
      </style>
    </>
  );
};

export default Filter;
