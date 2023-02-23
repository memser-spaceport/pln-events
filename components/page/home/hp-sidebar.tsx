import { useState } from "react";
import PlSelect from "../../ui/pl-select";
import PlTags from "../../ui/pl-tags";
import PlToggle from "../../ui/pl-toggle";
import { getUniqueValuesFromEvents } from "./hp-helper";


function HpSideBar(props) {
    const events = props.events ?? [];
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedTopic, setSelectedTopic] = useState('All')

    const filters = [
        {name: "Year", type: 'select', items: getUniqueValuesFromEvents('startYear', [...events]), selectedItem: selectedYear, onItemChange: setSelectedYear, placeholder: 'Filter by year', defaultValue: new Date().getFullYear().toString(), dropdownImgUrl: '/icons/arrow-down-filled.svg', identifierId: 'year', iconUrl: '/icons/pl-calender-icon.svg'},
        {name: "Location", type: 'select', items: getUniqueValuesFromEvents('location', [...events]), selectedItem: selectedLocation, onItemChange: setSelectedLocation, placeholder: 'Filter by location', defaultValue: 'All', dropdownImgUrl: '/icons/arrow-down-filled.svg', identifierId: 'location', iconUrl: '/icons/pl-location-icon.svg'},
        {name: "Event Type", type: 'tags', items: ['Virtual', 'Conference', 'Social'], identifierId: 'eventType'},
        {name: "Topics", type: 'select', items: getUniqueValuesFromEvents('topics', [...events]), selectedItem: selectedTopic, onItemChange: setSelectedTopic, placeholder:'Filter by topics', defaultValue: 'All', dropdownImgUrl: '/icons/arrow-down-filled.svg', identifierId: 'topic', iconUrl: '/icons/pl-topics-icon.svg'},
       
    ]



    const onFilterChange = props.onFilterChange;
    const onClearFilters = () => {
        const yearElement = document.getElementById("year-ps-input");
        const locationElement = document.getElementById("location-ps-input")
        const topic = document.getElementById("topic-ps-input");
        const eventType = document.getElementById("eventType-pl-tag");
        const toggle = document.getElementById("isPlnEventOnly-pl-toggle")

        yearElement.value = new Date().getFullYear().toString();
        setSelectedYear('')
        setSelectedYear(new Date().getFullYear().toString())
        setSelectedLocation('')
        setSelectedLocation('All');
        locationElement.value = 'All';
        setSelectedTopic('')
        setSelectedTopic('All')
        topic.value = 'All'
       
        eventType?.value = ''
        toggle?.checked = false;
        props.onClearFilters();
    }
     
    return <>
        <div className="hpsb">
            <div className="hpsb__filters">
                <h3 className="hpsb__filters__title">Filters</h3>
                <p onClick={onClearFilters} className="hpsb__filters__clear">Clear All</p>
            </div>
            <div className="hpsb__pln">
                <p className="hpsb__pln__title">Show PLN Events only</p>
                <PlToggle  itemId="isPlnEventOnly" activeItem={false} callback={onFilterChange}/>
            </div>
           
            {filters.map(filter => <div className="hpsb__location">
                <h4 className="hpsb__location__title">{filter.name}</h4>
                {filter.type === 'select' && <PlSelect callback={onFilterChange} {...filter}/>}
                {filter.type === 'tags' && <PlTags callback={onFilterChange} itemId={filter.identifierId} items={filter.items}/>}
            </div>)}

        </div>
        <style jsx>
            {
                `
                
             .hpsb {width: 100%; height: 100%; overflow-y: scroll; padding-bottom: 24px;}
             .hpsb__year {padding: 16px 24px 0 24px;}
             .hpsb__year__title {font-size: 13px;  margin-bottom: 8px;}
             .hpsb__filters {padding: 16px 24px; border-bottom: 1px solid #CBD5E1; display: flex; justify-content: space-between; align-items: center;} 
             .hpsb__filters__clear {font-size: 14px; color: #156FF7; cursor: pointer;}
             .hpsb__pln {padding: 24px; border-bottom: 1px solid #CBD5E1; align-items: center; display: flex; justify-content: space-between;}
             .hpsb__pln__title {color: #475569; font-size: 14px;}

             .hpsb__location {padding: 16px 24px 0 24px;}
             .hpsb__location__title {font-size: 13px; margin-bottom: 8px; }

             .hpsb__eventtype {padding: 16px 24px 0 24px;}
             .hpsb__eventtype__title {font-size: 13px; margin-bottom: 8px; }
            `
            }
        </style>
    </>
}

export default HpSideBar