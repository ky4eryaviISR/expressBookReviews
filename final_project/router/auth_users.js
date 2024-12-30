const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.find(item=> item.user === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.user;
  let pass = req.body.password;
  if(!user || !pass){
    return res.status(404).json({message: "Unable to login"});
  }
  if(!authenticatedUser(user, pass)){
    return res.status(404).json({message: "Credentials invalid"});
  }
  let accessToken = jwt.sign({data: pass}, "secret", {expiresIn: 60*60});
  req.session.authorization = {accessToken, user};
  return res.status(200).json({message: "Login success"})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
