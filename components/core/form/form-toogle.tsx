import { useRef, useState } from "react";

function FormToogle(props: any) {
  const callback = props.callback;
  const [activeItem, setIsActiveItem] = useState(props.activeItem);
  const name = props?.name ?? "";

  const onSelectionChange = () => {
    if (callback) {
      setIsActiveItem(!activeItem);
      callback(!activeItem);
    }
  };
  return (
    <>
      <label className="switch">
        <input
          name={name}
          checked={activeItem}
          onChange={onSelectionChange}
          type="checkbox"
        />
        <span className="slider round"></span>
      </label>

      <style jsx>
        {`
          .switch {
            position: relative;
            display: inline-block;
            width: 38px;
            height: 21px;
            border-radius: 25px;
            border: 0.4px solid rgba(203, 213, 225, 0.4);
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
            background-color: #f1f5f9;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            box-shadow: 0px 0px 2px rgba(15, 23, 42, 0.16);
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          input:checked + .slider {
            background-color: #156ff7;
          }

          input:focus + .slider {
          }

          input:checked + .slider:before {
            -webkit-transform: translateX(16px);
            -ms-transform: translateX(16px);
            transform: translateX(16px);
          }

          /* Rounded sliders */
          .slider.round {
            border-radius: 20px;
          }

          .slider.round:before {
            border-radius: 50%;
          }
        `}
      </style>
    </>
  );
}

export default FormToogle;
