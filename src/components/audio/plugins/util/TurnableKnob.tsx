'use client';
import { roboto_bold } from '@/helpers/fonts';
import React, { useRef, useState } from 'react';
import scale from './scale';
interface TurnableKnobProps {
  title: string;
  angle: number;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
}

const TurnableKnob: React.FC<TurnableKnobProps> = ({ title, angle, setAngle }) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = parseInt(e.target.value, 10) || 0;
    const clampedValue = Math.max(0, Math.min(inputValue, 100));
    const calculatedAngle = scale(clampedValue, 0, 100, -135, 135);

    setAngle(calculatedAngle);
    inputRef.current!.value = calculatedAngle !== 0 ? String(clampedValue) : '';
  };

  const calculatePercentage = (angle: number): number => {
    return Math.round(((angle + 135) / 270) * 100);
  };

  return (
    <div className=' m-4 flex flex-col items-center text-center'>
      <div className='text-md sm:text-lg 2xl:text-3xl text-acccent'>
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
        <input
          ref={inputRef}
          type='number'
          value={calculatePercentage(angle)}
          onChange={handleInputChange}
          className='w-10 text-xs lg:w-14 lg:text-xl text-center appearance-none bg-background text-acccent'
        />
        <span className={roboto_bold.className}>%</span>
      </div>
    </div>
  );
};

export default TurnableKnob;