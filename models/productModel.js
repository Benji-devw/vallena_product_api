// ROUTE 4
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema(
  {
    imgCollection: { type: Array },
    titleProduct: { type: String },
    categoryProduct: { type: String, required: false },
    descriptionProduct: { type: String, required: false },
    size_fit: { type: Array, required: false },
    method: { type: Array, required: false },
    priceProduct: { type: Number, required: false },
    sizeProduct: { type: Array, required: false },
    weightProduct: { type: String, required: false },
    quantityProduct: { type: Number, required: false },
    stockProduct: { type: Boolean, required: false },
    promotionProduct: { type: Boolean, required: false },
    reporterProduct: { type: String, required: false },
    tags: { type: String, required: false },
    matter: { type: String, required: false },
    composition: { type: String, required: false },
    fabrication: { type: String, required: false },
    color: { type: Array, required: false },
    entretien: { type: String, required: false },
    novelty: { type: Boolean, required: false },
    oldPriceProduct: { type: Number, required: false },
    displaySlideHome: { type: Boolean, required: false },
    yearCollection: { type: Number, required: false },
    visible: { type: Boolean },
    notes: { type: Number },
    comments: { type: Array }
  },
  { date: { type: Date, default: Date.now } },
  { timestamps: true },   // Date post
)

module.exports = mongoose.model('product', Product)
