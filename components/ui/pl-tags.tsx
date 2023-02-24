import {useRef, useState} from 'react'
function PlTags(props) {
    const items = props.items;
    const itemId = props.itemId;
    const inputRef = useRef<HTMLInputElement>()
    const callback = props.callback;
    const onItemSelected = (item) => {
        if(inputRef.current.value === item) {
            inputRef.current.value = "";
            callback(itemId, "")
        } else {
            inputRef.current.value = item;
            callback(itemId, item)
        }
      
    }


    return <>
        <div className="plt">
            {items.map(item => <p onClick={e => onItemSelected(item)} className={`plt__item ${inputRef?.current?.value === item ? 'plt__item--active': ''}`}>{item}</p>)}
            <input id={`${itemId}-pl-tag`} className='plt__hidden' ref={inputRef} type="text"/>
        </div>
        <style jsx>
            {
                `
                .plt {width: 100%; display: inline-flex; flex-wrap:wrap;}
                .plt__item {font-size: 12px; color: #0F172A; cursor: pointer;  padding: 6px 12px; border: 1px solid lightgrey; border-radius: 20px;}
                .plt__item--active {background: #dbeafe; color: #1d4ed8; border: 1px solid #1d4ed8;}
                .plt__hidden {visibility: hidden; height: 1px; width: 1px;}
                `
            }
        </style>
    </>
}

export default PlTags