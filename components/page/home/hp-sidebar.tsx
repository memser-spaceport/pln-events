import { useState } from "react";
import PlSelect from "../../ui/pl-select";
import PlTags from "../../ui/pl-tags";
import PlToggle from "../../ui/pl-toggle";
import { getUniqueValuesFromEvents, HpContext } from "./hp-helper";
import { useContext } from 'react'
import { trackGoal } from "fathom-client";
import PlMultiSelect from "../../ui/pl-multi-select";
import PlSingleSelect from "../../ui/pl-single-select";

function HpSideBar(props) {
    const events = props.events ?? [];
    const { state, dispatch } = useContext(HpContext);
    const { filters } = state

    const filterValues = [
        { name: "Year", type: 'single-select', items: getUniqueValuesFromEvents('startYear', [...events]), selectedItem: filters.year, placeholder: 'Filter by year', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'year', iconUrl: '/icons/pl-calender-icon.svg' },
        { name: "Locations", type: 'multi-select', items: getUniqueValuesFromEvents('location', [...events]), selectedItems: filters.locations, placeholder: 'Filter by location', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'locations', iconUrl: '/icons/pl-location-icon.svg' },
        { name: "Event Type", type: 'tags', items: ['Virtual', 'Conference', 'Social'], selectedItem: filters.eventType, identifierId: 'eventType' },
        { name: "Topics", type: 'multi-select', items: getUniqueValuesFromEvents('topics', [...events]), selectedItems: filters.topics, placeholder: 'Filter by topics', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'topics', iconUrl: '/icons/pl-topics-icon.svg' },

    ]


    const onFilterChange = (type, key, value) => {
        console.log(type, key, value);
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
          }
        if (type === 'multi-select') {
            if (filters[key].includes(value)) {
                dispatch({ type: 'removeMultiItemFromFilter', key, value })
            } else {
                dispatch({ type: 'addMultiItemToFilter', key, value })
            }
        } else if (type === 'single-select' || type === 'toggle') {
            dispatch({ type: 'setSingleSelectFilter', key, value })
        }
    }

    const onClearMultiSelect = (key) => {
        dispatch({ type: 'clearMultiSelect', key })
    }

    const onClearFilters = () => {
        trackGoal('H1OKCTIN', 0)
        dispatch({ type: 'clearAllFilters' })
    }

    return <>
        <div className="hpsb">
            <div className="hpsb__head">
                <h3 className="hpsb__head__title">Filters</h3>
                <p onClick={onClearFilters} className="hpsb__head__clear">Clear All</p>
                <img src="/icons/pln-close-black.svg" className="hpsb__head__close"/>
            </div>
            <div className="hpsb__pln">
                <p className="hpsb__pln__title">Show PLN Events only</p>
                <PlToggle itemId="isPlnEventOnly" activeItem={filters.isPlnEventOnly} callback={onFilterChange} />
            </div>
            {filterValues.map(filter => <div className="hpsb__filters">
                <h4 className="hpsb__filters__title">{filter.name}</h4>
                {filter.type === 'single-select' && <PlSingleSelect callback={onFilterChange} {...filter} />}
                {filter.type === 'multi-select' && <PlMultiSelect onClearMultiSelect={onClearMultiSelect} callback={onFilterChange} {...filter} />}
                {filter.type === 'tags' && <PlTags callback={onFilterChange} {...filter} />}
            </div>)}

        </div>
        <style jsx>
            {
                `
                
             .hpsb {width: 100%; height: 100%; overflow-y: scroll; padding-bottom: 24px;}
             .hpsb__year {padding: 16px 24px 0 24px;}
             .hpsb__year__title {font-size: 13px;  margin-bottom: 8px;}
             .hpsb__head {padding: 16px 24px; border-bottom: 1px solid #CBD5E1; display: flex; justify-content: space-between; align-items: center;} 
             .hpsb__head__title {font-size: 16px;}
             .hpsb__head__clear {display: none;}
             .hpsb__pln {padding: 24px; border-bottom: 1px solid #CBD5E1; align-items: center; display: flex; justify-content: space-between;}
             .hpsb__pln__title {color: #475569; font-size: 14px;}

             .hpsb__filters {padding: 20px 24px 0 24px;}
             .hpsb__filters__title {font-size: 14px; margin-bottom: 10px; font-weight: 600; }

             .hpsb__eventtype {padding: 16px 24px 0 24px;}
             .hpsb__eventtype__title {font-size: 13px; margin-bottom: 8px; }
             .hpsb__head__close {width: 16px; height: 16px; cursor: pointer;}

             @media(min-width: 1200px) {
                .hpsb__head__clear {display: block; font-size: 13px; color: #156FF7; cursor: pointer;}
                .hpsb__head__close {display: none;}
             }
            `
            }
        </style>
    </>
}

export default HpSideBar