import { useState, useEffect, useRef } from "react"

function HpMonthBox(props) {
    const name = props.name ?? '';
    const currentIndex = props.currentIndex ?? 0;
    const [isPaneActive, setPaneStatus] = useState(false);
    const [isMonthsPaneActive, setMonthsPaneStatus] = useState(false);
    const paneRef = useRef<HTMLDivElement>();
    const monthsRef = useRef<HTMLDivElement>();
    const allData = props.allData || [];
    const monthsAvailable = [...allData];
    const monthIndexes = monthsAvailable.map(m => m.index);
    const currenMonthId = new Date().getMonth();
    const isCurrentHasEvents = monthIndexes.includes(currenMonthId);
   

    const onMonthClicked = () => {
        if (allData.length > 0) {
            setPaneStatus(v => !v)
        }
    }

    const onNavigate = (type, index) => {
        if(index === -1) {
            return;
        }

        if (type === 'prev') {
            if(currentIndex === 0 || !monthIndexes.includes(currentIndex - 1)) {
                return;
            }
            const itemIndex = allData.findIndex(v => v.index === currentIndex);
            if (itemIndex - 1 >= 0) {
                const newItem = allData[itemIndex - 1]
                const scrollItem = document.getElementById(`m-${newItem.index}`);
                if (scrollItem) {
                    scrollItem.scrollIntoView({ behavior: "smooth", block: "start" })
                }
            }

        } else if (type === 'next') {
            if(currentIndex === 11 || !monthIndexes.includes(currentIndex + 1)) {
                return;
            }
            const itemIndex = allData.findIndex(v => v.index === currentIndex);
            if (itemIndex + 1 < allData.length) {
                const newItem = allData[itemIndex + 1]
                const scrollItem = document.getElementById(`m-${newItem.index}`);
                if (scrollItem) {
                    scrollItem.scrollIntoView({ behavior: "smooth", block: "start" })
                }
            }

        } else if (type === 'current') {
            const itemIndex = allData.findIndex(v => v.index === currenMonthId)
            if(itemIndex > -1) {
                const scrollItem = document.getElementById(`m-${currenMonthId}`);
                if (scrollItem) {
                    scrollItem.scrollIntoView({ behavior: "smooth", block: "start" })
                }
            }
            
        } else if (type === 'direct') {
            const scrollItem = document.getElementById(`m-${index}`);
            if (scrollItem) {
                scrollItem.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }
        setPaneStatus(false)
        setMonthsPaneStatus(false)

    }

    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!paneRef.current || paneRef?.current?.contains(event.target) || event.target.id === 'tesssst') {
                return;
            } else {
                setPaneStatus(false)
                setMonthsPaneStatus(false)
            }

            if (!monthsRef.current || monthsRef?.current?.contains(event.target)) {
                return;
            } else {
                setMonthsPaneStatus(false)
            }

        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [])

    useEffect(() => {
        if(!isPaneActive) {
            setMonthsPaneStatus(false)
        }
    }, [isPaneActive])
    return <>
        <div ref={paneRef} className="hpmp">
            <div onClick={() => onMonthClicked()} className="hpmp__month">
                <p className="hpmp__month__text">{name}</p>
                {(allData.length > 0) && <img src="/icons/pln-down-arrow.svg" className="hpmp__month__img" />}
            </div>
            {isPaneActive && <div className="hpmp__pane">
                <p className="hpmp__pane__head">Jump to</p>
                <div onClick={() => onNavigate('prev', 0)} className={`hpmp__pane__item ${currentIndex === 0 || !monthIndexes.includes(currentIndex - 1)? 'not-active': ''}`}>Previous Month</div>
                <div onClick={() => onNavigate('current', 0)} className={`hpmp__pane__item ${!isCurrentHasEvents ? 'not-active': ''}`}>Current Month</div>
                <div onClick={() => onNavigate('next', 0)} className={`hpmp__pane__item ${currentIndex === 11 || !monthIndexes.includes(currentIndex + 1) ? 'not-active': ''}`}>Next Month</div>
                <p className="onlyMobile bordertop"></p>
                {monthsAvailable.map(m => <div className="hpmp__pane__item onlyMobile" onClick={() => onNavigate('direct', m.index)}>{m.name}</div>)}
                <div onClick={() => setMonthsPaneStatus(v => !v)} onMouseEnter={() => setMonthsPaneStatus(true)} className="hpmp__pane__item desktopOnly">
                    <p>Specific Month</p>
                    <img className="hpmp__pane__item__img" src="/icons/pln-right-arrow.svg" />
                </div>
            </div>} 

            {isMonthsPaneActive && <div ref={monthsRef} className="hpmp__monthspane">
                {monthsAvailable.map(m => <p onClick={() => onNavigate('direct', m.index)} className={`hpmp__monthspane__item`}>{m.name}</p>)}
            </div>}
        </div>
        <style jsx>
            {
                `
                
                 .bordertop {height: 2px; margin: 5px 0; width: 100%; border-bottom: 0.5px solid #cbd5e1;}
                .hpmp {position: relative;  background: white; z-index:1; padding: 6px 16px; color: #0F172A; border-radius: 100px; font-size: 13px; font-weight: 400; border: 0.5px solid #CBD5E1; width: fit-content;}
                .hpmp__month {display: flex; cursor: pointer; align-items: center; justify-content: center;}
                .hpmp__month__text {color: #0F172A; font-size: 13px; font-weight: 400; margin-right: 8px;}
                .hpmp__month__img {display: block;}
                .hpmp__monthspane {position: absolute; display: block; top:28px; left: 180px; width: 104px; padding: 4px 8px; border: 1px solid #CBD5E1; border-radius: 4px; background: white;}
                .hpmp__monthspane__item {color: #475569; font-size: 13px; cursor: pointer; font-weight: 400; padding: 10px;}
                .hpmp__pane {position: absolute; display: block; z-index: 5; padding: 10px 0; top: 30px; left: -25px; height: 250px; width: 151px; border-radius: 4px; overflow-y: scroll; background: white; border: 1px solid #CBD5E1;}
                .hpmp__pane__item {padding: 10px 16px; display: flex; cursor: pointer; font-size: 13px; color: #475569; font-weight: 400;}
                .hpmp__pane__item__img {margin-left: 8px;}
                .hpmp__pane__head {font-size: 11px; font-weight: 700; color: #475569; padding: 10px 16px; }
                .not-active {color: grey; cursor: not-allowed;}
                .onlyMobile {display: block;}
                .desktopOnly {display: none;}
                @media(min-width: 1200px) {
                    .desktopOnly {display: flex;}
                    .onlyMobile {display: none;}
                    .hpmp__month__img {display: block}
                    .hpmp__pane {display: block; height: fit-content; overflow-y: hidden; left: 20px;}
                    .hpmp__monthspane {display: block;}
                    .hpmp__month__text {margin-right: 8px;}
                    
                }

                `
            }
        </style>
    </>
}

export default HpMonthBox