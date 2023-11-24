const express = require("express");
const Book = require("../models/book");

const router = new express.Router();

const jsonschema = require('jsonschema');
//PEER Is there a convention on how to name 3rd party libraries versus regular source code variables? 
const createBookSchema = require ('../schemas/createBookSchema.json')
const updateBookSchema = require ('../schemas/updateBookSchema.json')

const ExpressError = require('../expressError.js')

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {

     // Validate isbn input includes only numbers and hyphens.

     const isbnPattern = /^[\d-]+$/;
    
     if (!isbnPattern.test(req.params.isbn)) {
       return next({status: 400,
       message: "Your isbn input should include only numbers and hyphens."});
     }
     
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const validationResult = jsonschema.validate(req.body,createBookSchema);
   
    if (!validationResult.valid) {
      const listOfErrors = validationResult.errors.map(error => error.stack);
      const error = new ExpressError(listOfErrors,400);
      return next(error);
    }
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {

    // Validate isbn input includes only numbers and hyphens.

    const isbnPattern = /^[\d-]+$/;
    
    if (!isbnPattern.test(req.params.isbn)) {
      return next({status: 400,
      message: "Your isbn input should include only numbers and hyphens."});
    }

    const validationResult = jsonschema.validate(req.body,updateBookSchema);
   
    if (!validationResult.valid) {
      const listOfErrors = validationResult.errors.map(error => error.stack);
      const error = new ExpressError(listOfErrors,400);
      return next(error);
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
