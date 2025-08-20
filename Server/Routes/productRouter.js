const express = require("express")
const router = express.Router()
// ----------- Model -----------
const order = require("../Models/orderModel")
const product = require("../Models/productModel")
const user = require("../Models/userModel")
// ----------- config -----------
const upload = require("../config/multerConfig")
// ----------- Packages -----------
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



router.get("/", async (req, res)=> {
    res.send("Hey product route is working")
})


// ------------------- View Product -------------------


router.get("/viewProducts/:category", async (req, res) => {
    try {
        const products = await product.find({ category: req.params.category })
        const productsWithImage = products.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            success: true,
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Some Error Occured"
        })
        console.log(error)
    }
})

// ------------------- Add to cart -------------------

router.post("/add-to-cart", async (req, res) => {
    try {
        const foundUser = await user.findById(req.body.userid);
        foundUser.cart.push(req.body.productId)
        foundUser.save()
        res.json({
            message: "Added to cart"
        })
    } catch (error) {
        res.json({
            message: "Something went wrong"
        })
    }
}) 

// ------------------- Get cart -------------------


router.get("/cart/get/:id", async (req, res) => {
    try {
        const foundUser = await user.findById(req.params.id).populate('cart')
        const productsWithImage = foundUser.cart.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            message: "Data Sent Successfully",
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            message: "Something went wrong"
        })
    }
}) 

// ------------------- Remove from cart -------------------


router.get("/cart/:user/remove/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.user)
        userFound.cart.splice(userFound.cart.indexOf(req.params.id), 1);
        userFound.save()
        res.json({
            message: "Removed from cart"
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Something went wrong"
        })
    }
}) 


module.exports = router