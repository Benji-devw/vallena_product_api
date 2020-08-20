// ROUTE 4
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema(
    {
        imgCollection: { type: Array },
        titleProduct: { type: String },
        categoryProduct: { type: String, required: false },
        descriptionProduct: { type: String, required: false },
        priceProduct: { type: Number, required: false },
        sizeProduct: { type: String, required: false },
        weightProduct: { type: String, required: false },
        quantityProduct: { type: Number, required: false },
        stockProduct: { type: Boolean, required: false },
        promotionProduct: { type: Boolean, required: false },
        reporterProduct: { type: String, required: false },
        visible: {type: Boolean},
        notes: {type: Number},
        comments: {type: Array}
    },
    { date: { type: Date, default: Date.now } },
    { timestamps: true },   // Date post
)

module.exports = mongoose.model('product', Product)
