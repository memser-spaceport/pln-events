import React, { useState, useEffect } from 'react';
import { client } from "../../../.tina/__generated__/client";

interface TypographyPickerProps {
  onChange;
  value: string;
  className?: string;
}
export default function TypographyPicker(props:TypographyPickerProps) {
  const [options, setOptions] = useState([{label: "...", value: "loading"}])
  
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await client.queries.global({relativePath: `../global/index.json`})
      const data = fetchedData?.data?.global?.theme?.typo
      const options = data.map(item => ({ label: item.label, value: `mg-${item.label.replace(" ", "-").toLowerCase()}` }))
      setOptions(options);
    };
    fetchData().catch(console.error)
  });
  
  function handleChange (event) {
    props.onChange(event.target.value);
  }
  
  const optionElements = options.map((option) => {
    return <option value={option.value} key={option.value}>{option.label}</option>
  });

  const selectClasses = `${props.className} w-full border border-gray-100 text-gray-500 text-sm p-1 h-10 shadow rounded-md hover:text-blue-400 hover:border-gray-200 focus:shadow-outline focus:border-blue-500 focus:text-blue-500`;

  return (
    <select value={props.value} onChange={handleChange} className={selectClasses}>
        {optionElements}
    </select>
  )
}
