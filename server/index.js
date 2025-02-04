const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes"); // Import user routes
const notesRoutes = require("./routes/notesRoutes"); // Import notes routes

// Define port number
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests

// Connect to database and cloudinary
require("./config/database").dbconnect(); // Connect to database
require("./config/cloudinary").cloudinaryConnect(); // Connect to cloudinary

// File upload middleware setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Temporary directory for file uploads
  })
);

// Route setup
app.use("/user", userRoutes);
app.use("/notes", notesRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello Hi Bye</h1>"); // Simple response for root route
});

// Activate server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT); // Log server activation
});
