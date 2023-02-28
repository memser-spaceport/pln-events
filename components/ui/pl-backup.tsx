import { useEffect, useRef, useState } from "react";

function PlMultiSelect(props) {
    // Props
    const itemId = props.identifierId;
    const type = props.type ?? '';
    const items = props.items ?? [];
    const placeholder = props.placeholder ?? ''
    const callback = props.callback;
    const dropdownImgUrl = props.dropdownImgUrl ?? ''
    const iconUrl = props.iconUrl ?? '';
    const selectedItems = props.selectedItems ?? [];

    // Variables
    const [isPaneActive, setPaneActiveStatus] = useState(false);
    const [filteredItems, setFilteredItems] = useState([...items])
    const inputRef = useRef<HTMLInputElement>()
    const paneRef = useRef<HTMLDivElement>()

    // Methods
    const onInputChange = (e) => {
        setPaneActiveStatus(true)
        if (e.target.value.trim() === '') {
            setFilteredItems([...items])
        } else {
            const filteredValues = [...items].filter(v => v.toLowerCase().includes(e.target.value.toLowerCase()))
            setFilteredItems([...filteredValues])
        }

    }

    const onItemSelected = (item) => {
        callback(type, itemId, item);
    }

    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!paneRef.current || paneRef?.current?.contains(event.target)) {
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


    return <>
        <div id={`${itemId}-ps`} className="ms">
            <div onClick={() => setPaneActiveStatus(v => !v)} className="ms__info">
                {(selectedItems.length === 0) && <p className="ms__info__left">{`Select ${itemId}`}</p>}
                {(selectedItems.length === 1) && <p>{selectedItems[0]}</p>}
                {(selectedItems.length > 1) && <p>Multiple</p>}
                <div className="ms__info__right">
                    <p>{selectedItems.length}</p>
                    <p>X</p>
                </div>
                {iconUrl && <img className="ms__icon" src={iconUrl} />}
                {(dropdownImgUrl && items.length > 1) && <img className="ms__arrow" onClick={e => setPaneActiveStatus(v => !v)} src={dropdownImgUrl} />}
            </div>
            {isPaneActive && <div className="ms__input"><input disabled={items.length <= 1 ? true : false} placeholder="Search" id={`${itemId}-ps-input`} onChange={onInputChange} className="" type="text" /></div>}
            {isPaneActive && <div ref={paneRef} id={`${itemId}-ps-pane`} className="ms__pane">
                <div className="ps__pane__cn">
                   
                    {filteredItems.map((item, index) => <p id={`${itemId}-ps-pane-${index}`} className={`ms__pane__item ${selectedItems.includes(item) ? 'ms__pane__item--active' : ''}`} onClick={e => onItemSelected(item)}>{item}</p>)}
                </div>
            </div>}

        </div>

        <style jsx>
            {
                `
                .ms {position: relative; width: 100%;}
                .ms__info {display: flex; position: relative; justify-content: space-between; border: 1px solid #CBD5E1; color: #475569; font-size: 14px; width: 100%;  border-radius: 8px; padding: 8px 24px 8px 34px;}
                .ms__info__left {text-transform: capitalize;}
                .ms__info__right {display: flex;}
                .ms__pane {z-index: 4; max-height: 200px; overflow-y: auto;  box-shadow:0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 8px; position: absolute; border: 1px solid #E2E8F0; top: 38px; left:0; background: white; width: calc(100%);}
                .ps__pane__cn {padding-top: 8px; width: 100%; height: 200px;  padding: 8px 16px;}
                .ms__arrow {position: absolute; cursor:pointer; top: 8px; right: 8px; width:20px; height: 20px;}
                .ms__icon {position: absolute; cursor: pointer; top: 6px; left: 8px; width: 20px; height: 20px;}
                .ms__pane__item { font-size: 13px; padding: 4px 0; cursor: pointer;}
                .ms__input {border: 1px solid #CBD5E1; position: absolute; top: 0; left: 16px; font-size: 14px; width: calc(100% - 48px); outline: none; border-radius: 8px; padding: 8px 16px 8px 34px;}
                .ms__pane__item--active {font-weight: 700;}
                `
            }
        </style>
    </>
}

export default PlMultiSelect