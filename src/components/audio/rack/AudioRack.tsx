'use client';
import { roboto_bold } from '@/helpers/fonts';
import { ReverbRack } from './ReverbRack';
import PlayIcon from '@/components/icons/PlayIcon';
import { useState, useEffect, useRef } from 'react';
import useAudioFFT from '@/templates/hooks/useAudioFFT';
import AudioVisualizer from '../visualizer/AudioVisualizer';
export const AudioRack = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(null);
  const [convolver, setConvolver] = useState<ConvolverNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ac, setAC] = useState<AudioContext | null>(null);
  useEffect(() => {
    const fetchImpulseResponse = async () => {
      try {
        const response = await fetch('/audio/impulse_response.wav');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ac!.decodeAudioData(arrayBuffer);
        const convolverNode = ac!.createConvolver();
        convolverNode.buffer = audioBuffer;
        setConvolver(convolverNode);
      } catch (error) {
        console.error('Error fetching or decoding impulse response:', error);
      }
    };

    if (ac && !convolver) {
      fetchImpulseResponse();
    }
  }, [ac, convolver]);

  useEffect(() => {
    if (!ac) {
      const audioContext = new AudioContext();
      setAC(audioContext);
    } else {
      if (audioRef.current && ac && !source) {
        const audioSource = ac.createMediaElementSource(audioRef.current);
        setSource(audioSource);
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

  const fftData = useAudioFFT(audioRef, source, isInitialized);
  return (
    <>
      <div className={`${roboto_bold.className} `}>{isInitialized && <AudioVisualizer fftData={fftData} />}</div>
      <ReverbRack ac={ac} source={source} convolver={convolver} />
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
