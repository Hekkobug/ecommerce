const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    image: [
        {
            type: String,
            default: 'https://img.freepik.com/free-vector/isometric-e-commerce_23-2148554981.jpg?w=996&t=st=1718189192~exp=1718189792~hmac=ae5fe3628e79458f2961ffd0b826019e72ae97baf9c0b527abe6948cbb4af0ac',
        }
    ],
    author: {
        type: String,
        default: 'Admin',
    },
},{
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true},
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);