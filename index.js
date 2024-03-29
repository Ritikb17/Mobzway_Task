const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://ritikbansal7272:ULN9FGEeexXxSBoc@cluster0.q29whiq.mongodb.net/database?retryWrites=true&w=majority";
const path = require("path");
//rpfkjTdkvr1e
app.use(express.static(path.join(__dirname, "public")));
mongoose.connect(uri); // connecting MONGO DB
app.use(bodyParser.json()); // Add body-parser middleware for parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodie
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(bodyParser.json()); // Add body-parser middleware for parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
let global_data = {};
//DEFINEING SCHEMA
const UserSchema = new mongoose.Schema({
  FIRST_NAME: String,
  LAST_NAME: String,
  CONTACT: Number,
  EMAIL: String,
  AGE: Number,
  CITY: String,
  STATE: String,
  COUNTRY: String,
  LOGIN: String,
  PASSWORD: String,
  time_data: Date,
});

// CREATING DATA MODEL
const UserModel = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "./public/home-page.html");

  // Read the HTML file and send it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).type("text/html").send(data);
    }
  });
});

app.get("/welcome-page", (req, res) => {
  const filePath = path.join(__dirname, "./public/welcome.html");

  // Read the HTML file and send it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).type("text/html").send(data);
    }
  });
});

// SIGN UP PAGE GET
app.get("/sign-up", (req, res) => {
  const filePath = path.join(__dirname, "./public/sign-up.html");

  // Read the HTML file and send it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).type("text/html").send(data);
    }
  });
});

// SIGN UP PAGE POST
app.post("/sign-up", (req, res) => {
  //RECIVING DATA FROM HTML PAGE
  const data = req.body;
  // console.log(data)
  //ADDING DATE AND TIME
  const now = new Date();
  const formattedDate = now.toISOString();
  const time_data = {
    currentTime: formattedDate,
  };
  //   console.log(req.body)

  data.time_data = formattedDate;

  // console.log(data)

  //SENDING DATA TO DB
  const newUser = new UserModel(data);
  newUser
    .save()
    .then(() => {
      console.log("data inserted ", data);
      console.log("whooo");
      res.setHeader("Content-Type", "text/html");
      // res.send('<html><head><title>HTML Response</title></head><body><h1>Hello, world!</h1></body></html>');
    })

    .catch((err) => console.error("Error inserting document:", err));
});

// LOGIN PAGE
app.get("/login-page", (req, res) => {
  const filePath = path.join(__dirname, "public/login.html");

  // Read the HTML file and send it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).type("text/html").send(data);
    }
  });
});

// LOGIN PAGE FOR OUTPUT
app.post("/login-page", (req, res) => {
  const data = req.body;

  UserModel.find({ LOGIN: data.id })
    .then((users) => {
      if (users.length === 0) {
        console.log("No user found with the specified ID");
        res.status(404).json({ error: "No user found with the specified ID" });
      } else {
        const user = users.find((user) => user.PASSWORD === data.password);
        if (user) {
          console.log("Valid USER");
          console.log(user);
          global_data = user;
          res.json({ success: true });
        } else {
          console.log("Invalid password");
          res.status(401).json({ error: "Invalid password" });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/show-info", (req, res) => {
  console.log("this is info function", global_data);
  res.render("output", { global_data });
});
app.listen(PORT, () => console.log("Server is started", PORT));
