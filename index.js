// Importing modules
const express = require("express");
const dotenv = require("dotenv").config();
const bodyparser = require("body-parser");
const db_connect = require("./config/Dbconenct");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const http = require("http"); // For creating a server compatible with Socket.IO
const { Server } = require("socket.io"); // Socket.IO server

const UserRouter = require("./Routes/UserRoute");
const VendorRouter = require("./Routes/VendorRoute");

// Constants
const port = process.env.PORT || 3000;

// Initialization of Express app
const app = express();

// Middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" })); // Adjust size as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieparser());

// Server and Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for custom events from clients (if needed)
  socket.on("message", (data) => {
    console.log(`Message received: ${data}`);
  });

  // Emit events to notify all connected clients
  socket.on("orderStatusUpdated", (data) => {
    console.log(`Order status updated: ${JSON.stringify(data)}`);
    io.emit("orderStatusUpdated", data); // Broadcast to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server with Socket.IO
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// Database connection
db_connect();

// Routes
app.use("/api/users", UserRouter);
app.use("/api/vendor", VendorRouter);
app.get("/", (req, res) => {
  res.send("Welcome Bandi Wala");
});
