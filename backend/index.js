require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

const apiRoutes = require('./routes/api');

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 