const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  image: { type: String },
});

exports.User = mongoose.model("User", userSchema);
