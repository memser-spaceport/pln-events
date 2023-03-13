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
    const isFeaturedEvent = props?.isFeaturedEvent ?? false;
    const eventHosts = props.eventHosts ?? [];
    const preferredContacts = props.preferredContacts ?? [];
    const fullAddress = [venueName.trim(), venueAddress.trim(), location.trim()];
    const dateTBD = props.dateTBD
    const onLinkItemClicked = props.onLinkItemClicked;
    const trimmedTopics = topics.slice(0, 4);
    const fullAddressValue = [...fullAddress].filter(v => v !== '').join(", ")


    // images/logos
    const tagLogo = props?.tagLogo ?? ''
    const calenderLogo = props.calenderLogo ?? ''
    const locationLogo = props.locationLogo ?? ''
    const externalLinkIcon = props.externalLinkIcon;

    const onLinkClicked = (item) => {
         if(onLinkItemClicked) {
            onLinkItemClicked(item)
         }
    }

    return <>
        <div className={`pec ${isFeaturedEvent ? 'pec--feat': ''}`}>
            <div className="pec__info">
               {tag ? <div className="pec__info__tag">
                   {tagLogo ? <img className="pec__info__tag__img" src={tagLogo} /> : null}
                    <p className="pec__info__tag__text">{tag}</p>
                </div>: null}
               <div className="pec__info__type">
                    {eventType ? <img className="pec__info__tag__img" src={`/icons/pln-event-${eventType.toLowerCase().trim()}.svg`} />: null}
                    {eventType ?  <p className="pec__info__tag__text">{eventType}</p>:null}
                </div>
               {isFeaturedEvent ?  <div className="pec__info__feat">FEATURED</div> : null}

            </div>
            {website ? <p className="pec__eventname"><a onClick={() => onLinkClicked('event')} className="blue" href={website} target="_blank"><span className="title">{eventName}</span></a></p> : <p className="pec__eventname">{eventName}</p>}
            <div className="pec__topics">
                {trimmedTopics.map(v => <p className="pec__topics__item">{v}</p>)}
            </div>
            <div className="pec__contacts">
                    {preferredContacts.map(c => <a className="pec__contacts__link" href={c.link} target="_blank"><img title={c.name} className="pec__contacts__link__img" src={c.logo}/></a>)}
                </div>

            {description ? <p className="pec__desc">{description}</p> : null}
            <div className="pec__calender">
                <img className="pec__calender__icon" src={calenderLogo}/>
                {dateTBD ? <p className="pec__calender__text">Date TBD</p> : <p className="pec__calender__text">{fullDateFormat}</p>}
            </div>
           
           
            <div className="pec__location">
                <img className="pec__location__img" src={locationLogo}/>
                {venueMapsLink ? <a onClick={() => onLinkClicked('location')} className="pec__location__link" href={venueMapsLink} target="_blank"><p className="pec__location__text location-blue">{fullAddressValue}</p></a> : <p className="pec__location__text">{fullAddressValue}</p>}
                
            </div>
            {eventHosts.length > 0 ? <div className="pec__hosts">
                {eventHosts.map((eh, ehIndex) => <div className="pec__hosts__item">
                    <img className="pec__hosts__item__img" title={eh.name} src={`${eh.logo}`}/>
                    {ehIndex === 0 ? <img className="pec__hosts__item__primimg" src={eh.primaryIcon}/> : null}
                </div>)}
                {eventHosts.length === 1 ? <p className="pec__hosts__item__text">{eventHosts[0].name}</p> : null}

            </div>: null}
           
        </div>
        <style jsx>
            {
                `
              
            .pec {width: 100%; position: relative; border: 1px solid #CBD5E1; border-radius: 8px;  background: white; padding: 0 20px;}
            .pec__close {position: absolute; top: -13px; right: -13px; width: 26px; height: 26px; background: #475569; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.5);}
            .blue {text-decoration: none; color: #0F172A; }
            .title {display: inline-block; text-decoration: none;}
            .pec--feat { background: linear-gradient(white, white) padding-box,linear-gradient(to right, #427DFF, #44D5BB) border-box; border-radius: 8px; border: 2px solid transparent; border-radius: 8px;}
            .title:after{ content: "";  width: 16px; height: 16px;display: inline-block; margin-left: 4px;margin-bottom: -2px;background: url(${externalLinkIcon});}
            .pic {display: inline-block}

            .pec__info {display: flex; align-items: center; margin-top: 20px;}
            .pec__info__feat {height: 20px; width: 64px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 500; background: linear-gradient(90deg, #427DFF 0%, #44D5BB 100%);border-radius: 2px;}
            .pec__info__tag {display: flex; align-items: center;}
            .pec__info__tag__img {width: 16px; height: 16px; margin-right: 4px;}
            .pec__info__tag__text {font-size: 12px; color: #475569}
            .pec__desc {color: #475569; font-size: 14px; margin: 18px 0; line-height: 16px;}
            .pec__eventname {font-weight: 600; font-size: 16px; line-height: 24px; color: #0F172A; margin: 16px 0;}
            .pec__eventname--link {cursor: pointer; color: #0F172A !important; text-decoration: none;}
            .pec__calender {display: flex; align-items: center; margin-top: 4px;}
            .pec__calender__icon {width: 12px; height: 12px; margin-right: 4px;}
            .pec__calender__text {font-size: 12px;}
            .pec__location__link {display: flex; color: blue !important; text-decoration: none;}

            .pec__location {display: flex; align-items: center; margin:16px 0; margin-bottom: 20px;}
            .pec__location__img {width: 12px; height: 12px; margin-right: 4px;}
            .pec__location__text {color: #64748B; font-size: 12px; margin-right: 4px; display: flex; flex-wrap: wrap;  overflow: hidden;text-overflow: ellipsis;white-space: initial;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
            
            .pec__contacts {display: flex; flex-wrap: wrap; align-items: center;}
            .pec__contacts__link {text-decoration: none; margin-right:4px; margin-top: 8px; display: flex; align-items: center; justify-content: center;}
            .pec__contacts__link__img {width:26px; height: 26px; }

            .pec__hosts {display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 16px;}
            .pec__hosts__item {display: flex; align-items: center; position: relative;}
            .pec__hosts__item__img {width: 48px; height: 48px;}
            .pec__hosts__item__text {font-size: 13px; font-weight: 600; color: #475569; text-transform: capitalize;}
            .pec__hosts__item__primimg {position: absolute; top: -4px; right: -4px; width: 20px; height: 20px;}

            .pec__info__type {margin-left: 16px; display: flex; align-items: center; flex:1;}
            .pec__topics {display: flex; gap: 0 8px; flex-wrap: wrap;}
            .pec__topics__item {padding: 6px 16px; margin-bottom: 8px; border: 1px solid #CBD5E1; border-radius: 20px; color: #0F172A; font-size: 12px;}
            .timeline {position: absolute; height: 100%; left: 50%; top: 0; width: 1px; background: #CBD5E1;}
            .location-blue {color: #156ff7;}
            .hide {display: none;}
            `
            }
        </style>
    </>
}

export default PlEventCard