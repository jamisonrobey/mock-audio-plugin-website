'use client';
import React, { useState, useRef, useEffect } from 'react';
import useAudioFFT from '../../../templates/hooks/useAudioFFT'; // Make sure the path is correct
import AudioVisualizer from '../visualizer/AudioVisualizer'; // Make sure the path is correct
import TurnableKnob from './util/TurnableKnob'; // Make sure the path is correct
import { Bebas_Neue } from 'next/font/google'; // Assuming this is a correct import
import PlayIcon from '@/components/icons/PlayIcon'; // Ensure this path is correct!

// Initialize your desired font style
const bebas_Neue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const ReverbPlugin: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [dryAngle, setDryAngle] = useState(-135);
  const [dryPercentage, setDryPercentage] = useState(0);
  const [eLevelAngle, setELevelAngle] = useState(-135);
  const [eLevelPercentage, setELevelPercentage] = useState(0);
  const [wetAngle, setWetAngle] = useState(-135);
  const [wetPercentage, setWetPercentage] = useState(0);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // initalize audio context on mount and clean up on unmount
  useEffect(() => {
    setAudioContext(new AudioContext());
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!isInitialized) {
      setIsInitialized(true);
    }

    // needed for play/pause to work after page is reloaded
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const fftData = useAudioFFT(audioRef, audioContext, isInitialized);

  return (
    <div className={`${bebas_Neue.className} flex h-5/6  w-4/6 items-center justify-center`}>
      <div className='grid select-none grid-cols-5 rounded-md bg-slate-400 shadow-xl'>
        <div className='col-span-5 mt-4 flex items-center justify-between border-b-2 border-slate-600 text-8xl text-slate-700'>
          <div className='ml-4'>
            <p>Reverb</p>
          </div>
          <div onClick={togglePlay} className='mr-4 cursor-pointer'>
            <PlayIcon />
          </div>
        </div>
        <div className='col-span-4  row-span-4 flex items-center justify-center'>
          {isInitialized && <AudioVisualizer fftData={fftData} />}
        </div>
        <div className='col-span-1 row-span-4 flex flex-col items-center justify-evenly border-l-2 border-slate-600'>
          <TurnableKnob
            title='Dry'
            angle={dryAngle}
            setAngle={setDryAngle}
            percentage={dryPercentage}
            setPercentage={setDryPercentage}
          />
          <TurnableKnob
            title='E. Level'
            angle={eLevelAngle}
            setAngle={setELevelAngle}
            percentage={eLevelPercentage}
            setPercentage={setELevelPercentage}
          />
          <TurnableKnob
            title='Wet'
            angle={wetAngle}
            setAngle={setWetAngle}
            percentage={wetPercentage}
            setPercentage={setWetPercentage}
          />
        </div>
        <audio ref={audioRef} loop hidden>
          <source src='/audio/rakim.wav' type='audio/wav' />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default ReverbPlugin;
