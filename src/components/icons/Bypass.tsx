'use client';
import { useState } from 'react';
interface BypassIconProps {
  onToggle: (toggled: boolean) => void;
}
export const BypassIcon = ({ onToggle }) => {
  const [toggle, setToggled] = useState(true);
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setToggled(!toggle);
    onToggle(!toggle); // callback for parent
  };
  return (
    <svg
      className='h-32 w-32 fill-none stroke-acccent'
      version='1.1'
      id='Layer_1'
      onClick={handleClick}
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 960 560'
      xmlSpace='preserv'
    >
      <polygon
        strokeWidth={15}
        points='398.4,423.5 316.8,282 398.4,140.5 561.6,140.5 643.2,282 561.6,423.5 '
      />
      <circle
        strokeWidth={10}
        fill={toggle ? 'none' : '#c9c9c9'}
        cx='479.5'
        cy='281.5'
        r='100'
      />
    </svg>
  );
};
