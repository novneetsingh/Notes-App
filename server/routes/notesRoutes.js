// Importing express module
const express = require("express");

// Creating a router object
const router = express.Router();

// import middlewares
const { auth } = require("../middleware/auth");

// Importing controller function from notesController
const {
  getAllUsersNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleNoteFavouriteStatus,
  getAllFavouriteNotes,
  searchNotesByTitle,
} = require("../controllers/notesController");

// Defining routes

// get all user notes
router.get("/all-notes", auth, getAllUsersNotes);

// create a note
router.post("/create-notes", auth, createNote);

// update a note
router.put("/update/:id", auth, updateNote);

// delete a note
router.delete("/delete/:id", auth, deleteNote);

// mark a note favorite
router.put("/mark-favourite/:id", auth, toggleNoteFavouriteStatus);

// retrive all favourite notes of logged in user
router.get("/favourite-notes", auth, getAllFavouriteNotes);

// Search notes by title
router.get("/search-notes", auth, searchNotesByTitle);

// Exporting the router object to be used in other parts of the application
module.exports = router;
