'use client';

import scale from '../plugins/util/scale';
import { roboto_bold } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/Bypass';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
interface ReverbRackProps {
  ac: AudioContext;
  sourceRef: MutableRefObject<MediaElementAudioSourceNode>;
  audioRef: MutableRefObject<HTMLAudioElement>;
}
export const ReverbRack: React.FC<ReverbRackProps> = ({ ac, sourceRef, audioRef }) => {
  const [mix, setMix] = useState(0);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);

  const [preDelay, setPreDelay] = useState(0);
  const preDelayRef = useRef<DelayNode | null>(null);

  const convolverRef = useRef<ConvolverNode | null>(null);

  useEffect(() => {
    if (!ac) return;
    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;

    const pdNode = ac.createDelay();
    pdNode.delayTime.value = preDelay / 1000; // convert to seconds
    preDelayRef.current = pdNode;

    const convolver = ac.createConvolver();
    convolverRef.current = convolver;

    /* fetch impulse response and decode for reverb */
    fetch('/audio/impulse_response.wav')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        if (convolverRef.current) {
          convolverRef.current.buffer = audioBuffer;
        }
      })
      .catch((err) => console.error('Error with impulse response:', err));

    /* refs and connect nodes */
    sourceRef.current?.connect(dryGain);
    sourceRef.current?.connect(convolver);
    sourceRef.current?.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

    dryGain.gain.value = 0.5; // initial values to be 50/50
    wetGain.gain.value = 0.5;

    // clean up on unmount
    return () => {
      ac.close();
    };
  }, [ac]);

  // Function to set up audio nodes
  const setupAudioNodes = () => {
    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;

    const mediaSource = ac.createMediaElementSource(audioRef.current!);

    const pdNode = ac.createDelay();
    pdNode.delayTime.value = preDelay / 1000; // convert to seconds
    preDelayRef.current = pdNode;

    const convolver = ac.createConvolver();
    convolverRef.current = convolver;

    /* fetch impulse response and decode for reverb */
    fetch('/audio/impulse_response.wav')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        if (convolverRef.current) {
          convolverRef.current.buffer = audioBuffer;
        }
      })
      .catch((err) => console.error('Error with impulse response:', err));

    mediaSource.connect(dryGain);
    mediaSource.connect(convolver);
    mediaSource.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

    dryGain.gain.value = 0.5; // initial values to be 50/50
    wetGain.gain.value = 0.5;
  };

  useEffect(() => {
    if (ac) {
      setupAudioNodes();
    }
  }, [ac]);

  /* Update effects with knobs values */

  useEffect(() => {
    if (dryGainRef.current && wetGainRef.current) {
      const mixPercentage = Math.round(((mix + 135) / 270) * 100);
      dryGainRef.current.gain.value = 1 - mixPercentage / 100;
      wetGainRef.current.gain.value = mixPercentage / 100;
    }
  }, [mix]);

  useEffect(() => {
    if (preDelayRef.current) {
      const scaledPreDelay = scale(preDelay, -135, 135, 0, 0.05);
      preDelayRef.current.delayTime.value = scaledPreDelay;
    }
  }, [preDelay]);
  return (
    <div className='m-4 flex h-40 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${roboto_bold.className} ml-4 text-2xl sm:text-4xl`}>REVERB</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-16 border-l-2 border-acccent'>
        <div className='mt-6'>
          <TurnableKnob title='MIX' angle={mix} setAngle={setMix} />
        </div>
        <div className='mt-6'>
          <TurnableKnob title='PRE-DELAY' angle={preDelay} setAngle={setPreDelay} />
        </div>
        <BypassIcon />
      </div>
    </div>
  );
};
