import React, { useRef, useMemo } from 'react';
import { useLoader, Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Vector3, Mesh } from 'three';

interface CubeProps {
  fftData: number[];
}

const calculateRangeAverage = (data: number[], start: number, end: number) => {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += data[i];
  }
  return sum / (end - start);
};

const SphereAudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  const meshRef = useRef<Mesh>(null);
  const bassRange = { start: 0, end: 20 };
  const midRange = { start: 20, end: 40 };

  const targetScaleRef = useRef<Vector3>(new Vector3()); // Initialize once
  const averages = useMemo(() => {
    return {
      bassAvg: calculateRangeAverage(fftData, bassRange.start, bassRange.end),
      midAvg: calculateRangeAverage(fftData, midRange.start, midRange.end),
    };
  }, [fftData, bassRange.start, bassRange.end, midRange.start, midRange.end]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const enhancedScale = Math.max(1, 1 + averages.bassAvg * 0.005);
    targetScaleRef.current.set(enhancedScale, enhancedScale, enhancedScale);
    meshRef.current.scale.lerp(targetScaleRef.current, 0.1);

    const rotationFactor = averages.midAvg > 0 ? 0.005 : 0.001; // if audio playing rotate faster, if not slower.
    meshRef.current.rotation.y += rotationFactor;
    meshRef.current.rotation.x += rotationFactor;
    meshRef.current.rotation.z += rotationFactor;
  });

  return (
    <Sphere ref={meshRef} args={[1.75, 4, 4]} position={[0, 0, 0]}>
      <meshBasicMaterial wireframe={true} color='#C9C9C9' />
    </Sphere>
  );
};

const AudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  return (
    <div className='flex h-60 w-60 items-center justify-center rounded-full sm:h-96 sm:w-96'>
      <Canvas>
        <SphereAudioVisualizer fftData={fftData} />
      </Canvas>
    </div>
  );
};

export default AudioVisualizer;
