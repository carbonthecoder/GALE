import React from 'react';
import { Box, Text } from 'ink';

const ART = [
  '  ____    _    _     _____ ',
  ' / ___|  / \\  | |   | ____|',
  '| |  _  / _ \\ | |   |  _|  ',
  '| |_| |/ ___ \\| |___| |___ ',
  ' \\____/_/   \\_\\_____|_____|',
];

export function Logo() {
  return (
    <Box flexDirection="column" alignItems="center" flexShrink={0}>
      {ART.map((line, i) => (
        <Text key={i} color="#ededed" bold>
          {line}
        </Text>
      ))}
    </Box>
  );
}
