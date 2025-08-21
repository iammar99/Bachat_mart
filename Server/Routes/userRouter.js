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



router.get("/", async (req, res) => {
    res.send("Hey it's working")
})

// ------------------- Logout --- ✔ -------------------


router.get("/logout", async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        path: "/"
    });
    console.log(req.cookies.token)
    res.json({ message: "Logged out successfully", success: true })
})

// ------------------- Login --- ✔ -------------------

router.post("/login", async (req, res) => {
    try {
        const userFound = await user.findOne({ email: req.body.email })
        if (userFound) {
            bcrypt.compare(req.body.password, userFound.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ email: userFound.email, id: userFound._id }, process.env.JWT_SECRET);
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "Lax",
                        secure: false,
                    });

                    if (userFound.profileImg != "default.png") {
                        const imgBase64 = userFound.profileImg.toString('base64');
                        const imgSrc = `data:image/png;base64,${imgBase64}`;
                        userFound.profileImg = imgSrc
                        console.log(userFound)
                        res.json({
                            success: true,
                            message: "Logged In",
                            user: userFound,
                            img: imgSrc
                        })
                    } else {
                        res.json({
                            success: true,
                            message: "Logged In",
                            user: userFound,
                        })
                    }

                }
                else {
                    res.json({
                        success: false,
                        message: "Wrong Password!"
                    })
                }
            });
        }
        else {
            res.json({
                success: false,
                message: "No User Found with such Email Address"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Something went wrong"
        })
    }
})

// ------------------- Register  --- ✔ -------------------


router.post("/register", async (req, res) => {
    const userFound = await user.findOne({ email: req.body.email })
    if (userFound) {
        res.json({
            success: false,
            message: "User Already Existed"
        })
        return
    }
    else {
        try {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const userCreated = await user.create({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                    })
                    const token = jwt.sign({ email: userCreated.email, id: userCreated._id }, process.env.JWT_SECRET);
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "Lax",
                        secure: false,
                    });
                    const imgBase64 = userCreated.profileImg.toString('base64');
                    const imgSrc = `data:image/png;base64,${imgBase64}`;
                    console.log(imgSrc)
                    userCreated.profileImg = imgSrc
                    res.json({
                        success: true,
                        message: "User Registered Successfully",
                        user: userCreated,
                        profileImg: imgSrc
                    })
                    console.log(userCreated)
                });
            });
        } catch (error) {
            console.log(error)
            res.json({
                success: false,
                message: "Something Went Wrong"
            })
        }
    }
})


// ------------------- Create Order --- ✔ -------------------

router.post("/orders/create", async (req, res) => {
    try {
        const userNewData = req.body.billingInfo
        const orderCreated = await order.create(req.body)
        const userFound = await user.findById(req.body.userId)
        userFound.orders.push(orderCreated._id)
        userFound.firstName = userNewData.firstName
        userFound.lastName = userNewData.lastName
        userFound.contact = userNewData.phone
        userFound.address.address = userNewData.address
        userFound.address.city = userNewData.city
        userFound.address.state = userNewData.state
        userFound.address.zipCode = userNewData.zipCode
        userFound.address.country = userNewData.country
        userFound.cart = []
        userFound.save()
        res.json({
            success: true,
            message: "Order Done"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Something Went wrong"
        })
    }
})


// ------------------- Profile Image update --- ✔ -------------------


router.post("/profile/:id/img", upload.single("profile"), async (req, res) => {
    try {
        // const imgBuffer = req.file.buffer;
        const userFound = await user.findById(req.params.id)
        userFound.profileImg = req.file.buffer
        userFound.save()
        res.json({
            success: true,
            message: "Nothing Went Wrong"
        })
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: "Something Went Wrong"
        })
    }
})

// ------------------- Profile data update --- ✔ -------------------


router.post("/profile/update/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
        userFound.firstName = req.body.firstName,
            userFound.lastName = req.body.lastName,
            userFound.contact = req.body.contact,
            userFound.email = req.body.email
        userFound.save()
        res.json({
            success: true,
            message: "Profile Updated"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Somthing went wrong"
        })
    }
})


// ------------------- Profile Password update --- ✔ -------------------


router.post("/profile/updatePassword/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
        bcrypt.compare(req.body.oldPassword, userFound.password, function (err, result) {
            if (!result) {
                res.json({
                    success: false,
                    message: "Wrong old password"
                })
            } else {
                bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                    userFound.password = hash
                    userFound.save()
                });
                res.json({
                    success: true,
                    message: "Updated Password"
                })
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Something went Wrong"
        })
        console.log(error)
    }
})


// ------------------- Get User Profile Image for Navigation --- ✔ -------------------


router.get("/navImage/:id", async (req, res) => {
    const userFound = await user.findById(req.params.id)
    if (userFound.profileImg == "default.png") {
        return res.json({
            img: null,
            success: true,
            message: "Nothing went wrong"
        })
    }
    const imgBase64 = userFound.profileImg.toString('base64');
    const imgSrc = `data:image/png;base64,${imgBase64}`;
    try {
        res.json({
            img: imgSrc,
            success: true,
            message: "Nothing went wrong"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went wrong"
        })
    }
})

// ------------------- Get User Profile  --- ✔ -------------------

router.get("/profile/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
            .populate({
                path: 'orders',
                populate: {
                    path: 'items.id',
                    model: 'Product'
                }
            });


        let userImgSrc = null;
        if (userFound.profileImg) {
            const imgBase64 = userFound.profileImg.toString('base64');
            userImgSrc = `data:image/png;base64,${imgBase64}`;
        }

        const ordersWithImages = userFound.orders.map(order => {
            const itemsWithImages = order.items.map(orderItem => {
                let itemImgSrc = null;

                if (orderItem.id && orderItem.id.img) {
                    const imgBase64 = orderItem.id.img.toString('base64');
                    itemImgSrc = `data:image/png;base64,${imgBase64}`;
                }

                return {
                    ...orderItem._doc,
                    id: orderItem.id ? {
                        ...orderItem.id._doc,
                        img: itemImgSrc
                    } : orderItem.id
                };
            });

            return {
                ...order._doc,
                items: itemsWithImages
            };
        });

        const processedUser = {
            ...userFound._doc,
            orders: ordersWithImages
        };

        res.json({
            data: processedUser,
            img: userImgSrc,
            success: true,
            message: "Data fetched successfully"
        });
    } catch (error) {
        // console.error(error);
        res.json({
            success: false,
            message: "Something went wrong"
        });
        console.log("first error", error)
    }
});


module.exports = router