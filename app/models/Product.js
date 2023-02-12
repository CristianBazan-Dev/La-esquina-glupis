const { model, Schema, default: mongoose } = require('mongoose')

const newProduct = new Schema({
    category: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false 
    },
    product: {
        type: String,
        required: true
    },
    stock:{
        type: String,
        required: true 
    },
    minStock: {
        type: String,
        required: false
    },
    dateOff: {
        type: Date,
        required: false
    },
    description: {
        type: String, 
        required: false  
    }
});

module.exports = model('Product', newProduct)