const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config");

//db connection
require("./db/mongodb");

app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use(
  "/user/images",
  express.static(__dirname + `/${process.env.USER_PROFILE_FOLDER}`)
);

app.use(morgan("dev"));

app.use(`/api/v1/user`, require("./controller/user.controller"));

const port = process.env.SERVER_PORT || 3000;

console.log(process.env.SERVER_PORT);

app.listen(port, () => {
  console.log("server is running on port:", port);
});
