const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema: Qaybtan waxay qeexaysaa qaabka xogta isticmaalaha loogu kaydinayo Database-ka
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Magaca isticmaalaha
  email: { type: String, required: true, unique: true }, // Email-ka (waa inuu ahaado mid gaar ah)
  phone: { type: String }, // Lambarka telefoonka
  password: { type: String, required: true }, // Password-ka (waa inuu ku jiraa)
  role: { 
    type: String, 
    enum: ['user', 'staff', 'cashier', 'accountant', 'admin', 'superadmin'], // Darajooyinka nidaamka ka jira
    default: 'user' 
  }
}, { timestamps: true }); // Waxay si otomaatig ah u daraysaa xilligii la sameeyay (createdAt)

// Password Hashing: Qaybtan waxay xifdinaysaa (hash) password-ka ka hor intaanan lagu kaydin Database-ka si loo sugo amniga
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // Hadii password-ka aan wax laga bedelin, iska dhaaf
  this.password = await bcrypt.hash(this.password, 10); // Lagu xifdinayo bcrypt
});

// Compare Password: Function lagu barbardhigayo password-ka uu qofka soo galiyay iyo midka xifdisan
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
