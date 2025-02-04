// Importing express module
const express = require("express");

// Creating a router object
const router = express.Router();

// Importing controller function from userController
const { signup, login } = require("../controllers/userController");

// Defining routes

router.post("/signup", signup);

router.post("/login", login);

// Exporting the router object to be used in other parts of the application
module.exports = router;
