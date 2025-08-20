const mongoose = require("mongoose")


const productSchema = mongoose.Schema({
    name: String,
    img: {
        type: Buffer
    },
    description: String,
    category: String,
    price: Number,
    oldPrice: Number,
    bg: String,
    panelBg: String
})

const productModel = mongoose.model("Product", productSchema)

module.exports = productModel