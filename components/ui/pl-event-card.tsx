function PlEventCard(props) {
    const eventName = props?.eventName ?? '';
    const topics = props?.topics ?? [];
    const tag = props?.tag ?? ''
    const fullDateFormat = props?.fullDateFormat ?? ''
    const description = props?.description ?? '';
    const location = props?.location ?? ''
    const website = props?.website ?? ''
    const eventType = props?.eventType ?? '';
    const venueName = props?.venueName ?? '';
    const venueAddress = props?.venueAddress ?? '';
    const venueMapsLink = props?.venueMapsLink ?? '';
    const fullAddress = `${venueName}, ${venueAddress}, ${location}`;


    // images/logos
    const tagLogo = props?.tagLogo ?? ''
    const calenderLogo = props.calenderLogo ?? ''
    const locationLogo = props.locationLogo ?? ''


    return <>
        <div className="pec">
            <div className="pec__info">
                <div className="pec__info__tag">
                    <img className="pec__info__tag__img" src={tagLogo} />
                    <p className="pec__info__tag__text">{tag}</p>
                </div>
               {eventType &&  <div className="pec__info__type">
                  <img className="pec__info__tag__img" src={`/icons/pln-event-virtual.svg`} />
                    <p className="pec__info__tag__text">{eventType}</p>
                </div>}
            </div>
            {!website && <p className="pec__eventname">{eventName}</p>}
            {website && <a className="pec__eventname" href={website} target="_blank"><p className="pec__eventname--link">{eventName}</p></a>}
            <div className="pec__calender">
                <img className="pec__calender__icon" src={calenderLogo}/>
                <p className="pec__calender__text">{fullDateFormat}</p>
            </div>
            {topics.map(v => <p>{v}</p>)}
            <p>{description}</p>
            <div className="pec__location">
                <img className="pec__location__img" src={locationLogo}/>
                {!venueMapsLink && <p className="pec__location__text">{fullAddress}</p>}
                {venueMapsLink && <a href={venueMapsLink} target="_blank"><p className="pec__location__text">{fullAddress}</p></a>}

            </div>
           
        </div>
        <style jsx>
            {
                `
            .pec {width: 100%;}
            
            .pec__info {display: flex; align-items: center;}
            .pec__info__tag {display: flex; align-items: center;}
            .pec__info__tag__img {width: 12px; height: 12px; margin-right: 8px;}
            .pec__info__tag__text {font-size: 12px; color: #475569}
            
            .pec__eventname {font-weight: 600; font-size: 18px; color: #0F172A; margin: 16px 0;}
            .pec__eventname--link {cursor: pointer; color: blue;}
            .pec__calender {display: flex; align-items: center;}
            .pec__calender__icon {width: 14px; height: 14px; margin-right: 8px;}
            .pec__calender__text {font-size: 14px;}

            .pec__location {display: flex; align-items: center; margin:8px 0;}
            .pec__location__img {width: 12px; height: 12px; margin-right: 8px;}
            .pec__location__text {color: #64748B; font-size: 12px;}
            
            .pec__info__type {margin-left: 16px; display: flex; align-items: center;}

            .timeline {position: absolute; height: 100%; left: 50%; top: 0; width: 1px; background: #CBD5E1;}
            `
            }
        </style>
    </>
}

export default PlEventCard