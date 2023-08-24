/**
 * Entry point for the SSHConnection React application.
 *
 * Renders the SSHConnection component and attaches it to the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import SSHConnection from './frontend';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SSHConnection />
  </React.StrictMode>
);
