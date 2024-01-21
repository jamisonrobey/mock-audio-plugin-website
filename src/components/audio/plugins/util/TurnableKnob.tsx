'use client';
import { roboto_bold } from '@/helpers/fonts';
import React, { useRef, useState } from 'react';
interface TurnableKnobProps {
  title: string;
  angle: number;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
}

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
      <div className='text-lg sm:text-4xl text-acccent'>
        <p className={roboto_bold.className}>{title}</p>
      </div>
      <div
        id='knob'
        ref={knobRef}
        className='border-accent relative m-2 h-10 w-10 origin-center transform cursor-pointer overflow-hidden rounded-full border-2 bg-background'
        onWheel={handleWheel}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className='absolute left-1/2 top-0 h-6 w-1 -translate-x-1/2 bg-acccent'></div>
      </div>
      <div className='my-2 flex h-8 w-12 items-center justify-center rounded-xl bg-background p-6 text-lg text-acccent'>
        <p className={roboto_bold.className}>{calculatePercentage(angle)}%</p>
      </div>
    </div>
  );
};

export default TurnableKnob;
