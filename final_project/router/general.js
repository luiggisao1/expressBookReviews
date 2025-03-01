const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (username && password) {
    if (!isValid(username)) {
      return res.status(200).json({message: "User already exists"});
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({message: "User registered successfully"});
    }
  } else {
    return res.status(400).json({message: "Username and password are required"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const filteredBook = Object.values(books).filter(book => book.author === req.params.author);
  return res.status(200).json(filteredBook);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filteredBook = Object.values(books).find(book => book.title === req.params.title);
  if (filteredBook) {
    return res.status(200).json(filteredBook);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
