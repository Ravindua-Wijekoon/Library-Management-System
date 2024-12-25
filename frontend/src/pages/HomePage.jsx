import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import libBack from '../assets/images/libBack.jpg';
import theme from '../theme';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // React Router's hook for navigation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name || 'User');
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} style={{ padding: 0 }}>
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="left"
          alignItems="center"
          height="65vh"
          style={{
            backgroundImage: `url(${libBack})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '2rem',
            color: '#fff',
          }}
        >
          <Grid>
            <img
              src="https://lib.cmb.ac.lk/wp-content/uploads/2016/09/logo-3.png"
              alt="Library Logo"
              style={{ maxWidth: '300px', marginBottom: '1rem' }}
            />
            <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: "bold" }}>
              The Library
            </Typography>
            <Typography variant="h4">University Of Colombo</Typography>
            <Typography variant="h4" gutterBottom>Faculty Of Technology</Typography>
            <Typography variant="body1" style={{ fontStyle: 'italic', marginTop: '1rem' }}>
              "Reading is the gateway skill that makes all other learning possible."<br />
              -Barack Obama-
            </Typography>
          </Grid>
        </Box>

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

        {/* Card Section */}
        <Box paddingX="5rem">
          <Grid container mt={2} spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card onClick={() => navigate('/books')} style={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image="https://www.vedantu.com/seo/content-images/c03fc31a-b1fc-4c5f-af6b-40cb5e2c94aa.jpg"
                  alt="Books"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Books
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image="https://ebookreadersoftware.wordpress.com/wp-content/uploads/2012/05/publish-ebooks.jpg"
                  alt="Guidelines"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    E-Books
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image="https://cothamschoolenglish.weebly.com/uploads/8/3/5/4/83549726/past-papers_2.png"
                  alt="Staff"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Past Papers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Footer Section */}
        <Box paddingX={5} marginTop="4rem">
          <Typography variant="h6">Contact Details</Typography>
          <Typography variant="body2" color="textSecondary">
            Faculty of Technology,<br />
            University of Colombo,<br />
            Mahenwatta, Pitipana,<br />
            Homagama,<br /> Sri Lanka.
          </Typography>
        </Box>
      </Container>

      <Box textAlign="center" padding="2rem" marginTop="2rem" bgcolor="#f5f5f5">
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
