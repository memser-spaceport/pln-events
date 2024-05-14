"use client";

import Filter from "@/components/core/filter";
import useFilterHook from "@/hooks/use-filter-hook";
import { IEvent, IFilterValue, ISelectedItem } from "@/types/events.type";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useEffect, useState } from "react";
import { getNoFiltersApplied } from "./hp-helper";

interface IFilterWrapper {
  filterValues: IFilterValue[];
  selectedItems: ISelectedItem;
  events: IEvent[];
  showBanner: boolean;
}

const FilterWrapper = (props: IFilterWrapper) => {
  const filterValues = props?.filterValues;
  const selectedItems = props?.selectedItems;
  const events = props?.events;
  const filterCount = getNoFiltersApplied(selectedItems);
  const showBanner = props?.showBanner;

  const [isMobileFilter, setIsMobileFilter] = useState(false);

  const { clearAllQuery } = useFilterHook();

  const onMobileClear = () => {
    if (filterCount > 0) {
      clearAllQuery();
    }
  };

  const onApplyMobileFilter = () => {
    setIsMobileFilter(!isMobileFilter);
  };

  useEffect(() => {
    const handler = (e: any) => {
      setIsMobileFilter(e.detail.isOpen);
    };
    document.addEventListener(CUSTOM_EVENTS.FILTEROPEN, handler);
    return () => {
      document.removeEventListener(CUSTOM_EVENTS.FILTEROPEN, handler);
    };
  }, []);
  return (
    <>
      <div className="fw">
        {isMobileFilter && (
          <div className="fw__mobile">
            <div className="mfilter">
              <div id="mfiltercn" className="mfilter__top">
                <Filter
                  events={events}
                  filterValues={filterValues}
                  selectedItems={selectedItems}
                />
              </div>
              <div className="mfilter__bottom">
                <div className="mfilter__bottom__tools">
                  <div
                    onClick={onMobileClear}
                    className="mfilter__bottom__tools__clear"
                  >
                    Clear all
                  </div>
                  <div
                    onClick={onApplyMobileFilter}
                    className="mfilter__bottom__tools__apply"
                  >{`View ${events.length} event(s)`}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fw__web">
          <Filter
            events={events}
            filterValues={filterValues}
            selectedItems={selectedItems}
          />
        </div>
      </div>
      <style jsx>{`
        .fw__web {
          display: none;
        }

        .fw__mobile {
        }

        .mfilter {
          display: block;
          width: 100%;
          height: calc(100svh);
          box-sizing: content-box;
          padding-bottom: 0px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          z-index: 10;
        }

        .mfilter__top {
          height: calc(100svh - 70px);
          overflow-y: scroll;
        }

        .mfilter__bottom {
          height: 70px;
          background: red;
        }

        .mfilter__bottom__tools {
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          z-index: 13;
          padding: 12px 16px;
          box-shadow: 0px -2px 4px #e2e8f0;
        }

        .mfilter__bottom__tools__clear {
          border: 1px solid #cbd5e1;
          margin-right: 16px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 100px;
        }

        .mfilter__bottom__tools__apply {
          background: #156ff7;
          color: white;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 100px;
        }

        @media (min-width: 1200px) {
          .mfilter {
            display: none;
          }

          .fw__web {
            display: block;
            width: 300px;
            border: 1px solid #cbd5e1;
            height: calc(100svh - ${showBanner ? '103px' : '60px' });
          }

          .fw__mobile {
            display: none;
          }

          .fw {
            position: sticky;
            top: ${showBanner ? '103px' : '60px' };
          }
        }
      `}</style>

      <style jsx global>
        {`
          body {
            overflow: ${isMobileFilter ? "hidden" : "auto"};
          }
        `}
      </style>
    </>
  );
};

export default FilterWrapper;
