'use client';
import scale from '../plugins/util/scale';
import { compressor_font, roboto_bold } from '@/helpers/fonts';
import { BypassIcon } from '@/components/icons/BypassIcon';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { useEffect, useState, useRef } from 'react';

interface CompressorRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

export const CompressorRack: React.FC<CompressorRackProps> = ({ ac, source }) => {
  const [threshold, setThreshold] = useState(0); // Threshold knob angle
  const [ratio, setRatio] = useState(0); // Ratio knob angle
  const [toggle, setToggle] = useState(false); // Bypass toggle state
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);

  useEffect(() => {
    if (!ac || !source) return;

    if (!compressorRef.current) {
      compressorRef.current = ac.createDynamicsCompressor();
      source.connect(compressorRef.current);
      compressorRef.current.connect(ac.destination);
    }

    if (toggle) {
      source.connect(compressorRef.current);
      compressorRef.current.connect(ac.destination);
    } else {
      source.disconnect(compressorRef.current);
      compressorRef.current.disconnect(ac.destination);
    }
  }, [ac, source, toggle]);

  useEffect(() => {
    if (compressorRef.current) {
      compressorRef.current.threshold.value = scale(threshold, 0, 100, -50, 0);
      compressorRef.current.ratio.value = scale(ratio, 0, 100, 1, 20);
    }
  }, [threshold, ratio]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };
  return (
    <div className='m-4 flex h-40 w-5/6 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${compressor_font.className} ml-1 text-2xl sm:ml-4 sm:text-4xl`}>COMPRESSOR</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='ml-1 mt-11 sm:ml-0 sm:mt-6'>
          <TurnableKnob title='THRESHOLD' angle={threshold} setAngle={setThreshold} />
        </div>
        <div className='mt-6'>
          <TurnableKnob title='RATIO' angle={ratio} setAngle={setRatio} />
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
