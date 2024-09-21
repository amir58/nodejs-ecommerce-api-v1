const express = require( "express" );
const dotenv = require( "dotenv" );
const morgan = require( "morgan" );

dotenv.config( { path: "config.env" } );

const ApiError = require( "./utils/apiError" );
const globalError = require( "./middlewares/errorMiddleware" );
const dbConnection = require( "./config/database" );
// Routes
const categoryRoute = require( "./routes/categoryRoute" );
const subCategoryRoute = require( "./routes/subCategoryRoute" );
const brandRoute = require( "./routes/brandRoute" );
const productRoute = require( "./routes/productRoute" );

// Connect with DB
dbConnection();

// Express App
const app = express();

// Middleware
app.use( express.json() );

if ( process.env.MODE_ENV === "development" ) {
  app.use( morgan( "dev" ) );
}

// Routes
app.use( "/api/v1/categories", categoryRoute );
app.use( "/api/v1/subCategories", subCategoryRoute );
app.use( "/api/v1/brands", brandRoute );
app.use( "/api/v1/products", productRoute );

// Run when call route not found
app.all( "*", ( req, res, next ) => {
  // Create error and send it to error handling middleware
  // const error = new Error(`Cant find ${req.originalUrl} on this server`);
  next( new ApiError( `Cant find ${ req.originalUrl } on this server`, 404 ) );
} );

// Global error handling middleware
app.use( globalError );

app.get( "/", ( req, res ) => {
  res.send( "Our, API V1 ✅" );
} );

app.get( "/ping", ( req, res ) => {
  res.send( "🚀" );
} );

// app.get("/cities", (req, res) => {
//   res.send({
//     code: 200,
//     message: "",
//     data: ["Cairo", "Alexandria", "Mansoura", "Ismalia"],
//   });
// });

// const PORT = process.env.PORT;
const { PORT } = process.env;

const server = app.listen( PORT, () => {
  console.log( `App Running on port ${ PORT }` );
} );

// Handle unhandled promise rejections outside express
process.on( "unhandledRejection", ( err ) => {
  console.error( err.name, err.message );

  server.close( () => {
    console.error( "UNHANDLED REJECTION! 💥 Shutting down..." );
    process.exit( 1 );
    // In porduction the server have tools to restart
  } );
} );
