const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database Not Connected", err));

const app = express();

// Middleware to read JSON data
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/image", express.static("public"));

app.use("/", require("./routes/authRoutes"));

const port = 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
