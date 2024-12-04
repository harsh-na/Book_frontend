import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import axios from "axios";
import { Container, CssBaseline, Paper } from "@mui/material";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [books, setBooks] = useState([]);

  const fetchBooks = () => {
    if (token) {
      axios
        .get("http://localhost:9000/api/admin/getBooks", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBooks(res.data))
        .catch((error) => console.error("Error fetching books:", error));
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  return (
    <Container component="main" maxWidth="lg" style={{ marginTop: "20px" }}>
      <CssBaseline />
      {!token ? (
        <Paper elevation={3} style={{ padding: 20 }}>
          <AuthForm setToken={setToken} />
        </Paper>
      ) : (
        <>
          <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <BookForm refreshBooks={fetchBooks} />
          </Paper>

          <Paper elevation={3} style={{ padding: 20 }}>
            <BookList books={books} fetchBooks={fetchBooks} />
          </Paper>
        </>
      )}
    </Container>
  );
};

export default App;
