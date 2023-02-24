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
    const fullAddress = [venueName.trim(), venueAddress.trim(), location.trim()];
    const dateTBD = props.dateTBD
    
    const fullAddressValue = [...fullAddress].filter(v => v !== '').join(", ")


    // images/logos
    const tagLogo = props?.tagLogo ?? ''
    const calenderLogo = props.calenderLogo ?? ''
    const locationLogo = props.locationLogo ?? ''
    const externalLinkIcon = props.externalLinkIcon;

    return <>
        <div className="pec">
            <div className="pec__info">
               {tag && <div className="pec__info__tag">
                    <img className="pec__info__tag__img" src={tagLogo} />
                    <p className="pec__info__tag__text">{tag}</p>
                </div>}
               {eventType &&  <div className="pec__info__type">
                  <img className="pec__info__tag__img" src={`/icons/pln-event-${eventType.toLowerCase().trim()}.svg`} />
                    <p className="pec__info__tag__text">{eventType}</p>
                </div>}
            </div>
            {!website && <p className="pec__eventname">{eventName}</p>}
            {website && <p className="pec__eventname"><a className="blue" href={website} target="_blank"><span className="title">{eventName}</span></a></p>}
            <div className="pec__topics">
                {topics.map(v => <p className="pec__topics__item">{v}</p>)}
            </div>

            {description && <p className="pec__desc">{description}</p>}
            <div className="pec__calender">
                <img className="pec__calender__icon" src={calenderLogo}/>
                {!dateTBD && <p className="pec__calender__text">{fullDateFormat}</p>}
                {dateTBD && <p className="pec__calender__text">Date TBD</p>}
                
            </div>
           
           
            <div className="pec__location">
                <img className="pec__location__img" src={locationLogo}/>
                {!venueMapsLink && <p className="pec__location__text">{fullAddressValue}</p>}
                {venueMapsLink && <a className="pec__location__link" href={venueMapsLink} target="_blank"><p className="pec__location__text location-blue">{fullAddressValue}</p></a>}
                
            </div>
           
        </div>
        <style jsx>
            {
                `
              
            .pec {width: 100%; border: 1px solid #CBD5E1; border-radius: 8px;  background: white; padding: 0 20px;}
            .blue {text-decoration: none; color: #0F172A; }
            .title {display: inline-block; text-decoration: none;}

            .title:after{ content: "";  width: 16px; height: 16px;display: inline-block; margin-left: 4px;margin-bottom: -2px;background: url(${externalLinkIcon});}
            .pic {display: inline-block}

            .pec__info {display: flex; align-items: center; margin-top: 20px;}
            .pec__info__tag {display: flex; align-items: center;}
            .pec__info__tag__img {width: 16px; height: 16px; margin-right: 4px;}
            .pec__info__tag__text {font-size: 12px; color: #475569}
            .pec__desc {color: #475569; font-size: 14px; margin: 18px 0; line-height: 16px;}
            .pec__eventname {font-weight: 600; font-size: 16px; line-height: 24px; color: #0F172A; margin: 16px 0;}
            .pec__eventname--link {cursor: pointer; color: #0F172A !important; text-decoration: none;}
            .pec__calender {display: flex; align-items: center;}
            .pec__calender__icon {width: 12px; height: 12px; margin-right: 4px;}
            .pec__calender__text {font-size: 12px;}
            .pec__location__link {display: flex; color: blue !important; text-decoration: none;}

            .pec__location {display: flex; align-items: center; margin:16px 0; margin-bottom: 20px;}
            .pec__location__img {width: 12px; height: 12px; margin-right: 4px;}
            .pec__location__text {color: #64748B; font-size: 12px; margin-right: 4px; display: flex; flex-wrap: wrap;}
            
            .pec__info__type {margin-left: 16px; display: flex; align-items: center;}
            .pec__topics {display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;}
            .pec__topics__item {padding: 6px 16px; border: 1px solid #CBD5E1; border-radius: 20px; color: #0F172A; font-size: 12px;}
            .timeline {position: absolute; height: 100%; left: 50%; top: 0; width: 1px; background: #CBD5E1;}
            .location-blue {color: #156ff7;}
            `
            }
        </style>
    </>
}

export default PlEventCard