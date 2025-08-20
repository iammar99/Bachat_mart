const mongoose = require('mongoose');
const config = require('config');


mongoose
.connect(`${config.get("MONGODB_URI")}/bachatMart`)
.then(()=>{
    console.log("Mongoose connected")
})
.catch((err)=>{
    console.log(err)
})


module.exports = mongoose.connection