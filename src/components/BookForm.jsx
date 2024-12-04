import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const BookForm = ({ refreshBooks }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [bookList, setBookList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedInIsbn, setLoggedInIsbn] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false); 
  const [editingBook, setEditingBook] = useState(null); 

  const addBook = () => {
    if (!token) {
      alert("Please log in first!");
      return;
    }
    const book = { title, author, publicationYear: year, isbn: loggedInIsbn };
    axios
      .post("http://localhost:9000/api/admin/addNewBook", book, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Book added successfully");
        clearForm();
        refreshBooks();
      })
      .catch((error) => console.error(error));
  };

 
  const handleUpdateBook = () => {
    const updatedBook = { title }; 
    axios
      .put(
        `http://localhost:9000/api/admin/updateBook/${isbn}/${title}`,
        updatedBook,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        const updatedBookList = bookList.map(
          (book) => (book.isbn === isbn ? { ...book, title } : book) 
        );
        setBookList(updatedBookList);
        clearForm();
        setOpenModal(false); 
        alert("Book updated successfully");
        refreshBooks();
      })
      .catch((error) => alert("Error updating book"));
  };

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setYear("");
    setIsbn("");
  };

 
  const removeBook = (isbn) => {
    axios
      .delete(`http://localhost:9000/api/admin/removeBook/${isbn}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Book removed successfully");
        refreshBooks();
        setBookList(bookList.filter((book) => book.isbn !== isbn));
      })
      .catch((error) => console.error(error));
  };

  const fetchBooks = () => {
    axios
      .get("http://localhost:9000/api/admin/getBooks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBookList(response.data))
      .catch((error) => console.error(error));
  };

  const searchBooks = () => {
    if (searchTerm) {
      const filteredBooks = bookList.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.toString().includes(searchTerm)
      );
      setBookList(filteredBooks);
    } else {
      fetchBooks();
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const handleLogin = (isbn, password) => {
    axios
      .post("http://localhost:9000/api/admin/login", { isbn, password })
      .then((response) => {
        localStorage.setItem("token", response.data);
        setToken(response.data);
        setLoggedInIsbn(isbn);
        setPassword(password);
      })
      .catch((error) => alert("Login failed"));
  };

 
  const handleOpenModal = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    setIsbn(book.isbn);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container>
      {!token ? (
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Login</Typography>
          <TextField
            label="ISBN"
            fullWidth
            onChange={(e) => setIsbn(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button
            variant="contained"
            onClick={() => handleLogin(isbn, password)}
            fullWidth
          >
            Login
          </Button>
        </Paper>
      ) : (
        <div>
          <Paper style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6">Add a New Book</Typography>
            <TextField
              label="Title"
              fullWidth
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Author"
              fullWidth
              onChange={(e) => setAuthor(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Year"
              fullWidth
              onChange={(e) => setYear(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Button variant="contained" onClick={addBook} fullWidth>
              Add Book
            </Button>
          </Paper>

          <TextField
            label="Search by ISBN or Title"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") searchBooks();
            }}
            style={{ marginBottom: 20 }}
          />

          <List>
            {bookList.length > 0 ? (
              bookList.map((book) => (
                <ListItem key={book.isbn}>
                  <ListItemText
                    primary={book.title}
                    secondary={`Author: ${book.author}`}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModal(book)} 
                      style={{ marginRight: 10 }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => removeBook(book.isbn)}
                    >
                      Remove
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">No books found</Typography>
            )}
          </List>

          {/* Modal for updating book */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Update Book</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: 10 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateBook} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Container>
  );
};

export default BookForm;
