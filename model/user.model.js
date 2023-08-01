const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, minLength: 3 },
  firstname: { type: String, required: true, minLength: 3 },
  lastname: { type: String, required: true, minLength: 3 },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => {
        return value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g);
      },
      message: "please enter valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  gender: {
    type: String,
    enum: {
      values: ["not-set", "male", "female"],
      message: "invalid gender ({VALUE}): gender is eather male or female",
    },
    default: "not-set",
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "blogger"],
      message: "invalid role ({VALUE}): role is eather blogger or admin",
    },
    default: "blogger",
    lowercase: true,
    trim: true,
  },
});

module.exports = model("User", userSchema);
