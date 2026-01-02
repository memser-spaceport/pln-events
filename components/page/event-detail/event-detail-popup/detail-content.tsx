"use client";

import { ACCESS_TYPES } from "@/utils/constants";
import EventType from "./event-type";
import Image from "next/image";
interface DetailViewDesktopProps {
  event: any;
  onClose: () => void;
  handleRefreshClick: () => void;
  isRefreshing: boolean;
}

const DetailViewDesktop = ({
  event,
  onClose,
  handleRefreshClick,
  isRefreshing,
}: DetailViewDesktopProps) => {
  
  const eventAccessOption = event?.accessOption;
  
  return (
    <div className="detail-content">
      {/* Your content will go here */}
      <div className="detail-content__back-button">
        <div className="detail-content__back-button__wrapper" onClick={onClose}>
          <img
            src="/icons/arrow-right.svg"
            alt="back"
            className="detail-content__back-button__wrapper__icon"
            width={14}
            height={14}
          />
          <span>Back</span>
        </div>
      </div>
      {/* Header */}
      <div className="detail-content__header">
        <div className="detail-content__header__left">
          <div className="detail-content__header__left__title">
            EVENT DETAILS
          </div>
        </div>
        <div className="detail-content__header__right">
          <EventType event={event} />
          <div>
            {eventAccessOption === ACCESS_TYPES.PAID && (
              <div className="event__header__labels__label paid">
                <Image
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
                <Image
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
                <Image
                  src={"/icons/invite-only.svg"}
                  width={12}
                  height={12}
                  alt="invite logo"
                  loading="lazy"
                />
                <span>INVITE ONLY</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .detail-content {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 20px;
        }
        .detail-content__back-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-content__back-button__wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .detail-content__back-button__wrapper__icon {
          width: 14px;
          height: 14px;
          transform: rotate(180deg);
        }

        .detail-content__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default DetailViewDesktop;
