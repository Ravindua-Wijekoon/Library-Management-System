import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Container, Box, Toolbar, AppBar, Button } from '@mui/material';
import axios from 'axios';
import config from '../config';
import { jwtDecode } from 'jwt-decode';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {

    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/books`);
        console.log('Books fetched:', response.data);
        setBooks(response.data);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books. Please try again later.');
      }
    };
    const token = localStorage.getItem('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name || 'User');
          } catch (error) {
            console.error('Invalid token:', error);
          }
    }
  
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Container>
        <Box paddingY={4}>
          <Typography variant="h5" color="textSecondary">
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
    <Box>
      {/* Navbar Section */}
      <AppBar position="sticky" sx={{ marginBottom: '2rem', padding: '0.5rem' }}>
          <Toolbar>
            <div style={{ flexGrow: 1 }}>
              <img
                src="https://lib.cmb.ac.lk/wp-content/uploads/2016/09/logo-3.png"
                alt="Library Logo"
                style={{ maxWidth: '200px' }}
              />
            </div>
            {userName ? (
              <>
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  Welcome, {userName}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" href="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

      <Container>
        <Box >
          <Typography mb={4} variant="h4" gutterBottom>Available Books</Typography>
          {books.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No books available. Please check back later.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {books.map((book) => (
                <Grid item xs={12} sm={4} md={3} key={book._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="300"
                      image={`${config.apiUrl}${book.image}`} // Adjust image URL path as needed
                      alt={book.name}
                    />
                    <CardContent>
                      <Typography variant="h5">{book.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {book.author}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default BooksPage;
