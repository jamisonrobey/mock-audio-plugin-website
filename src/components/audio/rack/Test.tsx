'use client';
import { AudioRack } from './Rack';
import PlayIcon from '@/components/icons/PlayIcon';
import { useState, useEffect, useRef } from 'react';
export const Test = () => {
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ac, setAC] = useState<AudioContext | null>(null);
  useEffect(() => {
    if (!ac && typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext();
      setAC(audioContext);
    }
  }, [ac]);

  const togglePlay = () => {
    if (!ac) return; // stops crashing if playButton clicked while page is building

    if (ac && audioRef.current) {
      if (ac.state === 'suspended') {
        ac.resume();
      }

      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      <AudioRack ac={ac} sourceRef={sourceRef} audioRef={audioRef} />
      <div onClick={togglePlay} className='m-4 cursor-pointer'>
        <PlayIcon color={'acccent'} />
      </div>
      <audio ref={audioRef} loop hidden>
        <source src='/audio/909.wav' type='audio/wav' />
        Your browser does not support the audio element.
      </audio>
    </>
  );
};
