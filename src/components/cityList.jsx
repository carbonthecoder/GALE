import React from 'react';
import { Box, Text } from 'ink';

export default function CityList({ results, selectedIndex, width = 50 }) {
  if (!results || results.length === 0) return null;

  return (
    <Box flexDirection="column" marginTop={1} width={width}>
      {results.map((city, i) => {
        const selected = i === selectedIndex;
        const countryTag = city.country_code ? ` [${city.country_code.toUpperCase()}]` : '';
        const region = city.admin1 ? `, ${city.admin1}` : '';
        const country = city.country ? `, ${city.country}` : '';
        const coords = ` (${Number(city.latitude).toFixed(2)}, ${Number(city.longitude).toFixed(2)})`;

        return (
          <Box key={`${i}`} paddingLeft={1}>
            <Text color={selected ? '#ffffff' : '#666'} bold={selected}>
              {selected ? '> ' : '  '}
              {city.name}
              {region}
              {country}
              {countryTag}
              <Text color="#444">{coords}</Text>
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
