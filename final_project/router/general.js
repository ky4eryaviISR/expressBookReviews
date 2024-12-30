const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    user = req.body.user;
    pass = req.body.password;
    if(user && pass){
        if(!isValid(user)){
            users.push({"user": user, "pass": pass});
            return res.status(200).json({message: "You can login"});
        }
        else{
            return res.status(404).json({message:"User already exists"})
        }
    }
    return res.status(404).json({message: "Unable to register"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(Object.values(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(isbn in books)
    return res.status(200).json(books[isbn]);
  return res.status(404).json({message: "Book not found"})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  book = Object.entries(books).filter(([isbn, details]) => details.author===author);
  console.log(book)
  if(book){
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Books with provided author:" + author + " not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let books_filtered = Object.entries(books).filter(([isbn, details]) => details.title===title);
    console.log(book)
    if(books_filtered){
        return res.status(200).json(books_filtered);
    }
        return res.status(404).json({message: "Books with provided title:" + title + " not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if(isbn in books)
      return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({message: "Book reviews with isbn: "+isbn+" not found"})
});

module.exports.general = public_users;
