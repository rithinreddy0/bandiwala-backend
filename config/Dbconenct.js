require("dotenv").config();
const mongoose = require("mongoose")
 const db_connect = ()=>{
    mongoose.connect("mongodb+srv://bandiwala:bandiwala@1.8lkz9.mongodb.net/?retryWrites=true&w=majority&appName=1",{}).then(()=>{
        console.log("Data base connected successfully");
    }).catch((e)=>{
       console.log(process.env.DBURL);
        console.log("error");
        console.log(e);
    })
}
module.exports =  db_connect;
