import React, { useState, useEffect } from 'react';
import { getStyleMatch } from '../../helpers/utilities';
import { fontOptions } from './options/font-options';
import Control from './Control';
import SelectMenu from './widgets/SelectMenu';
import ToggleButton from './widgets/ToggleButton';
import PixelField from './widgets/PixelField';
import IconGap from './icons/IconGap';

// Font, Size(spx), Leading(lpx), Tracking(tpx), Bold
// - Store/Retrieve font as sluggified?
// - Maybe allow weight selection independant of Family

// - Pixel Field Icons
// - Headline CSS in Layout file
// - Maybe don't mix bold and weights

const weightOptions = [
  { label: "B", value: "font-bold" }
]
const hyphenatedFontOptions = fontOptions.map(item => {
  return {
    label: item.label,
    value: `font-${item.value.replace(" ", "-")}`
  }
})

// Font stored as prefixed hyphenated value
// Select menu access font value

const FieldRow = ({ inputValue='', onUpdate=(value)=>{ value }, isMobile = false }) => {
  const getFont = () => inputValue.split(' ').find(item => item.includes(`font-`))
  const [font, setFont] = useState(getFont() || "");
  const getSize = () => inputValue.split(' ').find(item => item.includes(`spx-`))
  const [size, setSize] = useState(getSize() || "")
  const getTracking = () => inputValue.split(' ').find(item => item.includes(`tpx-`))
  const [tracking, setTracking] = useState(getTracking() || "")
  const getLeading = () => inputValue.split(' ').find(item => item.includes(`lpx-`))
  const [leading, setLeading] = useState(getLeading() || "")
  const getMargin = () => inputValue.split(' ').find(item => item.includes(`mpx-`))
  const [margin, setMargin] = useState(getMargin() || "")

  const [weight, setWeight] = useState(getStyleMatch(weightOptions, inputValue));

  useEffect(() => {
    onUpdate(`${font} ${size} ${tracking} ${leading} ${margin} ${weight}`)
  }, [font, size, tracking, leading, margin, weight]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <SelectMenu value={font} onChange={setFont} options={hyphenatedFontOptions} className="flex-1" />
        <ToggleButton value={weight} onClick={setWeight} options={weightOptions} className="w-9 shrink-0" />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "8px",
      }}>
        <PixelField value={size.replace(`spx-`, '')} label="Font Size" icon={<IconGap />} onChange={event => setSize(`spx-${event.target.value}`)} className="" />
        <PixelField value={leading.replace(`lpx-`, '')} label="Line Height" icon={<IconGap />} onChange={event => setLeading(`lpx-${event.target.value}`)} className="" />
        <PixelField value={tracking.replace(`tpx-`, '')} label="Tracking" icon={<IconGap />} onChange={event => setTracking(`tpx-${event.target.value}`)} className="" />
        <PixelField value={margin.replace(`mpx-`, '')} label="Margin" icon={<IconGap />} onChange={event => setMargin(`mpx-${event.target.value}`)} className="" />
      </div>
      <input type="text" value={`${font} ${size} ${tracking} ${leading} ${margin} ${weight}`} className="mt-4" />
    </div>
  )
}

export default function TypographyControl({ field, input }) {
  return <Control field={field} input={input} fieldRow={<FieldRow />} isResponsive={false} />
}