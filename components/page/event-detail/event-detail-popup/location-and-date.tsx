import Image from "next/image";

const LocationAndDate = ({ event }: { event: any }) => {
  const eventLocation = event?.location || "Location TBD";
  const eventLocationUrl = event?.locationUrl || "";
  const meetingPlatform = event?.meetingPlatform || "TBD";
  const meetingLink = event?.meetingLink || "";

  const getLocationInfo = () => {
    // Try both addressInfo and address_info for compatibility
    const addressInfo = event.addressInfo || event.address_info;

    if (
      addressInfo &&
      (addressInfo.city || addressInfo.state || addressInfo.country)
    ) {
      const parts = [];

      // Add city
      if (addressInfo.city) {
        parts.push(addressInfo.city);
      }

      // Add state only if it's different from city
      if (addressInfo.state && addressInfo.state !== addressInfo.city) {
        parts.push(addressInfo.state);
      }

      // Add country
      if (addressInfo.country) {
        parts.push(addressInfo.country);
      }

      return parts.length > 0 ? parts.join(", ") : "Location TBD";
    }

    // Fallback to other location fields
    return event.locationAddress || "Location TBD";
  };

  const locationInfo = getLocationInfo();
  return (
    <>
      <section className="primary-event-details-content-location-and-date">
        <div className="primary-event-details-content-date">
          <Image
            alt="day"
            src="/icons/calendar-black.svg"
            height={15}
            width={15}
            style={{
              minHeight: "15px",
              minWidth: "15px",
            }}
          />
          <span className="primary-event-details-content-date-text">
            {event?.detailDateRange}
          </span>
        </div>
        {locationInfo && (
          <div className="primary-event-details-content-location">
            <div>
              <Image
                alt="location"
                src="/icons/location-black.svg"
                height={15}
                width={15}
                style={{
                  minHeight: "15px",
                  minWidth: "15px",
                }}
              />
            </div>
            <div className="primary-event-details-content-location-text">
              {event.addressInfo.locationUrl && (
                <a
                  href={event.addressInfo.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="location-name">
                  {event.addressInfo?.address}
                </span>
                <Image
                  alt="link"
                  src="/icons/link.svg"
                  height={15}
                  width={15}
                  style={{
                    minHeight: "15px",
                    top: "4px",
                    position: "relative",
                    minWidth: "15px",
                  }}
                  />
                </a>
              )}
              <p className="location-address">{locationInfo}</p>
              {event?.addressInfo?.location_instructions && (
                <p className="location-building">
                  {event?.addressInfo?.location_instructions}
                </p>
              )}
            </div>
          </div>
        )}
        {meetingLink && (
          <div className="primary-event-details-content-location-and-date-meeting-platform">
            <Image
              alt="meeting-platform"
              src="/icons/virtual.svg"
              height={15}
              width={15}
              style={{
                minHeight: "15px",
                minWidth: "15px",
              }}
            />

            <span className="primary-event-details-content-location-and-date-meeting-platform-text">
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                {meetingLink}
              </a>
              <Image
                alt="link"
                src="/icons/link.svg"
                height={15}
                width={15}
                style={{
                  minHeight: "15px",
                  top: "4px",
                  position: "relative",
                  minWidth: "15px",
                }}
              />
            </span>
          </div>
        )}
      </section>
      <style jsx>{`
        .primary-event-details-content-location-and-date {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .primary-event-details-content-date {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .primary-event-details-content-date-text {
          font-weight: 700;
          font-size: 13px;
          color: #3f4555;
        }
        .primary-event-details-content-location {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .no-link {
          color: #0f172a85;
          opacity: 0.52;
          font-weight: 400;
          font-size: 13px;
        }
        .primary-event-details-content-location-text {
          font-weight: 700;
          font-size: 13px;
          color: #3f4555;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .primary-event-details-content-location-and-date-meeting-platform {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 13px;
          color: #3f4555;
        }

        .location-address{
        opacity: 0.72;
        font-weight: 500;
        font-size: 12px;
        }

        .location-building {
          opacity: 0.52;
          font-weight: 400;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default LocationAndDate;
