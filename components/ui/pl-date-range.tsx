import { useState, useRef, useEffect } from "react";
import { months } from "../page/home/hp-helper";

function  PlDateRange(props) {
    const dateRange = props?.dateRange;
    const iconUrl = props?.iconUrl;
    const callback = props?.callback;
    const startDate = dateRange?.start ?? new Date(`01/01/${new Date().getFullYear()}`)
    const endDate = dateRange?.end ?? new Date(`12/31/${new Date().getFullYear()}`)
    const selectedYear = props.selectedYear;
    const paneRef = useRef<HTMLInputElement>()
    const [monthViewData, setMonthViewData] = useState({ isActive: false, month: - 1, type: '' });
    const selectedDay = monthViewData.type === 'start' ? startDate.getDate() : endDate.getDate();
    const selectedMonth = monthViewData.type === 'start' ? startDate.getMonth() : endDate.getMonth()
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const startDateText = `${startDate.getDate()} ${months[startDate.getMonth()].slice(0, 3)}`;
    const endDateText = `${endDate.getDate()} ${months[endDate.getMonth()].slice(0, 3)}`;
    const daysValues = getDaysInMonths(monthViewData, selectedYear);
  
    const onDateBoxClicked = (type) => {
        if (monthViewData.isActive) {
            setMonthViewData({ isActive: false, month: - 1, type: '' });
            return
        }
        if (type === 'start') {
            setMonthViewData({ isActive: true, month: startDate.getMonth(), type: 'start' })
        } else if(type === 'end') {
            setMonthViewData({ isActive: true, month: endDate.getMonth(), type: 'end' })
        }
    }

    const onMonthNavigate = (type) => {
        if (type === 'next' && ((monthViewData.month + 1) < months.length)) {
            setMonthViewData({ ...monthViewData, month: monthViewData.month + 1 })
        } else if (type === 'prev' && (monthViewData.month - 1) >= 0) {
            setMonthViewData({ ...monthViewData, month: monthViewData.month - 1 })
        }
    }

    const onDaySelected = (day) => {
        if(day === "") {
            return;
        }
        const newDateValue = new Date(`${monthViewData.month + 1}/${day}/${selectedYear}`);
        const newDateValueTimeStamp = newDateValue.getTime()
        const resetEndDateValue = new Date(`12/31/${selectedYear}`)
        const resetStartDateValue = new Date(`01/01/${selectedYear}`)
        if (monthViewData.type === 'start') {
            if(newDateValueTimeStamp >= resetEndDateValue.getTime() || newDateValueTimeStamp > endDate.getTime()) {
                callback('date-range', 'start', newDateValue)
                callback('date-range', 'end', new Date(`12/31/${selectedYear}`))
            } else {
                callback('date-range', 'start', new Date(`${monthViewData.month + 1}/${day}/${selectedYear}`))
            }
           
        } else {
            if(newDateValueTimeStamp <= resetStartDateValue.getTime() || newDateValueTimeStamp < startDate.getTime()) {
                callback('date-range', 'end', newDateValue)
                callback('date-range', 'start', new Date(`01/01/${selectedYear}`))
            } else {
                callback('date-range', 'end', new Date(`${monthViewData.month + 1}/${day}/${selectedYear}`))
            }
            
        }

        setMonthViewData({ isActive: false, month: - 1, type: '' })
    }


    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!paneRef.current || paneRef?.current?.contains(event.target) || event.target.id === 'tesssst') {
                return;
            } else {
                setMonthViewData({ isActive: false, month: - 1, type: '' })
            }

        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [])

    return <>
        <div className="pldr">
            <div onClick={() => onDateBoxClicked('start')} className={`pldr__start ${monthViewData.type === 'start'? 'active': ''}`}>
                <img className="pldr__start__img" src={iconUrl} />
                <p className="pldr__start__text">{startDateText}</p>
            </div>
            <p>-</p>
            <div onClick={() => onDateBoxClicked('end')} className={`pldr__end ${monthViewData.type === 'end'? 'active': ''}`}>
                <img className="pldr__start__img" src={iconUrl} />
                <p className="pldr__start__text">{endDateText}</p>
            </div>
            {monthViewData.isActive && <div ref={paneRef} className="pldr__mv">
                <div className="pldr__month">
                    {(monthViewData.month > 0) && <p className="pldr__month__left" onClick={() => onMonthNavigate('prev')}>
                        <img src="/icons/pl-left-icon.svg" className="pldr__month__left__img" />
                    </p>}
                    {(monthViewData.month === 0) && <div className="pldr__month__empty"></div>}
                    <p className="pldr__month__text">{months[monthViewData.month]}</p>
                    {(monthViewData.month < 11 &&  <p className="pldr__month__right" onClick={() => onMonthNavigate('next')}>
                        <img src="/icons/pl-right-icon.svg" className="pldr__month__left__img" />
                    </p>)}
                    {(monthViewData.month === 11) && <div className="pldr__month__empty"></div>}
                </div>
                <div className="pldr__mv__daycn">
                    {dayNames.map(v => <p className="pldr__mv__daycn__head">{v}</p>)}
                    {daysValues.map(v => <div>
                        {((monthViewData.type === 'start' && monthViewData.month > endDate.getMonth()) || (monthViewData.type === 'end' && monthViewData.month < startDate.getMonth()) || (monthViewData.type === 'start' && monthViewData.month === endDate.getMonth() && v > endDate.getDate()) ||  (monthViewData.type === 'end' && monthViewData.month === startDate.getMonth() && v < startDate.getDate()) ) ? <p className="pldr__mv__daycn__item--noactive">{v}</p> : 
                        <p onClick={() => onDaySelected(v)} className={`pldr__mv__daycn__item ${((selectedDay === v) && (selectedMonth === monthViewData.month)) ? 'pldr__mv__daycn__item--active': ''}`}>{v}</p>}
                    </div>)}
                </div>
            </div>}
        </div>
        <style jsx>
            {
                `
                .pldr {border: 1px solid #cbd5e1; position: relative; border-radius: 8px; display: flex; justify-content: center; align-items: center; width: 100%; padding: 8px 12px; height: 38px;}
                .pldr__start {padding: 4px 0px; cursor: pointer; display: flex;  font-weight: 500; font-size: 14px; color: #156FF7; margin-right: 10px}
                .pldr__start__img {width: 16px; height: 16px; margin-right: 10px;}
                .pldr__end {padding: 4px 0 px; display: flex;  cursor: pointer; font-weight: 500; font-size: 14px; color: #156FF7; margin-left: 10px;}
                .pldr__end__img {width: 16px; height: 16px; margin-right: 8px;}
                .pldr__mv {position: absolute; top: 40px; left:auto; right:auto;  width: 236px; padding: 16px; background: white; box-shadow: 0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 13px; background: white; z-index: 5;}
                .pldr__head {display: flex; border-bottom: 1px solid lightgrey; align-items: center; justify-content: center; font-size: 13px; padding: 8px 0;}
                .pldr__month {display: flex; padding: 0 16px; align-items: center; justify-content: center; font-size: 13px; padding: 8px 0;}
                .pldr__month__empty {width: 40px; height: 40px;}
                .pldr__month__left {border: 1px solid #CBD5E1; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; width: 40px; height: 40px;}
                .pldr__month__right {border: 1px solid #CBD5E1; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; width: 40px; height: 40px;}
                .pldr__month__text {flex: 1; display: flex; font-size: 14px; font-weight: 700; justify-content: center;}
                .pldr__mv__daycn {display: flex; flex-wrap: wrap; }
                .pldr__mv__daycn__item {width: 25px; cursor: pointer; height: 25px; font-size: 13px; font-weight: 500; color: #0F172A; display: flex; align-items: center; justify-content: center; margin-right: 4px; margin-bottom: 4px;}
                .pldr__mv__daycn__head {width: 25px; cursor: pointer; color: #9C9D9F; font-weight: 600; height: 25px; font-size: 13px; display: flex; align-items: center; justify-content: center; margin-right: 4px; margin-bottom: 4px;}
                .pldr__mv__daycn__item--active {background: #156FF7; color: white; border-radius: 50%;}
                .pldr__mv__daycn__item--noactive {width: 25px; cursor: pointer; height: 25px; font-size: 13px; font-weight: 500; color: lightgrey; cursor: not-allowed; display: flex; align-items: center; justify-content: center; margin-right: 4px; margin-bottom: 4px;}
                .active {color: #0060f1; font-weight: 700;}
                @media(min-width: 1200px) {
                    .pldr__mv {left:0; right:0;}
                }
                `
                
            }
        </style>
    </>
}


function getDaysInMonths(monthViewData, year){
    const items = [];
    if(!monthViewData.isActive) {
        return []
    }

    const noOfDaysInMonth = new Date(year, monthViewData.month + 1, 0).getDate();
    if(noOfDaysInMonth === 0) {
        return []
    } 

    const newDate = new Date(`${monthViewData.month + 1}/01/${year}`);
    const preFillValues = newDate.getDay();

    for(let j=1; j <= preFillValues; j++) {
        items.push("")
    }
    for(let i = 1; i<= noOfDaysInMonth; i++) {
        items.push(i)
    }

    return items
}

export default PlDateRange;