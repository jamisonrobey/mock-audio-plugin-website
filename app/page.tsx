import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import Sidebar from '@/components/ui/Sidebar';
import { AudioRack } from '@/components/audio/rack/AudioRack';
import { roboto_regular } from '@/helpers/fonts';
export default function Page() {
  return (
    <div className='grid h-full grid-cols-1 text-acccent sm:grid-cols-6'>
      {/* HEADER */}
      <div className='col-span-1 flex items-end justify-end border-b-2 border-r-2 border-acccent'>
        <Link href='https://github.com/jamisonrobey' className={`${roboto_regular.className} mb-2 mr-4`}>
          Jamison Robey
        </Link>
      </div>
      <div className='col-span-1 flex items-center justify-center border-b-2 border-acccent sm:col-span-5'>
        <Logo />
      </div>
      {/* SIDEBAR */}
      <div className='col-span-1 border-r-2 border-acccent '>
        <Sidebar />
      </div>
      {/* MAIN */}
      <div className={`${roboto_regular.className} col-span-1 sm:col-span-5 sm:mt-auto sm:h-full  sm:w-full`}>
        <AudioRack />
      </div>
    </div>
  );
}
