const mongoose = require("mongoose")



const userSchema = mongoose.Schema({
    email: String,
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    contact: String,
    profileImg: {
        type: Buffer,
        default: "default.png"
    },
    role: {
        type: String,
        default: "user"
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    address: {
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String
        },
        country: {
            type: String
        },
    }
}, { timestamps: true })


const userModel = mongoose.model("User", userSchema)


module.exports = userModel