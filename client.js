const http = require('http');

// Helper function to make GET requests
function makeRequest(path, callback) {
    const options = {
        hostname: 'localhost', // Change this to the server's IP if needed
        port: 3000, // Change this to the server's port if needed
        path,
        method: 'GET'
    };

    const req = http.request(options, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            callback(data);
        });
    });

    req.on('error', error => {
        console.error(`Error: ${error.message}`);
    });

    req.end();
}

// Function to test the /getbalance route multiple times
function testGetBalance() {
    for (let i = 0; i < 10; i++) {
        makeRequest('/getbalance', data => {
            console.log(`Response: ${data}`);
        });
    }
}

// Function to get logs from /getlogs
function getLogs() {
    makeRequest('/getlogs', data => {
        console.log('Logs: ', JSON.parse(data));
    });
}

// Test the /getBalance route
testGetBalance();

// Fetch and display logs after testing
setTimeout(() => {
    console.log('Fetching logs...');
    getLogs();
}, 3000);
