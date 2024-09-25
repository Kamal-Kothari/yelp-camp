const Joi = require('joi');

const campSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required(),
        price : Joi.number().min(0).required(),
        imageSrc : Joi.string().required(),
        location : Joi.string().required(),
        description : Joi.string().required()
    }).required()
})

module.exports = campSchema;