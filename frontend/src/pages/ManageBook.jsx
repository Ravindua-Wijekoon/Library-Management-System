import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from '../config';

const ManageBook = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const scannerRef = useRef(null);

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
      setIsHide(false);
      setTimeout(() => {
        startScanner();
      }, 0);
    }
  };

  const startScanner = () => {
    const html5QrCode = new Html5Qrcode('reader');
    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 5, qrbox: { width: 250, height: 250 } },
        (decodedText) => handleScanQRCode(decodedText),
        (errorMessage) => console.error(`QR Code Scanning Error: ${errorMessage}`)
      )
      .then(() => {
        scannerRef.current = html5QrCode;
        setIsScanning(true);
      })
      .catch((err) => console.error('Failed to initialize scanner', err));
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

        formik.setFieldValue('bookName', book.name);
        formik.setFieldValue('author', book.author);
        formik.setFieldValue('isbn', book.isbn);

        setSelectedBook(book);

        // Swal.fire({
        //   icon: 'success',
        //   title: 'QR Code Scanned',
        //   text: `Book "${book.name}" selected!`,
        //   confirmButtonText: 'OK',
        // });

        stopScanner();
      } catch (error) {
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error',
        //   text: 'Failed to fetch book details. Please try again.',
        //   confirmButtonText: 'OK',
        //});
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      bookName: '',
      author: '',
      isbn: '',
      indexNumber: '',
    },
    validationSchema: Yup.object({
      indexNumber: Yup.string().required('Index number is required'),
    }),
    onSubmit: () => {}, // No default submit; handled manually
  });

  const handleReleaseBook = async () => {
    formik.setTouched({
      bookName: true,
      indexNumber: true,
    });
  
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${config.apiUrl}/api/books/release`,
          {
            bookId: selectedBook._id,
            userId: formik.values.indexNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        Swal.fire({
          icon: 'success',
          title: 'Book Released',
          text: response.data,
          confirmButtonText: 'OK',
        });
  
        formik.resetForm();
        setSelectedBook(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User with this index does not exist.',
            confirmButtonText: 'OK',
          });
        } else if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data, // Show backend validation message
            confirmButtonText: 'OK',
          });
        }
      }
    }
  };

  const handleReturnBook = async () => {
    formik.setTouched({
      bookName: true,
      indexNumber: true,
    });

    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${config.apiUrl}/api/books/return`,
          {
            bookId: selectedBook._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer prefix
            },
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Book Returned',
          text: `Book "${selectedBook.name}" has been successfully returned!`,
          confirmButtonText: 'OK',
        });

        const updatedBooks = books.map((book) =>
          book._id === selectedBook._id ? { ...book, available: true } : book
        );
        setBooks(updatedBooks);
        setSelectedBook(null);
        formik.resetForm();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to return the book. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleLogout = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out!',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success').then(() => {
            window.location.href = '/';
          });
        }
      });
    };

  return (
    <Box>
      <AppBar position="static" sx={{ padding: '0.5rem', boxShadow: 4 }}>
        <Toolbar>
          <Grid container direction={'row'} style={{ flexGrow: 1 }}>
            <img
              src="https://lib.cmb.ac.lk/wp-content/uploads/2016/09/logo-3.png"
              alt="Library Logo"
              style={{ maxWidth: '180px' }}
            />
          </Grid>
          <Button color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container marginX={'auto'} direction={'column'} md={6} sx={{ marginTop: 4 }}>
        <Typography variant="h4" mb={4} gutterBottom>
          Manage a Book
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
              color={isScanning ? 'error' : 'primary'}
              onClick={toggleScanner}
              sx={{ marginTop: 2 }}
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </CardContent>
        </Card>

        <form>
          <Autocomplete
            options={filteredBooks}
            getOptionLabel={(option) => option.name || ''}
            value={books.find((b) => b.name === formik.values.bookName) || null}
            inputValue={formik.values.bookName}
            onInputChange={(event, value) => {
              formik.setFieldValue('bookName', value || '');
              if (value) {
                const filtered = books.filter((book) =>
                  book.name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredBooks(filtered);
              } else {
                setFilteredBooks([]);
              }
            }}
            onChange={(event, newValue) => {
              formik.setFieldValue('bookName', newValue?.name || '');
              formik.setFieldValue('author', newValue?.author || '');
              formik.setFieldValue('isbn', newValue?.isbn || '');
              setSelectedBook(newValue || null);
            }}
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
            value={formik.values.author}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            margin="dense"
            label="ISBN"
            fullWidth
            size="small"
            value={formik.values.isbn}
            sx={{ mt: 2 }}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            margin="dense"
            label="Index Number"
            fullWidth
            size="small"
            name="indexNumber"
            value={formik.values.indexNumber}
            onChange={formik.handleChange}
            error={formik.touched.indexNumber && Boolean(formik.errors.indexNumber)}
            helperText={formik.touched.indexNumber && formik.errors.indexNumber}
            sx={{ mt: 2 }}
          />

          <Box sx={{ textAlign: 'right', mt: 2, mb:4 }}>
            {selectedBook?.available ? (
              <Button variant="contained" color="secondary" onClick={handleReleaseBook}>
                Release Book
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleReturnBook}>
                Return Book
              </Button>
            )}
          </Box>
        </form>
      </Grid>
    </Box>
  );
};

export default ManageBook;
