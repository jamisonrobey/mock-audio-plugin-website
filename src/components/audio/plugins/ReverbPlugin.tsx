'use client';
import React, { useState, useRef, useEffect } from 'react';
import useAudioFFT from '../../../templates/hooks/useAudioFFT'; // Make sure the path is correct
import AudioVisualizer from '../visualizer/AudioVisualizer'; // Make sure the path is correct
import TurnableKnob from './util/TurnableKnob'; // Make sure the path is correct
import { roboto_bold, roboto_regular } from '@/helpers/fonts';
import PlayIcon from '@/components/icons/PlayIcon'; // Ensure this path is correct!

const scale = (number, inMin, inMax, outMin, outMax) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// todo: comment / refactor this mess of a component
const ReverbPlugin: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const [mixAngle, setMixAngle] = useState(0);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);

  const [preDelay, setPreDelay] = useState(0);
  const preDelayRef = useRef<DelayNode | null>(null);

  const [modAngle, setModAngle] = useState(-135);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const convolverRef = useRef<ConvolverNode | null>(null);

  useEffect(() => {
    if (!audioContext) {
      const ac = new AudioContext();
      setAudioContext(ac);
    } else {
      if (audioRef.current && audioContext && !sourceRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
      }

      /* Set up nodes */

      const dryGain = audioContext.createGain();
      const wetGain = audioContext.createGain();
      dryGainRef.current = dryGain;
      wetGainRef.current = wetGain;

      const pdNode = audioContext.createDelay();
      pdNode.delayTime.value = preDelay / 1000; // convert to seconds
      preDelayRef.current = pdNode;

      const convolver = audioContext.createConvolver();
      convolverRef.current = convolver;

      fetch('/audio/impulse_response.wav')
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          if (convolverRef.current) {
            convolverRef.current.buffer = audioBuffer;
          }
        })
        .catch((err) => console.error('Error with impulse response:', err));

      sourceRef.current?.connect(dryGain);
      sourceRef.current?.connect(convolver);
      sourceRef.current?.connect(pdNode);
      pdNode.connect(convolver);
      convolver.connect(wetGain);

      dryGain.connect(audioContext.destination);
      wetGain.connect(audioContext.destination);

      dryGain.gain.value = 0.5; // initial values to be 50/50
      wetGain.gain.value = 0.5;

      // clean up on unmount
      return () => {
        audioContext.close();
      };
    }
  }, [audioContext]);

  useEffect(() => {
    if (dryGainRef.current && wetGainRef.current) {
      const mixPercentage = Math.round(((mixAngle + 135) / 270) * 100);
      dryGainRef.current.gain.value = 1 - mixPercentage / 100;
      wetGainRef.current.gain.value = mixPercentage / 100;
    }
  }, [mixAngle]);

  useEffect(() => {
    if (preDelayRef.current) {
      preDelayRef.current.delayTime.value = preDelay / 1000;
    }
  }, [preDelay]);

  useEffect(() => {
    if (lfoGainRef.current && lfoGainRef.current) {
      const depth = scale(modAngle, -135, 135, 0, 1);
      lfoGainRef.current.gain.value = depth;
    }
  }, [modAngle]);

  const togglePlay = () => {
    if (!audioContext) return; // stops crashing if playButton clicked while page is building

    if (!isInitialized) {
      setIsInitialized(true);
    }

    if (audioContext && audioRef.current) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const fftData = useAudioFFT(audioRef, sourceRef.current, isInitialized);

  return (
    <div
      className={`${roboto_bold.className} text-accent flex sm:w-3/6 w-5/6 items-center justify-center rounded-lg border-2 border-acccent`}
    >
      <div className='grid select-none grid-cols-5 rounded-md bg-background shadow-xl'>
        <div className='border-accent col-span-5  flex items-center justify-between border-b-2  text-acccent'>
          <div className='flex h-full items-center border-r-2 border-acccent'>
            <p className='m-4 sm:text-4xl text-2xl'>REVERB</p>
          </div>
          <div onClick={togglePlay} className='m-4 cursor-pointer'>
            <PlayIcon color={'acccent'} />
          </div>
        </div>
        <div className='col-span-4 row-span-2 flex items-center justify-center'>
          {isInitialized && <AudioVisualizer fftData={fftData} />}
        </div>
        <div className='col-span-1 row-span-2 flex flex-col items-center justify-evenly border-l-2 border-acccent'>
          <TurnableKnob title='MIX' angle={mixAngle} setAngle={setMixAngle} />
          <TurnableKnob title='PRE-DELAY' angle={preDelay} setAngle={setPreDelay} />
        </div>
        <audio ref={audioRef} loop hidden>
          <source src='/audio/909.wav' type='audio/wav' />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default ReverbPlugin;
