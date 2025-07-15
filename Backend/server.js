const express = require("express");
const app = express();
const uploadRoutes = require("./routes/upload");

require("dotenv").config();

app.use(express.json());
app.use("/upload", uploadRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
