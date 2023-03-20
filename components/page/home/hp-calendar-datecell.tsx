function HpCalendarDateCell(dayInfo) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const isToday = dayInfo.isToday ?? false
    const dayOfWeek = dayInfo.dow;
    
    return <>
        <div className="dcn">
            <p className="dcn__date">{dayInfo.dayNumberText}</p>
           
        </div>
        {isToday ? <p className="dcn__dot"></p>: null}
        <p className="dcn__day">{days[dayOfWeek]}</p>

        <style jsx>
            {
                `
                .dcn {position: absolute; bottom: 8px; right: 6px;}
                .dcn__date {font-size: 16px; font-weight: 500; color: ${isToday ? '#E17527': 'black'};}
                .dcn__day{position: absolute; bottom: 10px; left: 6px;font-size: 8px; font-weight: 500; color: ${isToday ? '#E17527': 'lightgrey'}; text-transform: uppercase;}
                .dcn__dot {display: none;}
                @media(min-width: 1200px) {
                    .dcn {position: absolute; bottom: 8px; right: 10px;}
                    .dcn__date {font-size: 20px; font-weight: 500; color: ${isToday ? '#E17527': 'black'};}
                    .dcn__day{ position: absolute; bottom: 10px; left: 10px;font-size: 12px; font-weight: 500;color: ${isToday ? '#E17527': 'lightgrey'}}
                    .dcn__dot {display: block; position: absolute; background: #E17527; width: 6px; height: 6px; border-radius: 50%; bottom: 16px; right: 40px;}
                }
                
                `
            }
        </style>
    </>
}

export default HpCalendarDateCell