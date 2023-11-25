# A bookstore application built on Express and PostgreSQL.

# I made the following enhancements to the original source code:

1. Added API validation to the routes that create (POST /books) and update (PUT /books/:isbn) books.

    - Leveraged the JSONSchema tool for the validation. 

    - Routes are located in in routes/books.js.

2. Added SQL injection protection by validating the input of ISBNs for the PUT /books/:isbn and GET /books/:id routes. 

3. Added tests in __tests__/books.test.js, which tested the changes I made to the POST and PUT routes above.