import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // hidden by default
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

// Hash password before saving, only if it changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to compare plaintext vs hashed
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

userSchema.methods.generateTemporaryToken=function(){
  const unHashedToken =crypto.randomBytes(20).toString("hex")
  
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")


  const tokenExpiry = Date.now() + (20*60*1000)
  return {unHashedToken,hashedToken,tokenExpiry};

}
export const User = mongoose.model("User", userSchema);


// Why select: false on password/refreshToken: prevents them from leaking in normal find()/findById() calls unless you explicitly .
// select("+password"). Small habit, saves you from an accidental data leak.