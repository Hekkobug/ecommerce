const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required:  [true,'describe'],
    },
    lastname: {
        type: String,
        required: [true,'describe'],
    },
    email: {
        type: String,
        required: [true,'describe'],
        unique: true
    },
    mobile: {
        type: String,
        required: [true,'describe'],
        unique: true,
    },
    password: {
        type: String,
        required: [true,'describe'],
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    }
},{
    timestamps: true
});

userSchema.pre('save',async function (){
    if(!this.isModified('password')){
        next()
    }
    const sait = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,sait)
})

//Export the model
module.exports = mongoose.model('User', userSchema);