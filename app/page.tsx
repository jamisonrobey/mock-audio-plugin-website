import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import Sidebar from '@/components/ui/Sidebar';
import { roboto_regular } from '@/helpers/fonts';
import ReverbPlugin from '@/components/audio/plugins/ReverbPlugin';
import { resolveConfigFile } from 'prettier';
export default function Page() {
  return (
    <div className='grid h-full w-full grid-cols-6 grid-rows-[1fr,2fr,2fr] place-items-center justify-items-center text-acccent '>
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
      <div className='col-span-2 row-span-5 h-full w-full border-r'>
        <Sidebar />
      </div>

      <div
        className={`${roboto_regular.className} col-span-4 row-span-5 flex h-full w-full flex-col items-center justify-evenly`}
      >
        Nothing here but you can try the reverb plugin and tell me how the performance goes:
        <Link href='/apple'>Here</Link>
      </div>
    </div>
  );
}
