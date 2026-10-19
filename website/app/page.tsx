'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [copied, setCopied] = useState(false)
  const [installMethod, setInstallMethod] = useState<'curl' | 'git'>('curl')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'light' || current === 'dark') {
      setTheme(current)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('gale-theme', next)
    } catch {}
  }

  const curlCmd = 'curl -fsSL https://raw.githubusercontent.com/carbonthecoder/GALE/main/website/public/install.sh | bash'
  const gitCmd = 'git clone https://github.com/carbonthecoder/GALE.git && cd GALE && npm i && npm run build'

  const activeCmd = installMethod === 'curl' ? curlCmd : gitCmd

  const copyCmd = () => {
    navigator.clipboard.writeText(activeCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container">
      <div className="top-bar">
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className={`theme-icon ${theme === 'light' ? 'rotate-sun' : 'rotate-moon'}`}>
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="badge">
        <span className="badge-dot"></span>
        <span>v1.0.0 released</span>
      </div>

      <h1 className="logo">GALE</h1>

      <p className="tagline">
        Minimalist weather TUI powered by Open-Meteo.
        <br />
        Search any city. Live conditions, 6-hour timeline, and 7-day outlook.
      </p>

      <div className="screenshot">
        <div className="mockup-frame">
          <div className="mockup-header">
            <span className="mockup-dot" style={{ background: '#ef4444' }}></span>
            <span className="mockup-dot" style={{ background: '#eab308' }}></span>
            <span className="mockup-dot" style={{ background: '#22c55e' }}></span>
            <span style={{ fontSize: '11px', color: '#666', marginLeft: '8px', fontFamily: 'monospace' }}>gale ~ weather</span>
          </div>
          <div className="mockup-body">
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ color: '#888', letterSpacing: '0.1em' }}>~ GALE ~</div>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Tokyo, Japan</div>
              <div style={{ color: '#38bdf8', fontSize: '28px', fontWeight: '800', margin: '4px 0' }}>19°C · Clear Sky</div>
              <div style={{ color: '#777', fontSize: '12px' }}>Feels like 18°C · Humidity 48% · Wind 12 km/h · UV 4</div>
            </div>
            <div style={{ background: '#111', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Now: 19°C</span>
              <span>12:00: 21°C</span>
              <span>14:00: 22°C</span>
              <span>16:00: 20°C</span>
              <span>18:00: 17°C</span>
            </div>
            <div style={{ marginTop: '14px', color: '#666', fontSize: '12px', textAlign: 'center' }}>
              type city · ↑↓ navigate · enter select · esc clear · q quit
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tab-pill">
          <code>type</code> Search city
        </div>
        <div className="tab-pill">
          <code>Enter</code> Select
        </div>
        <div className="tab-pill">
          <code>--web</code> Local dashboard
        </div>
      </div>

      <div className="install-box" onClick={copyCmd} title="Click to copy command">
        <div className="install-header">
          <div className="install-tabs">
            <span className="install-label">Install</span>
            <button
              type="button"
              className={`install-tab-btn ${installMethod === 'curl' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setInstallMethod('curl')
              }}
            >
              curl
            </button>
            <span className="install-tab-divider">/</span>
            <button
              type="button"
              className={`install-tab-btn ${installMethod === 'git' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setInstallMethod('git')
              }}
            >
              git + npm
            </button>
          </div>
          <span className={`copy-hint ${copied ? 'copied' : ''}`}>
            {copied ? '✓ Copied' : 'Click to copy'}
          </span>
        </div>
        <div className="install-cmd">
          <span className="prompt">$</span>
          {activeCmd}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-title">
            <span>Powered by Open-Meteo</span>
          </div>
          <div className="feature-desc">
            Direct weather model indexing with zero API keys and zero tracking accounts required.
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-title">
            <span>6-Hour & 7-Day Forecast</span>
          </div>
          <div className="feature-desc">
            Highs, lows, precipitation probabilities, sunrise, and sunset times in clean ASCII charts.
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-title">
            <span>Global Geocoding</span>
          </div>
          <div className="feature-desc">
            Type any village, town, or capital. Instant autocomplete with arrow-key selection.
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-title">
            <span>Obsidian Local Dashboard</span>
          </div>
          <div className="feature-desc">
            Run gale --web to open a real-time weather station dashboard on localhost:3000.
          </div>
        </div>
      </div>

      <div className="links">
        <a
          href="https://github.com/carbonthecoder/GALE"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://github.com/carbonthecoder/GALE/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>
      </div>

      <div className="footer">
        <span>GALE</span>
        <span>·</span>
        <a
          href="https://github.com/carbonthecoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          carbonthecoder
        </a>
      </div>
    </div>
  )
}
