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

  function onFilterMenuClicked(value) {
    captureEvent(events.EVENT_VIEW_TYPE, {viewType: value})
  }

  function onClearFiltersClicked() {
    captureEvent(events.CLEAR_ALL_FILTERS)
  }

  function onFiltersApplied(filters, type, key, value) {
    try {
        if(type === 'multi-select') {
            const items = [...filters[key]];
            if(items.includes(value)) {
                if(items.filter(v => v !== value).length > 0) {
                    filters[key] = items.filter(v => v !== value)
                    const eventObj = {
                        filterType: type,
                        filterKey: key,
                        allFilters: JSON.parse(JSON.stringify(filters)),
                        filterValue:  items.filter(v => v !== value).join('|'),
                        filterValues:  items.filter(v => v !== value)
                    }
                    captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
                }
            } else {
                filters[key] = [...items, value]
                const eventObj = {
                    filterType: type,
                    filterKey: key,
                    filterValue:  [...items, value].join('|'),
                    filterValues:  [...items, value],
                    allFilters: JSON.parse(JSON.stringify(filters))
                }
                captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
            }

        } else if(type === 'single-select' || type === 'toggle') {
            if(filters[key] !== value) {
                filters[key] =  value;
                const eventObj = {
                    filterType: type,
                    filterKey: key,
                    filterValue:  value,
                    filterValues:  [value],
                    allFilters: JSON.parse(JSON.stringify(filters))
                }
                captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
            }

        } else if(type === 'date-range') {
            filters.dateRange[key] = value
            if(key === 'start') {
                const eventObj = {
                    filterType: type,
                    filterKey: key,
                    filterValue:  `${value} - ${filters.dateRange['end']}`,
                    filterValues:  [filters.dateRange['end'].toString(), value.toString()],
                    allFilters: JSON.parse(JSON.stringify(filters))
                }
                captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
            } else {
                const eventObj = {
                    filterType: type,
                    filterKey: key,
                    filterValue:  `${filters.dateRange['start']} - ${value}`,
                    filterValues:  [filters.dateRange['start'].toString(), value.toString()],
                    allFilters: JSON.parse(JSON.stringify(filters))
                }
                captureEvent(events.EVENT_FILTERS_APPLIED, eventObj);
            }
        } else {
            const eventObj = {
                filterType: type,
                filterKey: key,
                filterValue:  value,
                filterValues:  [value],
                allFilters: JSON.parse(JSON.stringify(filters))
            }
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
