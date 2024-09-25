const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema({
    // review:{
    //     type: String,
    //     required: true,
    // },
    // rating :{
    //     type: Number,
    //     required: true,

    // }
    body : String,
    rating : Number,
})

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;