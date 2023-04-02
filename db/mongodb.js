const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_CONNECTION_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("get error while connecting to db", error);
  });
