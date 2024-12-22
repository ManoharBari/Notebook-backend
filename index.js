const express = require("express");
const app = express();
const connectDB = require("./db");
const cors = require("cors");
const auth = require("./routes/auth");
const notes = require("./routes/notes");

// middleware
app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", auth);
app.use("/notes", notes);

//listen function
app.listen(8080, () => {});

module.exports = app;
