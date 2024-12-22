const express = require("express");
const Note = require("../models/notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

// Route 1: Get All Notes using GET - login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2: Create Notes using POST - login required
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Enter valid title").exists(),
    body("description", "Enter valid description").exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const notes = await note.save();
      res.json(notes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3: Update Notes using PUT - login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const { title, description, tag } = req.body;

      //create newNote object
      const newNote = {
        updateAt: Date.now(),
      };
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(401).send("Not Found");
      }

      if (note.user.toString() !== req.user.id) {
        res.status(401).send("Access Denied");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.send(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 4: Delete Notes using DELETE - login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(401).send("Not Found");
    }

    // check user credentials
    if (note.user.toString() !== req.user.id) {
      res.status(401).send("Access Denied");
    }

    await Note.findByIdAndDelete(req.params.id);
    res.send("Note deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
