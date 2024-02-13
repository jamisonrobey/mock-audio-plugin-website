'use client';
import { useState } from 'react';
interface BypassIconProps {
  onToggle: (toggled: boolean) => void;
}
export const BypassIcon = ({ onToggle }) => {
  const [toggle, setToggled] = useState(false);
  const handleClick = (e: React.MouseEvent<SVGCircleElement>) => {
    e.preventDefault();
    console.log("clicked")
    setToggled(!toggle);
    onToggle(!toggle); // callback for parent
  };
  return (
    <svg
      className='h-32 w-32 fill-none stroke-acccent'
      strokeWidth={10}
      strokeMiterlimit={10}
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 960 560'
      xmlSpace='preserv'
    >
      <polygon
        id='XMLID_1_'
        strokeWidth={15}
        points='398.4,423.5 316.8,282 398.4,140.5 561.6,140.5 643.2,282 561.6,423.5 '
      />
      <circle
        id='XMLID_2_'
        onClick={handleClick}

        fill={toggle ? '#c9c9c9' : 'none'}
        cx='479.5'
        cy='281.5'
        r='100'
      />
    </svg>
  );
};
