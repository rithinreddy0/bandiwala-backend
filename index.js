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
app.use(cors({origin:"*",methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));  // Adjust size as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
