import { EVENTS_STATUS, MANAGE_EVENT_OPTIONS } from "@/utils/constants";
import { useState } from "react";
import ManageOptionPopup from "./manage-confirmation-popup";

const ManageEventCard = (props: any) => {
  const event = props?.event;
  const selectedTab = props?.selectedTab;
  const eventName = event.title;
  const isMainEvent = event.isMainEvent;
  const mainEventName = event.mainEventName;
  const description = event.description;
  const location = event.location;
  const status = event.status;
  const profileImg = event.userInfo.imageurl;
  const profileName = event.userInfo.name;
  const date = "Mar 31-Apr 3, 2024";

  const [selectedOption, setSelectedOption] = useState("");

  const onOptionClickHandler = (option: string) => {
    setSelectedOption(option);
  }

  const onPopupCloseHandler  = () => {
    setSelectedOption("");
  }

  const onApproveClickHandler = () => {

  }

  const onRejectClickHandler = () => {

  }
  return (
    <>
    <ManageOptionPopup onReject={onRejectClickHandler} onApprove={onApproveClickHandler} selectedOption={selectedOption} onClose={onPopupCloseHandler}/>
      <div className="evtcard">
        <div className="evtcard__header">
          <div className="evtcard__header__right">
            <div className="evtcard__header__mtnamec">
              {!isMainEvent && (
                <p className="evtcard__header__mtname__evtname">
                  {mainEventName}
                </p>
              )}
            </div>
            <div className="evtcard__header__evtnamec">
              {!isMainEvent && (
                <img alt="arrow" src="/icons/right-arrow-black.svg" />
              )}
              <h2 className="evtcard__header__mtnamec__evtname">{eventName}</h2>
            </div>
          </div>
          <div className="evtcard__header__options">
            <button className="evtcard__header__options__edit" onClick={() => onOptionClickHandler(MANAGE_EVENT_OPTIONS.edit.name)}>
              <img
                loading="lazy"
                height={14}
                width={14}
                alt="edit"
                src="/icons/edit-blue.svg"
              />
            </button>

            {selectedTab === EVENTS_STATUS.pending.label && (
              <button className="evtcard__header__options__approve" onClick={() => onOptionClickHandler(MANAGE_EVENT_OPTIONS.approve.name)}>
                <img
                  loading="lazy"
                  height={14}
                  width={14}
                  alt="approve"
                  src="/icons/right-green.svg"
                />
              </button>
            )}

            {selectedTab === EVENTS_STATUS.pending.label && (
              <button className="evtcard__header__options__reject" onClick={() => onOptionClickHandler(MANAGE_EVENT_OPTIONS.reject.name)}>
                <img loading="lazy" alt="reject" src="/icons/close-red.svg" />
              </button>
            )}
          </div>
        </div>

        <div className="evtcard__body">
          <div
            className="evtcard__body__content"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>

        <div className="evtcard__footer">
          <div className="evtcard__footer__dteltnctn">
            <div>
              <p className="evtcard__footer__dteltnctn__date">{date}</p>
            </div>

            <div className="evtcard__footer__dteltnctn__ltnc">
              <img alt="location" src="/icons/location-gray.svg" />
              <p className="evtcard__footer__dteltnctn__ltnc__location">
                {location}
              </p>
            </div>
          </div>

          <div className="evtcard__footer__authorctn">
            <p>Added by</p>

            <div className="evtcard__footer__authorctn__athr">
              <img
                className="evtcard__footer__authorctn__profile"
                alt="profile"
                src={profileImg}
                height={20}
                width={20}
              />
              <p>{profileName}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .evtcard {
            background: white;
            border-radius: 12px;
            padding: 16px 20px 16px 20px;
            width: 100%;
            box-shadow: 0px 4px 4px 0px #0f172a0a;
            position: relative;
            transition: all .5s ease;
            cursor: pointer;
          }

          // .evtcard:hover {
          //   transform: scale(1.05);
          //   box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          // }

          .evtcard__header {
            display: flex;
            justify-content: space-between;
            align-items: start;
          }

          .evtcard__header__mtnamec__evtname {
            font-size: 18px;
            font-weight: 600;
            line-height: 28px;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .evtcard__header__mtname__evtname {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .evtcard__header__right {
            width: 60%;
          }
          .evtcard__header__mtname__evtname {
            font-size: 12px;
            font-weight: 400;
            color: #9fa2aa;
          }

          .evtcard__header__evtnamec {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .evtcard__header__options {
            display: flex;
            alignt-items: center;
            gap: 4px;
          }

          .evtcard__header__options__edit {
            cursor: pointer;
            outline: none;
            border: none;
            height: 30px;
            width: 30px;
            align-items: center;
            background-color: #f1f5f9;
            border-radius: 4px;
            display: flex;
            justify-content: center;
          }

          .evtcard__header__options__approve {
            cursor: pointer;
            outline: none;
            border: none;
            height: 30px;
            width: 30px;
            align-items: center;
            background-color: #f1f5f9;
            border-radius: 4px;
            display: flex;
            justify-content: center;
          }

          .evtcard__header__options__reject {
            cursor: pointer;
            outline: none;
            border: none;
            height: 30px;
            width: 30px;
            align-items: center;
            background-color: #f1f5f9;
            border-radius: 4px;
            display: flex;
            justify-content: center;
          }

          .evtcard__body {
            margin-top: 4px;
            line-height: 24px;
          }

          .evtcard__body__content {
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #cbd5e1;
          }

          .evtcard__body__content ul {
            padding: unset;
          }

          .evtcard__footer {
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .evtcard__footer__dteltnctn {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .evtcard__footer__dteltnctn__date {
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
          }

          .evtcard__footer__dteltnctn__ltnc {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .evtcard__footer__dteltnctn__ltnc__location {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }

          .evtcard__footer__authorctn {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
          }

          .evtcard__footer__authorctn__profile {
            border-radius: 50%;
            border: 1px solid #cbd5e1;
            object-fit: cover;
          }

          .evtcard__footer__authorctn__athr {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          @media (min-width: 1200px) {
            .evtcard__header__evtname {
              font-size: 18px;
              font-weight: 600;
              line-height: 28px;
            }
          }
        `}
      </style>
    </>
  );
};

export default ManageEventCard;
