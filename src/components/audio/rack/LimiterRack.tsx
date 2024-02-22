'use client';
import { useEffect, useState, useRef } from 'react';
interface LimiterRackProps {
  ac: AudioContext;
  source: MediaElementAudioSourceNode;
  limiter: DynamicsCompressorNode;
}

export const LimiterRack: React.FC<LimiterRackProps> = ({ ac, source, limiter }) => {
  return <></>;
};
