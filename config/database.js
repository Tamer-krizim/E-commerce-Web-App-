const mongoose = require("mongoose");

const DBconnection = (_) => {
  // connecting to mongoDB
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`DATABASE CONNECTED: ${conn.connection.host}`);
  });
  // .catch((error) => {
  //   console.error(`DATABASE ERORR: ${error}`);
  //   process.exit(1);
  // });
};

module.exports = DBconnection;
