// useAudioFFT.ts
import { useState, useEffect, useRef } from 'react';

const useAudioFFT = (
  audioRef: React.RefObject<HTMLAudioElement>,
  sourceRef: React.RefObject<MediaElementAudioSourceNode>,
  isInitialized: boolean,
) => {
  const [fftData, setFftData] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioRef.current || !isInitialized || !sourceRef.current) return;

    // Initialize AudioContext and analyser once the user has interacted
    const audioContext = sourceRef.current.context;
    const analyser = audioContext.createAnalyser();

    sourceRef.current.connect(analyser);
    analyser.connect(audioContext.destination);

    // Store references for cleanup
    audioContextRef.current = audioContext as AudioContext;
    analyserRef.current = analyser;

    // FFT size
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateFFTData = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setFftData(Array.from(dataArray));
      }
    };

    const intervalId = setInterval(updateFFTData, 15);

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
  }, [audioRef, isInitialized]); // Re-run effect if isInitialized changes

  return fftData;
};

export default useAudioFFT;
