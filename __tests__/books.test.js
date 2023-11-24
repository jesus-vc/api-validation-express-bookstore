process.env.NODE_ENV = 'test';

// const db = require ("../db");
// const Book = require ('../models/book');

const app = require('../app');
const db = require("../db");

const request = require('supertest');
const isbn = "11189333-545-01022-9911133-222333111"

describe("POST /books", function() {
    test('can create book',async function() {
        let response = await request(app).post('/books').send({
            "isbn": isbn,
                "amazon_url": "https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Sean Arian",
                "language": "French",
                "pages": 300,
                "publisher": "Black Nation Inc.",
                "title": "Heaven & Earth Grocery Store",
                "year": 2023
        });
        expect(response.body).toEqual({
            "book": {
                "isbn": isbn,
                "amazon_url": "https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Sean Arian",
                "language": "French",
                "pages": 300,
                "publisher": "Black Nation Inc.",
                "title": "Heaven & Earth Grocery Store",
                "year": 2023
            }
        });
    })
});

describe("PUT /books/:isbn", function() {
    test('can update a book',async function() {
        let response = await request(app).put(`/books/${isbn}`).send({
                "amazon_url":"https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Vanessa Vasquez",
                "language":"English",
                "pages": 300,
                "publisher":"Black Nation Inc.",
                "title":"Heaven & Earth Grocery Store",
                "year":2023
        });
        expect(response.body).toEqual({
            "book": {
                "isbn": isbn,
                "amazon_url":"https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Vanessa Vasquez",
                "language":"English",
                "pages": 300,
                "publisher":"Black Nation Inc.",
                "title":"Heaven & Earth Grocery Store",
                "year":2023
            }
        });
    })
});

describe("API Validations", function() {

    const invalidIsbn = 'jl1!!!ljkasdf;@!W!!'

    test('invalid PUT /books/:isbn causes error',async function() {
        let response = await request(app).put(`/books/${invalidIsbn}`).send({
                "amazon_url":"https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Vanessa Vasquez",
                "language":"English",
                "pages": 300,
                "publisher":"Black Nation Inc.",
                "title":"Heaven & Earth Grocery Store",
                "year":2023
        });
        expect(response.body).toEqual(expect.objectContaining({"message": "Your isbn input should include only numbers and hyphens."}));
    });

    test('invalid GET /books/:isbn causes error',async function() {
        let response = await request(app).get(`/books/${invalidIsbn}`).send({
                "amazon_url":"https://www.amazon.com/gp/product/B0BPNP7YQB/",
                "author": "Vanessa Vasquez",
                "language":"English",
                "pages": 300,
                "publisher":"Black Nation Inc.",
                "title":"Heaven & Earth Grocery Store",
                "year":2023
        });
        expect(response.body).toEqual(expect.objectContaining({"message": "Your isbn input should include only numbers and hyphens."}));
    });
});

afterAll(() => {
    db.end();
});