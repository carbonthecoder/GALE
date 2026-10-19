import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

const FRAMES = ['◜', '◝', '◞', '◟', '◠', '◡'];

export default function Spinner({ text }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      <Text dimColor>{FRAMES[frame]}</Text>
      <Text dimColor>{' '}{text || ''}</Text>
    </Box>
  );
}
