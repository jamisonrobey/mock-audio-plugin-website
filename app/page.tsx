import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import Sidebar from '@/components/ui/Sidebar';
import { AudioRack } from '@/components/audio/rack/AudioRack';
import { roboto_regular } from '@/helpers/fonts';
export default function Page() {
  return (
    <div className='grid h-full w-full grid-cols-2 place-items-center justify-items-center text-acccent sm:grid-cols-6 sm:grid-rows-[1fr,2fr,2fr] '>
      {/* HEADER */}
      <div className='col-span-6 row-span-1 grid h-full w-full grid-cols-6 border-b'>
        <div className='col-span-2 flex items-end justify-end border-r'>
          <Link href='https://github.com/jamisonrobey' className={`${roboto_regular.className} mb-2 mr-4`}>
            Jamison Robey
          </Link>
        </div>
        <div className='col-span-4 flex items-center justify-center'>
          <Logo />
        </div>
      </div>
      {/* SIDEBAR */}
      <div className='col-span-3 row-span-5 h-full w-full border-r sm:col-span-2'>
        <Sidebar />
      </div>
      {/* MAIN */}
      <div
        className={`${roboto_regular.className} col-span-4 row-span-5 sm:w-full sm:h-full  sm:mt-auto`}
      >
        <AudioRack />
      </div>
    </div>
  );
}
