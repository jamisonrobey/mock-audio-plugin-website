'use client';
import { useEffect, useState, useRef } from 'react';
import scale from '../util/scale';
import TurnableKnob from '../util/TurnableKnob';
import { BypassIcon } from '@/components/icons/BypassIcon';
import { compressor_font } from '@/helpers/fonts';

interface CompressorRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

export const CompressorRack: React.FC<CompressorRackProps> = ({ ac, source }) => {
  const [threshold, setThreshold] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [toggle, setToggle] = useState(false);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isCompressorConnected = useRef<boolean>(false);

  useEffect(() => {
    if (!ac || !source) return;

    const compressor = ac.createDynamicsCompressor();
    compressorRef.current = compressor;
    const gain = ac.createGain();
    gainRef.current = gain;

    source.connect(gain);
    gain.connect(ac.destination);
    compressor.connect(gain);

    // Default compressor values
    compressor.threshold.value = -30;
    compressor.knee.value = 30;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.1;
  }, [ac, source]);

  useEffect(() => {
    if (!compressorRef.current) return;
    const thresholdDb = scale(threshold, -135, 135, -100, 0);
    compressorRef.current.threshold.value = thresholdDb;
  }, [threshold]);

  useEffect(() => {
    if (!compressorRef.current) return;
    const ratioValue = scale(ratio, -135, 135, 1, 20);
    compressorRef.current.ratio.value = ratioValue;
  }, [ratio]);

  /* Bypass Logic */
  useEffect(() => {
    if (!ac || !source || !compressorRef.current || !gainRef.current) return;
    if (toggle && !isCompressorConnected.current) {
      source.disconnect(gainRef.current);
      source.connect(compressorRef.current);
      isCompressorConnected.current = true;
    } else if (!toggle && isCompressorConnected.current) {
      source.disconnect(compressorRef.current);
      source.connect(gainRef.current);
      isCompressorConnected.current = false;
    }
  }, [toggle, ac, source]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className='m-4 flex h-40 w-11/12 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-8 flex h-full w-2/6 items-center justify-center border-b-2 border-acccent text-acccent sm:mb-16 sm:h-auto sm:justify-start'>
        <p className={`${compressor_font.className} m-1 text-base sm:ml-5 sm:text-6xl`}>COMPRESSOR</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='flex w-11/12 items-center justify-evenly sm:ml-0 sm:mr-4  sm:w-1/5 sm:justify-between'>
          <div className='ml-1 mt-6 sm:ml-0 sm:mt-6'>
            <TurnableKnob title='THRESHOLD' angle={threshold} setAngle={setThreshold} />
          </div>
          <div className='mt-6'>
            <TurnableKnob title='RATIO' angle={ratio} setAngle={setRatio} />
          </div>
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
