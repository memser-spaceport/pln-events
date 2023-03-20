import { useEffect, useRef, useState } from "react";

function PlSelect(props) {
    const itemId = props.identifierId
    const items = props.items ?? [];
    const placeholder = props.placeholder ?? ''
    const activeItem = props.defaultValue ?? ''
    const callback = props.callback;
    const dropdownImgUrl = props.dropdownImgUrl ?? ''
    const iconUrl = props.iconUrl ?? '';
    const selectedItems = props.selectedItems ?? [];
    const setSelectedItem = props.onItemChange;
    const [isPaneActive, setPaneActiveStatus] = useState(false);
    const [filteredItems, setFilteredItems] = useState([...items])
    const inputRef = useRef<HTMLInputElement>()
    const paneRef = useRef<HTMLDivElement>()
 
    const onInputChange = (e) => {
        setPaneActiveStatus(true)
        if(e.target.value.trim() === '') {
            setSelectedItem(activeItem);
            setFilteredItems([...items]);
        } else {
            const filteredValues = [...items].filter(v => v.toLowerCase().includes(e.target.value.toLowerCase()))
            setFilteredItems([...filteredValues])
        } 
       
    }

    const onItemSelected = (item, index) => {
         callback(itemId, item, index);
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
        <div id={`${itemId}-ps`} className="ps">
            <input disabled={items.length <= 1 ? true : false} placeholder={placeholder} id={`${itemId}-ps-input`} onClick={() => setPaneActiveStatus(v => !v)} onChange={onInputChange} className="ps__input" ref={inputRef} type="text" />
            {isPaneActive && <div   id={`${itemId}-ps-pane`} className="ps__pane">
                {filteredItems.map((item, index) => <p id={`${itemId}-ps-pane-${index}`} className={`ps__pane__item ${selectedItems.includes(item) ? 'ps__pane__item--active': ''}`} onClick={() => onItemSelected(item, index)}>{item}</p>)}
            </div>}
            {iconUrl && <img className="ps__icon" src={iconUrl}/>}
            {(dropdownImgUrl && items.length > 1) && <img className="ps__arrow" onClick={() => setPaneActiveStatus(v => !v)}  src={dropdownImgUrl} />}
        </div>

        <style jsx>
            {
                `
                .ps {position: relative; width: 100%;}
                .ps__pane {z-index: 4; max-height: 200px; overflow-y: auto; box-shadow:0px 2px 6px rgba(15, 23, 42, 0.16); border-radius: 8px; position: absolute; border: 1px solid #E2E8F0; top: 38px; left:0; background: white; width: calc(100%); padding: 8px 16px;}
                .ps__arrow {position: absolute; cursor:pointer; top: 8px; right: 8px; width:20px; height: 20px;}
                .ps__icon {position: absolute; cursor: pointer; top: 6px; left: 8px; width: 20px; height: 20px;}
                .ps__pane__item { font-size: 13px; padding: 4px 0; cursor: pointer;}
                .ps__input {border: 1px solid #CBD5E1; font-size: 14px; width: calc(100% - 48px); outline: none; border-radius: 8px; padding: 8px 16px 8px 34px;}
                .ps__pane__item--active {font-weight: 700;}
                `
            }
        </style>
    </>
}

export default PlSelect