import { Roboto_Mono } from 'next/font/google';
import { Faster_One } from 'next/font/google';
import { Rubik_Bubbles } from 'next/font/google';
import { Ruslan_Display } from 'next/font/google';
export const roboto_regular = Roboto_Mono({
  weight: '400',
  subsets: ['latin'],
});

export const roboto_medium = Roboto_Mono({
  weight: '500',
  subsets: ['latin'],
});

export const roboto_bold = Roboto_Mono({
  weight: '700',
  subsets: ['latin'],
});

export const reverb_font = Faster_One({ weight: '400', subsets: ['latin'] });
export const distortion_font = Rubik_Bubbles({ weight: '400', subsets: ['latin'] });
export const compressor_font = Ruslan_Display({ weight: '400', subsets: ['latin'] });
