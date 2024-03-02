'use client';

import { useRef } from 'react';
import Scene from '../canvas/Scene';
const Layout = ({ children }) => {
  const ref = useRef();

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  );
};

export { Layout };
