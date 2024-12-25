import React, { useState, useCallback } from 'react';
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
  TextField,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../components/crop';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config';
import theme from '../theme';

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null); // State for the selected image file
  const [croppedImage, setCroppedImage] = useState(null); // State for the cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isCropComplete, setIsCropComplete] = useState(false); // Tracks if cropping is complete

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setImage(null);
    setCroppedImage(null);
    setIsCropComplete(false);
    setOpen(false);
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

  const handleCancelCrop = () => {
    setImage(null); // Reset the selected image
    setCroppedImage(null);
    setIsCropComplete(false);
    setCropModalOpen(false); // Close the crop dialog
  };

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
            Authorization: token,
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
        handleClose();
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

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Book
        </Button>

        {/* Dialog for Adding a Book */}
        <Dialog open={open} onClose={handleClose}>
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Add Book
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
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
      </Container>
    </ThemeProvider>
  );
};

export default AdminDashboard;
