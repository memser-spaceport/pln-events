import { useEffect, useState } from "react";
import PlEventCard from "../../ui/pl-event-card";
import { trackGoal } from "fathom-client";

function HpTimeline(props) {
    const monthWiseEvents = props.monthWiseEvents || [];
    const [isScrolledUp, setScrollUp] = useState(false);
    const totalEventsCount = monthWiseEvents.reduce((count, m) => {return count + m.events.length}, 0)

    const onScrollToCurrentMonth = (monthsData) => {
        const currentTimeStamp = new Date().getTime()
        const currentMonthId = new Date().getMonth();
        const foundItemIndex = [...monthsData].findIndex(m => m.index >= currentMonthId);
        if(foundItemIndex > -1) {
            const foundItem = monthsData[foundItemIndex];
            const foundEventId = foundItem.events.findIndex(ev => ev.startDateTimeStamp >= currentTimeStamp);
            if(foundEventId > -1) {
                const foundEventItem = foundItem.events[foundEventId];
                const scrollItem = document.getElementById(`m-${currentMonthId}-${foundEventItem.startDay}`);
                if(scrollItem) {
                    scrollItem.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})
                }
            }
        }
        
        setScrollUp(currentMonthId <= 1)
    }

    const onContentScroll = () => {
        const container = document.getElementById('timeline-cn');
        if(container.scrollTop < 5) {
            setScrollUp(true)
        } else {
            setScrollUp(false)
        }
    }

    const onLinkItemClicked = (item) => {
        if(item === 'event') {
            trackGoal('DULOJY8I', 0)
        } else if (item === 'location') {
            trackGoal('UKSYEJLH', 0)
        }
    }


    return <>
        <div onScroll={onContentScroll} id="timeline-cn" className="hmt">

            {/*** SCROLL UP TO VIEW PAST ***/}
            {!isScrolledUp && <div className="hmt__scollup">
                <img className="hmt__scollup__img" src="/icons/scroll-up-icon.svg"/>
                <p className="hmt__scollup__text">Scroll up to view past events</p>
            </div>}

            <div className="hmt__cn">
                {totalEventsCount === 0 && <div className="hmt__cn__empty">
                    No matching events available.
                    </div>}
                {monthWiseEvents.map(me => <div id={`m-${me.index}`} className="hmt__cn__sec">
                    {/*** MONTH DROPDOWN ***/}
                    <p className="hmt__cn__sec__month">{me.name}</p>

                    {/*** TIMELINE UI ***/}
                    <div className="hmt__cn__sec__timeline"></div>

                    {/*** EVENT CARD ***/}
                    {me.events.map((event, eventIndex) => <div id={`m-${me.index}-${event.startDay}-cn`} className={`hmt__cn__sec__event`}>
                        <div id={`m-${me.index}-${event.startDay}`}  className={`hmt__cn__sec__event__item ${(eventIndex + 1) % 2 !== 0 ? 'left' : 'right'}`}>
                            <PlEventCard onLinkItemClicked={onLinkItemClicked} {...event} />
                            <div className={`hmt__cn__sec__event__timeline ${(eventIndex + 1) % 2 !== 0 ? 'hmt__cn__sec__event__timeline--left' : 'hmt__cn__sec__event__timeline--right'}`}></div>
                            <div className={`hmt__cn__sec__event__databox ${(eventIndex + 1) % 2 !== 0 ? 'hmt__cn__sec__event__databox--left' : 'hmt__cn__sec__event__databox--right'}`}>
                                <p className="hmt__cn__sec__event__databox__date"> {event.startDay}</p>
                                <p className="hmt__cn__sec__event__databox__day">{event.startDayString}</p>
                            </div>
                        </div>
                    </div>
                    )}
                </div>)}
            </div>
        </div>
        <style jsx>
            {
                `
            .hmt {width: 100%; height: 100%; overflow-y:scroll; position: relative; display: flex; flex-direction: column; align-items: center; padding-bottom: 50px;}
            
            .hmt__scollup {width: 100%; display: flex; position: sticky; z-index: 5; top:0px; justify-content: center; align-items: center; padding: 13px 0; background: linear-gradient(180deg, #F1F5F9 0%, rgba(241, 245, 249, 0.92) 39.05%); color: #0F172A; font-size: 13px;}
            .hmt__scollup__img {width: 8px; margin-right: 8px; height: 8px;}
            .hmt__scollup__text {font-size: 12px;}
            
            .hmt__cn {position: relative;}
            .hmt__cn__empty {background: white; border: 1px solid lightgrey; text-align: center; margin-top: 40px; width: 400px; padding: 24px;}
            .hmt__cn__sec {width: 100%; display: flex; position: relative;  flex-direction: column; align-items: center;}
            .hmt__cn__sec__month {background: white;  position: sticky; top: 42px; padding: 6px 16px; color: #0F172A; border-radius: 100px; font-size: 13px; font-weight: 400; border: 0.5px solid #CBD5E1;z-index: 3; width: fit-content; margin: 32px 0;}
            .hmt__cn__sec__event { width: 100%; position: relative; margin: 16px 0}
            .hmt__cn__sec__event__item {position: relative; width: 354px; }
          
            .hmt__cn__sec__timeline {position: absolute; height: 100%; left: 50%; top: 0; width: 1px; background: #CBD5E1;}

           
            .hmt__cn__sec__event__timeline {display: none;}
            .hmt__cn__sec__event__timeline--left {}
            .hmt__cn__sec__event__timeline--right {}
            
            .hmt__cn__sec__event__databox {display: none; }
            .hmt__cn__sec__event__databox--left { top: 0; right: -67px;}
            .hmt__cn__sec__event__databox--right { top: 0; left: -67px;}
            .hmt__cn__sec__event__databox__date {font-size: 16px; font-weight: 600; margin-bottom: 0px;}
            .hmt__cn__sec__event__databox__day {font-size: 12px; font-weight: 400; text-transform: uppercase;}
 

            .left {}
            .right {} 

            @media(min-width: 1200px) {
                .left {float: left;}
                .right {float: right; margin-top: -12%;} 
                .hmt__cn__sec {width: 800px; display: flex; position: relative;  flex-direction: column; align-items: center;}
                .hmt__cn__sec__event { width: 800px; position: relative; margin:0;}

                .hmt__cn__sec__event__timeline {position: absolute; display: block; width: 23px; height: 1px; border-bottom: 1px solid #cbd5e1;}
                .hmt__cn__sec__event__timeline--left { top: 22px; right: -23px;}
                .hmt__cn__sec__event__timeline--right { top: 22px; left: -23px;}
                
                .hmt__cn__sec__event__databox {position: absolute; border-radius: 2px; width: 44px; color: white; font-size: 14px;  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 44px; background: #8C55D3; }
                .hmt__cn__sec__event__databox--left { top: 0; right: -67px;}
                .hmt__cn__sec__event__databox--right { top: 0; left: -67px;}
                .hmt__cn__sec__event__databox__date {font-size: 16px; font-weight: 600; margin-bottom: 0px;}
                .hmt__cn__sec__event__databox__day {font-size: 12px; font-weight: 400; text-transform: uppercase;}
            }

            `
            }
        </style>
    </>
}

export default HpTimeline