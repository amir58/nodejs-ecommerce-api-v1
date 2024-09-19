const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log(`Database connected with ${mongoose.connections.host}`);
    });
};

module.exports = dbConnection;
