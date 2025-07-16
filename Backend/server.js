const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
require('dotenv').config(); // Make sure this is at the top
const sendRoutes = require('./routes/send');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', uploadRoutes);
app.use('/api', sendRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
