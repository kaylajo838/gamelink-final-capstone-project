import { useState, useEffect } from 'react';
import "./EditProfile.css"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth, db } from '../firebase'
import { updatePassword, updateProfile, updateEmail, getAuth } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function EditProfile() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); 

  const theme = createTheme();

  const handleUpdate = async (event) => {
    event.preventDefault();
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const currentDisplayName = user.displayName || "";
        const currentFirstName = currentDisplayName.split(" ")[0] || "";
        const currentLastName = currentDisplayName.split(" ")[1] || "";

        const newFirstName = firstName !== "" ? firstName : currentFirstName;
        const newLastName = lastName !== "" ? lastName : currentLastName;

        await updateProfile(user, {
        displayName: newFirstName + " " + newLastName,
        });
  
        if (password !== "") {
          await updatePassword(user, password);
        }
        if (email !== "") {
            await updateEmail(user, email)
        }
  
        console.log("User profile updated successfully");
        setAlertSeverity("success");
        setAlertMessage("Successfully Updated Profile!");
        setAlertOpen(true);
      } catch (error) {
        console.error("Error updating user profile:", error.message);
        setAlertSeverity("error");
        setAlertMessage("Updating Profile Failed");
        setAlertOpen(true);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // Show the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
  
      // Upload the image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, 'avatars/' + auth.currentUser.uid);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          // You can show upload progress here
        },
        (error) => {
          console.error('Error uploading image:', error.message);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setImageUrl(downloadURL);
  
          // This is the new line to update the Navbar avatarUrl state
          // after the image is uploaded.
          setAvatarUrl(downloadURL);
        }
      );
    }
  };

  return (
    <div className="signup-main-body-container">
      <div className="signup-container">
        <div className='signup-form-container'>
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "#8e3dc6" }}>
                  <ModeEditIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Edit Profile
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleUpdate}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        // required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        onChange={(event) => {setFirstName(event.target.value)}}
                        sx={{
                            input: { color: "white" },
                            fieldset: { borderColor: "#2ca627", borderWidth: "2px" },
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                            "& label": {
                              color: "#2ca627",
                              fontWeight: 500
                            },
                          }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        // required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        onChange={(event) => {setLastName(event.target.value)}}
                        sx={{
                            input: { color: "white" },
                            fieldset: { borderColor: "#2ca627", borderWidth: "2px" },
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                            "& label": {
                              color: "#2ca627",
                              fontWeight: 500
                            },
                          }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        // required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(event) => {setEmail(event.target.value)}}
                        sx={{
                            input: { color: "white" },
                            fieldset: { borderColor: "#2ca627", borderWidth: "2px" },
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                            "& label": {
                              color: "#2ca627",
                              fontWeight: 500
                            },
                          }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        // required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={(event) => {setPassword(event.target.value)}}
                        sx={{
                            input: { color: "white" },
                            fieldset: { borderColor: "#2ca627", borderWidth: "2px" },
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                            "& label": {
                              color: "#2ca627",
                              fontWeight: 500
                            },
                          }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Button variant="contained" component="label" sx={{color: "white", backgroundColor: "#2ca627"}}>
                        Upload Profile Image
                        <input hidden accept="image/*" multiple type="file" onChange={handleImageChange} />
                    </Button>
                    <Avatar alt="Remy Sharp" src={imageUrl} sx={{marginTop: "20px"}}/>
                    
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, width: "fit-content", pr: 3, pl: 3 }}
                  >
                    Update
                  </Button>
                  <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={alertSeverity}>
                        {alertMessage}
                    </Alert>
                  </Snackbar>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}