const mongoose= require('mongoose');

const campSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true,
    },
    price:{
        type:Number,
        // required : true,
    },
    description:{
        type: String,
        // required : true,
    },
    location:{
        type: String,
        // required : true,
    },
    imageSrc:{
        type:String,
    }
})

const Camp = mongoose.model('Camp',campSchema); //err => Model

module.exports = Camp;