// useAudioFFT.ts
import { useState, useEffect, useRef } from 'react';

const useAudioFFT = (
  audioRef: React.RefObject<HTMLAudioElement>,
  audioContext: AudioContext,
  isInitialized: boolean,
) => {
  const [fftData, setFftData] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // Initialize AudioContext and analyser once the user has interacted
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Store references for cleanup
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    // FFT size
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateFFTData = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setFftData(Array.from(dataArray));
      }
    };

    const intervalId = setInterval(updateFFTData, 20);

    // cleanup
    return () => {
      clearInterval(intervalId);
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close(); // Close the audio context
      }
    };
  }, [audioRef]); // Re-run effect if isInitialized changes

  return fftData;
};

export default useAudioFFT;
