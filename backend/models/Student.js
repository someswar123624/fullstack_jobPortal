const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
studentSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
