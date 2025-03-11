// import { useEventDetailAnalytics } from "@/analytics/24-pg/event-detail-analytics";
import { TYPE_CONSTANTS } from "@/utils/constants";
import { useParams } from "next/navigation";

const EventLocation = (props: any) => {
  const event = props?.event;
  const eventFormat = event?.format ?? "";
  const eventLocation = event?.location || "TBD";
  const eventLocationUrl = event?.locationUrl || "";
  const meetingPlatform = event?.meetingPlatform || "TBD";
  const meetingLink = event?.meetingLink || "";
  const eventName = event?.name ?? "";
  const eventId = event?.id ?? "";
  const params = useParams();
  const view = params.type as string;

  // const { onEventUrlClicked } = useEventDetailAnalytics();

  const onClickEventUrl = (
    urlType: string,
    url: string,
    addtionalInfo: any
  ) => {
    // onEventUrlClicked(view, eventId, eventName, urlType, url, from, addtionalInfo);
  };

  return (
    <>
      {eventFormat && eventFormat === TYPE_CONSTANTS.IN_PERSON && (
        <>
          {eventLocationUrl ? (
            <a
              href={eventLocationUrl}
              target="_blank"
              className="event__location cursor-pointer"
              onClick={() => {
                onClickEventUrl("location", eventLocationUrl, {
                  location: eventLocation,
                });
              }}
            >
              <img
                src="/icons/location-black.svg"
                width={11}
                height={13}
                alt="location"
              />
              <span className="event__location__txt link">{eventLocation}</span>
            </a>
          ) : (
            <span className="event__location">
              <img
                src="/icons/location-black.svg"
                width={11}
                height={13}
                alt="location"
              />
              <span className="event__location__txt">{eventLocation}</span>
            </span>
          )}
        </>
      )}

      {eventFormat && eventFormat === TYPE_CONSTANTS.VIRTUAL && (
        <>
          {meetingLink ? (
            <a
              href={meetingLink}
              target="_blank"
              className="event__location cursor-pointer"
              onClick={() => {
                onClickEventUrl("meeting", meetingLink, {
                  meetingPlatform,
                });
              }}
            >
              <img
                src="/icons/virtual.svg"
                width={14}
                height={14}
                alt="location"
              />
              <span className="event__location__txt link">
                {meetingPlatform}
              </span>
            </a>
          ) : (
            <span className="event__location">
              <img
                src="/icons/virtual.svg"
                width={14}
                height={14}
                alt="location"
              />
              <span className="event__location__txt">{meetingPlatform}</span>
            </span>
          )}
        </>
      )}

      {eventFormat && eventFormat === TYPE_CONSTANTS.HYBRID && (
        <div className="event__location__wrpr">
          {eventLocationUrl ? (
            <a
              href={eventLocationUrl}
              target="_blank"
              className="event__location cursor-pointer"
              onClick={() => {
                onClickEventUrl("location", eventLocationUrl, {
                  location: eventLocation,
                });
              }}
            >
              <img
                src={"/icons/location-black.svg"}
                width={11}
                height={13}
                alt="location logo"
              />
              <span className="event__location__txt link">{eventLocation}</span>
            </a>
          ) : (
            <span className="event__location">
              <img
                src="/icons/location-black.svg"
                width={11}
                height={13}
                alt="location"
              />
              <span className="event__location__txt">{eventLocation}</span>
            </span>
          )}
          {meetingLink ? (
            <a
              href={meetingLink}
              target="_blank"
              className="event__location cursor-pointer"
              onClick={() => {
                onClickEventUrl("meeting", meetingLink, {
                  meetingPlatform,
                });
              }}
            >
              <img
                src={"/icons/virtual.svg"}
                width={14}
                height={14}
                alt="location logo"
              />
              <span className="event__location__txt link">
                {meetingPlatform}
              </span>
            </a>
          ) : (
            <span className="event__location">
              <img
                src="/icons/virtual.svg"
                width={14}
                height={14}
                alt="location"
              />
              <span className="event__location__txt">{meetingPlatform}</span>
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .event__location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #cbd5e1;
          border-radius: 24px;
          padding: 0px 12px;
          height: 26px;
        }

        .event__location__txt {
          font-size: 13px;
          line-height: 20px;
          color: #000000;
          max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline-block;
          white-space: nowrap;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .link {
          color: #156ff7 !important;
        }

        .event__location__wrpr {
          display: flex;
          gap: 4px;
          align-items: center;
          flex-wrap: wrap;
        }

        @media (min-width: 1024px) {
          .event__location__txt {
            max-width: unset;
            text-overflow: unset;
            overflow: unset;
            display: unset;
            white-space: unset;
          }
        }
      `}</style>
    </>
  );
};

export default EventLocation;
