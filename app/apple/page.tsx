import AudioPlayer from '@/components/audio/player/AudioPlayer'
import ReverbPugin from '@/components/audio/plugins/ReverbPlugin'
export default function Page() {
  return (
    <div className='flex items-center justify-center mt-16'>
      <ReverbPugin />
    </div>
  )
}
