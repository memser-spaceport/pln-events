import { IFilterValue, ISelectedItem } from "@/types/events.type";
import { usePostHog } from "posthog-js/react";

export default function useFilterAnalytics() {
  const posthog = usePostHog();
  const events = {
    EVENT_FILTERS_APPLIED: "EVENT_FILTERS_APPLIED",
    EVENT_VIEW_TYPE: "EVENT_VIEW_TYPE",
    CLEAR_ALL_FILTERS: "CLEAR_ALL_FILTERS"
  };

  const captureEvent = (eventName: string, eventParams = {}) => {
    try {
      if (posthog?.capture) {
        const allParams = { ...eventParams };
        posthog.capture(eventName, { ...allParams });
      }
    } catch (e) {
      console.error(e);
    }
  };

  function onFilterMenuClicked(value: string) {
    captureEvent(events.EVENT_VIEW_TYPE, { viewType: value })
  }

  function onClearFiltersClicked() {
    captureEvent(events.CLEAR_ALL_FILTERS)
  }

  function onFiltersApplied(filters: any, type: string, key: string, value: string) {
    try {
      if (type === 'multi-select') {
        const items = [...filters[key]];
        if (items.includes(value)) {
          if (items.filter(v => v !== value).length > 0) {
            filters[key] = items.filter(v => v !== value)
            const eventObj = {
              filterType: type,
              filterKey: key,
              allFilters: JSON.parse(JSON.stringify(filters)),
              filterValue: items.filter(v => v !== value).join('|'),
              filterValues: items.filter(v => v !== value)
            }
            delete eventObj.allFilters?.startDate;
            delete eventObj.allFilters?.endDate;
            captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
          }
        } else {
          filters[key] = [...items, value]
          const eventObj = {
            filterType: type,
            filterKey: key,
            filterValue: [...items, value].join('|'),
            filterValues: [...items, value],
            allFilters: JSON.parse(JSON.stringify(filters))
          }
          delete eventObj.allFilters?.startDate;
          delete eventObj.allFilters?.endDate;
          captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
        }

      } else if (type === 'single-select' || type === 'toggle') {
        if (filters[key] !== value) {
          filters[key] = value;
          const eventObj = {
            filterType: type,
            filterKey: key,
            filterValue: value,
            filterValues: [value],
            allFilters: JSON.parse(JSON.stringify(filters))
          }
          delete eventObj.allFilters?.startDate;
          delete eventObj.allFilters?.endDate;
          captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
        }

      } else if (type === 'date-range') {
        filters.key = key
        if (key === 'start') {
          const eventObj = {
            filterType: type,
            filterKey: key,
            filterValue: `${value} - ${filters.endDate}`,
            filterValues: [filters.endDate.toString(), value.toString()],
            allFilters: JSON.parse(JSON.stringify(filters))
          }
          delete eventObj.allFilters?.startDate;
          delete eventObj.allFilters?.endDate;
          captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
        } else {
          const eventObj = {
            filterType: type,
            filterKey: key,
            filterValue: `${filters.startDate} - ${value}`,
            filterValues: [filters.startDate.toString(), value.toString()],
            allFilters: JSON.parse(JSON.stringify(filters))
          }
          delete eventObj.allFilters?.startDate;
          delete eventObj.allFilters?.endDate;
          captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
        }
      } else {
        const eventObj = {
          filterType: type,
          filterKey: key,
          filterValue: value,
          filterValues: [value],
          allFilters: JSON.parse(JSON.stringify(filters))
        }
        delete eventObj.allFilters?.startDate;
        delete eventObj.allFilters?.endDate;
        captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onFiltersApplied,
    onFilterMenuClicked,
    onClearFiltersClicked
  };
}
