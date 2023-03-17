
function HpCalendarEvent(eventInfo) {
    const isFeatured = eventInfo?.event?.extendedProps?.isFeaturedEvent ?? false;
    const eventType = eventInfo?.event?.extendedProps?.eventType?.toLowerCase().trim() ?? 'social';
    const tileClass = isFeatured ? 'featured' : eventType;
    const eventHosts = eventInfo?.event?.extendedProps?.eventHosts ?? [];
    const trimmedHosts = eventHosts.slice(0, 4)
    const isStart = eventInfo?.isStart ?? false
    const isEnd = eventInfo?.isEnd ?? false;
    const isSingleRow = isStart === true && isEnd === true;
    const isSameDay = eventInfo?.event?.extendedProps.startDateValue.getTime() === eventInfo?.event?.extendedProps.endDateValue.getTime()
    const tagLogo = eventInfo?.event?.extendedProps?.tagLogo;
    const isHostsAvailable = trimmedHosts.length > 0 ? true : false


    return (
        <>
            <div className={`cn ${tileClass}`}>
                {(isSingleRow && isSameDay && isHostsAvailable) && <div className="cn__hostlogos">
                    {trimmedHosts.map((h) => <div className="cn__hostlogos__item">
                        <img className="cn__hostlogos__item__img" src={h.logo} />
                    </div>)}
                </div>}
                <p title={eventInfo.event.title} className="title">{eventInfo.event.title}</p>
                {(isSingleRow && isSameDay) && <div className="cn__eventtypes">
                    <img src={`/icons/pln-calendar-${eventType}.svg`}/>
                    <img src={tagLogo}/>
                </div>}
            </div>

           

            <style jsx>
                {
                    `
                .cn {display: flex; flex-direction: column; min-height: 47px; cursor: pointer; padding: 8px;  border-radius: 4px 6px 6px 5px; justify-content: center; align-items: flex-start; width: 100%;}
                .cn__hostlogos {display: none;}
                .cn__hostlogos__item__img {width: 24px; height: 24px; border-radius: 4px;}
                .title {  display: inline-block; font-size: 12px; font-weight: 500; max-width:100%;overflow: hidden; text-overflow: ellipsis;   white-space: nowrap;}
                .social {background: #EDECFF; color: black;  border-left: ${isStart ? '4px solid #817CD2' : ''};}
                .conference {background: #E7F6DF; color: black; border-left: ${isStart ? '4px solid #63A93E' : ''};}
                .virtual {background: #ECF8FF; color: black; border-left: ${isStart ? '4px solid #67AED7' : ''};}
                .featured {background: linear-gradient(90deg, #427DFF 0%, #44D5BB 100%); color: white; border-radius: 6px;}
                .cn__eventtypes {display: none;}
                @media(min-width: 1200px) {
                    .title {margin-bottom: 8px;}
                    .cn__hostlogos {display: flex; gap: 8px; margin-bottom: 4px;}
                    .cn__eventtypes {margin-top: 8px; display: flex; width: 100%; justify-content: space-between;}

                }
                `
                }
            </style>
        </>
    )
}
export default HpCalendarEvent