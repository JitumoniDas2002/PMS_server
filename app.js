require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./models/User");
const Publication = require("./models/Publication");
const Admin = require("./models/Admin");
// import bcrypt to hash password
const bcrypt = require("bcryptjs");
// import jsonwebtoken to sign token
const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");
var cors = require('cors')
const multer = require('multer');
const path = require('path');

// This is an express app
const app = express();

// Use the express json parser middleware
app.use(express.json());
app.use(cors())

// Logic goes here
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// a ppost route
app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password, username } = req.body;
    
        // Validate user input
        if (!(email && password && first_name && last_name && username)) {
          return res.status(400).send("All input is required");
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
          user_id: uuid4(),
          first_name,
          last_name,
          username,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const token = await jwt.sign(
          { user_id: user.user_id, email },
          "thisisatokenkey",
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        user.save();
    
        // return new user
        return res.status(200).json(user);
      } catch (err) {
        console.log(err);
      }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(409).send("User does not exist. Please register");
    }

    // Validate user password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).send("Invalid Username Or Password");
    }

    // Create token
    const token = await jwt.sign(
      { user_id: user.user_id, email },
      "thisisatokenkey",
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;
    user.save();

    // user
    return res.status(200).json(user);


  } catch (err) {
    console.log(err);
  }
})

app.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(409).send("User does not exist. Please register");
    }

    // Validate user password
    // const validPassword = await bcrypt.compare(password, user.password);

    // if (!validPassword) {
    //   return res.status(400).send("Invalid Username Or Password");
    // }

    const validPassword = password === admin.password;

    if (!validPassword) {
      return res.status(400).send("Invalid Username Or Password");
    }

    // Create token
    const token = await jwt.sign(
      { admin_id: admin.admin_id, email },
      "thisisatokenkey",
      {
        expiresIn: "2h",
      }
    );

    // save user token
    admin.token = token;
    admin.save();

    // user
    return res.status(200).json(admin);


  } catch (err) {
    console.log(err);
  }
})

app.post("/add-publications", async (req, res) => {
  try {
    const { title, author, co_authors, user_id, description, published_date } = req.body

    // const file_name = file.originalname;
    // const file_path = path.join(__dirname, file.path);

    // file = {
    //   file_name,
    //   file_path
    // }

    const user = await User.findOne({ user_id: user_id });

    console.log(user);

    const publication_id = uuid4();

    user.publications.push(publication_id);

    user.save();

    const publication = await Publication.create({
      publication_id: publication_id,
      user_id,
      title,
      author,
      co_authors,
      description,
      email: user.email,
      published_date
    })

    return res.status(200).json(publication);

  } catch (err) {
    console.log(err);
  }
})

app.get(`/get-publications`, async (req, res) => {
  try {

    const publications = await Publication.find({})

    return res.status(200).json(publications);

  } catch (err) {
    console.log(err);
  }
})

app.get(`/get-total-publications`, async (req, res) => {
  try {

    const publications = await Publication.find({})

    return res.status(200).json(publications.length);

  } catch (err) {
    console.log(err);
  }
})

app.get(`/get-publications/:userid`, async (req, res) => {
  const userId = req.params.userid
  try {

    const publications = await Publication.find({
      "user_id": userId
    })

    return res.status(200).json(publications);

  } catch (err) {
    console.log(err);
  }
})

app.get(`/get-publications-email/:email`, async (req, res) => {
  const email = req.params.email
  console.log(email);
  try {

    const publications = await Publication.find({
      "email": email
    })

    return res.status(200).json(publications);

  } catch (err) {
    console.log(err);
  }
})

app.delete(`/delete-publication/:publicationid`, async (req, res) => {
  const publicationId = req.params.publicationid
  try {

    const publication = await Publication.findOneAndDelete({
      "publication_id": publicationId
    })

    return res.status(200).json(publication);

  } catch (err) {
    console.log(err);
  }

})

app.get(`/get-users`, async (req, res) => {
  try {

    const users = await User.find({})

    return res.status(200).json(users);

  } catch (err) {
    console.log(err);
  }
})

app.get(`/get-user/:userid`, async (req, res) => {
  const userId = req.params.userid
  try {
    const user = await User.findOne({
      "user_id": userId
    })

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
})

// update user
app.put(`/update-user/:userid`, async (req, res) => {
  const userId = req.params.userid

  const { first_name, last_name } = req.body;

  try {
    const user = await User.findOne({
      "user_id": userId
    })
    
    user.first_name = first_name
    user.last_name = last_name

    user.save()

    return res.status(200).json(user);

  } catch (err) {
    console.log(err);
  }
})

module.exports = app;