const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "describe"],
    },
    lastname: {
      type: String,
      required: [true, "describe"],
    },
    email: {
      type: String,
      required: [true, "describe"],
      unique: true,
    },
    avatar: {
      type: String,
    },
    mobile: {
      type: String,
      required: [true, "describe"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "describe"],
    },
    role: {
      type: String,
      enum:[777,111],
      default: 111,
    },
    cart: [{
      product: {type: mongoose.Types.ObjectId, ref: "Product"},
      quantity: Number,
      color: String,
      price: Number,
      thumbnail: String,
      title: String,
    }],
    address: String,
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const sait = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, sait);
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangeToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
