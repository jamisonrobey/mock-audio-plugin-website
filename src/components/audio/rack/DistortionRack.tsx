import React, { useEffect, useState, useRef } from 'react';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { BypassIcon } from '@/components/icons/BypassIcon';
import { distortion_font } from '@/helpers/fonts';

interface DistortionRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

const makeDistortionCurve = (amount = 20) => {
  // Reduced maximum amount for subtlety
  const k = typeof amount === 'number' ? Math.min(amount, 20) : 20; // Limiting the amount for subtlety
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
  const [distortionAngle, setDistortionAngle] = useState(0); // Initial knob angle for distortion
  const [gainAngle, setGainAngle] = useState(0); // Initial knob angle for gain
  const [toggle, setToggle] = useState(false);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Convert knob angle to distortion amount
  const angleToDistortionAmount = (angle: number) => Math.round(((angle + 135) / 270) * 50); // Max 50 for subtlety

  // Convert knob angle to gain amount, with a more controlled range
  const angleToGainAmount = (angle: number) => 0.5 + ((angle + 135) / 270) * 1; // Max gain of 1.5 for subtlety

  useEffect(() => {
    if (!ac || !source) return;

    const distortion = ac.createWaveShaper();
    const gain = ac.createGain();
    distortion.curve = makeDistortionCurve(angleToDistortionAmount(distortionAngle));
    gain.gain.value = angleToGainAmount(gainAngle);
    distortionRef.current = distortion;
    gainRef.current = gain;

    // Initial connection setup
    if (toggle) {
      source.connect(distortion).connect(gain).connect(ac.destination);
    } else {
      source.connect(gain).connect(ac.destination);
    }
  }, [ac, source]); // Removed toggle from dependency array to prevent re-initialization

  useEffect(() => {
    if (distortionRef.current) {
      distortionRef.current.curve = makeDistortionCurve(angleToDistortionAmount(distortionAngle));
    }
  }, [distortionAngle]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = angleToGainAmount(gainAngle);
    }
  }, [gainAngle]);

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
    <div className='m-4 flex h-40 w-5/6 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${distortion_font.className} ml-1 text-2xl sm:ml-4 sm:text-5xl`}>DISTORTION</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <TurnableKnob title='DISTORTION' angle={distortionAngle} setAngle={setDistortionAngle} />
        <TurnableKnob title='GAIN' angle={gainAngle} setAngle={setGainAngle} />
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
