import PlTags from "../../ui/pl-tags";
import PlToggle from "../../ui/pl-toggle";
import { getNoFiltersApplied, getUniqueValuesFromEvents, HpContext } from "./hp-helper";
import { useContext } from 'react'
import { trackGoal } from "fathom-client";
import PlMultiSelect from "../../ui/pl-multi-select";
import PlSingleSelect from "../../ui/pl-single-select";
import PlDateRange from '../../ui/pl-date-range';

function HpFilters(props) {
    const events = props.events ?? [];
    const filteredCount = props?.filteredCount;
    const { state, dispatch } = useContext(HpContext);
    const { filters, flags } = state
    const { eventMenu } = flags;
    const menus = [
        { name: 'timeline', img: '/icons/pln-timeline.svg', title: "Timeline View", imgActive: '/icons/pln-timeline-active.svg' },
        { name: 'calendar', img: '/icons/pln-calendar.svg', title: "Calendar View", imgActive: '/icons/pln-calendar-active.svg' },
        /*  {name: 'map', img: '/icons/pln-map-view.svg', title: "Map View", imgActive: '/icons/pln-map-view-active.svg'} */
    ]
    const filterValues = [
        { name: "Year", type: 'single-select', items: getUniqueValuesFromEvents('startYear', [...events]), selectedItem: filters.year, placeholder: 'Filter by year', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'year', iconUrl: '/icons/pl-calender-icon.svg' },
        { name: "Locations", type: 'multi-select', items: getUniqueValuesFromEvents('location', [...events]), selectedItems: filters.locations, placeholder: 'Filter by location', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'locations', iconUrl: '/icons/pl-location-icon.svg' },
        { name: "Date Range", type: 'date-range', identifierId: 'eventHosts', iconUrl: '/icons/pl-calender-icon.svg', dateRange: filters.dateRange },
        { name: "Event Hosts", type: 'multi-select', items: getUniqueValuesFromEvents('eventHosts', [...events]), selectedItems: filters.eventHosts, placeholder: 'Filter by Host Name', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'eventHosts', iconUrl: '/icons/pln-hosts-icon.svg' },
        { name: "Event Type", type: 'tags', items: ['Virtual', 'Conference', 'Social'], selectedItem: filters.eventType, identifierId: 'eventType' },
        { name: "Topics", type: 'multi-select', items: getUniqueValuesFromEvents('topics', [...events]), selectedItems: filters.topics, placeholder: 'Filter by topics', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'topics', iconUrl: '/icons/pl-topics-icon.svg' },

    ]
    const filterCount = getNoFiltersApplied(filters);

    const onMenuSelection = (value) => {
        if (value === 'timeline') {
            trackGoal('E98R34BE', 0)
        } else {
            trackGoal('BBAJPYJQ', 0)
        }
        dispatch({ type: 'setEventMenu', value: value })
    }

    const onFilterChange = (type, key, value) => {
        if (key === 'year') {
            trackGoal('EES2EVT9', 0)
        } else if (key === 'locations') {
            trackGoal('VCSUHFMW', 0)
        } else if (key === 'isPlnEventOnly') {
            trackGoal('JGCGLRN8', 0)
        } else if (key === 'topics') {
            trackGoal('YEM46DUS', 0)
        } else if (key === 'eventType') {
            trackGoal('A4CRP5C0', 0)
        } else if (key === 'eventHosts') {
            trackGoal('FVQKH5ME', 0)
        } else if (type === 'date-range') {
            trackGoal('KP7PRKOU', 0)
        }
        if (type === 'multi-select') {
            if (filters[key].includes(value)) {
                dispatch({ type: 'removeMultiItemFromFilter', key, value })
            } else {
                dispatch({ type: 'addMultiItemToFilter', key, value })
            }
        } else if (type === 'single-select' || type === 'toggle') {
            dispatch({ type: 'setSingleSelectFilter', key, value })
            if (key === 'year') {

                dispatch({ type: 'setStartDateRange', value: new Date(`${filters.dateRange.start.getMonth() + 1}/${filters.dateRange.start.getDate()}/${value}`) });
                dispatch({ type: 'setEndDateRange', value: new Date(`${filters.dateRange.end.getMonth() + 1}/${filters.dateRange.end.getDate()}/${value}`) });
            }
        } else if (type === 'date-range') {
            dispatch({ type: key === 'start' ? 'setStartDateRange' : 'setEndDateRange', value })
        }
    }

    const onMultiSelectClicked = (type) => {

        console.log(type)
        if (type === 'Topics') {
            console.log(type, 'inside')
            setTimeout(() => {
                let filterContainer;
                if(window.innerWidth < 1200) {
                    filterContainer = document.getElementById('mfiltercn');
                    filterContainer.scrollTo(0, filterContainer.scrollHeight);
                } else {
                    filterContainer = document.getElementById('filtercn');
                    filterContainer.scrollTo(0, filterContainer.scrollHeight);
                }
            }, 50)
        }
    }

    const onClearMultiSelect = (key) => {
        dispatch({ type: 'clearMultiSelect', key })
    }

    const onClearFilters = () => {
        trackGoal('H1OKCTIN', 0)
        dispatch({ type: 'clearAllFilters' })
    }

    const onClosePopup = () => {
        dispatch({ type: 'toggleMobileFilter' });
    }

   
    return <>
        <div id="filtercn" className="hpf">
            <div className="hpf__menu">
                <h3 className="hpf__menu__view">VIEW</h3>
                <div className="hpf__menu__icons">
                    {menus.map(m => <img onClick={() => onMenuSelection(m.name)} title={m.title} className="hpf__menu__icons__item" src={eventMenu === m.name ? m.imgActive : m.img} />)}
                </div>
            </div>
            <div className="hpf__head">
                <h3 className="hpf__head__title">{`Filters`}</h3>
                {(filterCount > 0) && <p className="hpf__head__count">{filterCount}</p>}
                <p onClick={onClearFilters} className="hpf__head__clear">Clear All</p>
                <img onClick={onClosePopup} src="/icons/pln-close-black.svg" className="hpf__head__close" />
                <p className="hpf__head__counttext">{`Showing ${filteredCount} event(s)`}</p>
            </div>
            <div className="hpf__pln">
                <p className="hpf__pln__title">Show PLN Events only</p>
                <PlToggle itemId="isPlnEventOnly" activeItem={filters.isPlnEventOnly} callback={onFilterChange} />
            </div>
            {filterValues.map(filter => <div className="hpf__filters">
                <h4 className="hpf__filters__title">{filter.name}</h4>
                {filter.type === 'date-range' && <PlDateRange selectedYear={filters.year} callback={onFilterChange} {...filter} />}
                {filter.type === 'single-select' && <PlSingleSelect callback={onFilterChange} {...filter} />}
                {filter.type === 'multi-select' && <PlMultiSelect onMultiSelectClicked={onMultiSelectClicked} onClearMultiSelect={onClearMultiSelect} callback={onFilterChange} {...filter} />}
                {filter.type === 'tags' && <PlTags callback={onFilterChange} {...filter} />}
            </div>)}
           
        </div>
     
        <style jsx>
            {
                `
                
             .hpf {width: 100%; height: 100svh; }
           
             .hpf__year {padding: 16px 24px 0 24px;}
             .hpf__year__title {font-size: 13px;  margin-bottom: 8px;}
             .hpf__head {padding: 16px 24px; border-bottom: 1px solid #CBD5E1; display: flex; position: relative; justify-content: space-between; align-items: center;} 
             .hpf__head__count {background: #156FF7; color: white; position: absolute; top:16px; left: 80px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px;}
             .hpf__head__title {font-size: 16px;}
             .hpf__head__clear {display: none;}
             .hpf__pln {padding: 24px; border-bottom: 1px solid #CBD5E1; align-items: center; display: flex; justify-content: space-between;}
             .hpf__pln__title {color: #475569; font-size: 14px;}

             .hpf__menu {display: none; border-bottom: 1px solid #CBD5E1; padding: 12px 24px; height: 48px; align-items: center; justify-content: space-between;}
             .hpf__menu__view {font-size: 14px; color: #64748B; font-weight: 500;}
             .hpf__menu__icons {display: flex; gap: 0 16px;  }
             .hpf__menu__icons__item {cursor: pointer; width: 20px; height: 24px;}
             .hpf__filters {padding: 20px 24px 0 24px;}
             .hpf__filters__title {font-size: 14px; margin-bottom: 10px; font-weight: 600; }

             .hpf__eventtype {padding: 16px 24px 0 24px;}
             .hpf__eventtype__title {font-size: 13px; margin-bottom: 8px; }
             .hpf__head__close {width: 16px; height: 16px; cursor: pointer;}
             .hpf__head__counttext {display: none; }
             @media(min-width: 1200px) {
                .hpf {height: 100%;  padding-bottom: 30px; overflow-y: scroll;}
                .hpf__head {height: 74px; align-items: flex-start;}
                .hpf__mtools {display: none;}
                .hpf__head__clear {display: block; font-size: 13px; color: #156FF7; cursor: pointer;}
                .hpf__head__close {display: none;}
                .hpf__head__counttext {display: flex; position: absolute; bottom:16px; left:24px; color: #475569; font-size: 12px;}
                .hpf__menu {display: flex;}
             }
            `
            }
        </style>
    </>
}

export default HpFilters