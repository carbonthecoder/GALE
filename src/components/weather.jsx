import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Logo } from './logo.jsx';
import Spinner from './spinner.jsx';

const WEATHER_DESC = {
  0: { badge: 'CLEAR', desc: 'Clear sky' },
  1: { badge: 'CLEAR', desc: 'Mainly clear' },
  2: { badge: 'CLOUDY', desc: 'Partly cloudy' },
  3: { badge: 'OVERCAST', desc: 'Overcast' },
  45: { badge: 'FOG', desc: 'Fog' },
  48: { badge: 'FOG', desc: 'Depositing rime fog' },
  51: { badge: 'DRIZZLE', desc: 'Light drizzle' },
  53: { badge: 'DRIZZLE', desc: 'Moderate drizzle' },
  55: { badge: 'DRIZZLE', desc: 'Dense drizzle' },
  56: { badge: 'DRIZZLE', desc: 'Freezing drizzle' },
  57: { badge: 'DRIZZLE', desc: 'Dense freezing drizzle' },
  61: { badge: 'RAIN', desc: 'Slight rain' },
  63: { badge: 'RAIN', desc: 'Moderate rain' },
  65: { badge: 'HEAVY RAIN', desc: 'Heavy rain' },
  66: { badge: 'RAIN', desc: 'Freezing rain' },
  67: { badge: 'HEAVY RAIN', desc: 'Heavy freezing rain' },
  71: { badge: 'SNOW', desc: 'Slight snowfall' },
  73: { badge: 'SNOW', desc: 'Moderate snowfall' },
  75: { badge: 'HEAVY SNOW', desc: 'Heavy snowfall' },
  77: { badge: 'SNOW', desc: 'Snow grains' },
  80: { badge: 'SHOWERS', desc: 'Slight rain showers' },
  81: { badge: 'SHOWERS', desc: 'Moderate rain showers' },
  82: { badge: 'SHOWERS', desc: 'Violent rain showers' },
  85: { badge: 'SNOW', desc: 'Slight snow showers' },
  86: { badge: 'SNOW', desc: 'Heavy snow showers' },
  95: { badge: 'STORM', desc: 'Thunderstorm' },
  96: { badge: 'STORM', desc: 'Thunderstorm with slight hail' },
  99: { badge: 'STORM', desc: 'Thunderstorm with heavy hail' },
};

function getWeather(code) {
  return WEATHER_DESC[code] || { badge: 'WEATHER', desc: 'Unknown' };
}

function windDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function Detail({ label, value }) {
  return (
    <Box flexDirection="column" alignItems="center">
      <Text color="#666">{label}</Text>
      <Text color="#ededed" bold>{value}</Text>
    </Box>
  );
}

export default function WeatherDashboard({ city, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useInput((input, key) => {
    if (key.escape || input === 'b' || input === 'q') onBack();
  }, { isActive: Boolean(process.stdin.isTTY) });

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
      <Box flexDirection="column" alignItems="center" justifyContent="center">
        <Logo />
        <Box marginTop={1}>
          <Spinner text={`fetching weather for ${city.name}...`} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" alignItems="center" justifyContent="center">
        <Logo />
        <Box marginTop={1}>
          <Text color="#f44747">x {error}</Text>
        </Box>
        <Box marginTop={1}>
          <Text color="#666">press [esc] to go back</Text>
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
  const pressure = current.surface_pressure ? Math.round(current.surface_pressure) : null;

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

  const countryTag = city.country_code ? ` [${city.country_code.toUpperCase()}]` : '';

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center">
      <Logo />

      <Box marginTop={1} flexDirection="column" alignItems="center">
        <Text color="#ededed" bold>
          {city.name}{city.country ? `, ${city.country}` : ''}{countryTag}
        </Text>
        <Text color="#555">
          {Number(city.latitude).toFixed(2)}N, {Number(city.longitude).toFixed(2)}E
        </Text>
      </Box>

      {/* Main Temperature Card */}
      <Box
        marginTop={1}
        flexDirection="column"
        alignItems="center"
        borderStyle="round"
        borderColor="#333"
        paddingX={3}
        paddingY={0}
      >
        <Text color="#ededed" bold>
          {temp} C
        </Text>
        <Text color="#888">
          feels like {feels} C  |  [{w.badge}] {w.desc}
        </Text>
      </Box>

      {/* Weather Stats Bar */}
      <Box gap={4} marginTop={1}>
        <Detail label="WIND" value={`${windDirStr} ${windSpeed} km/h`} />
        <Detail label="HUMIDITY" value={`${humidity}%`} />
        <Detail label="UV INDEX" value={uv} />
        {pressure && <Detail label="PRESSURE" value={`${pressure} hPa`} />}
      </Box>

      {/* Hourly Forecast */}
      {hours.length > 0 && (
        <Box flexDirection="column" alignItems="center" marginTop={1}>
          <Text color="#555" bold>
            -- HOURLY OUTLOOK --
          </Text>
          <Box gap={2} marginTop={0}>
            {hours.map((t, i) => {
              const h = parseInt(t.split('T')[1].split(':')[0], 10);
              const badge = getWeather(hCodes[i]).badge;
              return (
                <Box key={i} flexDirection="column" alignItems="center">
                  <Text color="#666">{String(h).padStart(2, '0')}:00</Text>
                  <Text color="#ededed" bold>{Math.round(hTemps[i])} C</Text>
                  <Text color="#888">{badge.slice(0, 5)}</Text>
                  {hPrecip[i] > 0 ? (
                    <Text color="#555">{hPrecip[i]}%</Text>
                  ) : (
                    <Text color="#333">0%</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* 7-Day Forecast */}
      <Box flexDirection="column" alignItems="center" marginTop={1}>
        <Text color="#555" bold>
          -- 7-DAY OUTLOOK --
        </Text>
        <Box gap={2} marginTop={0}>
          {daily.time.slice(0, 7).map((date, i) => {
            const day = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
            });
            const badge = getWeather(daily.weather_code[i]).badge;
            const high = Math.round(daily.temperature_2m_max[i]);
            const low = Math.round(daily.temperature_2m_min[i]);
            const today = i === 0;

            return (
              <Box key={i} flexDirection="column" alignItems="center">
                <Text color={today ? '#ededed' : '#666'} bold={today}>
                  {day}
                </Text>
                <Text color="#ededed" bold>
                  {high} C
                </Text>
                <Text color="#555">{low} C</Text>
                <Text color="#888">{badge.slice(0, 5)}</Text>
                {daily.precipitation_probability_max[i] > 0 ? (
                  <Text color="#555">{daily.precipitation_probability_max[i]}%</Text>
                ) : (
                  <Text color="#333">0%</Text>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color="#555">
          <Text color="#888">[esc]</Text> search again  |  <Text color="#888">[q]</Text> quit
        </Text>
      </Box>
    </Box>
  );
}
