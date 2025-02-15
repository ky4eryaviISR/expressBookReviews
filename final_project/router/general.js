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

public_users.get("/books-async", async (req, res) => {
    try {
      const fetchBooks = () => {
        return new Promise((resolve) => {
          resolve(Object.values(books));
        });
      };
      const bookList = await fetchBooks();
      return res.status(200).json(bookList);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch books" });
    }
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(isbn in books)
    return res.status(200).json(books[isbn]);
  return res.status(404).json({message: "Book not found"})
 });

 public_users.get("/isbn-async/:isbn", async (req, res) => {
    try {
      const fetchBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          if (isbn in books) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        });
      };
  
      const isbn = req.params.isbn;
      const book = await fetchBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = Object.entries(books).filter(([isbn, details]) => details.author===author);
  console.log(book)
  if(book){
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Books with provided author:" + author + " not found"});
});

public_users.get('/author-promise/:author', (req, res) => {
    const fetchBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = Object.entries(books).filter(([isbn, details]) => details.author === author);
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor); // Resolve if books are found
        } else {
          reject(new Error(`Books with provided author: ${author} not found`)); // Reject if no books match
        }
      });
    };
  
    const author = req.params.author;
  
    fetchBooksByAuthor(author)
      .then((bookList) => {
        return res.status(200).json(bookList);
      })
      .catch((error) => {
        return res.status(404).json({ message: error.message });
      });
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

public_users.get('/title-promise/:title', (req, res) => {
    const fetchBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const booksByTitle = Object.entries(books).filter(([isbn, details]) => details.title === title);
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error(`Books with provided title: ${title} not found`));
        }
      });
    };
  
    const title = req.params.title;
  
    fetchBooksByTitle(title)
      .then((booksFiltered) => {
        return res.status(200).json(booksFiltered);
      })
      .catch((error) => {
        return res.status(404).json({ message: error.message });
      });
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if(isbn in books)
      return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({message: "Book reviews with isbn: "+isbn+" not found"})
});

module.exports.general = public_users;
