

const EventsNoResults = () => {


    return <>
        <div className="noResult"><img alt="no-results" src="/icons/no-results.svg" width={300} height={300}/></div>

        <style jsx>
            {`
            .noResult {
                width: 100%;
                // height: calc(100vh - 55px);
                display: flex;
                align-items: center;
                justify-content: center;
            }`}
        </style>
        </>
}

export default EventsNoResults;