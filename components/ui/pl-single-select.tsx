import { SyntheticEvent, useEffect, useRef, useState } from "react";

function PlSingleSelect(props: any) {
    // Props
    const itemId = props.identifierId;
    const type = props.type ?? '';
    const items = props.items ?? [];
    const callback = props.callback;
    const dropdownImgUrl = props.dropdownImgUrl ?? ''
    const iconUrl = props.iconUrl ?? '';
    const selectedItem = props.selectedItem?? '';

    // Variables
    const [isPaneActive, setPaneActiveStatus] = useState(false);
    const [filteredItems, setfilteredItems] = useState([...items])
    const paneRef = useRef<HTMLDivElement>(null);

    // Methods
    const onInputChange = (e: { target: { value: string; }; }) => {
        setPaneActiveStatus(true)
        if (e.target.value.trim() === '') {
            setfilteredItems([...items])
        } else {
            const filteredValues = [...items].filter(v => 
                v.label.toLowerCase().includes(e.target.value.toLowerCase()) ||
                v.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setfilteredItems([...filteredValues])
        }
    }

    const onItemSelected = (item: any) => {
        callback(itemId, item.name);
    }

    const onSelectionBoxClicked = () => {
        if(items.length > 1) {
            setPaneActiveStatus(v => !v)
        }
    }

    useEffect(() => {
        const listener = (event: any) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!paneRef.current || paneRef?.current?.contains(event.target) || event.target.id === 'tesssst') {
                return;
            } else {
                setPaneActiveStatus(false)
            }

        };
        document.addEventListener("click", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("click", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [])

    useEffect(() => {
        if(!isPaneActive) {
            setfilteredItems([...items])
        }
    }, [isPaneActive])

    const selectedItemObjs = items.filter((item: any) => selectedItem.includes(item.name));
    return <>
        <div ref={paneRef} className="plms">
            <div onClick={onSelectionBoxClicked} className="plms__info">
                <img src={iconUrl} className="plms__info__icon"/>
                {selectedItem.length === 0 && <div className="plms__info__text">{`Select Gathering`}</div>}
                {selectedItem.length > 0 && <div className="plms__info__text">{selectedItemObjs.map((item: any) => item.label).join(', ')}</div>}
                {(items.length > 1) && <img className="plms__info__arrow" src={dropdownImgUrl}/>}
            </div>

            {isPaneActive && <div className="plms__pane">
                {(items.length > 1) && <div className="plms__pane__head">
                    <input onChange={onInputChange} placeholder="Search" className="plms__pane__head__input" />
                    <img className="plms__pane__head__searchicon" src="/icons/pln-search-icon.svg" />
                </div>}
                <div className="plms__pane__list">
                    {filteredItems.length === 0 && (
                        <p className="plms__pane__empty">{`No ${props.name} available`}</p>
                    )}
                    {filteredItems.map((item, index) => (
                        <div key={`${item.name}-${index}`} onClick={() => onItemSelected(item)} className="plms__pane__list__item">
                            <p id={`${itemId}-ps-pane-${index}`} className={`plms__pane__list__item__text`}>{item.label}</p>
                            {/* {(selectedItem !== item.name) && <div className="plms__pane__list__item__check"></div>} */}
                            {selectedItemObjs.some((selectedItemObj: any) => selectedItemObj.name === item.name) ? (
                                <div className="plms__pane__list__item__check--active">
                                    <img className="plms__pane__list__item__check__icon" src="/icons/pln-white-tick.svg"/>
                                </div>
                            ) : (
                                <div className="plms__pane__list__item__check"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>}
        </div>
        <style jsx>
            {
                `
                .plms {position: relative; width: 100%; height: 36px;}
                .plms__info {position: relative; height: 38px; align-items: center; width: 100%; font-size: 14px; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 12px; display: flex; cursor: pointer;}
                .plms__info__icon {width: 16px; height: 16px; margin-right: 8px;}
                .plms__info__text {color: #475569; flex: 1; font-weight: 500; font-size: 14px; text-transform: capitalize;}
                .plms__info__close {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 0 100px 100px 0;}
                .plms__info__close__img {width: 16px; height: 16px;}
                .plms__info__count {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 100px 0 0 100px; margin-right: 1px;}
                .plms__info__count__text {color: white; font-weight: 500; font-size: 11px;}

                .plms__pane {position: absolute; background: white; z-index: 3; margin-bottom: 48px; top: 38px; left:0; max-height: 250px; box-shadow:0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 8px; position: absolute; border: 1px solid #E2E8F0; width: calc(100%);}
                .plms__pane__head {width: 100%;border-bottom: 1px solid #CBD5E1; padding:16px; position: relative;}
                .plms__pane__head__input {border: 1px solid #CBD5E1; padding: 0 12px 0 32px; height: 36px; width: 100%; outline: none; border-radius: 8px;}
                .plms__pane__head__searchicon {position: absolute; top: 27px; left: 26px;}
                .plms__pane__list {overflow-y: auto; max-height: 160px; padding: 8px 16px;}
                .plms__pane__list__item {display: flex; justify-content: space-between; cursor: pointer; width: 100%; padding: 6px 0;}
                .plms__pane__list__item__text {color: #0F172A; font-size: 14px; font-weight: 400; flex: 1; text-align:left; text-transform: capitalize;}
                .plms__pane__list__item__logo {width: 20px; height: 20px; border: 1px solid grey; background: grey; border-radius: 50%; margin-right: 8px;}
                .plms__pane__list__item__check {width: 20px; height: 20px; border: 1px solid #CBD5E1; border-radius: 4px; margin-left: 8px;}
                .plms__pane__list__item__check--active {background: #156FF7; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; margin-left: 8px;}
                .plms__pane__list__item__check__icon {width: 16px; height: 16px;}
                .plms__pane__empty {padding: 8px 16px; text-align: center; display: flex; justify-content: center; align-items: center; color: lightgrey; font-size: 13px;}
                `
            }
        </style>
    </>
}

export default PlSingleSelect