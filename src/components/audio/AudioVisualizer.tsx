import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, Sphere } from '@react-three/drei'
import { Vector3, Color } from 'three'

interface CubeProps {
  fftData: number[]
}

const calculateRangeAverage = (data: number[], start: number, end: number) => {
  const rangeData = data.slice(start, end)
  const sum = rangeData.reduce((a, b) => a + b, 0)
  return sum / rangeData.length
}

const SphereAudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current || fftData.length === 0) return // Guard to ensure meshRef is set and data is available

    // visualizing bass so define the range in fftData we want and average
    const bassRange = { start: 0, end: 20 } // adjustable
    const bassAvg = calculateRangeAverage(fftData, bassRange.start, bassRange.end)

    const scale = Math.max(1, bassAvg * 0.01) // adjustable
    const newScale = new Vector3(scale, scale, scale)

    meshRef.current.scale.lerp(newScale, 0.1)
    //
    // rotate back and forth while music playing
    if (bassAvg > 1) {
      if (clock.getElapsedTime() % 3 < 0.5) {
        meshRef.current.rotation.y += 0.005
        meshRef.current.rotation.x += 0.005
        meshRef.current.rotation.z += 0.005
      } else {
        meshRef.current.rotation.y -= 0.005
        meshRef.current.rotation.x -= 0.005
        meshRef.current.rotation.z -= 0.005
      }
    }
  })
  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} position={[0, 0, 0]}>
      <meshStandardMaterial color='black' wireframe={true} />
    </Sphere>
  )
}

// Updated Cube component
const AudioVisualizer: React.FC<CubeProps> = ({ fftData }) => {
  return (
    <Canvas className='w=max h-max'>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SphereAudioVisualizer fftData={fftData} />
    </Canvas>
  )
}
export default AudioVisualizer
