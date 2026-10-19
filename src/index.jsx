import React from 'react';
import { render } from 'ink';
import App from './app.jsx';
import { startServer } from './server.js';

const args = process.argv.slice(2);
if (
  args.includes('--web') ||
  args.includes('-w') ||
  args.includes('serve') ||
  args.includes('--server')
) {
  const portIdx = args.findIndex((a) => a === '--port' || a === '-p');
  const port =
    portIdx !== -1 && args[portIdx + 1]
      ? parseInt(args[portIdx + 1], 10)
      : 3000;
  startServer(port);
} else {
  render(<App />);
}
