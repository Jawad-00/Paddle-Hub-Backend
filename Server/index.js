const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const courtRoutes = require('./routes/court.routes');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Padel Hub API");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
