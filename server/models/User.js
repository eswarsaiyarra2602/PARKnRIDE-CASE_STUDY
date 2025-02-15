const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact : { type: Number, required: true },
  metroCard : { type: String, required: false },
  rides: [{ type: String, required: false }],
  parkingReservation: [{ type : String, required : false }], 
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  rewardCoins: { type: Number, default: 0 }
}, { timestamps: true });

// Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password Comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);