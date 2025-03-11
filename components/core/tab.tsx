import IconTab from "./icon-tab";
import { useState } from "react";

function Tab(props: any) {
  const [isDropDownActive, setDrodownStatus] = useState(false);
  const onCloseDropdown = () => {
    setDrodownStatus(false);
  };

  const onToggleDropdown = () => {
    setDrodownStatus((v) => !v);
  };

  return (
    <>
      <IconTab
        {...props}
        onToggleDropdown={onToggleDropdown}
        onCloseDropdown={onCloseDropdown}
        isDropDownActive={isDropDownActive}
      />
    </>
  );
}

export default Tab;
