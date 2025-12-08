const EventsNoResults = (props: any) => {
  const searchParams = props?.searchParams;
  const allEvents = props?.allEvents ?? [];
  
  const hasOtherFilters = searchParams ? Array.from(searchParams.keys()).some(
    key => key !== 'year' && searchParams.get(key)
  ) : false;
  
  const showNoEventsUI = allEvents.length === 0 && !hasOtherFilters;

  if (showNoEventsUI) {

    return (
      <>
        <div className="noResult">
          <div className="imgWrapper">
            <img
              alt="no-results"
              src="/icons/no-events.svg"
              width={300}
              height={300}
              className="noResultImg"
            />

            <a
              className="ah__btn overlayBtn"
              href={process.env.SUBMIT_EVENT_URL}
              target="_blank"
            >
              <span className="submit__text-web">Submit an event</span>
            </a>
          </div>
        </div>

        <style jsx>{`
          .noResult {
            width: 100%;
            height: calc(100vh - 55px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .imgWrapper {
            position: relative;
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
          }

          .noResultImg {
            width: 100%;
            height: auto;
            filter: drop-shadow(0px 4px 4px #00000024);

          }

          .ah__btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
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
            white-space: nowrap; 
            width: max-content;    
          }
          
          .overlayBtn {
            position: absolute;
            bottom: 40px; 
            left: 50%;
            transform: translateX(-50%);
          }

          .submit__text-web {
            display: inline;
          }
        `}</style>
      </>
    );
  }

  // Events exist in year but filters narrow results - show no-results.svg
  return (
    <>
      <div className="noResult">
        <img alt="no-results" src="/icons/no-results.svg" width={300} height={300}/>
      </div>

      <style jsx>
        {`
          .noResult {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
};

export default EventsNoResults;
