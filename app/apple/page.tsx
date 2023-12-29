import AudioPlayer from '@/components/audio/player/AudioPlayer';
import ReverbPugin from '@/components/audio/plugins/ReverbPlugin';
export default function Page() {
  return (
    <div className='mt-16 flex items-center justify-center'>
      <ReverbPugin />
    </div>
  );
}
