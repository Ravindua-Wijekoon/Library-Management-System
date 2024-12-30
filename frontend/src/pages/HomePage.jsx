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
  Link as MuiLink,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import libBack from '../assets/images/libBack.jpg';
import theme from '../theme';
import Swal from 'sweetalert2';
import AboutBack from '../assets/images/L2.jpg';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); 

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
        popup: 'swal2-custom-z-index', 
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
            <MuiLink
              underline="none"
              sx={{ marginRight: 2, color: 'white', cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('home');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Home
            </MuiLink>
            <MuiLink
              underline="none"
              sx={{ marginRight: 2, color: 'white', cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('categaries');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Categaries
            </MuiLink>
            <MuiLink
              underline="none"
              sx={{ marginRight: 2, color: 'white', cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              About
            </MuiLink>
            <MuiLink
              underline="none"
              sx={{ marginRight: 6, color: 'white', cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('contact');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact Us
            </MuiLink>
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
          id='home'
          display="flex"
          justifyContent="left"
          alignItems="center"
          height="450px"
          style={{
            backgroundImage: `url(${libBack})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '2rem',
            color: '#fff',
            scrollMarginTop: '5rem',
          }}
        >
          <Container>
            <img
              src="https://lib.cmb.ac.lk/wp-content/uploads/2016/09/logo-3.png"
              alt="Library Logo"
              style={{ maxWidth: '300px', marginBottom: '1rem' }}
            />
            <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
              The Library
            </Typography>
            <Typography variant="h4">University Of Colombo</Typography>
            <Typography variant="h4" gutterBottom>
              Faculty Of Technology
            </Typography>
            <Typography variant="body1" style={{ fontStyle: 'italic', marginTop: '1rem' }}>
              "Reading is the gateway skill that makes all other learning possible."<br />
              -Barack Obama-
            </Typography>
          </Container>
        </Box>

        {/* Card Section */}
        <Container 
          paddingX="5rem" 
          id="categaries" 
          display={'flex'}
          flexDirection={'column'}
          justifyContent="center"
          sx={{
            scrollMarginTop: '5rem', 
            py:3
          }}>
          <Typography 
              mt={3}
              variant="h4" 
              align='center'
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)' 
              }}
          >
            Categories
          </Typography>
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
        </Container>

        {/* About Section */}
          <Box 
            id="about" 
            mt={6}
            height='450px'
            paddingX={5} 
            paddingY={5} 
            textAlign="center" 
            display={'flex'}
            flexDirection={'row'}
            justifyContent="center" 
            alignItems="center" 
            sx={{
              backgroundImage: `url(${AboutBack})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              scrollMarginTop: '4rem', 
              boxShadow: 3,
            }}
          >

          <Container>
          
            <Typography 
              variant="body1" 
              color="white" 
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                padding: '3rem', 
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' 
                }}
              >
                About Us
              </Typography>

              Faculty of Technology is one of the newest faculties being adjoined to the prestigious University of Colombo. With the establishment of the faculty, the Technology Library was started as a branch library to the Main Library of the university. The library was temporarily functioning on the Main Library premises until the faculty built its own structure that was officially opened in 2020. The faculty library, at present, is located on the ground floor of the ICT Department (or D Block). The total collection of the faculty library is around 215 books, however, it has subscribed to 61 electronic books, too. Among many other Learning & Research Support Services (LRSS), the faculty library is committed to conduct information literacy series, orientation programs and to provide reference/referral services to students and staff. LRSS include training on Turnitin, Mendeley, Grammarly and various applications related to learning and research activities of the library users. Technology Library has consisted of an academic staff member and two non-academic staff members to serve the user community of the faculty.
            </Typography>
          </Container>
        </Box>


        {/* Footer */}
        <Box
          id="contact"
          paddingX={5}
          textAlign="center"
          sx={{
            backgroundColor: 'primary.main',
            paddingY: 3,
          }}
        >
          <Typography variant="h6" color="white">
            Contact Us
          </Typography>
          <Typography variant="body2" color="white" sx={{ marginTop: 1 }}>
            Faculty of Technology,<br />
            University of Colombo,<br />
            Mahenwatta, Pitipana, Homagama,<br /> Sri Lanka.
          </Typography>
        </Box>

        <Box textAlign="center" padding="1rem" bgcolor="#f5f5f5" >
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;