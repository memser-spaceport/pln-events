import { ACCESS_TYPES } from "@/utils/constants";
import Image from "next/image";

export default function EventAccessOption(props: any) {
  const eventAccessOption = props?.event?.accessOption;
  const eventAccessOptionClass = eventAccessOption.toLowerCase().replace(" ", "-");
  const eventAccessOptionLabel = eventAccessOption === ACCESS_TYPES.PAID ? "PAID" : eventAccessOption === ACCESS_TYPES.FREE ? "FREE w/ RSVP" : "INVITE ONLY";
  const eventAccessOptionIcon = eventAccessOption === ACCESS_TYPES.PAID ? "/icons/paid-green.svg" : eventAccessOption === ACCESS_TYPES.FREE ? "/icons/free.svg" : "/icons/invite-only.svg";
  return (
    <>
      <div>
        {
            <div className={`event__header__labels__label ${eventAccessOptionClass}`}>
            <Image
              src={eventAccessOptionIcon}
              width={20}
              height={20}
              alt={`${eventAccessOption} Logo`}
              loading="lazy"
            />
            <span>{eventAccessOptionLabel}</span>
          </div>
        }
      </div>
      <style jsx>{`
        .event__header__labels__label {
          //padding: 0px 8px;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: 0px;
            border-radius: 4px;
            gap: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-color: #0F172A;
        }
            .paid {
            color: #15b066;
            background-color: #e9f9ee;
          }

          .free {
            color: #e42cbc;
            background-color: #f9e9f5;
          }

          .invite {
            color: #f19100;
            background-color: #f9f3e9;
          }
      `}</style>
    </>
  );
}
