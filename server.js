const http = require('http');
const fs = require('fs');
const path = require('path');

// Log file path
const logFilePath = path.join(__dirname, 'server.log');

// Helper function to log data
function logData(ip, event) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - IP: ${ip} - Outcome: ${event}\n`;
    fs.appendFileSync(logFilePath, logEntry);
}

// Serve the /getbalance route
function handleGetBalance(req, res) {
    const ip = req.socket.remoteAddress;
    const randomNumber = Math.random();

    if (randomNumber < 0.2) {
        // 20% chance to timeout (simulate by doing nothing)
        logData(ip, 'Timeout');

    } else if (randomNumber < 0.4) {
        // 20% chance to return 403 Forbidden
        logData(ip, '403 Forbidden');
        res.statusCode = 403;
        res.end('403 Forbidden');
    } else if (randomNumber < 0.5) {
        // 10% chance to return 500 Internal Server Error
        logData(ip, '500 Internal Server Error');
        res.statusCode = 500;
        res.end('500 Internal Server Error');
    } else {
        // 50% chance to return 200 OK with HTML/CSS content
        logData(ip, '200 OK');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
      <html lang="en">
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .balance { color: green; font-size: 24px; }
          </style>
          <title>HW</title>
        </head>
        <body>
          <h1>Account Balance</h1>
          <p class="balance">$1234.56</p>
        </body>
      </html>
    `);
    }
}

// Serve the /getLogs route
function handleGetLogs(req, res) {
    if (fs.existsSync(logFilePath)) {
        const logData = fs.readFileSync(logFilePath, 'utf8');
        const logEntries = logData.split('\n').filter(entry => entry !== '');
        const logJson = logEntries.map(entry => {
            const [timestamp, , ip, , outcome] = entry.split(' - ');
            return { timestamp, ip, outcome };
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(logJson));
    } else {
        res.statusCode = 200;
        res.end('[]');
    }
}

// Create the server
const server = http.createServer((req, res) => {
    if (req.url === '/getbalance' && req.method === 'GET') {
        handleGetBalance(req, res);
    } else if (req.url === '/getlogs' && req.method === 'GET') {
        handleGetLogs(req, res);
    } else {
        res.statusCode = 404;
        res.end('404 Not Found');
    }
});

// Start the server on port 3000 (or any other port)
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
