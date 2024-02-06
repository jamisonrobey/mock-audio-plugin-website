'use client';
import { roboto_bold } from '@/helpers/fonts';
import PlayIcon from '@/components/icons/PlayIcon';
import TurnableKnob from '../plugins/util/TurnableKnob';
import scale from '../plugins/util/scale';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
interface AudioRackProps {
  ac: AudioContext;
  sourceRef: MutableRefObject<MediaElementAudioSourceNode>;
  audioRef: MutableRefObject<HTMLAudioElement>;
}
export const AudioRack: React.FC<AudioRackProps> = ({ ac, sourceRef, audioRef }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const [mixAngle, setMixAngle] = useState(0);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);

  const [preDelay, setPreDelay] = useState(0);
  const preDelayRef = useRef<DelayNode | null>(null);

  const [modAngle, setModAngle] = useState(-135);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  /*   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
 */
  const convolverRef = useRef<ConvolverNode | null>(null);

  useEffect(() => {
    /*  if (!audioContext) {
      const ac = new AudioContext();
      setAudioContext(ac);
    } else {
      if (audioRef.current && audioContext && !sourceRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
      
    */
    if (!ac) return;
    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;

    const pdNode = ac.createDelay();
    pdNode.delayTime.value = preDelay / 1000; // convert to seconds
    preDelayRef.current = pdNode;

    const convolver = ac.createConvolver();
    convolverRef.current = convolver;

    /* fetch impulse response and decode for reverb */
    fetch('/audio/impulse_response.wav')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        if (convolverRef.current) {
          convolverRef.current.buffer = audioBuffer;
        }
      })
      .catch((err) => console.error('Error with impulse response:', err));

    /* refs and connect nodes */
    sourceRef.current?.connect(dryGain);
    sourceRef.current?.connect(convolver);
    sourceRef.current?.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

    dryGain.gain.value = 0.5; // initial values to be 50/50
    wetGain.gain.value = 0.5;

    // clean up on unmount
    return () => {
      ac.close();
    };
  }, [ac]);

  // Function to set up audio nodes
  const setupAudioNodes = () => {
    const dryGain = ac.createGain();
    const wetGain = ac.createGain();
    dryGainRef.current = dryGain;
    wetGainRef.current = wetGain;

    const pdNode = ac.createDelay();
    pdNode.delayTime.value = preDelay / 1000; // convert to seconds
    preDelayRef.current = pdNode;

    const convolver = ac.createConvolver();
    convolverRef.current = convolver;

    /* fetch impulse response and decode for reverb */
    fetch('/audio/impulse_response.wav')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ac.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        if (convolverRef.current) {
          convolverRef.current.buffer = audioBuffer;
        }
      })
      .catch((err) => console.error('Error with impulse response:', err));

    /* refs and connect nodes */
    sourceRef.current?.connect(dryGain);
    sourceRef.current?.connect(convolver);
    sourceRef.current?.connect(pdNode);
    pdNode.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(ac.destination);
    wetGain.connect(ac.destination);

    dryGain.gain.value = 0.5; // initial values to be 50/50
    wetGain.gain.value = 0.5;
  };

  useEffect(() => {
    if (ac) {
      setupAudioNodes();
    }

    // clean up on unmount
  }, [ac]);

  return (
    <div
      className={`${roboto_bold.className} text-accent flex w-5/6 items-center justify-center rounded-lg border-2 border-acccent sm:w-3/6`}
    >
      <div className='grid select-none grid-cols-5 rounded-md bg-background shadow-xl'>
        <div className='border-accent col-span-5  flex items-center justify-between border-b-2  text-acccent'>
          <div className='flex h-full items-center border-r-2 border-acccent'>
            <p className='m-4 text-2xl sm:text-4xl'>REVERB</p>
          </div>
        </div>
        <div className='col-span-1 row-span-2 flex flex-col items-center justify-evenly border-l-2 border-acccent'>
          <TurnableKnob title='MIX' angle={mixAngle} setAngle={setMixAngle} />
          <TurnableKnob title='PRE-DELAY' angle={preDelay} setAngle={setPreDelay} />
        </div>
      </div>
    </div>
  );
};
