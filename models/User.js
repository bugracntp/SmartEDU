const mongoose = require('mongoose');

const bcrypt = require('bcrypt');// şifreleri criptlolamak için kullandığımız kütüphane

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
      type:String,
      required: true
  }
});

// burada ilgili elemanı şifrelemek için kütüğhane yardımıyla hashing gerçekleşiyor
UserSchema.pre('save', function (next){
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    })
})

const User = mongoose.model('User', UserSchema);
module.exports = User;