import PlayIcon from '@/components/icons/PlayIcon'
import React from 'react'

type PlayButtonProps = {
  ref: React.RefObject<HTMLAudioElement>
}

export default function PlayButton({ ref }: PlayButtonProps) {
  const playAudio = () => {
    if (ref.current) {
      if (ref.current.paused) {
        ref.current.play()
      } else {
        ref.current.currentTime = 0
      }
    }
  }

  return (
    <div>
      <div onClick={playAudio}>
        <PlayIcon />
      </div>
      <audio ref={ref}>
        <source src='/samples/rakim.wav' type='audio/wav' />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
