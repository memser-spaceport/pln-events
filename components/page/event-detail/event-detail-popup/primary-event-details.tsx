import Image from "next/image";
import Tags from "../tags";
import Agenda from "../agenda";
import EventType from "./event-type";
import EventAccessOption from "./event-access-option";
import LocationAndDate from "./location-and-date";

export default function PrimaryEventDetails({ event }: { event: any }) {
  console.log(event);

  const eventLogo = event?.eventLogo
    ? event?.eventLogo
    : event?.hostLogo || "/icons/default-event-logo.svg";

  
  const eventTags = event?.tags ?? [];
  const sessions = event?.sessions ?? [];

  return (
    <>
      <div className="primary-event-details">
        <div className="primary-event-details-desktop">
          <div className="primary-event-details-image">
            <Image
              src={eventLogo}
              alt="Primary Event Details Image"
              width={180}
              height={180}
              style={{
                minWidth: "180px",
                minHeight: "180px",
                border: "1px solid #DBDBDB",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="primary-event-details-content">
            <div className="primary-event-details-content-title-container">
              <h2 className="primary-event-details-content-title--mbl">
                {event?.name}
              </h2>
            </div>
            <LocationAndDate event={event} />
          </div>
        </div>
        <div className="primary-event-details-mobile">
          <div className="primary-event-details-mobile__title">
            <Image
              src={eventLogo}
              alt="Primary Event Details Image"
              width={58}
              height={58}
              style={{
                minWidth: "58px",
                minHeight: "58px",
                border: "1px solid #DBDBDB",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <div className="primary-event-details-content-title-container--mobile">
              <h2 className="primary-event-details-content-title">
                {event?.name}
              </h2>
            </div>
          </div>
          <div className="primary-event-details-mobile__type-and-access">
            <EventType event={event} />
            <EventAccessOption event={event} />
          </div>
          <div>
            <LocationAndDate event={event} />
          </div>
        </div>
        <div className="primary-event-details-content-tags">
          {eventTags.length > 0 && (
            <div className="event__tags">
              <Tags tags={eventTags} noOftagsToShow={eventTags.length} />
            </div>
          )}
        </div>
        <div className="primary-event-details-content-host">
          <div className="primary-event-details-content-host-details">
            <div className="primary-event-details-content-host-details-icon">
              <Image
                src="/icons/host.svg"
                alt="host-icon"
                width={16}
                height={16}
              />
              <span className="primary-event-details-content-host-details-icon-text">
                Host
              </span>
            </div>
            <div className="primary-event-details-content-host-details-name">
              <span>{event?.hostName || "Host Name"}</span>
            </div>
          </div>
          {event?.coHosts && event?.coHosts.length > 0 && (
            <div className="primary-event-details-content-host-details">
              <div className="primary-event-details-content-host-details-icon">
                <Image
                  src="/icons/host.svg"
                  alt="host-icon"
                  width={16}
                  height={16}
                />
                <span className="primary-event-details-content-host-details-icon-text">
                  Co-Host
                </span>
              </div>
              <div className="primary-event-details-content-host-details-name">
                <span>
                  {" "}
                  {(event?.coHosts && event?.coHosts[0].name) || "Co-Host Name"}
                </span>
              </div>
            </div>
          )}
        </div>
        {event?.description && (
          <div className="primary-event-details-content-description">
            <div className="primary-event-details-content-description-header">
              <Image
                src="/icons/desc.svg"
                alt="description"
                width={16}
                height={16}
              />
              <span className="primary-event-details-content-description-header-text">
                Description
              </span>
            </div>

            <p
              className="primary-event-details-content-description-text"
              dangerouslySetInnerHTML={{ __html: event?.description }}
            ></p>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="primary-event-details-content-sessions">
            <div className="primary-event-details-content-sessions-header">
              <Image
                src="/icons/agenda.svg"
                alt="schedule"
                width={16}
                height={16}
              />
              <span className="primary-event-details-content-sessions-header-text">
                Agenda
              </span>
            </div>
            <div className="primary-event-details-content-sessions-body">
              <Agenda event={event} eventTimezone={event.timezone} />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .primary-event-details {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .primary-event-details-desktop {
          display: flex;
          flex-direction: row;
          gap: 10px;
        }

        .primary-event-details-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .primary-event-details-mobile {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .primary-event-details-image {
          flex-shrink: 0;
          width: 180px;
          height: 180px;
        }
        .primary-event-details-content-title {
          font-weight: 700;
          font-size: 30px;
          color: #263d53;
        }
        .primary-event-details-content-description {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .primary-event-details-content-host {
          display: flex;
          flex-direction: row;
          gap: 8px;
        }

        .primary-event-details-content-host-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .primary-event-details-content-sessions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .primary-event-details-content-host-details-icon {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0px;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .primary-event-details-content-host-details-name {
          padding: 4px 10px;
          border: 0.5px solid #dadada;
          border-radius: 5px;
          background-color: #f1f5f9;
          font-weight: 500;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: 0px;
        }

        .primary-event-details-content-description-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .primary-event-details-content-sessions-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .primary-event-details-content-description-header-text,
        .primary-event-details-content-sessions-header-text {
          font-weight: 700;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0px;
        }

        .primary-event-details-content-sessions-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 13px;
          background-color: #f1f5f9;
          border-radius: 5px;
        }

        .primary-event-details-content-sessions-body-item {
          display: flex;
          flex-direction: row;
          gap: 10px;
        }

        .primary-event-details-content-description-text {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0px;
        }

        .primary-event-details-mobile__title {
          display: flex;
          flex-direction: row;
          gap: 10px;
        }

        .primary-event-details-content-title--mbl {
          font-weight: 700;
          font-size: 22px;
          color: #0f172a;
        }

        .primary-event-details-mobile__type-and-access {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        @media (max-width: 768px) {
          .primary-event-details-desktop {
            display: none;
          }
        }
        @media (min-width: 768px) {
          .primary-event-details-mobile {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
