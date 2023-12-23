'use client'
import { Bebas_Neue } from 'next/font/google'
import React, { useRef, useState } from 'react'
interface TurnableKnobProps {
  title: string
  angle: number
  setAngle: React.Dispatch<React.SetStateAction<number>>
  percentage: number
  setPercentage: React.Dispatch<React.SetStateAction<number>>
}

const bebas_Neue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

const TurnableKnob: React.FC<TurnableKnobProps> = ({ title, angle, setAngle, percentage, setPercentage }) => {
  const knobRef = useRef<HTMLDivElement>(null)

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { deltaY } = e
    const sensitivity = 0.35
    const newAngle = angle + -deltaY * sensitivity

    const clampedAngle = Math.max(-135, Math.min(newAngle, 135))

    setAngle(clampedAngle)

    const newPercentage = ((clampedAngle + 135) / 270) * 100
    setPercentage(Math.round(newPercentage))
    knobRef.current?.focus()
  }

  return (
    <div className=' flex flex-col text-center items-center m-4'>
      <div className='text-4xl text-slate-700'>
        <p className={bebas_Neue.className}>{title}</p>
      </div>
      <div
        id='knob'
        ref={knobRef}
        className='w-10 h-10 m-2 overflow-hidden bg-slate-300 rounded-full relative cursor-pointer transform origin-center'
        onWheel={handleWheel}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className='absolute w-1 h-6 bg-slate-700 top-0 left-1/2 -translate-x-1/2'></div>
      </div>
      <div className='my-4 w-12 h-8 bg-slate-300 text-2xl text-slate-700 p-6 rounded-xl flex items-center justify-center'>
        <p className={bebas_Neue.className}>{percentage}</p>
      </div>
    </div>
  )
}

export default TurnableKnob
