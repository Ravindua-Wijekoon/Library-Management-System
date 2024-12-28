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
import Swal from 'sweetalert2';

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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} style={{ padding: 0 }}>

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

        

        {/* Card Section */}
        <Box paddingX="5rem">
          <Grid container mt={2} spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                onClick={() => navigate('/books')} 
                sx={{
                  cursor: 'pointer',
                  boxShadow: 6,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
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
              <Card
                sx={{
                  cursor: 'pointer',
                  boxShadow: 6,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
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
              <Card
                sx={{
                  cursor: 'pointer',
                  boxShadow: 6,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
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

        {/* Footer */}
        <Box paddingX={5} marginTop={8} textAlign="center">
          <Typography variant="h6">Contact Us</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            Faculty of Technology,<br />
            University of Colombo,<br />
            Mahenwatta, Pitipana, Homagama,<br /> Sri Lanka.
          </Typography>
        </Box>

        <Box textAlign="center" padding="1rem" bgcolor="#f5f5f5" marginTop={4}>
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
      
    </ThemeProvider>
  );
};

export default HomePage;
