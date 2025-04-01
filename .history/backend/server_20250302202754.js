const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });
console.log("Database URL:", process.env.PORT); // Debugging

if (!process.env.DATABASE) {
    console.error("❌ DATABASE environment variable is missing");
    process.exit(1);
}

// Replace the password placeholder
const DB = process.env.DATABASE.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to MongoDB
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ DB connection successful!'))
    .catch(err => console.error('❌ DB connection error:', err));

const server = http.createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
