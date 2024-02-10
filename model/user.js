// Requiring Packages
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Schema = mongoose.Schema;
let userSchema = new Schema({
  userName: {
    type: String,
  },
  userShortName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  password: {
    type: String,
  },
  userMobileNumber: {
    type: String,
  },
  userProfilePicture: {
    type: String,
  },
  userType: {
    type: String,
    default: "user",
  },
  userToken: {
    type: String,
    default: "not Taken",
  },
});

// Only password Encryption Handler
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  let salt = await bcrypt.genSalt(10);
  let encryptedPassword = await bcrypt.hash(this.password, salt);
  this.password = encryptedPassword;
  next();
});

module.exports = mongoose.model("User", userSchema);
