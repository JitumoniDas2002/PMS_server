require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./models/User");
// import bcrypt to hash password
const bcrypt = require("bcryptjs");
// import jsonwebtoken to sign token
const jwt = require("jsonwebtoken");

// This is an express app
const app = express();

// Use the express json parser middleware
app.use(express.json());

// Logic goes here
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// a ppost route
app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;
    
        // Validate user input
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email: email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const token = await jwt.sign(
          { user_id: user._id, email },
          "thisisatokenkey",
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        user.save();
    
        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
})

module.exports = app;