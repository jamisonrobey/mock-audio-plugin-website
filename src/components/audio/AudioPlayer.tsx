'use client'
import React, { useState, useRef, useEffect } from 'react'
import useAudioFFT from './useAudioFFT'
import AudioVisualizer from './AudioVisualizer'
const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // need to initalize audio context on user interaction, mdn: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  const initializeAudio = () => {
    setIsInitialized(true)
  }

  const fftData = useAudioFFT(audioRef, isInitialized)
  return (
    <>
      {!isInitialized && (
        <button onClick={initializeAudio}>Enable Audio</button> // User clicks this to start audio
      )}
      <audio ref={audioRef} controls loop={true}>
        <source src='/audio/rakim.wav' type='audio/wav' />
        Your browser does not support the audio element.
      </audio>
      <AudioVisualizer fftData={fftData} />
    </>
  )
}

export default AudioPlayer
