import { TYPE_CONSTANTS } from "@/utils/constants";
import Image from "next/image";
const EventType = (props: any) => {
  const event = props?.event;
  const eventFormat = event?.format ?? "";

  return (
    <>
      {eventFormat && eventFormat === TYPE_CONSTANTS.IN_PERSON && (
        <span className="event__type">
          <Image
            src={"/icons/person-black.svg"}
            width={14}
            height={14}
            alt="in person"
          />
          <div className="event__type__txt">In-Person</div>
        </span>
      )}
      {eventFormat && eventFormat === TYPE_CONSTANTS.HYBRID && (
        <div className="event__type">
          <div className="event__type__hybrid">
            <Image
              src="/icons/person-black.svg"
              width={14}
              height={14}
              alt="in person"
            />
            <span>+</span>
            <Image
              src="/icons/virtual.svg"
              width={14}
              height={14}
              alt="virtual"
            />
          </div>
          <div className="event__type__txt">Hybrid</div>
        </div>
      )}
      {eventFormat && eventFormat === TYPE_CONSTANTS.VIRTUAL && (
        <div className="event__type">
          <Image
            src={"/icons/virtual.svg"}
            width={14}
            height={14}
            alt="virtual"
          />
          <div className="event__type__txt">Virtual</div>
        </div>
      )}
      <style jsx>{`
        .event__type {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          // border: 1px solid #cbd5e1;
          // border-radius: 24px;
          //padding: 0px 12px;
          height: 26px;
        }

        .event__type__txt {
          font-size: 14px;
          line-height: 20px;
          color: #0F172A;
          font-weight: 500;
          letter-spacing: 0px;
        }

        .event__type__hybrid {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default EventType;
