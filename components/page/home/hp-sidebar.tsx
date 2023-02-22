import { useState } from "react";
import PlSelect from "../../ui/pl-select";
import PlToggle from "../../ui/pl-toggle";


function HpSideBar(props) {
    const events = props.events ?? [];
    const [defaultFilters, setDefaultFilters] = useState({year: 'All', location: ''})
    let allYears = [];
    let location = ['All'];
    let eventType = ['All'];
    let topics = ['All'];
    events.forEach(ev => {
        if(!allYears.includes(ev.startYear)) {
            allYears.push(ev.startYear)
        }
        if(!location.includes(ev.location)) {
            location.push(ev.location)
        }

        if(!eventType.includes(ev.eventType) && ev.eventType) {
            eventType.push(ev.eventType)
        }

        ev.topicitems.forEach(t => {
            if(!topics.includes(t)) {
                topics.push(t)
            }
        })

        console.log(eventType)
    })

    const onFilterChange = props.onFilterChange;
    const onClearFilters = () => {
        const yearElement = document.getElementById("year-ps-input");
        const locationElement = document.getElementById("location-ps-input")
        const topic = document.getElementById("topic-ps-input");
        const eventType = document.getElementById("eventType-ps-input");
        const toggle = document.getElementById("isPlnEventOnly-pl-toggle")
        yearElement.value = 'All'
        locationElement.value = 'All';
        topic.value = 'All'
        eventType.value = 'All'
        toggle.checked = false;
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
            <div className="hpsb__year">
                <h4 className="hpsb__year__title">Year</h4>
                <PlSelect selectArrowImgSrc="/icons/arrow-down-filled.svg" itemId="year" callback={onFilterChange} activeItem={`${new Date().getFullYear()}`} placeholder="Filter by Year" items={[...allYears]}/>
            </div>
            <div className="hpsb__location">
                <h4 className="hpsb__location__title">Location</h4>
                <PlSelect selectArrowImgSrc="/icons/arrow-down-filled.svg" itemId="location" callback={onFilterChange} activeItem="All" placeholder="Filter by location" items={[...location]}/>
            </div> 
            <div className="hpsb__location">
                <h4 className="hpsb__location__title">Topics</h4>
                <PlSelect selectArrowImgSrc="/icons/arrow-down-filled.svg" itemId="topic" callback={onFilterChange} activeItem="All" placeholder="Filter By Topics" items={[...topics]}/>
            </div>
            <div className="hpsb__eventtype">
                <h4 className="hpsb__eventtype__title">Event Type</h4>
                <PlSelect selectArrowImgSrc="/icons/arrow-down-filled.svg" itemId="eventType" callback={onFilterChange} activeItem="All" placeholder="Filter By Event Type" items={[...eventType]}/>
            </div>

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