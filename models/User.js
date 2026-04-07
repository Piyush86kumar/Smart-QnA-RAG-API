const mongoose = require('mongoose');
const bcrypt = require('bcryotjs');

/**
 * User — stores credentials for JWT authentication.
 * Passwords are NEVER stored in plain text (bcrypt hashes them).
 */

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries unless explicitly asked
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: hash password before storing.
 * WHY a hook? So we never forget to hash — it's automatic.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if changed
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method: compare plain password with stored hash.
 * Keeps auth logic close to the model that owns it.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
