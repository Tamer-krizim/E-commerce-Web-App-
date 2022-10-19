const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
// ERROR Handeler
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");

// DataBase Conniction
const DBconnection = require("./config/database");

// Routes =>
const categoryRoute = require("./routes/categoryRoute");
const subCategoriesRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");

// DB connetion {Mongoe}
DBconnection();

const app = express();

// Middelware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
  console.log(`App Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
const ROOT_DIR = "/api/v1";
app.use(`${ROOT_DIR}/categories`, categoryRoute);
app.use(`${ROOT_DIR}/subcategories`, subCategoriesRoute);
app.use(`${ROOT_DIR}/brands`, brandRoute);
app.use(`${ROOT_DIR}/products`, productRoute);

// Catching all {*} route that not handeld
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handler Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("server is rannign");
});

/**
 * @desc listen to any ERROR out side of Express to chack it.
 * @ex Events => list => callback(err)
 */
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection ERORR: ${err.name} | ${err.message}`);
  // Close the server first to wait any {req} then shutting down the server
  server.close(() => {
    console.error(`Shutting Down...`);
    process.exit(1);
  });
});
