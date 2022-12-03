const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test";

describe("Books routes test", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let book1 = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017,
    });
  });

  describe("create book", function () {
    test("with valid content", async function () {
      let response = await request(app).post("/books").send({
        isbn: "0691161518113",
        amazon_url: "http://a.co/eobPtX2321",
        author: "Matthew Lane2",
        language: "englicious",
        pages: 269,
        publisher: "Princeton College Press",
        title: "Power-Down: Locking Hidden Mathematics behind Audio Games",
        year: 2019,
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toBeInstanceOf(Object);
      expect(response.body.book.author).toEqual("Matthew Lane2");
    });

    test("with invalid content", async function () {
      let response = await request(app).post("/books").send({
        isbn: "0691161518113",
        amazon_url: "http://a.co/eobPtX2321",
        author: "Matthew Lane2",
        language: "englicious",
        pages: 269,
        publisher: "Princeton College Press",
        title: "Power-Down: Locking Hidden Mathematics behind Audio Games",
        year: "2019",
      });
      console.log(response.body);
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message[0]).toEqual("instance.year is not of a type(s) integer");
    });
  });

  describe("update book", function () {
    test("with valid content", async function () {
      let response = await request(app).put("/books/0691161518").send({
        amazon_url: "http://a.co/eobPtX2321321",
        author: "Matthew Lane4",
        language: "englicious",
        pages: 269,
        publisher: "Princeton College Press",
        title: "Power-Down: Locking Hidden Mathematics behind Audio Games",
        year: 2019,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.book).toBeInstanceOf(Object);
    });

    test("with invalid content", async function () {
      let response = await request(app).put("/books/0691161518").send({
        amazon_url: "http://a.co/eobPtX2321321",
        author: "Matthew Lane4",
        language: "englicious",
        pages: "269",
        publisher: "Princeton College Press",
        title: "Power-Down: Locking Hidden Mathematics behind Audio Games",
        year: 2019,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message[0]).toEqual("instance.pages is not of a type(s) integer");
    });
  });
});

afterAll(async function () {
  await db.end();
});
