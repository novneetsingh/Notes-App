const User = require("../models/User");
const Note = require("../models/Note");
const { uploadToCloudinary } = require("../utils/cloudinaryUploader");

// create a note for a user
exports.createNote = async (req, res) => {
  try {
    const { title, transcribedText } = req.body;

    const { audio } = req.files;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!title || !audio || !transcribedText) {
      return res
        .status(400)
        .json({ message: "Please provide title, audio, and transcribedText" });
    }

    // upload audio to cloudinary
    const audioFile = await uploadToCloudinary(audio, process.env.FOLDER_NAME);

    const newNote = await Note.create({
      user: req.user.id,
      title,
      audio: audioFile.secure_url,
      transcribedText,
    });

    // add note to user's notes array
    user.notes.push(newNote._id);

    await user.save();

    res.status(201).json({
      message: "Note created successfully",
      newNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all current notes user notes
exports.getAllUsersNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // find all notes of user
    const user = await User.findById(userId).populate("notes");

    // sort the user notes by createdAt in ascending order
    user.notes.sort((a, b) => a.createdAt - b.createdAt);

    res.status(200).json({
      message: "Notes fetched successfully",
      notes: user.notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update a note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // if title is provided, update title
    if (req.body.title) {
      note.title = req.body.title;
    }

    // if content is provided, update content
    if (req.body.content) {
      note.content = req.body.content;
    }

    // if transcribedText is provided, update transcribedText
    if (req.body.transcribedText) {
      note.transcribedText = req.body.transcribedText;
    }

    if (req.files) {
      let images = req.files.images;

      // If images is not an array, convert it to an array
      if (!Array.isArray(images)) {
        images = [images];
      }

      let imageUrls = []; // Create an empty array to store image URLs

      // Upload each image to Cloudinary
      for (let i = 0; i < images.length; i++) {
        const result = await uploadToCloudinary(
          images[i],
          process.env.FOLDER_NAME
        );

        imageUrls.push(result.secure_url); // Push the image URL to the array
      }

      // Update the note.images field
      note.images = [...note.images, ...imageUrls];
    }

    // Save the updated note
    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(404).json({ message: "Note not found" });
    }

    // find note and delete
    await Note.findByIdAndDelete(noteId);

    // also delete note from user's notes array
    await User.updateOne({ _id: req.user.id }, { $pull: { notes: noteId } });

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// toggle note favourite status
exports.toggleNoteFavouriteStatus = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(404).json({ message: "Note not found" });
    }

    // find note and update isFavorite field
    const note = await Note.findById(noteId);
    note.isFavourite = !note.isFavourite;
    await note.save();

    res.status(200).json({
      message: "Note favorite status updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// retrive all favorite notes of logged in user
exports.getAllFavouriteNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // find user and populate notes
    const user = await User.findById(userId).populate("notes");

    // filter notes to include only favorite notes
    const favouriteNotes = user.notes.filter(
      (note) => note.isFavourite === true
    );

    res.status(200).json({
      message: "Favorite notes fetched successfully",
      notes: favouriteNotes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search notes by title
exports.searchNotesByTitle = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user ID is valid
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the search query from the request
    const searchQuery = req.query.search;

    // Check if the search query is valid
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Find the user and populate their notes
    const user = await User.findById(userId).populate("notes");

    // Filter the notes based on the search query in the title field
    const searchResults = user.notes.filter((note) => {
      // Convert the note title to lowercase
      const title = note.title.toLowerCase();

      // Convert the search query to lowercase
      const searchQueryLower = searchQuery.toLowerCase();

      // Check if the note title includes the search query
      return title.includes(searchQueryLower);
    });

    // Return the search results
    res.status(200).json({
      message: "Search results fetched successfully",
      notes: searchResults,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
