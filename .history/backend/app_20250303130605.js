const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Adjust based on frontend URL
  credentials: true, // Allows cookies to be sent with requests
}));
