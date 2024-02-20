'use client';

import scale from '../plugins/util/scale';
import { roboto_bold } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/Bypass';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
interface ReverbRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode
  convolver: ConvolverNode;
}
export const ReverbRack: React.FC<ReverbRackProps> = ({ ac, source, convolver }) => {
  const [mix, setMix] = useState(0);
  const [preDelay, setPreDelay] = useState(0);
  const [toggle, setBypass] = useState(false);
  /* refs */
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const preDelayRef = useRef<DelayNode | null>(null);

  useEffect(() => {
    if (!ac || !source || !convolver || !toggle) return;
    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    const pdNode = ac.createDelay();

    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;
    preDelayRef.current = pdNode;

    // Connect nodes
    source.connect(dryGain);
    source.connect(convolver);
    source.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

  }, [ac, source, convolver, toggle]);

  /* BYPASS Logic */
  useEffect(() => {
    if (dryGainRef.current && wetGainRef.current && preDelayRef.current) {
      if (!toggle) {
        dryGainRef.current.disconnect();
        wetGainRef.current.disconnect();
        preDelayRef.current.disconnect();
      } else {
      }
    }
  }, [toggle])
  const handleToggle = (toggle: boolean) => {
    setBypass(toggle);
  };

  useEffect(() => {
    if (dryGainRef.current && wetGainRef.current) {
      const mixPercentage = mix / 100;
      if (toggle) {
        /* if the reverb is on we need to compenstate for volume as two signals playing at once */
        dryGainRef.current.gain.value = (1 - mixPercentage) * 0.5;
        wetGainRef.current.gain.value = mixPercentage * 0.5;
      } else {
        dryGainRef.current.gain.value = 1 - mixPercentage;
        wetGainRef.current.gain.value = mixPercentage;
      }
    }
  }, [mix, toggle]);
  useEffect(() => {
    if (preDelayRef.current) {
      const scaledPreDelay = scale(preDelay, -135, 135, 0, 0.08);
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
        <BypassIcon onToggle={handleToggle} />
      </div>
    </div>
  );
};
