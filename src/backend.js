/**
 * SSH Connection Server.
 *
 * Listens for SSH connection requests from the frontend,
 * establishes SSH connections, listens for command input,
 * and sends the results back to the frontend.
 * Utilizes 'socket.io' for real-time communication and 'ssh2' for SSH connections.
 */
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const { Client } = require('ssh2');
app.use(express.static('build'));



io.on('connection', socket => {
     /**
     * Establishes an SSH connection using provided credentials.
     */
    socket.on('ssh-login', async data => {

        socket.emit('clear-terminal');
       
        if (socket.ssh) {
            socket.emit('ui-message', 'Connected already.');
            return;
        }

        const ssh = new Client();
        socket.ssh = ssh; 
        
        ssh.on('ready', () => {
            ssh.shell((err, stream) => {
                if (err) {
                    socket.emit('ui-message', `Error: ${err.message}`);
                    return;
                }

                stream.removeAllListeners('data');
                stream.removeAllListeners('close');

                socket.shellStream = stream;

                stream.on('data', (data) => {
                    const output = data.toString();
                    socket.emit('output', output);
                    if (output.trim().includes('exit')) {
                        socket.emit('clear-terminal');
                        socket.emit('ui-message', 'SSH disconnected.');
                    }

                }).on('close', () => {
                    if (socket.ssh) {
                        socket.ssh.end();
                        socket.emit('ui-message', 'SSH disconnected.');
                        socket.ssh = null;
                        socket.shellStream = null;
                    }
                });

                socket.emit('ui-message', 'SSH established.');
                console.log(`${data.ip} connection established`);
            });

        }).on('error', (err) => {
            console.error(`SSH Error: ${err.message}`);
            socket.emit('ui-message', `SSH Error: ${err.message}`);
            
            if (socket.ssh) {
                socket.ssh.end();
                socket.ssh = null;
                socket.shellStream = null;
            }


        }).connect({
            host: data.ip,
            port: data.port,
            username: data.username,
            password: data.password
        });
    });

    /**
     * Execute a command in the SSH session.
     */
    socket.on('command', command => {
        if (socket.shellStream) {
            socket.shellStream.write(command);
        } else {
            socket.emit('ui-message', 'Error: No active connection.');
        }
    });

    /**
     * Handles keypress events, sending them to the SSH session.
     */
    socket.on('keypress', key => {
        if (socket.shellStream) {
            socket.shellStream.write(key);
        } else {
            socket.emit('ui-message', 'Error: No active connection.');
        }
    });

    /**
     * Disconnect the SSH session.
     */
    socket.on('ssh-logout', () => {
        if (socket.shellStream) {
            socket.shellStream.end('exit\n');
        }
        if (socket.ssh) {
            socket.ssh.end();
            socket.ssh = null;
            socket.shellStream = null;
            socket.emit('clear-terminal');
            socket.emit('ui-message', 'SSH terminated.');
        }
    });

    /**
     * Clean up when socket disconnects.
     */
    socket.on('disconnect', () => {
        if (socket.shellStream) {
            socket.shellStream.end('exit\n');
        }
        if (socket.ssh) {
            socket.ssh.end();
            socket.ssh = null;
            socket.shellStream = null;
            socket.emit('clear-terminal');
            socket.emit('ui-message', 'SSH terminated.');
        }
       
    });
});


const port = 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
