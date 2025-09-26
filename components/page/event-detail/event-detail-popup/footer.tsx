import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { getRefreshStatus } from "@/utils/helper";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import SocialLinks from "../social-links";
import { getRefreshedAgenda } from "@/service/events.service";

export default function Footer({ event, setEvent }: any) {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { onScheduleRefreshClick } = useSchedulePageAnalytics();
  const irlLink = event?.irlLink;
  const websiteLink = event?.websiteLink;
  const registrationLink = event?.registrationLink;
  const { onEventUrlClicked, onViewAttendeesUrlClicked } =
    useSchedulePageAnalytics();
  const params = useParams();
  const view = params.type as string;

  const isRefreshRestricted = getRefreshStatus(event?.id ?? "");
  const handleRefreshClick = async () => {
    try {
      onScheduleRefreshClick(event?.id!, event?.name!, "clicked");
      if (event?.id) {
        setIsRefreshing(true);
        const result = await getRefreshedAgenda(event.id);
        if (result?.agenda) {
          onScheduleRefreshClick(event?.id!, event?.name!, "success");
          const updatedAgenda = result?.agenda?.map((session: any) => {
            return {
              ...session,
              startDate: session.start_date,
              endDate: session.end_date,
            };
          });
          setEvent((prevEvent: any) => ({
            ...prevEvent,
            sessions: updatedAgenda,
          }));
        }
        setIsRefreshing(false);
      }
    } catch (error) {
      setIsRefreshing(false);
      onScheduleRefreshClick(event?.id!, event?.name!, "error");
      toast.error("Session refresh failed");
      return { error };
    }
  };
  const onNavigateToWebsite = (websiteLink: string) => {
    onEventUrlClicked(view, event?.id, event?.name, "website", websiteLink, {});
  };
  const onNavigateToViewAttendees = (irlLink: string) => {
    onViewAttendeesUrlClicked(
      view,
      event?.id,
      event?.name,
      "view attendees",
      irlLink,
      {}
    );
  };
  return (
    <>
      {/* FOOTER */}
      <div className="event__footer">
        <div className="event__footer__socialLinks">
          <SocialLinks event={event} />
        </div>
        <div className="event__footer__ctrls">
          {!isRefreshRestricted && (
            <button
              className="event__schedule__cn__right"
              disabled={isRefreshing}
              onClick={handleRefreshClick}
            >
              {!isRefreshing ? (
                <>
                  <Image
                    src="/icons/refresh.svg"
                    alt="edit"
                    height={16}
                    width={16}
                  />
                  <span className="event__schedule__cn__right__text">
                    Refresh Schedule
                  </span>
                </>
              ) : (
                <span className="event__schedule__cn__right__text">
                  Refreshing...
                </span>
              )}
            </button>
          )}

          {/* <a
            className={`event__footer__ctrls__attendees__button ${
              irlLink ? "" : "disabled"
            } `}
            href={irlLink || ""}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (!irlLink) {
                event.preventDefault(); // Prevent navigation if irlLink is empty
              } else {
                onNavigateToViewAttendees(irlLink);
              }
            }}
          >
            <img
              src="/icons/avatar-group.svg"
              alt="Attendees"
              className="event__footer__ctrls__attendees__img"
            />
            View Attendees
          </a> */}

          {websiteLink && <a
            href={websiteLink || ""}
            target="_blank"
            className={`${
              websiteLink ? "" : "disabled"
            } event__footer__ctrls__website`}
            onClick={(event) => {
              if (!websiteLink) {
                event.preventDefault(); // Prevent navigation if websiteLink is empty
              } else {
                onNavigateToWebsite(websiteLink);
              }
            }}
          >
            Website
          </a>}

          {registrationLink && <a
            href={registrationLink || ""}
            target="_blank"
            className={`${
              registrationLink ? "" : "disabled"
            } event__footer__ctrls__website`}
            onClick={(event) => {
              if (!registrationLink) {
                event.preventDefault(); // Prevent navigation if websiteLink is empty
              } else {
                onNavigateToWebsite(websiteLink);
              }
            }}
          >
            Register
          </a>}

          {/* <a
              href={registrationLink}
              target="_blank"
              className="event__footer__ctrls__register"
            >
              Register
            </a> */}
        </div>
      </div>
      <style jsx>{`
        .event__footer {
          display: flex;
          justify-content: space-between;
          padding-right: 24px;
          padding-top: 4px;
          padding-bottom: 18px;
          align-items: center;
          position: sticky;
          bottom: 0;
          background: #fff;
          z-index: 1;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
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
        .event__footer__ctrls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .event__footer__ctrls__attendees__button {
          display: flex;
          align-items: center;
          color: #156ff7;
          border: 1px solid #156ff7;
          border-radius: 100px;
          border: 1px solid;
          padding: 8px 11px;
          gap: 8px;
          height: 35px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }

        .event__footer__ctrls__attendees__img {
          width: 40px;
          height: 40px;
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
      `}</style>
    </>
  );
}
