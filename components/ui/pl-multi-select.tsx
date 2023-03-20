import { useEffect, useRef, useState } from "react";

function PlMultiSelect(props) {
    // Props
    const itemId = props.identifierId;
    const type = props.type ?? '';
    const rawItems = props.items ?? [];
    const items = [...rawItems].sort()
    const name = props.name ?? '';
    const callback = props.callback;
    const dropdownImgUrl = props.dropdownImgUrl ?? ''
    const iconUrl = props.iconUrl ?? '';
    const selectedItems = props.selectedItems ?? [];
    const onClearMultiSelect = props.onClearMultiSelect;
    const onMultiSelectClicked = props.onMultiSelectClicked;

    // Variables
    const [isPaneActive, setPaneActiveStatus] = useState(false);
    const [filteredItems, setfilteredItems] = useState([...items])
    const paneRef = useRef<HTMLDivElement>()

    // Methods
    const onInputChange = (e) => {
        setPaneActiveStatus(true)
        if (e.target.value.trim() === '') {
            setfilteredItems([...items])
        } else {
            const filteredValues = [...items].filter(v => v.toLowerCase().includes(e.target.value.toLowerCase()))
            setfilteredItems([...filteredValues])
        }

    }

    const onItemSelected = (item) => {
        callback(type, itemId, item);
    }

    const onClearSelection = () => {
        if (onClearMultiSelect) {
            setPaneActiveStatus(false)
            onClearMultiSelect(itemId);
            setfilteredItems([...items])

        }
    }

    const onMultiBoxClicked = () => {
        if(onMultiSelectClicked && isPaneActive === false) {
            setPaneActiveStatus(v => !v)
            onMultiSelectClicked(name)
            return;
        }
        setPaneActiveStatus(v => !v)
    }

    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!paneRef.current || paneRef?.current?.contains(event.target) || event.target.id === 'tesssst') {
                return;
            } else {
                setPaneActiveStatus(false)
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
            setfilteredItems([...items])
        }
    }, [isPaneActive])


    return <>
        <div ref={paneRef} className="plms">
            <div title={selectedItems.length > 0 ? selectedItems.join('|') : ``} id="tesssst" onClick={onMultiBoxClicked} className="plms__info">
                <img src={iconUrl} className="plms__info__icon" />
                {(selectedItems.length === 0) && <div className="plms__info__text">{`Select ${name}`}</div>}
                {(selectedItems.length === 1) && <div className="plms__info__text">{selectedItems[0]}</div>}
                {(selectedItems.length > 1) && <div className="plms__info__text">Multiple</div>}

                {(selectedItems.length > 0) && <div className="plms__info__count">
                    <p className="plms__info__count__text">{selectedItems.length}</p>
                </div>}
                {(selectedItems.length > 0) && <div onClick={onClearSelection} className="plms__info__close">
                    <img src="/icons/pln-white-close.svg" className="plms__info__close__img" />
                </div>}
                <img className="plms__info__arrow" src={dropdownImgUrl} />
            </div>


            {isPaneActive && <div className="plms__pane">
                {(items.length === 0) && <p className="plms__pane__empty">No Items to Select</p>}
                {(items.length > 0) && <div className="plms__pane__head">
                    <input onChange={onInputChange} placeholder="Search" className="plms__pane__head__input" />
                    <img className="plms__pane__head__searchicon" src="/icons/pln-search-icon.svg" />
                </div>}

                {(items.length > 0) && <div className="plms__pane__list">
                    {filteredItems.map((item, index) => <div onClick={() => onItemSelected(item)} className="plms__pane__list__item">
                        {/*  <div className="plms__pane__list__item__logo"></div> */}
                        <p id={`${itemId}-ps-pane-${index}`} className={`plms__pane__list__item__text ${selectedItems.includes(item) ? 'ps__pane__item--active' : ''}`} >{item}</p>
                        {!selectedItems.includes(item) && <div className="plms__pane__list__item__check"></div>}
                        {selectedItems.includes(item) && <div className="plms__pane__list__item__check--active">
                            <img className="plms__pane__list__item__check__icon" src="/icons/pln-white-tick.svg" />
                        </div>}

                    </div>)}
                </div>}

            </div>}
        </div>
        <style jsx>
            {
                `
                .plms {position: relative; width: 100%; height: 36px;}
                .plms__pane__empty {padding: 8px 16px; text-align:center; display: flex; justify-content: center; align-items: center; color: lightgrey; font-size: 13px;}
                .plms__info {position: relative; height: 38px; align-items: center; width: 100%; font-size: 14px; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 12px; display: flex; cursor: pointer;}
                .plms__info__icon {width: 16px; height: 16px; margin-right: 8px;}
                .plms__info__text {color: #475569; overflow: hidden;white-space: nowrap; text-overflow: ellipsis; text-transform: capitalize; flex: 1; font-weight: 500; font-size: 14px;}
                .plms__info__close {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 0 100px 100px 0;}
                .plms__info__close__img {width: 16px; height: 16px;}
                .plms__info__count {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 100px 0 0 100px; margin-right: 1px;}
                .plms__info__count__text {color: white; font-weight: 500; font-size: 11px;}

                .plms__pane {position: absolute; background: white; z-index: 3; margin-bottom: 48px; top: 38px; left:0; max-height: 250px; box-shadow:0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 8px; position: absolute; border: 1px solid #E2E8F0; width: calc(100%);}
                .plms__pane__head {width: 100%;border-bottom: 1px solid #CBD5E1; padding:16px; position: relative;}
                .plms__pane__head__input {border: 1px solid #CBD5E1; padding: 0 12px 0 32px; height: 36px; width: calc(100% - 46px); outline: none; border-radius: 8px;}
                .plms__pane__head__searchicon {position: absolute; top: 27px; left: 26px;}
                .plms__pane__list {overflow-y: auto; max-height: 160px; padding: 8px 16px;}
                .plms__pane__list__item {display: flex; justify-content: space-between; cursor: pointer; width: 100%; padding: 6px 0;}
                .plms__pane__list__item__text {color: #0F172A; overflow: hidden;white-space: nowrap; text-overflow: ellipsis; font-size: 14px; font-weight: 400; flex: 1; text-align:left; text-transform: capitalize;}
                .plms__pane__list__item__logo {width: 20px; height: 20px; border: 1px solid grey; background: grey; border-radius: 50%; margin-right: 8px;}
                .plms__pane__list__item__check {width: 20px; height: 20px; border: 1px solid #CBD5E1; border-radius: 4px; margin-left: 8px;}
                .plms__pane__list__item__check--active {background: #156FF7; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; margin-left: 8px;}
                .plms__pane__list__item__check__icon {width: 16px; height: 16px;}
                
                `
            }
        </style>
    </>
}

export default PlMultiSelect