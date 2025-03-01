const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  } else {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          username: username,
        },
        "access",
        { expiresIn: 60 * 60 },
      );

      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({ message: "User successfully logged in"});
    } else {
      return res
        .status(404)
        .json({ message: "Invalid Login. Check username and password" });
    }
  }
  
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const currentUser = req.user.username;

  if (book) {
    const review = req.query.review;
    if (review) {
      book.reviews[currentUser] = review;
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(400).json({ message: "Review is required" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  } 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const currentUser = req.user.username;

  if (book) {
    delete book.reviews[currentUser];
    return res.status(200).json({ message: `Review from user ${currentUser} deleted` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  } 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
