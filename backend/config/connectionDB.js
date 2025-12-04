const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database", err);
    });
};

module.exports = connectDB;
