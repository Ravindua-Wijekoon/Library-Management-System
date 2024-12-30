import React, { useState, useCallback, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { LibraryBooks, Book, AddCircle, ManageAccounts } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../components/crop';

const AdminDashboard = () => {
  const [userName, setUserName] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [releasedBooks, setReleasedBooks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [borrowedBooksOpen, setBorrowedBooksOpen] = useState(false);
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [image, setImage] = useState(null); // State for the selected image file
  const [croppedImage, setCroppedImage] = useState(null); // State for the cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isCropComplete, setIsCropComplete] = useState(false);

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

    // Fetch library stats
    fetchLibraryStats();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      author: '',
      isbn: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Book Name is required'),
      author: Yup.string().required('Author is required'),
      isbn: Yup.string().required('ISBN is required'),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (!croppedImage) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select an image before adding the book.',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('author', values.author);
        formData.append('isbn', values.isbn);
        formData.append('description', values.description);
        formData.append('image', croppedImage);

        await axios.post(`${config.apiUrl}/api/books`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
          },
      });

        Swal.fire({
          icon: 'success',
          title: 'Book Added',
          text: `Book "${values.name}" has been added successfully!`,
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
        handleAddClose();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add the book. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
      }
    },
  });

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);
        setImage({ file, preview });
        setCropModalOpen(true); // Open crop modal
      }
    },
  });

  const handleSaveCrop = () => {
      if (!isCropComplete) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please crop the image before saving.',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
        return;
      }
      setCropModalOpen(false); // Close the crop dialog
    };

    const handleCancelCrop = () => {
      setImage(null); // Reset the selected image
      setCroppedImage(null);
      setIsCropComplete(false);
      setCropModalOpen(false); // Close the crop dialog
    };

  const fetchLibraryStats = async () => {
  try {
    const token = localStorage.getItem('token');

    // Fetch all books
    const booksResponse = await axios.get(`${config.apiUrl}/api/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Fetch all borrowed records
    const borrowResponse = await axios.get(`${config.apiUrl}/api/borrow`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Calculate total books
    setTotalBooks(booksResponse.data.length);

    // Calculate released books based on borrowed records with status "borrowed"
    const releasedBooksCount = borrowResponse.data.length;

    setReleasedBooks(releasedBooksCount);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
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

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
      try {
        const croppedImg = await getCroppedImg(image.preview, croppedAreaPixels);
        setCroppedImage(croppedImg);
        setIsCropComplete(true); // Mark crop as complete
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }, [image]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiUrl}/api/borrow/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("hello", response);
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    }
    setLoading(false);
  };

  const handleOpenBorrowedBooks = () => {
    fetchBorrowedBooks(); // Fetch borrowed books when the dialog opens
    setBorrowedBooksOpen(true);
  };

  const handleCloseBorrowedBooks = () => {
    setBorrowedBooksOpen(false);
  };

  const handleAddOpen = () => setAddOpen(true);

  const handleAddClose = () => {
    formik.resetForm();
    setImage(null);
    setCroppedImage(null);
    setIsCropComplete(false);
    setAddOpen(false);
  };


  const handleNavigateToManageBook = () => {
    navigate('/manage-book');
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

      <Container sx={{ marginTop: 4 }}>
        {/* Welcome Card */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: 'linear-gradient(to right, #1976d2, #1e88e5)',
                color: '#fff',
                padding: 3,
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent>
                <Typography variant="h4">Welcome, {userName}!</Typography>
                <Typography variant="h6">
                  Today's Date: {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Responsive Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/books')} 
              sx={{
                background: '#004080',
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <LibraryBooks sx={{ fontSize: 50, color: 'white', mb: 2 }} />
                <Typography variant="h5" color="white" gutterBottom>
                  Total Books
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {totalBooks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={handleOpenBorrowedBooks}
              sx={{
                background: 'white',
                border: '1px solid rgb(194, 194, 194)',
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Book sx={{ fontSize: 50, color: '#004080', mb: 2 }} />
                <Typography variant="h5" color="primary" gutterBottom>
                  Released Books
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#004080' }}>
                  {releasedBooks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={handleAddOpen}
              sx={{
                background: '#004080',
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <AddCircle sx={{ fontSize: 50, color: 'white', mb: 2 }} />
                <Typography variant="h5" color="white" gutterBottom>
                  Add New Book
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Quickly add a new book to the library.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={handleNavigateToManageBook}
              sx={{
                background: 'white',
                border: '1px solid rgb(194, 194, 194)',
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <ManageAccounts sx={{ fontSize: 50, color: '#004080', mb: 2 }} />
                <Typography variant="h5" color="primary" gutterBottom>
                  Manage Books
                </Typography>
                <Typography variant="body1" sx={{ color: '#004080' }}>
                  Edit or delete books in the library.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog for Borrowed Books */}
                <Dialog
                  open={borrowedBooksOpen}
                  onClose={handleCloseBorrowedBooks}
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
                    Currently Borrowed Books
                  </DialogTitle>
                  <DialogContent
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff, #f5f7fa)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    {loading ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <Typography variant="h6">Loading borrowed books...</Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          mt:2,
                          height: 400,
                          width: '100%',
                          background: '#fff',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                        }}
                      >
                        <DataGrid
                          rows={borrowedBooks}
                          columns={[
                            { field: 'bookName', headerName: '📘 Book Name', flex: 1 },
                            { field: 'userIndex', headerName: '🧑‍💻 User Index', flex: 1 },
                            {
                              field: 'borrowedDate',
                              headerName: '📅 Borrowed Date',
                              flex: 1,
                              valueFormatter: (params) =>
                                params
                                  ? new Date(params).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })
                                  : 'N/A',
                            },
                          ]}
                          pageSize={5}
                          rowsPerPageOptions={[5, 10, 15]}
                          disableSelectionOnClick
                          sx={{
                            '& .MuiDataGrid-columnHeaders': {
                              background: 'white',
                              color: '#000',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              borderBottom: '2px solid #e3f2fd',
                            },
                            '& .MuiDataGrid-cell': {
                              background: '#f9fbfa',
                              color: '#333',
                              fontSize: '14px',
                              padding: '8px',
                            },
                            '& .MuiDataGrid-row:hover': {
                              background: '#e3f2fd',
                              cursor: 'pointer',
                            },
                            '& .MuiDataGrid-footerContainer': {
                              background: '#fafafa',
                              borderTop: '1px solid #e0e0e0',
                              padding: '10px',
                            },
                            border: 'none',
                          }}
                        />
                      </Box>
                    )}
                  </DialogContent>
                  <DialogActions
                    sx={{
                      mr:2,
                      background: '#f5f5f5',
                      padding: '15px',
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <Button
                      onClick={handleCloseBorrowedBooks}
                      variant="contained"
                      sx={{
                        background: 'primary',
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        padding: '8px 20px',
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

          {/* Crop Modal */}
        <Dialog
          open={cropModalOpen}
          onClose={handleCancelCrop} // Reset image on cancel
          fullWidth
          maxWidth="md"
          sx={{
            '& .MuiDialog-paper': {
              height: '80vh',
            },
          }}
        >
          <DialogTitle>Crop Image</DialogTitle>
          <DialogContent>
            {image && (
              <Box sx={{ width: '100%', height: '60vh', position: 'relative' }}>
                <Cropper
                  image={image.preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    containerStyle: { width: '100%', height: '100%' },
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCrop}>Cancel</Button> {/* Resets the image */}
            <Button onClick={handleSaveCrop} variant="contained" color="primary" disabled={!isCropComplete}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

          {/* Dialog for Adding a Book */}
                  <Dialog open={addOpen} onClose={handleAddClose}>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogContent>
                      <form onSubmit={formik.handleSubmit}>
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: '2px dashed grey',
                            borderRadius: 1,
                            padding: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            mt: 2,
                            mb: 2,
                          }}
                        >
                          <input {...getInputProps()} />
                          <Typography variant="body2" color="textSecondary">
                            Drag and drop an image here, or click to select one
                          </Typography>
                        </Box>
                        {croppedImage && (
                          <Typography mb={2} variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Cropped image ready for upload.
                          </Typography>
                        )}
          
                        <TextField
                          margin="dense"
                          label="Book Name"
                          name="name"
                          fullWidth
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                          margin="dense"
                          label="Author"
                          name="author"
                          fullWidth
                          value={formik.values.author}
                          onChange={formik.handleChange}
                          error={formik.touched.author && Boolean(formik.errors.author)}
                          helperText={formik.touched.author && formik.errors.author}
                        />
                        <TextField
                          margin="dense"
                          label="ISBN"
                          name="isbn"
                          fullWidth
                          value={formik.values.isbn}
                          onChange={formik.handleChange}
                          error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                          helperText={formik.touched.isbn && formik.errors.isbn}
                        />
                        <TextField
                          margin="dense"
                          label="Description"
                          name="description"
                          multiline
                          rows={3}
                          fullWidth
                          value={formik.values.description}
                          onChange={formik.handleChange}
                        />
          
                        <DialogActions>
                          <Button onClick={handleAddClose}>Cancel</Button>
                          <Button type="submit" variant="contained" color="primary">
                            Add Book
                          </Button>
                        </DialogActions>
                      </form>
                    </DialogContent>
                  </Dialog>
      </Container>
    </Box>

    
  );
};

export default AdminDashboard;
