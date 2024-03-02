import { roboto_bold, roboto_regular } from '@/helpers/fonts';
import Link from 'next/link';
import GithubLogo from '../icons/socials/Github';
import LinkedInLogo from '../icons/socials/Linkedin';
const Sidebar = () => {
  return (
    <div className='grid h-auto grid-cols-2 grid-rows-4 sm:h-full'>
      <div className='col-span-2 row-span-2 border-b-2 border-acccent sm:flex sm:flex-col sm:items-center sm:justify-center'>
        <h1 className={`${roboto_bold.className} m-2 w-5/6 text-lg lg:text-4xl`}>BUILT BY JAMISON ROBEY</h1>
        <p className={`${roboto_regular.className} m-2 w-5/6 text-sm lg:text-xl`}>
          I am a full-stack web developer based out of Brisbane, Australia.
        </p>
        <p className={`${roboto_regular.className} m-2 w-5/6 text-sm lg:text-xl`}>
          My favourite technolgies include NextJS, Typescript and TailwindCSS.
        </p>
      </div>
      <div className='group relative row-span-2 flex items-center justify-center border-b-2 border-r-2 border-acccent'>
        <h1
          className={`${roboto_bold.className} absolute  text-4xl transition-opacity duration-500 group-hover:opacity-0 sm:-rotate-90`}
        >
          PROJECTS
        </h1>
        <h1
          className={`${roboto_bold.className} absolute  w-5/6 text-center text-4xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:-rotate-90`}
        >
          CHECK LATER
        </h1>
      </div>
      <div className='group relative row-span-2 flex items-center justify-center border-b-2 border-acccent'>
        <h1
          className={`${roboto_bold.className} absolute m-4  text-4xl transition-opacity duration-500 group-hover:opacity-0 sm:-rotate-90`}
        >
          SOCIALS
        </h1>
        <div
          className={`${roboto_bold.className} absolute m-4 flex items-center justify-evenly opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:flex-col`}
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
