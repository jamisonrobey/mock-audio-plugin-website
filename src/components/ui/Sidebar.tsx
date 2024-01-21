import { roboto_regular } from '@/helpers/fonts';
import { roboto_bold } from '@/helpers/fonts';
import Link from 'next/link';
import GithubLogo from '../icons/socials/Github';
import LinkedInLogo from '../icons/socials/Linkedin';
const Sidebar = () => {
  return (
    <div className='grid h-full grid-cols-4 border-b border-acccent grid-rows-2'>
      <div className='col-span-2 row-span-2 border-r'>
        <h1 className={`${roboto_bold.className} m-4 w-5/6 text-4xl`}>WHAT IS THIS?</h1>
        <p className={`${roboto_regular.className} m-4 w-5/6`}> Early reflections is a psuedo audio plugin website.</p>
        <p className={`${roboto_regular.className} m-4 w-5/6`}>
          We offer 3 plugins at the moment, which you can try out with a preloaded sample right here in the browser.
        </p>
        <br></br>
        <h1 className={`${roboto_bold.className} m-4 w-5/6 text-4xl`}>...WHY?</h1>
        <p className={`${roboto_regular.className} m-4 w-5/6`}>
          This project initally begun as a 3D audio visualizer as a way to learn 3D programming in the Web.
        </p>
        <p className={`${roboto_regular.className} m-4 w-5/6`}>
          I got this working and decided to flesh it out with controllable audio effects to make the visualizer
          interactive, something I was also interested in learning the software behind.
        </p>
      </div>
      <div className='col-span-2'>
        <h1 className={`${roboto_bold.className} m-4 w-5/6 text-4xl`}>BUILT BY JAMISON ROBEY</h1>
        <p className={`${roboto_regular.className} m-4 w-5/6`}>
          I am a full-stack web developer based out of Brisbane, Australia.
        </p>
        <p className={`${roboto_regular.className} m-4 w-5/6`}>
          My favourite technolgies include NextJS, Typescript and TailwindCSS.
        </p>
      </div>
      <div className='group relative flex items-center justify-center border-r border-t'>
        <h1
          className={`${roboto_bold.className} absolute m-4 w-5/6 -rotate-90 text-4xl transition-opacity duration-500 group-hover:opacity-0`}
        >
          PROJECTS
        </h1>
        <h1
          className={`${roboto_bold.className} absolute m-4 w-5/6 -rotate-90 text-4xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        >
          CHECK LATER
        </h1>
      </div>

      <div className='group relative flex items-center justify-center border-r border-t'>
        <h1
          className={`${roboto_bold.className} absolute m-4  -rotate-90 text-4xl transition-opacity duration-500 group-hover:opacity-0`}
        >
          SOCIALS
        </h1>
        <div
          className={`${roboto_bold.className} ext-4xl absolute m-4 flex h-full w-full flex-col items-center justify-evenly opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        >
          <Link href='https://github.com/jamisonrobey'>
            <GithubLogo />
          </Link>
          <Link href='https://www.linkedin.com/in/jamison-robey-3620722a9/'>
            <LinkedInLogo />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
