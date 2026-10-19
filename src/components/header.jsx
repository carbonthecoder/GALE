import React from 'react';
import { Box, Text } from 'ink';

export default function Header() {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Text bold color="yellowBright">
        ~ GALE ~
      </Text>
      <Text bold color="yellowBright">
        ◇ weather ◇
      </Text>
    </Box>
  );
}
