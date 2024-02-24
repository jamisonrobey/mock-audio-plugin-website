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
  const [toggle, setToggle] = useState(false);
  const [dryGain, setDryGain] = useState<GainNode>();
  const [wetGain, setWetGain] = useState<GainNode>();
  const [pdNode, setPdNode] = useState<DelayNode>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!ac || !source || !convolver) return;
    // Create nodes
    const dryGainNode = ac.createGain();
    const wetGainNode = ac.createGain();
    const pdNode = ac.createDelay();

    // Connect nodes
    source.connect(dryGainNode);
    dryGainNode.connect(ac.destination);

    source.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGainNode);
    wetGainNode.connect(ac.destination);

    // Set state
    setDryGain(dryGainNode);
    setWetGain(wetGainNode);
    setPdNode(pdNode);
    setInitialized(true);

    return () => {
      // Disconnect nodes on cleanup
      dryGainNode.disconnect();
      wetGainNode.disconnect();
      pdNode.disconnect();
      convolver.disconnect();
    };
  }, [ac, source, convolver]);

  useEffect(() => {
    if (initialized && toggle) {
      // Bypass the effect
      dryGain?.disconnect();
      source.connect(ac.destination);
    } else if (initialized && !toggle) {
      // Apply the effect
      source.disconnect();
      source.connect(dryGain as GainNode);
    }
  }, [ac, source, toggle, initialized, dryGain]);

  useEffect(() => {
    if (dryGain && wetGain) {
      const dryMix = 1 - mix;
      dryGain.gain.value = dryMix;
      const wetMix = mix;
      wetGain.gain.value = wetMix;
    }
  }, [mix, dryGain, wetGain]);

  useEffect(() => {
    if (pdNode) {
      const scaledPreDelay = scale(preDelay, -135, -135, 0, 0.08);
      pdNode.delayTime.value = scaledPreDelay;
    }
  }, [preDelay, pdNode]);

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
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
