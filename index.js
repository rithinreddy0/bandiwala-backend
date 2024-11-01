//importing modules
const express = require("express");
const dotenv = require('dotenv').config();
const bodyparser = require("body-parser");
const db_connect= require("./config/Dbconenct");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const UserRouter = require("./Routes/UserRoute");
const VendorRouter = require("./Routes/VendorRoute");


//constants
const port = process.env.PORT||3000


//initialiazation of server
const app = express();


//middle wares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());

app.use(cookieparser());
// server listening
app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})

//configurations
db_connect();

//routes
app.use('/api/users',UserRouter);
app.use("/api/vendor",VendorRouter)
app.get("/",(req,res)=>{
    res.send("Welcome Bandi Wala ")
})
