const mongoose = require( "mongoose" );

const dbConnection = () => {
  mongoose
    .connect( process.env.DB_URI )
    .then( ( connection ) => {
      console.log( `Database connected with ${ connection.connections[ 0 ].host }` );
    } );
};

module.exports = dbConnection;
