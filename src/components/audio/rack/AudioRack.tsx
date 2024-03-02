'use client';
import { roboto_bold } from '@/helpers/fonts';
import { ReverbRack } from './ReverbRack';
import PlayIcon from '@/components/icons/PlayIcon';
import { useState, useEffect, useRef } from 'react';
import useAudioFFT from '../useAudioFFT';
import AudioVisualizer from '../visualizer/AudioVisualizer';
import { CompressorRack } from './CompressorRack';
import { DistortionRack } from './DistortionRack';
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
  }, [ac, source]);

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
    <div className='grid grid-cols-2 sm:grid-cols-3'>
      <div
        className={`${roboto_bold.className} col-span-2 flex items-center justify-center border-b-2 border-acccent p-4 sm:col-span-1 sm:h-96 sm:w-96 sm:border-r-2`}
      >
        {<AudioVisualizer fftData={fftData} />}
      </div>
      <div className='m-4 my-8 flex-col items-center sm:m-16'>
        <h1 className={`${roboto_bold.className} text-sm sm:text-3xl`}>GUIDE:</h1>
        <p className='mt-3 text-xs sm:text-base'>1) Click the play button to the right to start playing the sample.</p>
        <p className='mt-3 text-xs sm:text-base'>
          2) Initially, all audio effects are disabled, you can toggle each individually by clicking the bypass icon
          (rightmost icon for each plugin).
        </p>
        <p className='mt-3 text-xs sm:text-base'>
          3) Scroll on the knobs, or input the value manually, to adjust the parameters for the audio effects in real
          time.
        </p>
      </div>
      <div onClick={togglePlay} className='flex cursor-pointer items-center justify-center'>
        <PlayIcon color={'acccent'} />
      </div>
      <br></br>
      <br></br>
      <div className='col-span-2 flex items-center justify-center sm:col-span-3'>
        <ReverbRack convolver={convolver} source={source} ac={ac} />
      </div>
      <div className='col-span-2 flex items-center justify-center sm:col-span-3'>
        <CompressorRack ac={ac} source={source} />
      </div>
      <div className='col-span-2 flex items-center justify-center sm:col-span-3'>
        <DistortionRack ac={ac} source={source} />
      </div>
      <div className='col-span-2 flex items-center justify-center sm:col-span-3'></div>
      <audio ref={audioRef} loop hidden>
        <source src='/audio/909.wav' type='audio/wav' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
