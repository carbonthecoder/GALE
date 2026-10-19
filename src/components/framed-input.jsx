import React from 'react';
import { Box, Text } from 'ink';

export function FramedInput({ title, width = 50, children }) {
  const inner = Math.max(10, width - 2);
  const tail = Math.max(0, inner - title.length - 3);

  return (
    <Box flexDirection="column" width={width}>
      <Text>
        <Text color="#555">{'╭─ '}</Text>
        <Text color="#ededed" bold>{title}</Text>
        <Text color="#555">{` ${'─'.repeat(tail)}╮`}</Text>
      </Text>
      <Box width={width} height={1} overflow="hidden">
        <Text color="#555">│ </Text>
        <Text color="#ededed" bold>{'> '}</Text>
        <Box flexGrow={1} height={1} overflow="hidden">
          {children}
        </Box>
        <Text color="#555"> │</Text>
      </Box>
      <Text color="#555">{`╰${'─'.repeat(inner)}╯`}</Text>
    </Box>
  );
}
