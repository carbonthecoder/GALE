import React, { useState, useCallback, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import Header from './components/header.jsx';
import Spinner from './components/spinner.jsx';
import SearchBox from './components/search.jsx';
import CityList from './components/cityList.jsx';
import WeatherDashboard from './components/weather.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null);
  const [phase, setPhase] = useState('search');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const requestId = useRef(0);

  useInput((input, key) => {
    if (phase !== 'search') return;

    if (key.escape) {
      setQuery('');
      setResults([]);
      return;
    }

    if (results.length === 0) return;

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(results.length - 1, prev + 1));
    } else if (key.return) {
      const city = results[selectedIndex];
      if (city) {
        setSelectedCity(city);
        setPhase('weather');
      }
    }
  });

  const handleChange = useCallback(async (value) => {
    const id = ++requestId.current;
    setQuery(value);
    setSelectedIndex(0);
    setSearchError(null);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const url =
        'https://geocoding-api.open-meteo.com/v1/search?' +
        `name=${encodeURIComponent(value)}&count=10&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (id === requestId.current) {
        setResults(data.results || []);
      }
    } catch (err) {
      if (id === requestId.current) {
        setSearchError(err.message);
        setResults([]);
      }
    } finally {
      if (id === requestId.current) {
        setSearching(false);
      }
    }
  }, []);

  const handleBack = useCallback(() => {
    setPhase('search');
    setSelectedCity(null);
  }, []);

  if (phase === 'weather' && selectedCity) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100%"
        width="100%"
      >
        <WeatherDashboard city={selectedCity} onBack={handleBack} />
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100%"
      width="100%"
    >
      <Header />

      <SearchBox value={query} onChange={handleChange} />

      {searching && query.length >= 2 && (
        <Box marginTop={1}>
          <Spinner text="searching..." />
        </Box>
      )}

      {searchError && (
        <Box marginTop={1}>
          <Text color="red">! {searchError}</Text>
        </Box>
      )}

      {results.length > 0 && (
        <CityList results={results} selectedIndex={selectedIndex} />
      )}

      {results.length === 0 && query.length >= 2 && !searching && !searchError && (
        <Box marginTop={1}>
          <Text dimColor>~ no cities found ~</Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>
          type ·{' '}
          {results.length > 0 ? '\u2191\u2193 navigate \u00B7 ' : ''}
          enter select · esc clear
        </Text>
      </Box>
    </Box>
  );
}
