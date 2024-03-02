'use client';
import scale from '../plugins/util/scale';
import { roboto_bold, reverb_font } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/BypassIcon';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { useEffect, useState, useRef } from 'react';

interface SaturationRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

export const SaturationRack: React.FC<SaturationRackProps> = ({ ac, source }) => {
  const [drive, setDrive] = useState(0); // Drive knob angle
  const [toggle, setToggle] = useState(false); // Bypass toggle state
  const gainRef = useRef<GainNode | null>(null);
  const waveShaperRef = useRef<WaveShaperNode | null>(null);

  useEffect(() => {
    if (!ac || !source) return;

    const gain = ac.createGain();
    const waveShaper = ac.createWaveShaper();
    gainRef.current = gain;
    waveShaperRef.current = waveShaper;

    source.connect(gain);
    gain.connect(waveShaper);
    waveShaper.connect(ac.destination);

    // Initial gain value
    gain.gain.value = 0.5;
  }, [ac, source]);

  useEffect(() => {
    if (!gainRef.current || !waveShaperRef.current) return;
    const drivePercentage = Math.round(((drive + 135) / 270) * 100);
    if (toggle) {
      gainRef.current.gain.value = 1 - drivePercentage / 100;
      waveShaperRef.current.curve = makeDistortionCurve(drivePercentage);
    } else {
      gainRef.current.gain.value = drivePercentage / 100;
      waveShaperRef.current.curve = makeDistortionCurve(0);
    }
  }, [drive, toggle]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  // Function to create distortion curve
  const makeDistortionCurve = (amount: number): Float32Array => {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  return (
    <div className='m-4 flex h-40 w-5/6 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${reverb_font.className} ml-1 text-2xl sm:ml-4 sm:text-5xl`}>SATURATION</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='ml-1 mt-11 sm:ml-0 sm:mt-6'>
          <TurnableKnob title='DRIVE' angle={drive} setAngle={setDrive} />
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
