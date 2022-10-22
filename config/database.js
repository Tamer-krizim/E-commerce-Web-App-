const mongoose = require("mongoose");

const DBconnection = (_) => {
  // connecting to mongoDB
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`DATABASE CONNECTED: ${conn.connection.host}`);
  });
};

module.exports = DBconnection;
