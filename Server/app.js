const express = require("express")
const app = express()
const cors = require("cors")
// ----------- Packages -----------
const cookieParser = require("cookie-parser")
// ----------- DB -----------
const db = require("./config/mongooseConnection")
// ----------- ENV -----------
require('dotenv').config();
// ----------- Router -----------
const userRouter = require("./Routes/userRouter")
const productRouter = require("./Routes/productRouter")
const adminRouter = require("./Routes/adminRouter")





// ----------- MiddleWare -----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:3000",
            "https://lctf38vz-3000.uks1.devtunnels.ms"
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);  // Allow the origin
        } else {
            callback(new Error('Not allowed by CORS'));  // Reject the origin
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser())




app.use("/user" , userRouter)
app.use("/product" , productRouter)
app.use("/admin/" , adminRouter)

// ----------- Get -----------

// app.get("/logout", async (req, res) => {
//     res.clearCookie("token", {
//         httpOnly: true,
//         sameSite: "Lax",
//         secure: false,
//         path: "/"
//     });
//     console.log(req.cookies.token)
//     res.json({ message: "Logged out successfully", success: true })
// })

// app.get("/admin/viewProducts", async (req, res) => {
//     try {
//         const products = await product.find({})
//         const productsWithImage = products.map(product => {
//             const imgBase64 = product.img.toString('base64');
//             const imgSrc = `data:image/png;base64,${imgBase64}`;

//             return {
//                 ...product._doc,
//                 img: imgSrc,
//             };
//         });
//         res.json({
//             success: true,
//             data: productsWithImage
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Some Error Occured"
//         })
//         console.log(error)
//     }
// })


// app.get("/admin/orders", async (req, res) => {
//     try {
//         const orders = await order.find()
//             .populate({
//                 path: 'items.id',
//                 model: 'Product'
//             })
//             .sort({ createdAt: -1 });

//         const ordersWithFlattenedItems = orders.map(orderItem => {
//             const flattenedItems = orderItem.items.map(item => {
//                 let processedProduct = { ...item.id._doc };

//                 // Debug logging to see what we're working with
//                 // console.log('Item structure:', {
//                 //     hasId: !!item.id,
//                 //     hasImg: !!item.id?.img,
//                 //     imgType: typeof item.id?.img,
//                 //     imgKeys: item.id?.img ? Object.keys(item.id.img) : null
//                 // });

//                 // Multiple approaches to handle different image buffer formats
//                 let imgSrc = null;

//                 if (item.id && item.id.img) {
//                     try {
//                         let buffer;

//                         // Case 1: img is {type: 'Buffer', data: Array}
//                         if (item.id.img.type === 'Buffer' && item.id.img.data) {
//                             buffer = Buffer.from(item.id.img.data);
//                         }
//                         // Case 2: img is already a Buffer object
//                         else if (Buffer.isBuffer(item.id.img)) {
//                             buffer = item.id.img;
//                         }
//                         // Case 3: img.buffer exists (some MongoDB drivers)
//                         else if (item.id.img.buffer) {
//                             buffer = item.id.img.buffer;
//                         }
//                         // Case 4: Direct data array
//                         else if (Array.isArray(item.id.img)) {
//                             buffer = Buffer.from(item.id.img);
//                         }

//                         if (buffer && buffer.length > 0) {
//                             const imgBase64 = buffer.toString('base64');
//                             imgSrc = `data:image/png;base64,${imgBase64}`;
//                             console.log('Successfully converted image, base64 length:', imgBase64.length);
//                         } else {
//                             console.log('No valid buffer found for image');
//                         }
//                     } catch (error) {
//                         console.error('Error converting image:', error);
//                     }
//                 }

//                 processedProduct.img = imgSrc;

//                 // Flatten: spread all product properties + add quantity
//                 return {
//                     ...processedProduct,
//                     quantity: item.quantity,
//                     itemId: item._id
//                 };
//             });

//             return {
//                 ...orderItem._doc,
//                 items: flattenedItems
//             };
//         });

//         res.json({
//             success: true,
//             data: ordersWithFlattenedItems,
//             message: "Orders fetched successfully"
//         });
//     } catch (error) {
//         console.error('Admin orders error:', error);
//         res.json({
//             success: false,
//             message: "Some Error Occurred"
//         });
//     }
// });

// app.get("/admin/orders/:id/delete", async (req, res) => {
//     try {
//         const orderFound = await order.findByIdAndDelete(req.params.id)
//         const userFound = await user.findById(orderFound.userId)
//         userFound.orders.splice(userFound.cart.indexOf(orderFound.userId), 1);
//         userFound.save()
//         res.json({
//             success: true,
//             message: "Deleted successfully"
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Some Error Occurred"
//         })
//     }
// })

// For Home Page

// app.get("/home/viewProducts/:category", async (req, res) => {
//     try {
//         const products = await product.find({ category: req.params.category })
//         const productsWithImage = products.map(product => {
//             const imgBase64 = product.img.toString('base64');
//             const imgSrc = `data:image/png;base64,${imgBase64}`;

//             return {
//                 ...product._doc,
//                 img: imgSrc,
//             };
//         });
//         res.json({
//             success: true,
//             data: productsWithImage
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Some Error Occured"
//         })
//         console.log(error)
//     }
// })

// For Other  Page

// app.get("/viewProducts/:category", async (req, res) => {
//     try {
//         const products = await product.find({ category: req.params.category })
//         const productsWithImage = products.map(product => {
//             const imgBase64 = product.img.toString('base64');
//             const imgSrc = `data:image/png;base64,${imgBase64}`;

//             return {
//                 ...product._doc,
//                 img: imgSrc,
//             };
//         });
//         res.json({
//             success: true,
//             data: productsWithImage
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Some Error Occured"
//         })
//         console.log(error)
//     }
// })



// app.get("/cart/get/:id", async (req, res) => {
//     try {
//         const foundUser = await user.findById(req.params.id).populate('cart')
//         const productsWithImage = foundUser.cart.map(product => {
//             const imgBase64 = product.img.toString('base64');
//             const imgSrc = `data:image/png;base64,${imgBase64}`;

//             return {
//                 ...product._doc,
//                 img: imgSrc,
//             };
//         });
//         res.json({
//             message: "Data Sent Successfully",
//             data: productsWithImage
//         })
//     } catch (error) {
//         res.json({
//             message: "Something went wrong"
//         })
//     }
// }) // -- user




// app.get("/cart/:user/remove/:id", async (req, res) => {
//     try {
//         const userFound = await user.findById(req.params.user)
//         userFound.cart.splice(userFound.cart.indexOf(req.params.id), 1);
//         userFound.save()
//         res.json({
//             message: "Removed from cart"
//         })
//     } catch (error) {
//         console.log(error)
//         res.json({
//             message: "Something went wrong"
//         })
//     }
// }) // -- user


// app.get("/profile/user/:id", async (req, res) => {
//     try {
//         const userFound = await user.findById(req.params.id)
//             .populate({
//                 path: 'orders',
//                 populate: {
//                     path: 'items.id',
//                     model: 'Product'
//                 }
//             });
//         // console.log(userFound)
//         // return

//         let userImgSrc = null;
//         if (userFound.profileImg) {
//             const imgBase64 = userFound.profileImg.toString('base64');
//             userImgSrc = `data:image/png;base64,${imgBase64}`;
//         }

//         const ordersWithImages = userFound.orders.map(order => {
//             const itemsWithImages = order.items.map(orderItem => {
//                 let itemImgSrc = null;

//                 if (orderItem.id && orderItem.id.img) {
//                     const imgBase64 = orderItem.id.img.toString('base64');
//                     itemImgSrc = `data:image/png;base64,${imgBase64}`;
//                 }

//                 return {
//                     ...orderItem._doc,
//                     id: orderItem.id ? {
//                         ...orderItem.id._doc,
//                         img: itemImgSrc
//                     } : orderItem.id
//                 };
//             });

//             return {
//                 ...order._doc,
//                 items: itemsWithImages
//             };
//         });

//         const processedUser = {
//             ...userFound._doc,
//             orders: ordersWithImages
//         };

//         res.json({
//             data: processedUser,
//             img: userImgSrc,
//             success: true,
//             message: "Data fetched successfully"
//         });
//     } catch (error) {
//         // console.error(error);
//         res.json({
//             success: false,
//             message: "Something went wrong"
//         });
//     }
// }); // -- user


// app.get("/navImage/user/:id", async (req, res) => {
//     const userFound = await user.findById(req.params.id)
//     if (userFound.profileImg == "default.png") {
//         return res.json({
//             img: null,
//             success: true,
//             message: "Nothing went wrong"
//         })
//     }
//     const imgBase64 = userFound.profileImg.toString('base64');
//     const imgSrc = `data:image/png;base64,${imgBase64}`;
//     try {
//         res.json({
//             img: imgSrc,
//             success: true,
//             message: "Nothing went wrong"
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Something went wrong"
//         })
//     }
// }) // -- user
// ----------- Post -----------


// app.post("/login", async (req, res) => {
//     const userFound = await user.findOne({ email: req.body.email })
//     if (userFound) {
//         bcrypt.compare(req.body.password, userFound.password, function (err, result) {
//             if (result) {
//                 const token = jwt.sign({ email: userFound.email, id: userFound._id }, process.env.JWT_SECRET);
//                 res.cookie("token", token, {
//                     httpOnly: true,
//                     sameSite: "Lax",
//                     secure: false,
//                 });

//                 if (userFound.profileImg != "default.png") {
//                     const imgBase64 = userFound.profileImg.toString('base64');
//                     const imgSrc = `data:image/png;base64,${imgBase64}`;
//                     userFound.profileImg = imgSrc
//                     console.log(userFound)
//                     res.json({
//                         success: true,
//                         message: "Logged In",
//                         user: userFound,
//                         img: imgSrc
//                     })
//                 } else {
//                     res.json({
//                         success: true,
//                         message: "Logged In",
//                         user: userFound,
//                     })
//                 }

//             }
//             else {
//                 res.json({
//                     success: false,
//                     message: "Wrong Password!"
//                 })
//             }
//         });
//     }
//     else {
//         res.json({
//             success: false,
//             message: "No User Found with such Email Address"
//         })
//     }
//     console.log(userFound)
// })




// app.post("/register", async (req, res) => {
//     const userFound = await user.findOne({ email: req.body.email })
//     if (userFound) {
//         res.json({
//             success: false,
//             message: "User Already Existed"
//         })
//         return
//     }
//     else {
//         try {
//             bcrypt.genSalt(10, function (err, salt) {
//                 bcrypt.hash(req.body.password, salt, async function (err, hash) {
//                     const userCreated = await user.create({
//                         email: req.body.email,
//                         username: req.body.username,
//                         password: hash,
//                     })
//                     const token = jwt.sign({ email: userCreated.email, id: userCreated._id }, process.env.JWT_SECRET);
//                     res.cookie("token", token, {
//                         httpOnly: true,
//                         sameSite: "Lax",
//                         secure: false,
//                     });
//                     res.json({
//                         success: true,
//                         message: "User Registered Successfully",
//                         user: userCreated
//                     })
//                 });
//             });
//         } catch (error) {
//             res.json({
//                 success: false,
//                 message: "Something Went Wrong"
//             })
//         }
//     }
// })



// app.post('/add-products', upload.single('img'), async (req, res) => {
//     try {
//         const { name, category, price, oldPrice, bg, panelBg, description } = req.body;
//         const imgBuffer = req.file.buffer;

//         console.log(req.file.buffer);
//         const newProduct = await product.create({
//             name,
//             description,
//             category,
//             price,
//             oldPrice: oldPrice || null,
//             bg,
//             panelBg,
//             img: imgBuffer,
//         });


//         res.json({ success: true, message: 'Product added successfully', productId: newProduct._id });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Failed to upload product' });
//     }
// });


// app.post("/add-to-cart", async (req, res) => {
//     try {
//         const foundUser = await user.findById(req.body.userid);
//         foundUser.cart.push(req.body.productId)
//         foundUser.save()
//         res.json({
//             message: "Added to cart"
//         })
//     } catch (error) {
//         res.json({
//             message: "Something went wrong"
//         })
//     }
// }) // -- product


// app.post("/orders/create", async (req, res) => {
//     try {
//         const userNewData = req.body.billingInfo
//         const orderCreated = await order.create(req.body)
//         const userFound = await user.findById(req.body.userId)
//         userFound.orders.push(orderCreated._id)
//         userFound.firstName = userNewData.firstName
//         userFound.lastName = userNewData.lastName
//         userFound.contact = userNewData.phone
//         userFound.address.address = userNewData.address
//         userFound.address.city = userNewData.city
//         userFound.address.state = userNewData.state
//         userFound.address.zipCode = userNewData.zipCode
//         userFound.address.country = userNewData.country
//         userFound.cart = []
//         userFound.save()
//         res.json({
//             success: true,
//             message: "Order Done"
//         })
//     } catch (error) {
//         console.log(error)
//         res.json({
//             success: false,
//             message: "Something Went wrong"
//         })
//     }
// }) // -- user


// app.post("/profile/:id/img", upload.single("profile"), async (req, res) => {
//     try {
//         // const imgBuffer = req.file.buffer;
//         const userFound = await user.findById(req.params.id)
//         userFound.profileImg = req.file.buffer
//         userFound.save()
//         res.json({
//             success: true,
//             message: "Nothing Went Wrong"
//         })
//     } catch (error) {
//         console.error(error)
//         res.json({
//             success: false,
//             message: "Something Went Wrong"
//         })
//     }
// }) // -- user


// app.post("/profile/update/:id", async (req, res) => {
//     try {
//         const userFound = await user.findById(req.params.id)
//         userFound.firstName = req.body.firstName,
//             userFound.lastName = req.body.lastName,
//             userFound.contact = req.body.contact,
//             userFound.email = req.body.email
//         userFound.save()
//         res.json({
//             success: true,
//             message: "Profile Updated"
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Somthing went wrong"
//         })
//     }
// }) // -- user


// app.post("/profile/updatePassword/:id", async (req, res) => {
//     try {
//         const userFound = await user.findById(req.params.id)
//         bcrypt.compare(req.body.oldPassword, userFound.password, function (err, result) {
//             if (!result) {
//                 res.json({
//                     success: false,
//                     message: "Wrong old password"
//                 })
//             } else {
//                 bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
//                     userFound.password = hash
//                     userFound.save()
//                 });
//                 res.json({
//                     success: true,
//                     message: "Updated Password"
//                 })
//             }
//         });
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Something went Wrong"
//         })
//         console.log(error)
//     }
// }) // -- user


// app.post("/admin/orders/:id/status", async (req, res) => {
//     try {
//         const orderFound = await order.findById(req.params.id)
//         orderFound.status = req.body.status.toLowerCase()
//         orderFound.save()
//         res.json({
//             success: true,
//             message: "Nothing went wrong"
//         })
//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Something went wrong"
//         })
//     }
// })

app.listen("8000")