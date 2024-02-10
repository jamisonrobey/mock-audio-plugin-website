'use client';
import { roboto_bold } from '@/helpers/fonts';
import { ReverbRack } from './ReverbRack';
import PlayIcon from '@/components/icons/PlayIcon';
import { useState, useEffect, useRef } from 'react';
import useAudioFFT from '@/templates/hooks/useAudioFFT';
import AudioVisualizer from '../visualizer/AudioVisualizer';
export const AudioRack = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ac, setAC] = useState<AudioContext | null>(null);
  useEffect(() => {
    if (!ac) {
      const ac = new AudioContext();
      setAC(ac);
    } else {
      if (audioRef.current && ac && !sourceRef.current) {
        const source = ac.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
      }
    }
  }, [ac]);

  const togglePlay = () => {
    if (!ac) return; // stops crashing if playButton clicked while page is building

    if (!isInitialized) {
      setIsInitialized(true);
    }
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

  const fftData = useAudioFFT(audioRef, sourceRef, isInitialized);
  return (
    <>
      <div className={`${roboto_bold.className} `}>{isInitialized && <AudioVisualizer fftData={fftData} />}</div>
      <ReverbRack ac={ac} sourceRef={sourceRef} audioRef={audioRef} />
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
