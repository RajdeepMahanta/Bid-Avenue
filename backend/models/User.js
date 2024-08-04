const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  // username, email, password
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Users",
  }
);
module.exports = mongoose.model("Users", userSchema);
