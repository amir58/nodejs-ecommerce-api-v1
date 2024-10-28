const path = require( "path" );

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
const userRoute = require( "./routes/userRoute" );
const authRoute = require( "./routes/authRoute" );
const reviewRoute = require( "./routes/reviewRoute" );
const wishlistRoute = require( "./routes/wishlistRoute" );
const addressRoute = require( "./routes/addressRoute" );
const couponRoute = require( "./routes/couponRoute" );
const cartRoute = require( "./routes/cartRoute" );
const orderRoute = require( "./routes/orderRoute" );

// Connect with DB
dbConnection();

// Express App
const app = express();

// Middleware
app.use( express.json() );
app.use( express.static( path.join( __dirname, "uploads" ) ) );

if ( process.env.MODE_ENV === "development" ) {
  app.use( morgan( "dev" ) );
}

// Routes
app.get( "/", ( req, res ) => { res.send( "Our, API V1 ✅" ); } );
app.get( "/ping", ( req, res ) => { res.send( "🚀" ); } );
app.use( "/api/v1/categories", categoryRoute );
app.use( "/api/v1/subCategories", subCategoryRoute );
app.use( "/api/v1/brands", brandRoute );
app.use( "/api/v1/products", productRoute );
app.use( "/api/v1/users", userRoute );
app.use( "/api/v1/auth", authRoute );
app.use( "/api/v1/reviews", reviewRoute );
app.use( "/api/v1/wishlist", wishlistRoute );
app.use( "/api/v1/addresses", addressRoute );
app.use( "/api/v1/coupons", couponRoute );
app.use( "/api/v1/cart", cartRoute );
app.use( "/api/v1/orders", orderRoute );

// Run when call route not found
app.all( "*", ( req, res, next ) => {
  // Create error and send it to error handling middleware
  // const error = new Error(`Cant find ${req.originalUrl} on this server`);
  next( new ApiError( `Cant find ${ req.originalUrl } on this server`, 404 ) );
} );

// Global error handling middleware
app.use( globalError );

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
