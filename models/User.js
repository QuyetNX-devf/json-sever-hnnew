const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  account: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  info: {
    userName: {
      type: String,
      required: true,
    },
    avatar: String,
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
