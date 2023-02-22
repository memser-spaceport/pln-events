import { useRef } from "react"

function PlToggle(props) {
    const checkRef = useRef();
    const callback = props.callback;
    const itemId = props.itemId;

    const onSelectionChange = (e) => {
        if(callback) {
            callback(itemId, checkRef.current.checked)
        }
    }
    return <>
        <label className="switch">
            <input id={`${itemId}-pl-toggle`} onChange={onSelectionChange} ref={checkRef} type="checkbox"/>
            <span className="slider round"></span>
        </label>

        <style jsx>
            {
            `
            .switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
              }
              
              .switch input { 
                opacity: 0;
                width: 0;
                height: 0;
              }
              
              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
              }
              
              .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 2px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
              }
              
              input:checked + .slider {
                background-color: #156ff7;
              }
              
              input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
              }
              
              input:checked + .slider:before {
                -webkit-transform: translateX(14px);
                -ms-transform: translateX(14px);
                transform: translateX(14px);
              }
              
              /* Rounded sliders */
              .slider.round {
                border-radius: 20px;
              }
              
              .slider.round:before {
                border-radius: 50%;
              }
            
            
            `
            }
        </style>
    </>
}

export default PlToggle