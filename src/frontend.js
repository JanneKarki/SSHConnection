/**
 * SSHConnection React Component.
 *
 * Provides a user interface for establishing SSH connections,
 * sending commands, and viewing the results in a terminal-like display.
 * Utilizes the 'socket.io' library for real-time communication with the backend.
 */

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const socket = io('http://localhost:3001');


function SSHConnection() {
  const [ip, setIP] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [command, setCommand] = useState('');
  const [port, setPort] = useState('22'); 
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const [uiMessage, setUIMessage] = useState('');
  const bufferRef = useRef('');

   /**
     * Establish an SSH connection using provided credentials.
     */
  const handleConnect = () => {
      socket.emit('ssh-login', { ip, username, password, port });
      
  };

   /**
     * Disconnect the existing SSH session.
     */
  const handleDisconnect = () => {
      socket.emit('ssh-logout');
  };

   /**
     * Send command to the connected SSH session.
     */
  const handleCommand = () => {
      socket.emit('command', command);
      setCommand('');
  };


      useEffect(() => {
        if (!terminal.current) {
          terminal.current = new Terminal({
            rows: 20,
            cols: 80,
            scrollback: 1000,
          });
          terminal.current.open(terminalRef.current);
    
          terminal.current.onKey(({ key, domEvent }) => {
            socket.emit('keypress', key);
            bufferRef.current += key; 
            if (domEvent.keyCode === 13) {
              handleCommand();
              setCommand('');
            }
          });
        }
    
        socket.on('output', message => {
          terminal.current.write(message);
          bufferRef.current = message;
          console.log(bufferRef)
        });

        socket.on('ui-message', message => {
          setUIMessage(message);
          setTimeout(() => {
            setUIMessage('');
          }, 3000);
        });

        socket.on('clear-terminal', () => {
          if (terminal.current) {
            terminal.current.write('\x1bc');
          }
        });
    
        return () => {
          socket.off('output');
        };
      }, []);

   /**
     * Render the UI for SSH connection establishment, command input, and display terminal.
     */
  return (
    <div>
    <input value={ip} onChange={e => setIP(e.target.value)} placeholder="IP-address" />
    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
    <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
    <input value={port} onChange={e => setPort(e.target.value)} placeholder="Portti" />
    <button onClick={handleConnect}>Connect</button>
    <button onClick={handleDisconnect}>Disconnect</button>
    <div ref={terminalRef} style={{ height: '400px', width: '60%' }}></div>
    <div style={{ color: 'red', marginBottom: '10px' }}>{uiMessage}</div>
    </div>
  );
}

export default SSHConnection;
