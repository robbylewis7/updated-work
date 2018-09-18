'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passwordValidator = require('password-validator');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        minLength: 2,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    email: { type: String, required: true },
});

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .is().max(72)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});



userSchema.methods.serialize = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        username: this.username,
    };
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);


module.exports = { User, passwordSchema };