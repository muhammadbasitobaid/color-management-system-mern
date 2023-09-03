const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 100;

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 255;

const shadeToneSchema = mongoose.Schema({
    value: {
        type: Number,
        required: true,

    },
    image: {
        type: String,
        min: MIN_TITLE_LENGTH,
        max: MAX_TITLE_LENGTH,
    }
})

const colorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: MAX_TITLE_LENGTH,
    },
    shadesTones: [shadeToneSchema]
})

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: MIN_TITLE_LENGTH,
        max: MAX_TITLE_LENGTH,
    },
    description: {
        type: String,
        min: MIN_DESCRIPTION_LENGTH,
        max: MAX_DESCRIPTION_LENGTH,
    },
    colors: [colorSchema]
});

const Product = mongoose.model('products', productSchema);

function validateProduct(data) {
    const shadeToneValidator = Joi.object({
        value: Joi.number().required(),
        image: Joi.string().required().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),

    })

    const colorsValidator = Joi.object({
        name: Joi.string().required().min(3).max(MAX_TITLE_LENGTH),
        shadesTones: Joi.array().items(shadeToneValidator),

    })
    const validator = Joi.object({
        title: Joi.string().required().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),
        description: Joi.string()
            .allow('')
            .min(MIN_DESCRIPTION_LENGTH)
            .max(MAX_DESCRIPTION_LENGTH),
        colors: Joi.array().items(colorsValidator),
    });

    return validator.validate(data);
}

module.exports = { Product, validateProduct };
