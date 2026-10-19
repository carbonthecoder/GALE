import React, { useState, useCallback, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { Logo } from './components/logo.jsx';
import Spinner from './components/spinner.jsx';
import SearchBox from './components/search.jsx';
import CityList from './components/cityList.jsx';
import WeatherDashboard from './components/weather.jsx';

const TAGLINE = 'minimalist weather terminal · powered by open-meteo';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null);
  const [phase, setPhase] = useState('search');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const requestId = useRef(0);

  const boxWidth = 56;

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
  }, { isActive: Boolean(process.stdin.isTTY) });

  const handleChange = useCallback(async (value) => {
    const id = ++requestId.current;
    setQuery(value);
    setSelectedIndex(0);
    setSearchError(null);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const url =
        'https://geocoding-api.open-meteo.com/v1/search?' +
        `name=${encodeURIComponent(value.trim())}&count=6&language=en&format=json`;
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
      <Box flexDirection="column" alignItems="center" justifyContent="center" minHeight="100%" width="100%">
        <WeatherDashboard city={selectedCity} onBack={handleBack} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" minHeight="100%" width="100%">
      <Logo />
      <Box marginTop={1}>
        <Text color="#ededed">{TAGLINE}</Text>
      </Box>
      <Text color="#555">zero api keys · zero tracking · 10,000+ cities</Text>

      <Box marginTop={2} flexDirection="column" alignItems="center">
        <SearchBox value={query} onChange={handleChange} width={boxWidth} />
      </Box>

      {searching && (
        <Box marginTop={1}>
          <Spinner text="searching locations..." />
        </Box>
      )}

      {searchError && (
        <Box marginTop={1}>
          <Text color="#f44747">x {searchError}</Text>
        </Box>
      )}

      <CityList results={results} selectedIndex={selectedIndex} width={boxWidth} />

      <Box marginTop={2}>
        <Text color="#555">
          {results.length > 0 ? (
            <>
              <Text color="#888">[up/down]</Text> choose  |  <Text color="#888">[enter]</Text> view  |  <Text color="#888">[esc]</Text> clear
            </>
          ) : (
            <>
              <Text color="#888">[type]</Text> city name  |  <Text color="#888">[ctrl+c]</Text> quit
            </>
          )}
        </Text>
      </Box>
    </Box>
  );
}
