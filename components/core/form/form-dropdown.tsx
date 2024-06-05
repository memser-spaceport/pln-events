import { useState } from "react";

const FormDropdown = (props: any) => {
  const name = props?.name;
  const placeholder = props?.placeholder;
  const options = props?.options;
  const isError = props?.isError;

  const [isPanActive, setIsPanActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    props?.selectedValue ?? placeholder
  );

  const onDropdownClickHandler = () => {
    setIsPanActive(!isPanActive);
  };

  const onOptionClickHandler = (option: any) => {
    setSelectedValue(option.title);
    setIsPanActive(false);
  }

  return (
    <>
      <div className="fddc">
        <div className="fddc__dd" onClick={onDropdownClickHandler}>
          <input
            className={`fddc__dd__int ${isError ? "error" : ''}`}
            name={name}
            readOnly
            value={selectedValue}
          />
        </div>

        {isPanActive && (
          <div className="fddc__opts">
            {options?.map((option: any, index: number) => (
              <div onClick={() => onOptionClickHandler(option)} key={`${option} + ${index}`}>{option.title}</div>
            ))}
          </div>
        )}
      </div>

      <style jsx>
        {`
          .fddc {
            position: relative;
          }

          .fddc__dd {
            display: flex;
          }

          .fddc__dd__int {
            background: none;
            outline: none;
            height: 40px;
          }


          .error {
            border: 1px solid red;
          }
          .fddc__opts {
            position: absolute;
            max-height: 200px;
            width: 100%;
            overflow: auto;
            background: white;
          }
        `}
      </style>
    </>
  );
};

export default FormDropdown;
