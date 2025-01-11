import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  Avatar,
  Paper,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import config from '../config';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import logBack from '../../src/assets/images/logBack.jpg';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004080', 
    },
    secondary: {
      main: '#D3A955', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const SignupPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      index: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      index: Yup.string().required('Index number is required'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(`${config.apiUrl}/api/auth/register`, values);
        setSuccess(true);
        setError('');

        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'Please log in to continue.',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.href = '/login'; // Redirect after alert
        });
      } catch (err) {
        setSuccess(false);


        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data || 'Error signing up.',
          confirmButtonText: 'OK',
        });
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url(${logBack})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container component={Paper} maxWidth="xs" sx={{ p: 4, boxShadow: 3, backgroundColor: 'rgba(255,255,255,0.9)' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <PersonAddOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Join the Library
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              Create your account to explore 
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                fullWidth
                size='small'
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                margin="normal"
                fullWidth
                id="lastName"
                size='small'
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
              <TextField
                margin="normal"
                fullWidth
                id="index"
                size='small'
                label="Index Number"
                name="index"
                autoComplete="index"
                value={formik.values.index}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.index && Boolean(formik.errors.index)}
                helperText={formik.touched.index && formik.errors.index}
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                size='small'
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                fullWidth
                size='small'
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Typography variant="body2" align="center">
                Do you have an account?{' '}
                <Link to="/login" variant="body2">
                  Log in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignupPage;
