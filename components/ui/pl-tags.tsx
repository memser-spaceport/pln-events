import {useRef, useState} from 'react'
function PlTags(props) {
    const items = props.items;
    const itemId = props.identifierId;
    const inputRef = useRef<HTMLInputElement>();
    const selectedItem = props.selectedItem ?? ''
    const callback = props.callback;
    const onItemSelected = (item) => {
        callback('single-select',itemId, item)
    }


    return <>
        <div className="plt">
            {items.map(item => <p onClick={e => onItemSelected(item)} className={`plt__item ${selectedItem === item ? 'plt__item--active': ''}`}>{item}</p>)}
        </div>
        <style jsx>
            {
                `
                .plt {width: 100%; display: inline-flex; gap: 0 6px;}
                .plt__item {font-size: 12px; color: #0F172A; cursor: pointer; margin-bottom: 4px; padding: 6px 12px; border: 1px solid #CBD5E1; border-radius: 20px;}
                .plt__item--active {background: #dbeafe; color: #1d4ed8; border: 1px solid #1d4ed8;}
                .plt__hidden {visibility: hidden; height: 1px; width: 1px;}
                `
            }
        </style>
    </>
}

export default PlTags