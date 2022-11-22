import React, { useState, useEffect, useRef } from 'react';
import SelectMenu from './widgets/SelectMenu';
import ColorPicker from './widgets/ColorPicker';
import IconMobile from './icons/IconMobile';
import IconMargin from './icons/IconMargin';
import FieldLabel from './widgets/FieldLabel';
import { getStyleMatch } from './widgets/helpers'

function buildColorOptions(prefix?) {
  const options = [
    { label: "Primary", value: "text-primary"},
    { label: "Accent 1", value: "text-accent1"},
    { label: "Accent 2", value: "text-accent2"},
    { label: "Accent 3", value: "text-accent3"},
    { label: "Accent 4", value: "text-accent4"},
    { label: "White", value: "text-white"},
    { label: "Gray Light", value: "text-gray-light"},
    { label: "Gray", value: "text-gray"},
    { label: "Gray Dark", value: "text-gray-dark"},
    { label: "Black", value: "text-black"},
  ]
  const formattedOptions = options.map(option => {
    return {
      label: option.label,
      value: `${prefix || ""}${option.value}`
    }
  });
  return formattedOptions;
}

function buildFontOptions(prefix?) {
  const options = [
    { label: "Headline Xs", value: "mg-headline-xs" },
    { label: "Headline Sm", value: "mg-headline-sm" },
    { label: "Headline Md", value: "mg-headline-md" },
    { label: "Headline Lg", value: "mg-headline-lg" },
    { label: "Headline Xl", value: "mg-headline-xl" },
    { label: "Body Xs", value: "mg-body-xs" },
    { label: "Body Sm", value: "mg-body-sm" },
    { label: "Body Md", value: "mg-body-md" },
    { label: "Body Lg", value: "mg-body-lg" },
    { label: "Body Xl", value: "mg-body-xl" },
  ]
  const formattedOptions = options.map(option => {
    return {
      label: option.label,
      value: `${prefix || ""}${option.value}`
    }
  });
  return formattedOptions;
}

function buildMarginOptions(prefix?) {
  const options = [
    { label: "0", value: "mb-0" },
    { label: "1", value: "mb-px" },
    { label: "2", value: "mb-0.5" },
    { label: "4", value: "mb-1" },
    { label: "6", value: "mb-1.5" },
    { label: "8", value: "mb-2" },
    { label: "10", value: "mb-2.5" },
    { label: "12", value: "mb-3" },
    { label: "14", value: "mb-3.5" },
    { label: "16", value: "mb-4" },
    { label: "20", value: "mb-5" },
    { label: "24", value: "mb-6" },
    { label: "28", value: "mb-7" },
    { label: "32", value: "mb-8" },
    { label: "36", value: "mb-9" },
    { label: "40", value: "mb-10" },
    { label: "44", value: "mb-11" },
    { label: "48", value: "mb-12" },
    { label: "56", value: "mb-14" },
    { label: "64", value: "mb-16" },
    { label: "80", value: "mb-20" },
    { label: "96", value: "mb-24" },
  ]
  const formattedOptions = options.map(option => {
    return {
      label: option.label,
      value: `${prefix || ""}${option.value}`
    }
  });
  return formattedOptions;
}

export default function TypeControl({ field, input, meta }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasMobileStyles, setHasMobileStyles] = useState(input.value.includes("sm:"));

  const colorOptions = buildColorOptions();
  const colorOptionsMobile = buildColorOptions('sm:');
  const fontOptions = buildFontOptions();
  const fontOptionsMobile = buildFontOptions('sm:');
  const marginOptions = buildMarginOptions();
  const marginOptionsMobile = buildMarginOptions('sm:');

  const [color, setColor] = useState(getStyleMatch(colorOptions, input.value));
  const [colorMobile, setColorMobile] = useState(getStyleMatch(colorOptionsMobile, input.value));
  const [font, setFont] = useState(getStyleMatch(fontOptions, input.value));
  const [fontMobile, setFontMobile] = useState(getStyleMatch(fontOptionsMobile, input.value));
  const [margin, setMargin] = useState(getStyleMatch(marginOptions, input.value));
  const [marginMobile, setMarginMobile] = useState(getStyleMatch(marginOptionsMobile, input.value));

  function toggleMobile() {
    setHasMobileStyles(!hasMobileStyles)
  }

  function updateHiddenField() {
    const input = inputRef.current;
    const lastValue = input.value;
    const defaultClasses = `${color} ${font} ${margin}`;
    const mobileClasses = `${colorMobile} ${fontMobile} ${marginMobile}`;
    if (mobileClasses.includes("undefined")) {
      setColorMobile(`sm:${color || 'text-white'}`)
      setFontMobile(`sm:${font || 'mg-headline-md'}`)
      setMarginMobile(`sm:${margin || 'mb-0'}`)
    }
    const newValue = hasMobileStyles ? `${defaultClasses} ${mobileClasses}` : defaultClasses;
    input.value = newValue;
    (input as any)._valueTracker?.setValue(lastValue);
    input.dispatchEvent(new Event("input", {bubbles: true}));
  }
  
  useEffect(() => {
    updateHiddenField()
  }, [color, font, margin, colorMobile, fontMobile, marginMobile, hasMobileStyles, inputRef.current]);

  function handleSetColor(value: string) {
    setColor(`text-${value}`)
  }
  function handleSetColorMobile(value: string) {
    setColorMobile(`sm:text-${value}`)
  }

  return (
    <>
      <FieldLabel label={field.label} hasMobileStyles={hasMobileStyles} onMobileToggle={toggleMobile} mobileMode={true} />
      <div className="mb-4">
        <div className="flex mb-2 items-center gap-2">
          <ColorPicker value={color?.replace('text-','')} onClick={handleSetColor} className="w-9" />
          <SelectMenu value={font} onChange={setFont} options={fontOptions} className="w-12 flex-1" />
          <div className="w-3.5 pr-.5">
            <IconMargin className="float-right" />
          </div>
          <SelectMenu value={margin} onChange={setMargin} options={marginOptions} className="w-12 " />
        </div>
        {hasMobileStyles &&
          <div className="flex mb-2 relative">
            <div className="absolute -left-4 top-2.5 pl-px">
              <IconMobile />
            </div>
            <div className="flex items-center w-full">
              <ColorPicker value={colorMobile?.replace('sm:text-','')} onClick={handleSetColorMobile} className="mr-2" />
              <SelectMenu value={fontMobile} onChange={setFontMobile} options={fontOptionsMobile} className="flex-grow mr-2" />
              <div className="w-6 pr-1">
                <IconMargin className="float-right" />
              </div>
              <SelectMenu value={marginMobile} onChange={setMarginMobile} options={marginOptionsMobile} className="w-12 mr-2" />
            </div>
          </div>
        }
      </div>
      <input ref={inputRef} type="text" {...input}  className="hidden" />
    </>
  )
}
