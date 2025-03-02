
let server = require('http').createServer();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');  // Express app
const setupSocket = require('./websocket/websocket');  // WebSocket setup

dotenv.config({ path: './config.env' });

// Database connection
if (!process.env.DATABASE) {
    throw new Error('DATABASE environment variable is not defined');
}

const DB = process.env.DATABASE.replace(
    '<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
    console.log('DB connection successful!');
});



server.on('request', app);

setupSocket(server);

const Port = process.env.PORT || 3000;
server.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});
