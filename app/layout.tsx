import { Layout } from '@/components/dom/Layout';
import '@/global.css';

export const metadata = {
  title: 'Mock Audio Website',
  description: 'A mock audio plugin website using Next.js, react-three-fiber and web audio API',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body className='bg-background'>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
