import React from 'react';
import { roboto_bold } from '@/helpers/fonts';
const Logo: React.FC = () => {
  return (
    <svg
      viewBox='0 0 523 160'
      className='h-auto w-96'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
        <g id='Extra-Large' transform='translate(-41, -67)' fill='#C9C9C9' fill-rule='nonzero'>
          <g id='Untitled-3' transform='translate(41, 67)'>
            <g id='Group' transform='translate(290, 18)'>
              <rect id='XMLID_5_' x='0' y='13.8085106' width='16' height='31.3829787'></rect>
              <rect id='XMLID_6_' x='23' y='5.64893617' width='16' height='45.8191489'></rect>
              <rect id='XMLID_8_' x='47' y='0' width='16' height='59'></rect>
              <rect id='XMLID_9_' x='72' y='8.78723404' width='16' height='41.4255319'></rect>
              <rect id='XMLID_10_' x='95' y='10.6702128' width='16' height='36.4042553'></rect>
              <rect id='XMLID_11_' x='118' y='15.0638298' width='16' height='28.2446809'></rect>
              <rect id='XMLID_12_' x='142' y='5.0212766' width='16' height='50.212766'></rect>
              <rect id='XMLID_13_' x='165' y='11.2978723' width='16' height='35.7765957'></rect>
            </g>
            <text id='REFLECTIONS' className={`${roboto_bold.className} text-7xl`}>
              <tspan x='0' y='141'>
                REFLECTIONS
              </tspan>
            </text>
            <text id='EARLY' className={`${roboto_bold.className} text-7xl`}>
              <tspan x='0' y='75'>
                EARLY
              </tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Logo;
