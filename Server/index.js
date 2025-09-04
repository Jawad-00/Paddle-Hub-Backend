const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const courtRoutes = require('./routes/court.routes');

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/courts', courtRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Padel Hub API');
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
