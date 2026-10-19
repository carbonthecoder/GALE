'use client';

import React, { useState } from 'react';

const CURL_CMD =
  'curl -fsSL https://raw.githubusercontent.com/carbonthecoder/GALE/main/website/public/install.sh | bash';

const GIT_CMD =
  'git clone https://github.com/carbonthecoder/GALE.git && cd GALE && npm install && npm run build';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'git'>('curl');
  const [copied, setCopied] = useState(false);

  const currentCommand = activeTab === 'curl' ? CURL_CMD : GIT_CMD;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          borderBottom: '1px solid #222222',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1040px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
            }}
          >
            GALE
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '11px',
              color: '#888888',
              border: '1px solid #222222',
              background: '#090909',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            v1.0.0
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://github.com/carbonthecoder/GALE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '13px',
              color: '#888888',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #222222',
              background: '#090909',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <svg
              height="16"
              width="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ color: '#ededed' }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          flex: 1,
          maxWidth: '1040px',
          width: '100%',
          margin: '0 auto',
          padding: '64px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Geist Mono', monospace",
              fontSize: '12px',
              color: '#888888',
              border: '1px solid #222222',
              background: '#090909',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            <span>Open-Meteo Integration</span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '16px',
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            GALE
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#888888',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Minimalist weather TUI powered by Open-Meteo. Zero API keys, zero tracking.
          </p>
        </div>

        {/* Install Box */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            background: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #222222',
              background: '#080808',
              padding: '0 12px',
            }}
          >
            <div style={{ display: 'flex' }}>
              <button
                onClick={() => setActiveTab('curl')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'curl' ? '2px solid #ffffff' : '2px solid transparent',
                  color: activeTab === 'curl' ? '#ffffff' : '#777777',
                  padding: '10px 14px',
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'curl' ? 600 : 400,
                }}
              >
                curl installer
              </button>
              <button
                onClick={() => setActiveTab('git')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'git' ? '2px solid #ffffff' : '2px solid transparent',
                  color: activeTab === 'git' ? '#ffffff' : '#777777',
                  padding: '10px 14px',
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'git' ? 600 : 400,
                }}
              >
                git + npm
              </button>
            </div>

            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#142918' : '#141414',
                border: copied ? '1px solid #10b981' : '1px solid #222222',
                color: copied ? '#10b981' : '#ededed',
                fontFamily: "'Geist Mono', monospace",
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Command display */}
          <div
            style={{
              padding: '16px 20px',
              fontFamily: "'Geist Mono', monospace",
              fontSize: '13px',
              color: '#ededed',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: '#555555', userSelect: 'none', marginRight: '10px' }}>$</span>
            {currentCommand}
          </div>
        </div>

        {/* Terminal TUI Mockup */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            background: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {/* Window header */}
          <div
            style={{
              background: '#080808',
              borderBottom: '1px solid #1a1a1a',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#333333' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#333333' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#333333' }} />
            <span
              style={{
                marginLeft: '8px',
                fontFamily: "'Geist Mono', monospace",
                fontSize: '11px',
                color: '#666666',
              }}
            >
              gale — 80x24
            </span>
          </div>

          {/* Terminal content */}
          <div
            style={{
              padding: '24px',
              fontFamily: "'Geist Mono', monospace",
              fontSize: '13px',
              color: '#ededed',
              lineHeight: 1.6,
            }}
          >
            <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 600, marginBottom: '2px' }}>
              ~ GALE ~
            </div>
            <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 600, marginBottom: '16px' }}>
              ◇ weather ◇
            </div>

            <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>
              ☀️  Tokyo, Japan  🇯🇵
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#38bdf8' }}>19°</span>
              <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
                feels like 19°  ·  clear sky
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                borderTop: '1px solid #1a1a1a',
                borderBottom: '1px solid #1a1a1a',
                padding: '10px 0',
                marginBottom: '16px',
                fontSize: '11px',
                color: '#888888',
              }}
            >
              <div>wind: <span style={{ color: '#ededed' }}>N 14km/h</span></div>
              <div>humidity: <span style={{ color: '#ededed' }}>48%</span></div>
              <div>uv: <span style={{ color: '#ededed' }}>4</span></div>
              <div>pressure: <span style={{ color: '#ededed' }}>1016hPa</span></div>
            </div>

            <div style={{ textAlign: 'center', color: '#555555', fontSize: '11px' }}>
              type · ↑↓ navigate · enter select · esc clear · b back · q quit
            </div>
          </div>
        </div>

        {/* Feature Cards Grid (4 items) */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '12px',
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Data Source
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>
              Open-Meteo Powered
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
              Direct access to global high-resolution meteorological models. Fast geocoding and forecasting.
            </p>
          </div>

          <div
            style={{
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '12px',
                color: '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Zero Overhead
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>
              No API Keys
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
              Zero account creation, zero tokens to manage, zero telemetry. Install and immediately query any city.
            </p>
          </div>

          <div
            style={{
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '12px',
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Deep Coverage
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>
              7-Day Forecast & Hourly
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
              6-hour granular timeline with precipitation chance, plus complete 7-day outlook with highs and lows.
            </p>
          </div>

          <div
            style={{
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '12px',
                color: '#e0e0e0',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Dual Mode
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>
              Local Web Dashboard
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
              Run `gale --web` to launch the obsidian black browser UI on localhost:3000 with interactive controls.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #222222',
          padding: '24px',
          maxWidth: '1040px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#555555',
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        <div>
          <span>MIT License © </span>
          <a
            href="https://github.com/carbonthecoder"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888888' }}
          >
            carbonthecoder
          </a>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a
            href="https://github.com/carbonthecoder/GALE"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888888' }}
          >
            GitHub
          </a>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888888' }}
          >
            Open-Meteo
          </a>
        </div>
      </footer>
    </div>
  );
}
