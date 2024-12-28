import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  Autocomplete,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ReleaseBook = () => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const scannerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/books`);
        setBooks(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch books. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchBooks();
  }, []);

  const toggleScanner = () => {
    if (isScanning) {
      stopScanner();
    } else {
      setIsHide(false); // Set isHide to false
      setTimeout(() => {
        startScanner(); // Start the scanner after ensuring setIsHide is processed
      }, 0); // Delay to ensure React processes state updates
    }
  };

  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 5,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => handleScanQRCode(decodedText),
        (errorMessage) => console.error(`QR Code Scanning Error: ${errorMessage}`)
      )
      .then(() => {
        scannerRef.current = html5QrCode;
        setIsScanning(true);
      })
      .catch((err) => console.error("Failed to initialize scanner", err));
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => scannerRef.current.clear());
      setIsScanning(false);
      setIsHide(true);
    }
  };

  const handleScanQRCode = async (result) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result);
        const bookId = parsedData.id;

        const response = await axios.get(`${config.apiUrl}/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const book = response.data;
        setBookName(book.name);
        setAuthor(book.author);
        setIsbn(book.isbn);

        Swal.fire({
          icon: 'success',
          title: 'QR Code Scanned',
          text: `Book "${book.name}" selected!`,
          confirmButtonText: 'OK',
        });

        // Stop scanning after success
        stopScanner();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch book details. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleBookSelect = (selectedBook) => {
    if (selectedBook) {
      setBookName(selectedBook.name);
      setAuthor(selectedBook.author);
      setIsbn(selectedBook.isbn);
    } else {
      setBookName('');
      setAuthor('');
      setIsbn('');
    }
  };

  const handleInputChange = (event, value) => {
    setBookName(value);
    if (value) {
      const filtered = books.filter((book) =>
        book.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  };

  const handleReleaseBook = async () => {
    if (!bookName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a book before releasing.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.apiUrl}/api/books/release`,
        { name: bookName, author, isbn },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Book Released',
        text: `Book "${bookName}" has been successfully released!`,
        confirmButtonText: 'OK',
      });

      setBookName('');
      setAuthor('');
      setIsbn('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to release the book. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Release Book
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container marginX={'auto'} direction={'column'} md={6} sx={{ marginTop: 4 }}>
        <Typography variant="h4" mb={4} gutterBottom>
          Release a Book
        </Typography>

        <Card sx={{ marginBottom: 4, textAlign: 'center', padding: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scan QR Code to Select Book
            </Typography>
            {!isHide && (
                <Box
                id="reader"
                sx={{
                    margin: '20px auto',
                    width: '300px',
                    height: '300px',
                    border: '2px solid #1976d2',
                    borderRadius: '10px',
                }}
                ></Box>
            )}
            <Button
              variant="contained"
              color={isScanning ? "error" : "primary"}
              onClick={toggleScanner}
              sx={{ marginTop: 2 }}
            >
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>
          </CardContent>
        </Card>

        <Autocomplete
          options={filteredBooks}
          getOptionLabel={(option) => option.name}
          value={books.find((b) => b.name === bookName) || null}
          onInputChange={handleInputChange}
          onChange={(event, newValue) => handleBookSelect(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Book Name"
              size="small"
              margin="dense"
              fullWidth
              placeholder="Type to search books"
            />
          )}
        />

        <TextField
          margin="dense"
          label="Author"
          fullWidth
          size="small"
          value={author}
          disabled
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="ISBN"
          fullWidth
          size="small"
          value={isbn}
          disabled
          sx={{ mt: 2 }}
        />

        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleReleaseBook}>
            Release Book
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default ReleaseBook;
