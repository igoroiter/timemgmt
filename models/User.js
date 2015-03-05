var bcrypt = require('bcrypt-nodejs'),
    mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email : String,
    password : String,
    googleId: String,
    displayName: String,
    linkedinId: String
});

userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};

userSchema.methods.comparePasswords= function(pwd, callback) {
    bcrypt.compare(pwd, this.password, callback);
}

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
});

module.exports = mongoose.model('User', userSchema);