const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ASDFGHJ!@SDFG$%1DF34$%^&*GHJKL";

// create user using : POST = api/user - No login required
router.post(
  "/signup",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  // If there are errors, return bad request and errors
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ msg: "User already exits" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create new user
      user = await User.create({
        username: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
          name: user.username,
        },
      };

      // generating JWT token for user
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.status(200).json({ msg: "Account created successfully", authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").exists(),
  ],
  async (req, res) => {
    let success = "false";
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        success = "false";
        return res.status(400).json({ success, msg: "User does not exist" });
      }

      let passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        success = "false";
        return res.status(400).json({ success, msg: "Incorrect Password" });
      }

      const data = {
        user: {
          id: user.id,
          name: user.username,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success: "true", authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //select()- password does not include
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
