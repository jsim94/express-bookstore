/** Common config for bookstore. */

let DB;

if (process.env.NODE_ENV === "test") {
  DB = "books_test";
} else {
  DB = process.env.DATABASE || "books";
}

module.exports = { DB };
