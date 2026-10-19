import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Header from './header.jsx';
import Spinner from './spinner.jsx';

const WEATHER = {
  0: { emoji: '\u2600\uFE0F', desc: 'clear' },
  1: { emoji: '\uD83C\uDF24\uFE0F', desc: 'mostly clear' },
  2: { emoji: '\u26C5', desc: 'partly cloudy' },
  3: { emoji: '\u2601\uFE0F', desc: 'overcast' },
  45: { emoji: '\uD83C\uDF2B\uFE0F', desc: 'fog' },
  48: { emoji: '\uD83C\uDF2B\uFE0F', desc: 'rime fog' },
  51: { emoji: '\uD83C\uDF26\uFE0F', desc: 'light drizzle' },
  53: { emoji: '\uD83C\uDF26\uFE0F', desc: 'drizzle' },
  55: { emoji: '\uD83C\uDF26\uFE0F', desc: 'drizzle' },
  56: { emoji: '\uD83C\uDF27\uFE0F', desc: 'freezing drizzle' },
  57: { emoji: '\uD83C\uDF27\uFE0F', desc: 'freezing drizzle' },
  61: { emoji: '\uD83C\uDF26\uFE0F', desc: 'light rain' },
  63: { emoji: '\uD83C\uDF27\uFE0F', desc: 'rain' },
  65: { emoji: '\uD83C\uDF27\uFE0F', desc: 'heavy rain' },
  66: { emoji: '\uD83C\uDF27\uFE0F', desc: 'freezing rain' },
  67: { emoji: '\uD83C\uDF27\uFE0F', desc: 'freezing rain' },
  71: { emoji: '\uD83C\uDF28\uFE0F', desc: 'light snow' },
  73: { emoji: '\uD83C\uDF28\uFE0F', desc: 'snow' },
  75: { emoji: '\u2744\uFE0F', desc: 'heavy snow' },
  77: { emoji: '\u2744\uFE0F', desc: 'snow grains' },
  80: { emoji: '\uD83C\uDF26\uFE0F', desc: 'rain showers' },
  81: { emoji: '\uD83C\uDF27\uFE0F', desc: 'rain showers' },
  82: { emoji: '\uD83C\uDF27\uFE0F', desc: 'rain showers' },
  85: { emoji: '\uD83C\uDF28\uFE0F', desc: 'snow showers' },
  86: { emoji: '\u2744\uFE0F', desc: 'snow showers' },
  95: { emoji: '\u26C8\uFE0F', desc: 'thunderstorm' },
  96: { emoji: '\u26C8\uFE0F', desc: 'thunderstorm' },
  99: { emoji: '\u26C8\uFE0F', desc: 'thunderstorm' },
};

function getWeather(code) {
  return WEATHER[code] || { emoji: '?', desc: 'unknown' };
}

function tempColor(temp) {
  if (temp >= 35) return 'red';
  if (temp >= 25) return 'yellowBright';
  if (temp >= 15) return 'white';
  if (temp >= 5) return 'cyan';
  return 'blue';
}

function windDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return '';
  const points = [...code.toUpperCase()].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65,
  );
  return String.fromCodePoint(...points);
}

function formatTime(timeStr) {
  const parts = timeStr.split('T')[1].split(':');
  return `${parts[0]}:${parts[1]}`;
}

function Detail({ label, value }) {
  return (
    <Box flexDirection="column" alignItems="center">
      <Text dimColor>{label}</Text>
      <Text>{value}</Text>
    </Box>
  );
}

export default function WeatherDashboard({ city, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useInput((input) => {
    if (input === 'b' || input === 'q') onBack();
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      latitude: city.latitude,
      longitude: city.longitude,
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
      hourly: 'temperature_2m,weather_code,precipitation_probability',
      daily:
        'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset',
      timezone: 'auto',
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [city]);

  if (loading) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100%"
      >
        <Header />
        <Spinner text="fetching weather..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100%"
      >
        <Header />
        <Box marginTop={1}>
          <Text color="red">! {error}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>b: back</Text>
        </Box>
      </Box>
    );
  }

  const { current, daily, hourly, timezone } = data;
  const w = getWeather(current.weather_code);
  const temp = Math.round(current.temperature_2m);
  const feels = Math.round(current.apparent_temperature);
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const windDirStr = windDir(current.wind_direction_10m);
  const uv = current.uv_index;
  const pressure = current.surface_pressure
    ? Math.round(current.surface_pressure)
    : null;

  const now = new Date();
  const localHour = parseInt(
    now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false,
    }),
    10,
  );
  const localDateStr = now.toLocaleDateString('en-CA', {
    timeZone: timezone,
  });

  const localTimeStr = `${localDateStr}T${String(localHour).padStart(2, '0')}:00`;
  let startIdx = hourly.time.findIndex((t) => t >= localTimeStr);
  if (startIdx < 0) startIdx = Math.max(0, hourly.time.length - 6);
  const endIdx = Math.min(startIdx + 6, hourly.time.length);

  const hours = hourly.time.slice(startIdx, endIdx);
  const hTemps = hourly.temperature_2m.slice(startIdx, endIdx);
  const hCodes = hourly.weather_code.slice(startIdx, endIdx);
  const hPrecip = hourly.precipitation_probability.slice(startIdx, endIdx);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100%"
    >
      <Header />

      <Box flexDirection="column" alignItems="center" marginBottom={1}>
        <Text bold>
          {w.emoji}  {city.name}
          {city.country ? `, ${city.country}` : ''}
          {flagEmoji(city.country_code)
            ? `  ${flagEmoji(city.country_code)}`
            : ''}
        </Text>
      </Box>

      <Box flexDirection="column" alignItems="center" marginBottom={1}>
        <Text bold color={tempColor(temp)}>
          {temp}°
        </Text>
        <Text>
          feels like {feels}°  ·  {w.desc}
        </Text>
      </Box>

      <Box gap={4} marginBottom={1}>
        <Detail label="wind" value={`${windDirStr} ${windSpeed}`} />
        <Detail label="humidity" value={`${humidity}%`} />
        <Detail label="uv" value={uv} />
        {pressure && <Detail label="pressure" value={`${pressure}hPa`} />}
      </Box>

      {hours.length > 0 && (
        <Box flexDirection="column" alignItems="center" marginBottom={1}>
          <Text bold dimColor>
            ── hourly ──
          </Text>
          <Box gap={2}>
            {hours.map((t, i) => {
              const h = parseInt(t.split('T')[1].split(':')[0], 10);
              const icon = getWeather(hCodes[i]).emoji;
              return (
                <Box key={i} flexDirection="column" alignItems="center">
                  <Text dimColor>
                    {String(h).padStart(2, '0')}:00
                  </Text>
                  <Text bold>{Math.round(hTemps[i])}°</Text>
                  <Text>{icon}</Text>
                  {hPrecip[i] > 0 && (
                    <Text dimColor>{hPrecip[i]}%</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box flexDirection="column" alignItems="center" marginBottom={1}>
        <Text bold dimColor>
          ── 7 days ──
        </Text>
        <Box gap={1}>
          {daily.time.map((date, i) => {
            const day = new Date(date + 'T00:00:00').toLocaleDateString(
              'en-US',
              { weekday: 'short' },
            );
            const icon = getWeather(daily.weather_code[i]).emoji;
            const high = Math.round(daily.temperature_2m_max[i]);
            const low = Math.round(daily.temperature_2m_min[i]);
            const today = i === 0;
            return (
              <Box
                key={i}
                flexDirection="column"
                alignItems="center"
              >
                <Text bold={today} dimColor={!today}>
                  {day}
                </Text>
                <Text bold color={tempColor(high)}>
                  {high}°
                </Text>
                <Text dimColor>{low}°</Text>
                <Text>{icon}</Text>
                {daily.precipitation_probability_max[i] > 0 && (
                  <Text dimColor>
                    {daily.precipitation_probability_max[i]}%
                  </Text>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>b: back  q: quit</Text>
      </Box>
    </Box>
  );
}
