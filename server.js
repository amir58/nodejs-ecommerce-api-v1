const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");

// Connect with DB
dbConnection();

// Express App
const app = express();

// Middleware
app.use(express.json());

if (process.env.MODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRoute);

// Run when call route not found
app.all("*", (req, res, next) => {
  // Create error and send it to error handling middleware
  // const error = new Error(`Cant find ${req.originalUrl} on this server`);
  next(new ApiError(`Cant find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalError);

app.get("/", (req, res) => {
  res.send("Our, API V1 ✅");
});

app.get("/ping", (req, res) => {
  res.send("🚀");
});

// app.get("/cities", (req, res) => {
//   res.send({
//     code: 200,
//     message: "",
//     data: ["Cairo", "Alexandria", "Mansoura", "Ismalia"],
//   });
// });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});
