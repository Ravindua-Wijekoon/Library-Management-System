import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Box,
  Toolbar,
  AppBar,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import config from '../config';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/books`);
        setBooks(response.data);
        setFilteredBooks(response.data); // Initialize filtered books
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name || 'User');
        setUserRole(decodedToken.role || 'user');
      } catch {
        console.error('Invalid token.');
      }
    }

    fetchBooks();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter((book) =>
      book.name.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
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
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'swal2-custom-z-index', // Add custom z-index class here
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success').then(() => {
            window.location.href = '/';
          });
        }
      });
    };

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress size={60} thickness={5} color="primary" />
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ marginTop: 2, fontStyle: 'italic' }}
          >
            Loading books...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box paddingY={4}>
          <Typography variant="h5" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
    sx={{
      backgroundImage: 'url(https://your-image-url.jpg)', // Replace with your image URL or import path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh', // Ensures it covers the viewport height
      display: 'flex',
      flexDirection: 'column', // Ensure children stack properly
    }}
    >
      
      {/* Navbar */}
              <AppBar position="sticky" sx={{ padding: '0.5rem', boxShadow: 4 }}>
                <Toolbar>
                  <div style={{ flexGrow: 1 }}>
                    <img
                      src="https://lib.cmb.ac.lk/wp-content/uploads/2016/09/logo-3.png"
                      alt="Library Logo"
                      style={{ maxWidth: '180px' }}
                    />
                  </div>
                  {userName ? (
                    <>
                      <Typography variant="body1" sx={{ marginRight: 2 }}>
                        Welcome, <strong>{userName}</strong>
                      </Typography>
                      <Button color="inherit" variant="outlined" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button color="inherit" href="/login" variant="outlined">
                      Login
                    </Button>
                  )}
                </Toolbar>
              </AppBar>

      <Container>
        <Typography textAlign="center" mt={4} mb={4} variant="h4" gutterBottom>
          Available Books
        </Typography>
        
        {/* Search Bar */}
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            variant="outlined"
            placeholder="Search by book name..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: '100%', maxWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredBooks.length === 0 ? (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            No books found. Please try a different search term.
          </Typography>
        ) : (
          <Grid container spacing={3} mb={6}>
            {filteredBooks.map((book) => (
              <Grid item xs={6} sm={3} md={2} key={book._id}>
                <Card
                  onClick={() => handleBookClick(book)}
                  sx={{
                    cursor: 'pointer',
                    boxShadow: 3,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.03)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${config.apiUrl}${book.image}`}
                    alt={book.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ padding: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {book.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      by {book.author}
                    </Typography>
                  </CardContent>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'white',
                      backgroundColor: book.available ? 'green' : 'error.main',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '4px 8px', // Padding inside the background
                    }}
                  >
                    {book.available ? 'Available' : 'Not Available'}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialog */}
      {selectedBook && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogContent>
            <Grid container spacing={4}>
              {/* Book Image */}
              <Grid item xs={4}>
                <img
                  src={`${config.apiUrl}${selectedBook.image}`}
                  alt={selectedBook.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </Grid>

              {/* Book Details */}
              <Grid item xs={8}>
                <Typography variant="h4"  sx={{ fontWeight: 'bold' }}>
                  {selectedBook.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  By <strong>{selectedBook.author}</strong>
                </Typography>

                {/* ISBN Field */}
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 3 }}>
                  ISBN
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    background: '#f9fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    mt: 1,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {selectedBook.isbn}
                </Typography>
              
                {/* Description */}
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 3 }}>
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    background: '#f9fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    mt: 1,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {selectedBook.description || 'No description available.'}
                </Typography>
              </Grid>
            </Grid>

            {userRole === 'admin' && (
              <Divider sx={{ my: 4 }} />
            )}

            {/* Admin Actions */}
            {userRole === 'admin' && (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold' }}>
                  QR Code
                </Typography>
                  <img
                    src={`${config.apiUrl}${selectedBook.qrCode}`}
                    alt="QR Code"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      try {
                        const response = await fetch(`${config.apiUrl}${selectedBook.qrCode}`);
                        const blob = await response.blob();
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${selectedBook.name}_QR.png`;
                        link.click();
                        URL.revokeObjectURL(link.href);
                        toast.success('QR Code downloaded successfully!');
                      } catch (error) {
                        console.error('Failed to download QR Code:', error);
                        toast.error('Failed to download QR Code. Please try again.');
                      }
                    }}
                  >
                    Download QR Code
                  </Button>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{p: 2 }}>
            <Button onClick={handleCloseDialog} color="error" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ToastContainer position="bottom-left" />
    </Box>
  );
};

export default BooksPage;
