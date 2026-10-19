import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export default function SearchBox({ value, onChange }) {
  return (
    <Box flexDirection="column" alignItems="center" width="60%">
      <Box>
        <Text bold color="yellowBright">
          {'› '}
        </Text>
        <TextInput
          value={value}
          onChange={onChange}
          placeholder="search for a city..."
        />
      </Box>
    </Box>
  );
}
