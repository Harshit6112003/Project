const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const sendRoutes = require('./routes/send');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use( uploadRoutes);
app.use( sendRoutes);

// ✅ 404 handler must go after all routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
