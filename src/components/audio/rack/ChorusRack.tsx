'use client';
import { useEffect, useState, useRef } from 'react';
import scale from '../plugins/util/scale';
import { compressor_font } from '@/helpers/fonts'; // Consider renaming this if it's specific to the compressor
import { BypassIcon } from '@/components/icons/BypassIcon';
import TurnableKnob from '../plugins/util/TurnableKnob';

interface ChorusRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
}

export const ChorusRack: React.FC<ChorusRackProps> = ({ ac, source }) => {
  const [depth, setDepth] = useState(50); // Depth of the modulation
  const [rate, setRate] = useState(50); // Rate of the modulation
  const [delay, setDelay] = useState(50); // Delay time for the chorus effect
  const [toggle, setToggle] = useState(false); // Start with the effect disengaged
  const chorusRef = useRef<DelayNode | null>(null);
  const modulatorRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const updateChorusEffect = () => {
    if (!chorusRef.current || !modulatorRef.current || !oscillatorRef.current) {
      chorusRef.current = ac.createDelay();
      modulatorRef.current = ac.createGain();
      oscillatorRef.current = ac.createOscillator();

      // Connect the oscillator to the gain node (modulator)
      oscillatorRef.current.connect(modulatorRef.current);
      // Connect the gain node to the delay time of the chorus effect
      modulatorRef.current.connect(chorusRef.current.delayTime);

      // Start the oscillator
      oscillatorRef.current.start(0);
    }

    // Update the parameters based on the knob values
    chorusRef.current.delayTime.value = scale(delay, 0, 100, 0.005, 0.03); // 5ms to 30ms delay
    modulatorRef.current.gain.value = scale(depth, 0, 100, 0.001, 0.005); // Depth of modulation
    oscillatorRef.current.frequency.value = scale(rate, 0, 100, 0.1, 5); // Rate of modulation in Hz
  };

  useEffect(() => {
    if (!ac || !source) return;

    if (toggle) {
      updateChorusEffect();
      source.connect(chorusRef.current);
      chorusRef.current.connect(ac.destination);
    } else {
      source.disconnect(chorusRef.current);
      chorusRef.current.disconnect(ac.destination);
    }
  }, [toggle]);

  useEffect(() => {
    if (!ac || !source || !chorusRef.current) return;
    updateChorusEffect(); // Update effect parameters on knob changes
  }, [depth, rate, delay]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className='m-4 flex h-40 w-5/6 select-none items-center border-2 border-acccent bg-background'>
      <div className='mb-16 w-2/6 border-b-2 border-acccent text-acccent'>
        <p className={`${compressor_font.className} ml-1 text-2xl sm:ml-4 sm:text-4xl`}>CHORUS</p>
      </div>
      <div className='flex h-full w-4/6 items-center justify-end space-x-4 border-l-2 border-acccent sm:space-x-16'>
        <div className='ml-1 mt-11 sm:ml-0 sm:mt-6'>
          <TurnableKnob title='DEPTH' angle={depth} setAngle={setDepth} />
        </div>
        <div className='mt-6'>
          <TurnableKnob title='RATE' angle={rate} setAngle={setRate} />
        </div>
        <div className='mt-6'>
          <TurnableKnob title='DELAY' angle={delay} setAngle={setDelay} />
        </div>
        <BypassIcon toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
};
