import { ACCESS_TYPES } from "@/utils/constants";

const EventHeader = (props: any) => {
  const event = props?.event;
  const eventLogo = event?.eventLogo
    ? event?.eventLogo
    : event?.hostLogo || "/icons/default-event-logo.svg";
  const eventAccessOption = event?.accessOption ?? "";
  const isFeatured = event?.isFeatured ?? false;
  const isMultiDay = event?.multiday ?? false;

  return (
    <>
      <div className="event__header">
        <img width={32} height={32} src={eventLogo} alt="event logo" />
        <div className="event__header__labels">
          {isMultiDay && (
            <div className="event__header__labels__label multiday">
              <img
                src={"/icons/multiday.svg"}
                width={10}
                height={10}
                alt="multiday"
                loading="lazy"
              />
              <span>MULTIDAY</span>
            </div>
          )}

          {eventAccessOption === ACCESS_TYPES.PAID && (
            <div className="event__header__labels__label paid">
              <img
                src={"/icons/paid-green.svg"}
                width={10}
                height={10}
                alt="paid Logo"
                loading="lazy"
              />
              <span>{ACCESS_TYPES.PAID}</span>
            </div>
          )}

          {eventAccessOption === ACCESS_TYPES.FREE && (
            <div className="event__header__labels__label free">
              <img
                src={"/icons/free.svg"}
                width={10}
                height={10}
                alt="free Logo"
                loading="lazy"
              />
              <span>{ACCESS_TYPES.FREE_LABEL}</span>
            </div>
          )}

          {eventAccessOption === ACCESS_TYPES.INVITE && (
            <div className="event__header__labels__label invite-only">
              <img
                src={"/icons/invite-only.svg"}
                width={12}
                height={12}
                alt="invite logo"
                loading="lazy"
              />
              <span>INVITE ONLY</span>
            </div>
          )}

          {isFeatured && (
            <div className="event__header__labels__label featured">
              <img
                src={"/icons/featured-star.svg"}
                width={12}
                height={12}
                alt="featured"
                loading="lazy"
                className="event__header__labels__label_icon"
              />
              <span className="event__header__labels__label_text__featured">
                FEATURED
              </span>
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .event__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .event__header__labels {
            display: flex;
            gap: 4px;
          }

          .event__header__labels__label {
            padding: 0px 8px;
            font-size: 11px;
            line-height: 24px;
            font-weight: 700;
            border-radius: 4px;
            gap: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .multiday {
            color: #0992f5;
            background-color: #e9f4f9;
          }

          .paid {
            color: #15b066;
            background-color: #e9f9ee;
          }

          .free {
            color: #e42cbc;
            background-color: #f9e9f5;
          }

          .invite-only {
            color: #f19100;
            background-color: #f9f3e9;
          }

          .featured {
            background: linear-gradient(90deg, #427dff 0%, #44d5bb 100%);
            color: #fff;
          }

          .event__header__labels__label_text__featured {
            display: none;
          }

          @media (min-width: 1024px) {
            .event__header__labels__label_text__featured {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
};

export default EventHeader;
