'use client';
import scale from '../plugins/util/scale';
import { reverb_font, roboto_bold } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/BypassIcon';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { useEffect, useState, useRef } from 'react';

interface ReverbRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
  convolver: ConvolverNode;
}

export const ReverbRack: React.FC<ReverbRackProps> = ({ ac, source, convolver }) => {
  const [mix, setMix] = useState(0); // Mix knob angle
  const [preDelay, setPreDelay] = useState<number>(0); // Pre-Delay knob angle
  const [toggle, setToggle] = useState(false); // Bypass toggle state
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const preDelayRef = useRef<DelayNode | null>(null);

  useEffect(() => {
    if (!ac || !source || !convolver) return;

    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    const preDelayNode = ac.createDelay();
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;
    preDelayRef.current = preDelayNode;

    source.connect(dryGain);
    dryGain.connect(ac.destination);

    source.connect(preDelayNode);
    preDelayNode.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(ac.destination);

    // Initial gain values
    dryGain.gain.value = 0.5;
    wetGain.gain.value = 0.5;
  }, [ac, source, convolver]);

  useEffect(() => {
    if (!dryGainRef.current && !wetGainRef.current) return;
    const mixPercentage = Math.round(((mix + 135) / 270) * 100);
    if (toggle) {
      dryGainRef.current.gain.value = 1 - mixPercentage / 100;
      wetGainRef.current.gain.value = mixPercentage / 100;
    } else {
      wetGainRef.current.gain.value = mixPercentage / 100;
    }
  }, [mix, toggle]);

  useEffect(() => {
    if (preDelayRef.current) {
      preDelayRef.current.delayTime.value = scale(preDelay, -135, 135, 0, 0.1);
    }
  }, [preDelay]);

  useEffect(() => {
    if (convolver) {
      if (toggle) {
        source.connect(preDelayRef.current!);
        preDelayRef.current!.connect(convolver);
        convolver.connect(wetGainRef.current!);
      } else {
        source.disconnect(preDelayRef.current!);
        preDelayRef.current!.disconnect(convolver);
        convolver.disconnect(wetGainRef.current!);
      }
    }
  }, [toggle, convolver, source]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className='m-4 flex h-40 w-11/12 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-8 flex h-full w-2/6 items-center justify-center border-b-2 border-acccent text-acccent sm:mb-16 sm:h-auto sm:justify-start'>
        <p className={`${reverb_font.className} m-1 text-xl sm:ml-5 sm:text-6xl`}>REVERB</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='ml-1 mt-11 sm:ml-0 sm:mt-6'>
          <TurnableKnob title='MIX' angle={mix} setAngle={setMix} />
        </div>
        <div className='mt-6'>
          <TurnableKnob title='PRE-DELAY' angle={preDelay} setAngle={setPreDelay} />
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
