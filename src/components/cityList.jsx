import React from 'react';
import { Box, Text } from 'ink';

function flagEmoji(code) {
  if (!code || code.length !== 2) return '';
  const points = [...code.toUpperCase()].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65,
  );
  return String.fromCodePoint(...points);
}

export default function CityList({ results, selectedIndex }) {
  return (
    <Box flexDirection="column" marginTop={1} width="60%">
      {results.map((city, i) => {
        const selected = i === selectedIndex;
        return (
          <Box key={`${i}`}>
            <Text
              color={selected ? 'yellowBright' : 'white'}
              bold={selected}
            >
              {selected ? '  ›' : '   '} {city.name}
              {city.admin1 ? `, ${city.admin1}` : ''}
              {city.country ? `, ${city.country}` : ''}
              {flagEmoji(city.country_code)
                ? `  ${flagEmoji(city.country_code)}`
                : ''}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
