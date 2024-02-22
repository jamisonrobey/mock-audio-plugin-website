'use client';

import { useEffect, useState } from 'react';
import { roboto_bold } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/Bypass';
import TurnableKnob from '../plugins/util/TurnableKnob';
import scale from '../plugins/util/scale';

interface ReverbRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
  convolver: ConvolverNode;
}

export const ReverbRack: React.FC<ReverbRackProps> = ({ ac, source, convolver }) => {
  const [mix, setMix] = useState(0);
  const [preDelay, setPreDelay] = useState(0);
  const [toggle, setBypass] = useState(false);

  useEffect(() => {
    if (!ac || !source || !convolver || !toggle) return;

    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    const pdNode = ac.createDelay();

    // Connect nodes
    source.connect(dryGain);
    source.connect(convolver);
    source.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

    // Disconnect nodes if bypassed
    if (!toggle) {
      dryGain.disconnect();
      wetGain.disconnect();
      pdNode.disconnect();
    }

    // Set gains based on mix and toggle
    const mixPercentage = mix / 100;
    if (toggle) {
      dryGain.gain.value = (1 - mixPercentage) * 0.5;
      wetGain.gain.value = mixPercentage * 0.5;
    } else {
      dryGain.gain.value = 1 - mixPercentage;
      wetGain.gain.value = mixPercentage;
    }

    // Set pre-delay
    const scaledPreDelay = scale(preDelay, -135, 135, 0, 0.08);
    pdNode.delayTime.value = scaledPreDelay;
  }, [ac, source, convolver, toggle, mix, preDelay]);

  const handleToggle = (toggle: boolean) => {
    setBypass(toggle);
  };

  return (
    <div className='m-4 flex h-40 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${roboto_bold.className} ml-1 text-2xl sm:ml-4 sm:text-4xl`}>REVERB</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='ml-1 mt-11 sm:ml-0 sm:mt-6'>
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
