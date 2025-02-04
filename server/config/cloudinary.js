// Importing cloudinary module
const cloudinary = require("cloudinary").v2;

// Function to configure and connect to Cloudinary
exports.cloudinaryConnect = () => {
  try {
    // Configuring cloudinary with credentials from environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  } catch (error) {
    // Logging any errors that occur during configuration
    console.log(error);
  }
};