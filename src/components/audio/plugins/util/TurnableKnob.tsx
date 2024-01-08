'use client';
import { Bebas_Neue } from 'next/font/google';
import React, { useRef, useState } from 'react';
interface TurnableKnobProps {
  title: string;
  angle: number;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
}

const bebas_Neue = Bebas_Neue({ weight: '400', subsets: ['latin'] });

const TurnableKnob: React.FC<TurnableKnobProps> = ({ title, angle, setAngle }) => {
  const knobRef = useRef<HTMLDivElement>(null);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { deltaY } = e;
    const sensitivity = 0.35;
    const newAngle = angle + -deltaY * sensitivity;
    const clampedAngle = Math.max(-135, Math.min(newAngle, 135));

    setAngle(clampedAngle);
    knobRef.current?.focus();
  };

  const calculatePercentage = (angle: number): number => {
    return Math.round(((angle + 135) / 270) * 100);
  };

  return (
    <div className=' m-4 flex flex-col items-center text-center'>
      <div className='text-4xl text-slate-700'>
        <p className={bebas_Neue.className}>{title}</p>
      </div>
      <div
        id='knob'
        ref={knobRef}
        className='relative m-2 h-10 w-10 origin-center transform cursor-pointer overflow-hidden rounded-full bg-slate-300'
        onWheel={handleWheel}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className='absolute left-1/2 top-0 h-6 w-1 -translate-x-1/2 bg-slate-700'></div>
      </div>
      <div className='my-4 flex h-8 w-12 items-center justify-center rounded-xl bg-slate-300 p-6 text-2xl text-slate-700'>
        <p className={bebas_Neue.className}>{calculatePercentage(angle)}%</p>
      </div>
    </div>
  );
};

export default TurnableKnob;
