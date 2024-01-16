import React, { useRef } from 'react';
import { useLoader, Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Vector3, Color, Mesh } from 'three';
interface CubeProps {
  fftData: number[];
}

// TODO: TRY OUT THE GLBS PROVIDED AND SEE IF THEY WORK IN AUDIO VISUALIZER

const calculateRangeAverage = (data: number[], start: number, end: number) => {
  const rangeData = data.slice(start, end);
  const sum = rangeData.reduce((a, b) => a + b, 0);
  return sum / rangeData.length;
};

const SphereAudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  const meshRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current || !meshRef.current.material || fftData.length === 0) return; // Guard to ensure meshRef is set and data is available

    // visualizing bass so define the range in fftData we want and average
    const bassRange = { start: 0, end: 20 }; // adjustable
    const midTrebleRange = { start: 20, end: 100 };

    const bassAvg = calculateRangeAverage(fftData, bassRange.start, bassRange.end);

    const scale = Math.max(1, bassAvg * 0.008); // adjustable
    const newScale = new Vector3(scale, scale, scale);

    meshRef.current.scale.lerp(newScale, 0.1);

    //rotation

    if (bassAvg > 0) {
      if (clock.getElapsedTime() % 3 < 0.5) {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.z += 0.005;
      } else {
        meshRef.current.rotation.y -= 0.005;
        meshRef.current.rotation.x -= 0.005;
        meshRef.current.rotation.z -= 0.005;
      }
    } else {
      if (clock.getElapsedTime() % 20 < 10) {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.x += 0.001;
        meshRef.current.rotation.z += 0.001;
      } else {
        meshRef.current.rotation.y -= 0.001;
        meshRef.current.rotation.x -= 0.001;
        meshRef.current.rotation.z -= 0.001;
      }
    }
  });
  return (
    <Sphere ref={meshRef} args={[1.75, 12, 12]} position={[0, 0, 0]}>
      <meshStandardMaterial wireframe={true} color='#334155' />
    </Sphere>
  );
};

const AudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  return (
    <div className='flex  h-96 w-96 items-center justify-center rounded-full  '>
      <Canvas>
        {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} />
        <SphereAudioVisualizer fftData={fftData} />
      </Canvas>
    </div>
  );
};
export default AudioVisualizer;
