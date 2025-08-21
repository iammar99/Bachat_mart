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
    res.send("Hey admin is working")
})


router.post('/add-products', upload.single('img'), async (req, res) => {
    try {
        const { name, category, price, oldPrice, bg, panelBg, description } = req.body;
        const imgBuffer = req.file.buffer;

        console.log(req.file.buffer);
        const newProduct = await product.create({
            name,
            description,
            category,
            price,
            oldPrice: oldPrice || null,
            bg,
            panelBg,
            img: imgBuffer,
        });


        res.json({ success: true, message: 'Product added successfully', productId: newProduct._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to upload product' });
    }
});


router.get("/viewProducts", async (req, res) => {
    try {
        const products = await product.find({})
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
    }
})


router.get("/orders", async (req, res) => {
    try {
        const orders = await order.find()
            .populate({
                path: 'items.id',
                model: 'Product'
            })
            .sort({ createdAt: -1 });

        const ordersWithFlattenedItems = orders.map(orderItem => {
            const flattenedItems = orderItem.items.map(item => {
                let processedProduct = { ...item.id._doc };

                // Debug logging to see what we're working with
                // console.log('Item structure:', {
                //     hasId: !!item.id,
                //     hasImg: !!item.id?.img,
                //     imgType: typeof item.id?.img,
                //     imgKeys: item.id?.img ? Object.keys(item.id.img) : null
                // });

                // Multiple approaches to handle different image buffer formats
                let imgSrc = null;

                if (item.id && item.id.img) {
                    try {
                        let buffer;

                        // Case 1: img is {type: 'Buffer', data: Array}
                        if (item.id.img.type === 'Buffer' && item.id.img.data) {
                            buffer = Buffer.from(item.id.img.data);
                        }
                        // Case 2: img is already a Buffer object
                        else if (Buffer.isBuffer(item.id.img)) {
                            buffer = item.id.img;
                        }
                        // Case 3: img.buffer exists (some MongoDB drivers)
                        else if (item.id.img.buffer) {
                            buffer = item.id.img.buffer;
                        }
                        // Case 4: Direct data array
                        else if (Array.isArray(item.id.img)) {
                            buffer = Buffer.from(item.id.img);
                        }

                        if (buffer && buffer.length > 0) {
                            const imgBase64 = buffer.toString('base64');
                            imgSrc = `data:image/png;base64,${imgBase64}`;
                            console.log('Successfully converted image, base64 length:', imgBase64.length);
                        } else {
                            console.log('No valid buffer found for image');
                        }
                    } catch (error) {
                        console.error('Error converting image:', error);
                    }
                }

                processedProduct.img = imgSrc;

                // Flatten: spread all product properties + add quantity
                return {
                    ...processedProduct,
                    quantity: item.quantity,
                    itemId: item._id
                };
            });

            return {
                ...orderItem._doc,
                items: flattenedItems
            };
        });

        res.json({
            success: true,
            data: ordersWithFlattenedItems,
            message: "Orders fetched successfully"
        });
    } catch (error) {
        console.error('Admin orders error:', error);
        res.json({
            success: false,
            message: "Some Error Occurred"
        });
    }
});

router.get("/orders/:id/delete", async (req, res) => {
    try {
        const orderFound = await order.findByIdAndDelete(req.params.id)
        const userFound = await user.findById(orderFound.userId)
        userFound.orders.splice(userFound.cart.indexOf(orderFound.userId), 1);
        userFound.save()
        res.json({
            success: true,
            message: "Deleted successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Some Error Occurred"
        })
    }
})


router.post("/orders/:id/status", async (req, res) => {
    try {
        const orderFound = await order.findById(req.params.id)
        orderFound.status = req.body.status.toLowerCase()
        orderFound.save()
        res.json({
            success: true,
            message: "Nothing went wrong"
        })
        // res.redirect(`/user/profile/${orderFound.userId}`);
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Something went wrong"
        })
    }
})



module.exports = router