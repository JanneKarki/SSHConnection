# SSHConnection App

The SSHConnection application is a web-based interface designed to facilitate real-time SSH interactions with remote servers directly from a browser. Integrated with the 'xterm' library, the app provides a live terminal experience. Whether a connection is successfully established, terminated, or if there's an error, feedback is promptly displayed to the user. The app's frontend communicates in real time with its backend using 'socket.io'. This backend is responsible for actual SSH operations, leveraging the 'ssh2' library to establish connections, execute commands, and relay the results back to the frontend. In essence, application serves as a bridge, allowing users to interact with remote servers via SSH directly from their web browsers.


## Setup

### Cloning the Repository:

1. **Open Terminal or Command Prompt**:
    - On macOS and Linux: Open the Terminal application.
    - On Windows: Open Command Prompt or use Git Bash (if installed).

2. **Clone the Repository**:
   ```bash
   git clone git@github.com:JanneKarki/SSHConnection.git
2. **Navigate to the Directory:**
   ```bash
   cd SSHConnection

### **Installing Dependencies:**

1. **Install Node.js:**
 - If you haven't installed Node.js yet, download and install it from Node.js official site.

2. **Install Project Dependencies:**
  ```bash
    npm install
  ```
## Running the App:
1. **Start the Backend:**
   
   Open a new Terminal or Command Prompt window, navigate to the SSHConnection directory and start the backend server with:
```bash
  npm run server
```
2. **Start the Frontend:**
   
   In another Terminal or Command Prompt window (while keeping the backend one running), navigate to the SSHConnection directory and start the React development server with:
```bash
  npm start
```
3. **Access the Application**
   
   After starting both the frontend and backend, open a web browser and navigate to:
```bash
  http://localhost:3000/
```

   
