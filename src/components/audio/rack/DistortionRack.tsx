import React, { useEffect, useState, useRef } from 'react';
import TurnableKnob from '../util/TurnableKnob';
import { BypassIcon } from '@/components/icons/BypassIcon';
import { distortion_font } from '@/helpers/fonts';

interface DistortionRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

const makeDistortionCurve = (amount = 20) => {
  const k = typeof amount === 'number' ? Math.min(amount, 20) : 20; // limit amount otherwise bad things happen
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

export const DistortionRack: React.FC<DistortionRackProps> = ({ ac, source }) => {
  const [distortion, setDistortion] = useState(0);
  const [gain, setGain] = useState(0);
  const [toggle, setToggle] = useState(false);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const angleToDistortionAmount = (angle: number) => Math.round(((angle + 135) / 270) * 50); // Max 50 for subtlety

  const angleToGainAmount = (angle: number) => 0.5 + ((angle + 135) / 270) * 1; // Max gain of 1.5 for subtlety

  useEffect(() => {
    if (!ac || !source) return;

    const dist_waveShaper = ac.createWaveShaper();
    const gainNode = ac.createGain();
    dist_waveShaper.curve = makeDistortionCurve(angleToDistortionAmount(distortion));
    gainNode.gain.value = angleToGainAmount(gain);
    distortionRef.current = dist_waveShaper;
    gainRef.current = gainNode;

    if (toggle) {
      source.connect(dist_waveShaper).connect(gainNode).connect(ac.destination);
    } else {
      source.connect(gainNode).connect(ac.destination);
    }
  }, [ac, source]);

  useEffect(() => {
    if (distortionRef.current) {
      distortionRef.current.curve = makeDistortionCurve(angleToDistortionAmount(distortion));
    }
  }, [distortion]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = angleToGainAmount(gain);
    }
  }, [gain]);

  useEffect(() => {
    if (!ac || !source || !distortionRef.current || !gainRef.current) return;

    if (toggle) {
      source.connect(distortionRef.current).connect(gainRef.current).connect(ac.destination);
    } else {
      source.connect(ac.destination);
      distortionRef.current.disconnect();
      gainRef.current.disconnect();
    }
  }, [toggle]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className='m-4 flex h-40 w-11/12 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-8 flex h-full w-2/6 items-center justify-center border-b-2 border-acccent text-acccent sm:mb-16 sm:h-auto sm:justify-start'>
        <p className={`${distortion_font.className} m-1 text-base sm:ml-5 sm:text-6xl`}>DISTORTION</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='flex w-11/12 items-center justify-evenly sm:ml-0 sm:mr-4  sm:w-1/5 sm:justify-between'>
          <div className='ml-1 mt-6 sm:ml-0 sm:mt-6'>
            <TurnableKnob title='DISTORTION' angle={distortion} setAngle={setDistortion} />
          </div>
          <div className='mt-6'>
            <TurnableKnob title='GAIN' angle={gain} setAngle={setGain} />
          </div>
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
