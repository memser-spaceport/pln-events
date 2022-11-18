
import React, { useState, useRef, useEffect } from 'react';

interface PixelFieldProps {
  onChange;
  label: string;
  value: string;
  className?: string;
}

export default function PixelField(props:PixelFieldProps) {
  return (
    <div className={`relative pl-6 ${props.className}`}>
      <span className="absolute text-xs text-gray-300 font-bold" style={{top: "12px", left: "2px"}}>{props.label}</span>
      <input value={props.value} onChange={props.onChange} type="number" step="1" placeholder="auto" className="border border-gray-100 shadow text-gray-500 text-sm p-1 pl-2 h-10 w-full rounded-md hover:border-gray-200 focus:border-blue-500" />
    </div>
  );
};