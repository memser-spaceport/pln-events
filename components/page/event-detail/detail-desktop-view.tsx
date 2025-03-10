import EventHeader from "./event-header";
import EventType from "./event-type";
import EventLocation from "./event-location";
import Tags from "./tags";
import Agenda from "./agenda";
import SocialLinks from "./social-links";
import EventHosts from "./event-hosts";
// import { useEventDetailAnalytics } from "@/analytics/24-pg/event-detail-analytics";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getRefreshStatus } from "@/utils/helper";

const DetailsDesktopView = (props: any) => {
  const event = props?.event;
  const handleRefreshClick = props?.handleRefreshClick;
  const isRefreshing = props?.isRefreshing;
  const description = event?.description ?? "";
  const eventTitle = event?.name ?? "";
  const eventTags = event?.tags ?? [];
  const sessions = event?.sessions ?? [];
  const websiteLink = event?.websiteLink ?? "";
  const eventId = event?.id ?? "";
  const params = useParams();
  const view = params.type as string;

//   const { onEventUrlClicked } = useEventDetailAnalytics();

  const onNavigateToWebsite = (websiteLink: string) => {
    // onEventUrlClicked(view, eventId, eventTitle, "website", websiteLink, from, {});
  };

  const timing = event?.timing;
  const isRefreshRestricted = getRefreshStatus(eventId)

  return (
    <>
      <div className="event">
        {/* HEADER */}
        <div className="event__header__wrpr">
          <div className="event__topbar">
            <EventHeader event={event} />
          </div>

          {/* TITLE */}
          <div className="event__title">
            <h1 className="event__title__text">{eventTitle}</h1>
          </div>
        </div>

        <div className="event__body">
          {/* DATE */}
          <div className="event__date">
            <img alt="day" src="/icons/calendar-black.svg" height={13} width={13} />
            <span>{event?.dateRange}</span>
          </div>

          {/* TIME */}
          <div className="event__time">
            <img alt="time" src="/icons/clock.svg" className="event__time__icon" height={13} width={13} />
            <span className="event__time__text">
              {/* {calculateTime(event?.startDate, event?.endDate)} */}
              {`${event?.startTime} - ${event?.endTime} (${event?.utcOffset})`}
            </span>
          </div>

          {/* HOSTS */}
          <div className="event__hosts">
            <EventHosts event={event} showTitle />
          </div>

          {/* EVENT TYPE & LOCATION */}
          <div className="event__info">
            {/* EVENT TYPE  */}
            <EventType event={event} />
            {/* LOCATION  */}
            <EventLocation event={event} />
          </div>

          {/* DESCRIPTION */}
          {description && (
            <div className="event__desc__wrpr">
              <div className="event__desc">
                <div className="event__desc__text" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </div>
          )}

          {/* TAGS */}
          {eventTags.length > 0 && (
            <div className="event__tags">
              <Tags tags={eventTags} noOftagsToShow={eventTags.length} />
            </div>
          )}

          {/* SCHEDULE */}
          {sessions.length > 0 && (
            <div className="event__schedule">
              <div className="event__schedule__cn">
                <div className="event__schedule__cn__left">
                  <h6 className="event__schedule__cn__left__title">Schedule</h6>
                  {/* <span className="event__schedule__cn__left__update">{`Last updated on ${formatUpdatedDate(event.updatedAt)}`}</span> */}
                </div>
              </div>
              <div className="event__schedule__wrpr">
                <Agenda event={event} eventTimezone={event.timezone} />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="event__footer">
          <div className="event__footer__socialLinks">
            <SocialLinks event={event} />
          </div>
          <div className="event__footer__ctrls">
            {!isRefreshRestricted && <button className="event__schedule__cn__right" disabled={isRefreshing} onClick={handleRefreshClick}>
              {!isRefreshing ? (
                <>
                  <Image src="/icons/refresh.svg" alt="edit" height={16} width={16} />
                  <span className="event__schedule__cn__right__text">Refresh Schedule</span>
                </>
              ) : (
                <span className="event__schedule__cn__right__text">Refreshing...</span>
              )}
            </button>}
            <a
              href={websiteLink || ""}
              target="_blank"
              className={`${websiteLink ? "" : "disabled"} event__footer__ctrls__website`}
              onClick={(event) => {
                if (!websiteLink) {
                  event.preventDefault(); // Prevent navigation if websiteLink is empty
                } else {
                  onNavigateToWebsite(websiteLink);
                }
              }}
            >
              Website
            </a>
            {/* <a
              href={registrationLink}
              target="_blank"
              className="event__footer__ctrls__register"
            >
              Register
            </a> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .event {
          padding: 24px 0px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 90vh;
        }

        .event__header__wrpr {
          padding-right: 24px;
        }

        .event__topbar {
          padding-bottom: 9px;
        }

        .event__body {
          flex: 1;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event__title__text {
          font-size: 24px;
          font-weight: 600;
          line-height: 32px;
          color: #0f172a;
          white-space: normal;
          word-break: break-word;
        }

        .event__date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          line-height: 22px;
        }

        .event__time {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .event__time__text {
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          line-height: 20px;
        }

        .event__info {
          display: flex;
          gap: 4px;
          align-items: center;
          flex-wrap: wrap;
        }

        .event__desc__wrpr {
          margin-right: 20px;
        }

        .event__desc {
          max-height: 200px;
          overflow-y: auto;
        }

        .event__desc__text {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          white-space: normal;
          word-break: break-word;
        }

        .event__schedule {
          margin-right: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event__schedule__cn {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .event__schedule__cn__left {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .event__schedule__cn__left__title {
          font-size: 16px;
          font-weight: 700;
          line-height: 20px;
        }

        .event__schedule__cn__left__update {
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          font-style: italic;
          color: #0f172a;
        }

        .event__schedule__cn__right {
          display: flex;
          align-items: center;
          gap: 3px;
          border: 1px solid #156ff7;
          border-radius: 47px;
          padding: 0px 23px;
          height: 36px;
          background: #ffffff;
        }

        .event__schedule__cn__right:disabled {
          cursor: default;
        }

        .event__schedule__cn__right__text {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #156ff7;
        }

        .event__schedule__wrpr {
          max-height: 280px;
          overflow: auto;
          padding: 18px 8px 18px 0px;
          border-top: 1px solid #cbd5e1;
          border-bottom: 1px solid #cbd5e1;
        }

        .event__footer {
          display: flex;
          justify-content: space-between;
          padding-right: 24px;
          padding-top: 4px;
          align-items: center;
        }

        .event__footer__ctrls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .event__footer__ctrls__website {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #ffffff;
          height: 36px;
          display: flex;
          align-items: center;
          padding: 0px 23px;
          border-radius: 24px;
          background: #156ff7;
        }

        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        :global(.event__desc__text a) {
          color: #156ff7;
          cursor: pointer;
        }

        :global(.event__desc__text ul),
        :global(.event__desc__text ol) {
          margin-left: 16px;
          padding-left: 16px;
          list-style-position: inside;
        }

        :global(.event__desc__text ul) {
          list-style-type: disc;
        }

        :global(.event__desc__text ol) {
          list-style-type: decimal;
        }

        /* Bold (strong, b) and Italic (em, i) styles */
        :global(.event__desc__text strong),
        :global(.event__desc__text b) {
          font-weight: 700;
          color: #0f172a;
        }

        :global(.event__desc__text em),
        :global(.event__desc__text i) {
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </>
  );
};

export default DetailsDesktopView;
