import http from 'node:http';
import { URL } from 'node:url';

const WEATHER_CODES = {
  0: { desc: 'Clear sky', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Fog', icon: '🌫️' },
  48: { desc: 'Depositing rime fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', icon: '🌦️' },
  53: { desc: 'Moderate drizzle', icon: '🌦️' },
  55: { desc: 'Dense drizzle', icon: '🌧️' },
  56: { desc: 'Light freezing drizzle', icon: '🌧️' },
  57: { desc: 'Dense freezing drizzle', icon: '🌧️' },
  61: { desc: 'Slight rain', icon: '🌦️' },
  63: { desc: 'Moderate rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '🌧️' },
  66: { desc: 'Light freezing rain', icon: '🌧️' },
  67: { desc: 'Heavy freezing rain', icon: '🌧️' },
  71: { desc: 'Slight snow fall', icon: '🌨️' },
  73: { desc: 'Moderate snow fall', icon: '🌨️' },
  75: { desc: 'Heavy snow fall', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Slight rain showers', icon: '🌦️' },
  81: { desc: 'Moderate rain showers', icon: '🌧️' },
  82: { desc: 'Violent rain showers', icon: '⛈️' },
  85: { desc: 'Slight snow showers', icon: '🌨️' },
  86: { desc: 'Heavy snow showers', icon: '❄️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

function getHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GALE · Weather Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #000000;
      --card-bg: #111111;
      --card-hover: #161616;
      --border: #222222;
      --border-focus: #444444;
      --text: #ededed;
      --text-muted: #888888;
      --text-dim: #555555;
      --accent: #f5f5f5;
      --highlight: #e0e0e0;
      --cyan: #38bdf8;
      --amber: #fbbf24;
      --radius: 8px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px 64px;
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
    }

    .container {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 16px;
    }

    .logo-block {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      font-family: 'Geist Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: #ffffff;
      text-decoration: none;
    }

    .badge {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      border: 1px solid var(--border);
      background: #080808;
      padding: 2px 8px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .unit-toggle {
      background: #080808;
      border: 1px solid var(--border);
      color: var(--text);
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .unit-toggle:hover {
      background: var(--card-bg);
      border-color: var(--border-focus);
    }

    /* Search Box */
    .search-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input-box {
      display: flex;
      align-items: center;
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0 14px;
      transition: border-color 0.15s ease;
    }

    .search-input-box:focus-within {
      border-color: var(--border-focus);
    }

    .search-icon {
      color: var(--text-dim);
      font-size: 14px;
      margin-right: 10px;
      user-select: none;
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-family: 'Geist', sans-serif;
      font-size: 14px;
      padding: 12px 0;
    }

    .search-input::placeholder {
      color: var(--text-dim);
    }

    .search-shortcut {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-dim);
      border: 1px solid var(--border);
      background: #000;
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 8px;
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      z-index: 50;
      max-height: 280px;
      overflow-y: auto;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8);
      display: none;
    }

    .dropdown.show {
      display: block;
    }

    .dropdown-item {
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border-bottom: 1px solid #161616;
      font-size: 13px;
      transition: background 0.1s ease;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover, .dropdown-item.active {
      background: #141414;
    }

    .dropdown-city {
      font-weight: 500;
      color: #fff;
    }

    .dropdown-region {
      font-size: 12px;
      color: var(--text-muted);
      margin-left: 6px;
    }

    .dropdown-coords {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-dim);
    }

    /* City Quick Chips */
    .quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }

    .quick-label {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-dim);
      margin-right: 4px;
    }

    .chip {
      background: #080808;
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .chip:hover {
      background: var(--card-bg);
      color: var(--text);
      border-color: #333;
    }

    /* Cards */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      position: relative;
    }

    /* Main Weather Hero */
    .hero {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 24px;
    }

    .hero-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .city-heading {
      font-size: 26px;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .country-code {
      font-family: 'Geist Mono', monospace;
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .weather-condition {
      font-size: 15px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hero-temp-block {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .temp-big {
      font-size: 64px;
      font-weight: 300;
      line-height: 1;
      letter-spacing: -0.05em;
      color: #ffffff;
    }

    .temp-feels {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 6px;
      font-family: 'Geist Mono', monospace;
    }

    /* Details Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .hero {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .hero-temp-block {
        align-items: flex-start;
        text-align: left;
      }
    }

    .metric-item {
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-dim);
    }

    .metric-val {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }

    .metric-sub {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }

    /* Section Headings */
    .section-title {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* 6-hour forecast timeline */
    .timeline {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }

    @media (max-width: 600px) {
      .timeline {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .timeline-col {
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .time-lbl {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }

    .timeline-icon {
      font-size: 20px;
      margin: 2px 0;
    }

    .timeline-temp {
      font-size: 14px;
      font-weight: 600;
    }

    .timeline-precip {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--cyan);
    }

    /* 7-day forecast */
    .days-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .day-row {
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 16px;
      display: grid;
      grid-template-columns: 80px 40px 1fr 100px;
      align-items: center;
      gap: 16px;
      font-size: 13px;
    }

    .day-name {
      font-weight: 500;
      color: var(--text);
    }

    .day-name.is-today {
      color: #fff;
      font-weight: 700;
    }

    .day-icon {
      font-size: 18px;
      text-align: center;
    }

    .day-precip {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--cyan);
    }

    .day-temp-range {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
    }

    .high-temp {
      font-weight: 600;
      color: var(--text);
    }

    .low-temp {
      color: var(--text-muted);
    }

    /* Footer */
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 16px;
      margin-top: 12px;
      font-size: 12px;
      color: var(--text-dim);
      font-family: 'Geist Mono', monospace;
    }

    footer a {
      color: var(--text-muted);
      text-decoration: none;
    }

    footer a:hover {
      color: var(--text);
    }

    .loading-pulse {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-block">
        <span class="logo">GALE</span>
        <div class="badge">
          <span class="badge-dot"></span>
          <span>localhost:3000</span>
        </div>
      </div>
      <div class="header-controls">
        <button class="unit-toggle" id="unitToggle" onclick="toggleUnit()">°C</button>
      </div>
    </header>

    <div class="search-wrapper">
      <div class="search-input-box">
        <span class="search-icon">⌕</span>
        <input 
          type="text" 
          id="searchInput" 
          class="search-input" 
          placeholder="Search city (e.g. London, Tokyo, San Francisco)..." 
          autocomplete="off"
          spellcheck="false"
        >
        <span class="search-shortcut">/</span>
      </div>
      <div id="dropdown" class="dropdown"></div>
    </div>

    <div class="quick-chips">
      <span class="quick-label">QUICK:</span>
      <button class="chip" onclick="selectPreset('Tokyo', 35.6895, 139.6917, 'Japan', 'JP')">Tokyo</button>
      <button class="chip" onclick="selectPreset('London', 51.5085, -0.1257, 'United Kingdom', 'GB')">London</button>
      <button class="chip" onclick="selectPreset('New York', 40.7143, -74.006, 'United States', 'US')">New York</button>
      <button class="chip" onclick="selectPreset('San Francisco', 37.7749, -122.4194, 'United States', 'US')">San Francisco</button>
      <button class="chip" onclick="selectPreset('Berlin', 52.5244, 13.4105, 'Germany', 'DE')">Berlin</button>
      <button class="chip" onclick="selectPreset('Reykjavik', 64.1355, -21.8954, 'Iceland', 'IS')">Reykjavik</button>
    </div>

    <div id="contentArea">
      <!-- Weather data injected dynamically -->
      <div class="card loading-pulse" style="text-align: center; padding: 48px;">
        <div style="font-family: 'Geist Mono', monospace; font-size: 13px; color: var(--text-muted);">
          Fetching weather data from Open-Meteo...
        </div>
      </div>
    </div>

    <footer>
      <span>GALE · Minimalist Weather</span>
      <div>
        <span>Powered by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></span>
        <span style="margin: 0 8px;">·</span>
        <a href="https://github.com/carbonthecoder/GALE" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  </div>

  <script>
    const WEATHER = ${JSON.stringify(WEATHER_CODES)};

    let currentCity = {
      name: 'London',
      country: 'United Kingdom',
      country_code: 'GB',
      latitude: 51.5085,
      longitude: -0.1257
    };
    let currentData = null;
    let unit = 'C'; // 'C' or 'F'

    const searchInput = document.getElementById('searchInput');
    const dropdown = document.getElementById('dropdown');
    const contentArea = document.getElementById('contentArea');
    const unitToggle = document.getElementById('unitToggle');

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        dropdown.classList.remove('show');
      }
    });

    function toggleUnit() {
      unit = unit === 'C' ? 'F' : 'C';
      unitToggle.textContent = '°' + unit;
      if (currentData) renderDashboard(currentData);
    }

    function toDisplayTemp(celsius) {
      if (unit === 'F') {
        return Math.round((celsius * 9/5) + 32);
      }
      return Math.round(celsius);
    }

    function windDir(deg) {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return dirs[Math.round(deg / 45) % 8];
    }

    let searchTimer = null;
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      clearTimeout(searchTimer);
      if (val.length < 2) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }
      searchTimer = setTimeout(() => searchCities(val), 250);
    });

    async function searchCities(query) {
      try {
        const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
        const data = await res.json();
        const results = data.results || [];
        if (results.length === 0) {
          dropdown.innerHTML = '<div style="padding: 12px; font-size: 13px; color: var(--text-dim); text-align: center;">No cities found</div>';
          dropdown.classList.add('show');
          return;
        }

        dropdown.innerHTML = results.map((city, idx) => \`
          <div class="dropdown-item" onclick="selectCity(\${idx})">
            <div>
              <span class="dropdown-city">\${city.name}</span>
              <span class="dropdown-region">\${city.admin1 ? city.admin1 + ', ' : ''}\${city.country || ''}</span>
            </div>
            <span class="dropdown-coords">\${city.latitude.toFixed(2)}°, \${city.longitude.toFixed(2)}°</span>
          </div>
        \`).join('');
        dropdown.dataset.results = JSON.stringify(results);
        dropdown.classList.add('show');
      } catch (err) {
        dropdown.innerHTML = '<div style="padding: 12px; font-size: 13px; color: #ef4444; text-align: center;">Search failed</div>';
        dropdown.classList.add('show');
      }
    }

    function selectCity(idx) {
      const results = JSON.parse(dropdown.dataset.results || '[]');
      const city = results[idx];
      if (!city) return;
      dropdown.classList.remove('show');
      searchInput.value = '';
      currentCity = city;
      loadWeather(city.latitude, city.longitude);
    }

    function selectPreset(name, lat, lon, country, code) {
      currentCity = { name, latitude: lat, longitude: lon, country, country_code: code };
      loadWeather(lat, lon);
    }

    async function loadWeather(lat, lon) {
      contentArea.innerHTML = \`
        <div class="card loading-pulse" style="text-align: center; padding: 48px;">
          <div style="font-family: 'Geist Mono', monospace; font-size: 13px; color: var(--text-muted);">
            Updating \${currentCity.name}...
          </div>
        </div>
      \`;

      try {
        const res = await fetch(\`/api/weather?latitude=\${lat}&longitude=\${lon}\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        currentData = data;
        renderDashboard(data);
      } catch (err) {
        contentArea.innerHTML = \`
          <div class="card" style="text-align: center; padding: 36px; border-color: #ef4444;">
            <div style="color: #ef4444; font-weight: 500; margin-bottom: 8px;">Failed to load weather data</div>
            <div style="font-size: 12px; color: var(--text-dim); font-family: 'Geist Mono', monospace;">\${err.message}</div>
          </div>
        \`;
      }
    }

    function renderDashboard(data) {
      const { current, daily, hourly, timezone } = data;
      const wInfo = WEATHER[current.weather_code] || { desc: 'Unknown', icon: '☁️' };
      const curTemp = toDisplayTemp(current.temperature_2m);
      const curFeels = toDisplayTemp(current.apparent_temperature);
      const windSpeed = current.wind_speed_10m;
      const windDirStr = windDir(current.wind_direction_10m);
      const humidity = current.relative_humidity_2m;
      const uv = current.uv_index;
      const pressure = current.surface_pressure ? Math.round(current.surface_pressure) : null;

      // 6-hour forecast
      const now = new Date();
      const localHour = parseInt(now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }), 10);
      const localDateStr = now.toLocaleDateString('en-CA', { timeZone: timezone });
      const localTimeStr = \`\${localDateStr}T\${String(localHour).padStart(2, '0')}:00\`;
      
      let startIdx = hourly.time.findIndex(t => t >= localTimeStr);
      if (startIdx < 0) startIdx = Math.max(0, hourly.time.length - 6);
      const endIdx = Math.min(startIdx + 6, hourly.time.length);
      const hours = hourly.time.slice(startIdx, endIdx);
      const hTemps = hourly.temperature_2m.slice(startIdx, endIdx);
      const hCodes = hourly.weather_code.slice(startIdx, endIdx);
      const hPrecip = hourly.precipitation_probability.slice(startIdx, endIdx);

      // Hourly timeline HTML
      const hourlyHtml = hours.map((t, i) => {
        const h = parseInt(t.split('T')[1].split(':')[0], 10);
        const icon = (WEATHER[hCodes[i]] || { icon: '☁️' }).icon;
        const temp = toDisplayTemp(hTemps[i]);
        const precip = hPrecip[i] || 0;
        return \`
          <div class="timeline-col">
            <span class="time-lbl">\${String(h).padStart(2, '0')}:00</span>
            <span class="timeline-icon">\${icon}</span>
            <span class="timeline-temp">\${temp}°</span>
            <span class="timeline-precip">\${precip > 0 ? precip + '%' : '·'}</span>
          </div>
        \`;
      }).join('');

      // 7-day outlook HTML
      const daysHtml = daily.time.map((dateStr, i) => {
        const d = new Date(dateStr + 'T00:00:00');
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = (WEATHER[daily.weather_code[i]] || { icon: '☁️' }).icon;
        const high = toDisplayTemp(daily.temperature_2m_max[i]);
        const low = toDisplayTemp(daily.temperature_2m_min[i]);
        const precip = daily.precipitation_probability_max[i] || 0;
        const isToday = i === 0;

        return \`
          <div class="day-row">
            <span class="day-name \${isToday ? 'is-today' : ''}">\${isToday ? 'Today' : dayName}</span>
            <span class="day-icon">\${icon}</span>
            <span class="day-precip">\${precip > 0 ? precip + '% rain' : ''}</span>
            <div class="day-temp-range">
              <span class="high-temp">\${high}°</span>
              <span class="low-temp">\${low}°</span>
            </div>
          </div>
        \`;
      }).join('');

      contentArea.innerHTML = \`
        <div class="card hero">
          <div class="hero-meta">
            <div class="city-heading">
              \${currentCity.name}
              \${currentCity.country ? \`<span class="country-code">\${currentCity.country_code || currentCity.country}</span>\` : ''}
            </div>
            <div class="weather-condition">
              <span>\${wInfo.icon}</span>
              <span>\${wInfo.desc}</span>
            </div>
          </div>
          <div class="hero-temp-block">
            <div class="temp-big">\${curTemp}°</div>
            <div class="temp-feels">Feels like \${curFeels}°\${unit}</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Wind</span>
            <span class="metric-val">\${windSpeed} km/h</span>
            <span class="metric-sub">\${windDirStr}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Humidity</span>
            <span class="metric-val">\${humidity}%</span>
            <span class="metric-sub">relative</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">UV Index</span>
            <span class="metric-val">\${uv}</span>
            <span class="metric-sub">\${uv >= 6 ? 'High' : (uv >= 3 ? 'Moderate' : 'Low')}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Pressure</span>
            <span class="metric-val">\${pressure || '--'} hPa</span>
            <span class="metric-sub">barometric</span>
          </div>
        </div>

        <div>
          <div class="section-title">6-Hour Forecast</div>
          <div class="timeline">\${hourlyHtml}</div>
        </div>

        <div>
          <div class="section-title">7-Day Outlook</div>
          <div class="days-list">\${daysHtml}</div>
        </div>
      \`;
    }

    // Initial load
    loadWeather(currentCity.latitude, currentCity.longitude);
  </script>
</body>
</html>`;
}

export function startServer(port = 3000) {
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = parsedUrl.pathname;

      if (pathname === '/' || pathname === '/index.html') {
        const html = getHtml();
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(html),
        });
        res.end(html);
        return;
      }

      if (pathname === '/api/search') {
        const query = parsedUrl.searchParams.get('q') || '';
        if (query.length < 2) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ results: [] }));
          return;
        }

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        const fetchRes = await fetch(geoUrl);
        const data = await fetchRes.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      }

      if (pathname === '/api/weather') {
        const lat = parsedUrl.searchParams.get('latitude');
        const lon = parsedUrl.searchParams.get('longitude');
        if (!lat || !lon) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'latitude and longitude are required' }));
          return;
        }

        const params = new URLSearchParams({
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
          hourly: 'temperature_2m,weather_code,precipitation_probability',
          daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset',
          timezone: 'auto',
        });

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const fetchRes = await fetch(weatherUrl);
        const data = await fetchRes.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  server.listen(port, () => {
    console.log(`\n  ◇ GALE local dashboard listening on http://localhost:${port}\n  Press Ctrl+C to stop\n`);
  });

  return server;
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.mjs'))) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  startServer(port);
}
