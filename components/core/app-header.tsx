"use client";

import useHeaderAnalytics from "@/analytics/header.analytics";

function AppHeader() {
  const { onHostEventClicked, onDirectoryIrlClicked } = useHeaderAnalytics();
  const onSubmitClicked = () => {
    onHostEventClicked();
  };

  const onViewDirectoryIrlClick = () => {
    onDirectoryIrlClicked();
  }
  return (
    <>
      <div className="ah__contianer">
        <header className="ah">
          <div className="ah__logo">
            <img
              className="ah__logo__img"
              src="/logos/protocol-labs-network-small-logo.svg"
            />
            <div className="ah__logo__heading">
              <h1 className="ah__logo__heading__text">Protocol Labs Events</h1>
            </div>
          </div>
          <div className="ah__actions">
            <button id="pl-events-feedback">
              <img
                src="/icons/feedback.svg"
                alt="Feedback"
                className="feedback__img"
              />
            </button>
            <a className="attendees-button" href={process.env.NEXT_PUBLIC_IRL_URL} target="_blank" rel="noopener noreferrer">
              {/* <img
                src="/icons/avatar-group.svg"
                alt="Attendees"
                className="attendees__img"
                onClick={onViewDirectoryIrlClick}
              /> */}
              <span className="attendees-text">View Attendees</span>
            </a>
            <a
              className="ah__btn"
              onClick={onSubmitClicked}
              target="_blank"
              href={process.env.SUBMIT_EVENT_URL}
            >
              <span className="submit__text-web">Submit an event</span>
              <span className="submit__text-mobile">Submit</span>
            </a>
          </div>
          {/* <img src="/icons/pln-menu-icon.svg" className="ah__menu"/> */}
        </header>
      </div>
      <style jsx>
        {`
          .ah {
            padding: 0px 24px;
            background: white;
            justify-content: space-between;
            border-bottom: 1px solid lightgrey;
            align-items: center;
            display: flex;
            width: 100vw;
            height: 60px;
            box-shadow: 0px 1px 4px #e2e8f0;
          }
          .ah__logo {
            display: flex;
            align-items: center;
          }
          .ah__logo__img {
            margin: 0;
            padding: 0;
            width: 48px;
            height: 48px;
          }
          .ah__logo__heading {
            display: none;
          }
          .ah__logo__heading__text {
            margin: 0;
            padding: 0;
            font-size: 16px;
          }
          .ah__btn {
            cursor: pointer;
            display: block;
            text-decoration: none;
            box-shadow: 0px 1px 1px rgba(7, 8, 8, 0.16),
              inset 0px 1px 0px rgba(255, 255, 255, 0.16);
            padding: 8px 24px;
            background: linear-gradient(90deg, #427dff 0%, #44d5bb 100%);
            border-radius: 20px;
            color: white;
            outline: none;
            border: none;
            font-size: 15px;
            font-weight: 600;
          }

          .submit__text-web {
            display: inline; 
          }

          .submit__text-mobile {
            display: none; 
          }

          @media (max-width: 600px) { 
            .submit__text-web {
              display: none; 
            }
            .submit__text-mobile {
              display: inline; 
            }
          }

          .attendees-button {
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
            
          .ah__feedback {
            cursor: pointer;
            display: block;
            text-decoration: none;
            box-shadow: 0px 1px 1px rgba(7, 8, 8, 0.16),
              inset 0px 1px 0px rgba(255, 255, 255, 0.16);
            padding: 8px 24px;
            background: linear-gradient(90deg, #427dff 0%, #44d5bb 100%);
            border-radius: 20px;
            color: white;
            outline: none;
            border: none;
            font-size: 15px;
            font-weight: 600;
          }

          .ah__menu {
            display: inline;
            cursor: pointer;
          }
          @media (min-width: 1200px) {
            .ah__menu {
              display: none;
            }

            .ah__feedback{
              position: absolute;
              right: 195px;
              font-weight: 600;
              font-size: 15px;
            }

            .ah__logo__heading {
              margin: 0;
              padding: 0;
              line-height: 18px;
              font-size: 18px;
              font-weight: 700;
              display: block;
              margin-left: 8px;
            }
          }

          .feedback__img,
          .attendees__img {
            width: 40px;
            height: 40px;
          }

          .ah__actions {
            display: flex;
            align-items: center;
            margin-left: auto;
            gap: 9px;
          }

          @media (max-width: 768px) { 
            .ah {
              padding: 0px 10px;
            }
              
            .ah__btn {
              padding: 8px 11px;
              font-size: 13px;
            } 

            .attendees-button {
              padding: 8px 11px;
              font-size: 13px;
              height: auto; 
            }

            .attendees__img {
              display: none; /* Hide the image on smaller screens */
            }
          }
        `}
      </style>
    </>
  );
}

export default AppHeader;
