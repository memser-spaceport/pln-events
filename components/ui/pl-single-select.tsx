import { SyntheticEvent, useEffect, useRef, useState } from "react";

function PlSingleSelect(props: any) {
    // Props
    const itemId = props.identifierId;
    const type = props.type ?? '';
    const items = props.items ?? [];
    const callback = props.callback;
    const dropdownImgUrl = props.dropdownImgUrl ?? ''
    const iconUrl = props.iconUrl ?? '';
    const selectedItem = props.selectedItem ?? '';
    const isPanClose = props?.isPanClose ?? false;
    const showSearch = props?.showSearch ?? false;

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
            const filteredValues = [...items].filter(v => v.toLowerCase().includes(e.target.value.toLowerCase()))
            setfilteredItems([...filteredValues])
        }

    }

    const onItemSelected = (item: string) => {
        if(isPanClose) {
            setPaneActiveStatus(v => !v)
        }
        callback(itemId, item, type);
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
            <div onClick={onSelectionBoxClicked} className="plms__info">
                {iconUrl && <img src={iconUrl} className="plms__info__icon"/>}
                {!selectedItem && <div className="plms__info__text">{`Select ${itemId}`}</div>}
                {selectedItem && <div className="plms__info__text">{selectedItem}</div>}
                {(items.length > 1) && <img className="plms__info__arrow" src={dropdownImgUrl}/>}
            </div>

            {isPaneActive && <div  className="plms__pane">
                {showSearch && (
                    <>
                    {(items.length > 1) && <div className="plms__pane__head">
                        <input onChange={onInputChange} placeholder="Search" className="plms__pane__head__input" />
                        <img className="plms__pane__head__searchicon" src="/icons/pln-search-icon.svg" />
                        </div>}
                </>
            )}
                <div className="plms__pane__list">
                    {filteredItems.length > 0 && (
                    <>{filteredItems.map((item, index) => <div key={`${item} + ${index}`} onClick={() => onItemSelected(item)} className="plms__pane__list__item">
                        <p id={`${itemId}-ps-pane-${index}`} className={`plms__pane__list__item__text ${selectedItem === item ? 'plms__pane__list__item__text--active' : '' }`} >{item}</p>
                        {(selectedItem !== item) && <div className="plms__pane__list__item__check"></div>}
                        {(selectedItem === item) && <div className="plms__pane__list__item__check--active">
                            <img className="plms__pane__list__item__check__icon" src="/icons/blue-tick.svg"/>
                            </div>}</div>)}
                    </>
                )}
                {filteredItems.length === 0 && <div className="plms__pan__list">No results found</div>}
                </div>
            </div>}
        </div>
        <style jsx>
            {
                `
                .plms {position: relative; width: 100%; height: 40px;}
                .plms__info {position: relative; height: 40px; align-items: center; width: 100%; font-size: 14px; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 12px; display: flex; cursor: pointer;}
                .plms__info__icon {width: 16px; height: 16px; margin-right: 8px;}
                .plms__info__text {color: #475569; flex: 1; font-weight: 500; font-size: 14px;; word-break: break-word; word-wrap: break-word; white-spac: nowrap; overflow: hidden; text-overflow: ellipsis;}
                .plms__info__close {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 0 100px 100px 0;}
                .plms__info__close__img {width: 16px; height: 16px;}
                .plms__info__count {background: #64748B;width: 20px; display: flex; align-items: center; justify-content: center; height: 20px; border-radius: 100px 0 0 100px; margin-right: 1px;}
                .plms__info__count__text {color: white; font-weight: 500; font-size: 11px;}

                .plms__pane {position: absolute; background: white; z-index: 3; margin-bottom: 48px; top: 40px; left:0; max-height: 250px; box-shadow:0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 8px; position: absolute; border: 1px solid #E2E8F0; width: calc(100%);}
                .plms__pane__head {width: 100%;border-bottom: 1px solid #CBD5E1; padding:16px; position: relative;}
                .plms__pane__head__input {border: 1px solid #CBD5E1; padding: 0 12px 0 32px; height: 36px; width: -moz-available; width: -webkit-fill-available; width: fill-available; outline: none; border-radius: 8px;}
                .plms__pane__head__searchicon {position: absolute; top: 27px; left: 26px;}
                .plms__pane__list {overflow-y: auto; max-height: 160px; padding: 8px 16px;}
                .plms__pane__list__item {display: flex; justify-content: space-between; cursor: pointer; width: 100%; padding: 6px 0;}
                .plms__pane__list__item__text {color: #0F172A; font-size: 14px; font-weight: 400; flex: 1; text-align:left;}
                .plms__pane__list__item__logo {width: 20px; height: 20px; border: 1px solid grey; background: grey; border-radius: 50%; margin-right: 8px;}
                .plms__pane__list__item__check {width: 20px; height: 20px; margin-left: 8px;}
                .plms__pane__list__item__check--active {display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; margin-left: 8px;}
                .plms__pane__list__item__text--active { font-weight: 500;}
                .plms__pan__list {color: #64748B; font-size: 14px; font-weight: 400; line-height: 20px; text-align: center; padding: 2px 0px 4px 0px;}
                `
            }
        </style>
    </>
}

export default PlSingleSelect