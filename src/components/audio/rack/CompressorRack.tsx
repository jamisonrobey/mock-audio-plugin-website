'use client';
import { useEffect, useState, useRef } from 'react';
import scale from '../plugins/util/scale';
import TurnableKnob from '../plugins/util/TurnableKnob';
import { BypassIcon } from '@/components/icons/BypassIcon';

interface CompressorRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

export const CompressorRack: React.FC<CompressorRackProps> = ({ ac, source }) => {
  const [threshold, setThreshold] = useState(0); // Threshold knob angle
  const [ratio, setRatio] = useState(0); // Ratio knob angle
  const [toggle, setToggle] = useState(false); // Bypass toggle state
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isCompressorConnected = useRef<boolean>(false);

  useEffect(() => {
    if (!ac || !source) return;

    const compressor = ac.createDynamicsCompressor();
    compressorRef.current = compressor;
    const gain = ac.createGain();
    gainRef.current = gain;

    // Set up the initial connection
    source.connect(gain);
    gain.connect(ac.destination);
    compressor.connect(gain); // Prepare the compressor in the chain without disrupting the signal

    // Default compressor values
    compressor.threshold.value = -30; // dB, a lower threshold to affect more of the drum signal
    compressor.knee.value = 30; // dB, a soft knee for a more gradual compression onset
    compressor.ratio.value = 8; // a moderate ratio to clearly hear compression without squashing the dynamics
    compressor.attack.value = 0.01; // seconds, slightly slower attack to preserve drum transients
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

  useEffect(() => {
    if (!ac || !source || !compressorRef.current || !gainRef.current) return;

    if (toggle && !isCompressorConnected.current) {
      // Connect the compressor only if it's not already connected
      source.disconnect(gainRef.current);
      source.connect(compressorRef.current);
      isCompressorConnected.current = true;
    } else if (!toggle && isCompressorConnected.current) {
      // Disconnect the compressor to bypass it
      source.disconnect(compressorRef.current);
      source.connect(gainRef.current);
      isCompressorConnected.current = false;
    }
  }, [toggle, ac, source]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className='m-4 flex h-40 w-5/6 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className='ml-1 text-2xl sm:ml-4 sm:text-5xl'>COMPRESSOR</p>
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
