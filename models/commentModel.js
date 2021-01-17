// ROUTE 4
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Comment = new Schema(
    {
        orderNumber: { type: String, required: false },
        idProduct: { type: String, required: false },
        by: { type: String, required: false },
        messageTitle: { type: String, required: false },
        message: { type: String, required: false },
        note: { type: String, required: false },
        dateBuy: { type: String, required: false },
        datePost: { type: String, required: false },
        status: { type: Boolean, required: false },
    }
)

module.exports = mongoose.model('comment', Comment)
