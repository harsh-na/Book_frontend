import React, { useEffect } from "react";

const BookList = ({ books, fetchBooks }) => {
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="book-list">
      <h2>Books</h2>
      {books.length ? (
        books.map((book) => (
          <div key={book.id}>
            <p>
              <strong>{book.title}</strong> by {book.author} ({book.publicationYear})
            </p>
          </div>
        ))
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
};

export default BookList;
