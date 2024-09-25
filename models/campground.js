const mongoose= require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');

const campSchema = new Schema({
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
        type: String,
    },

    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
})

campSchema.post('findOneAndDelete',async (camp)=>{
    await Review.deleteMany({
        _id : {$in :camp.reviews}
    })
})

const Camp = mongoose.model('Camp',campSchema); //err => Model

module.exports = Camp;