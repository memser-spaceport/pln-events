"use cient";
import useFilterAnalytics from "@/analytics/filter.analytics";
import useFilterHook from "@/hooks/use-filter-hook";
import { ISelectedItem } from "@/types/events.type";
import { IViewTypeMenu } from "@/types/shared.type";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { getNoFiltersApplied } from "./hp-helper";

interface IHpFilterHead {
  selectedItems: ISelectedItem;
  showBanner: boolean;
}
function HpFilterHead(props: IHpFilterHead) {
  const viewType = props?.selectedItems?.viewType;
  const showBanner = props?.showBanner;

  const { clearAllQuery, clearQuery, setQuery } = useFilterHook();

  const filterCount = getNoFiltersApplied(props?.selectedItems);
  const { onFilterMenuClicked } = useFilterAnalytics();
  const menus = [
    {
      name: "calendar",
      img: "/icons/pln-calendar.svg",
      title: "Calendar View",
      imgActive: "/icons/pln-calendar-active.svg",
    },
    {
      name: "timeline",
      img: "/icons/pln-timeline.svg",
      title: "Timeline View",
      imgActive: "/icons/pln-timeline-active.svg",
    },
    /*  {name: 'map', img: '/icons/pln-map-view.svg', title: "Map View", imgActive: '/icons/pln-map-view-active.svg'} */
  ];
  const toggleMobileFilter = () => {
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.FILTEROPEN, {
        detail: { isOpen: true },
      })
    );
  };

  const onClearFilters = () => {
    clearAllQuery();
  };

  const onMenuSelection = (key: string, value: string) => {
    if(viewType !== value) {
    onFilterMenuClicked(value);
    if (value === "calendar") {
      clearQuery(key);
      return;
    }
    setQuery(key, value);
  }
  };

  return (
    <>
      <div className="hp__maincontent__tools">
        <div
          onClick={toggleMobileFilter}
          className="hp__maincontent__tools__filter"
        >
          <img
            className="hp__maincontent__tools__filter__icon"
            src="/icons/pln-filter-icon.svg"
          />
          <p className="hp__maincontent__tools__filter__text">Filters</p>
          {filterCount > 0 && (
            <p className="hp__maincontent__tools__filter__count">
              {filterCount}
            </p>
          )}
        </div>
        <div className="hpf__menu">
          <div className="hpf__menu__icons">
            {menus.map((m: IViewTypeMenu, index: number) => (
              <img
                key={`${m} + ${index}`}
                onClick={(e) => onMenuSelection("viewType", m.name)}
                title={m.title}
                className="hpf__menu__icons__item"
                src={viewType === m.name ? m.imgActive : m.img}
              />
            ))}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .hp__maincontent {
            width: 100%;
            display: block;
            padding-top: 0px;
            overflow-y: scroll;
            background: #f2f7fb;
            height: 100%;
          }
          .hp__maincontent__tools {
            background: white;
            z-index: 5;
            position: sticky;
            top:  ${showBanner ? '220px' : '60px'};
            width: 100%;
            height: 48px;
            // margin-top: 60px;
            box-shadow: 0px 1px 4px rgba(226, 232, 240, 0.25);
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .hp__maincontent__tools__filter {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 5px 12px;
            cursor: pointer;
            z-index: 3;
          }
          .hp__maincontent__tools__filter__icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
          .hp__maincontent__tools__filter__text {
            font-size: 13px;
            font-weight: 400;
          }
          .hp__maincontent__tools__clear {
            color: #156ff7;
            font-size: 13px;
            cursor: pointer;
          }
          .hp__maincontent__tools__filter__count {
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

          .hpf__menu {
            display: flex;
            padding: 16px 0px;
            height: 48px;
            align-items: center;
            justify-content: space-between;
          }
          .hpf__menu__view {
            font-size: 14px;
            color: #64748b;
          }
          .hpf__menu__icons {
            display: flex;
            gap: 0 16px;
          }
          .hpf__menu__icons__item {
            cursor: pointer;
            width: 20px;
            height: 20px;
          }

          @media (min-width: 1200px) {
            .hp__maincontent__tools {
              display: none;
            }
            .hpf__menu {
              padding: 12px 0px;
            }
          }

          @media (max-width: 1200px) and (min-width: 639px) {
            .hp__maincontent__tools {
              top: 60px;
            }
        `}
      </style>
    </>
  );
}

export default HpFilterHead;
