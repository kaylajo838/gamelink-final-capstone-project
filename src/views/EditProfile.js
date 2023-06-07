import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "./EditProfile.css"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from '../firebase'
import { updatePassword, updateProfile, updateEmail, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Alert from '@mui/material/Alert';
// import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";


export default function EditProfile() {

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/sign-in');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [reauthDialogOpen, setReauthDialogOpen] = useState(false); 
  const [dialogCallback, setDialogCallback] = useState(null);


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
            openReauthDialog(async () => {
              await updatePassword(user, password);
            });
          }
          
          if (email !== "") {
            openReauthDialog(async () => {
              await updateEmail(user, email);
            });
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


  const handleReauthentication = async (email, password) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);
  
    try {
      await reauthenticateWithCredential(user, credential);
      console.log("User re-authenticated.");
      setReauthDialogOpen(false);
  
      if (dialogCallback) {
        await dialogCallback();
        setDialogCallback(null);
      }
    } catch (error) {
      console.error("Error re-authenticating user:", error.message);
      setAlertSeverity("error");
      setAlertMessage("Re-authentication Failed");
      setAlertOpen(true);
    }
  };

  const openReauthDialog = (callback) => {
    setReauthDialogOpen(true);
    setDialogCallback(() => callback);
  };

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
  
      const storage = getStorage();
      const storageRef = ref(storage, 'avatars/' + auth.currentUser.uid);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          
        },
        (error) => {
          console.error('Error uploading image:', error.message);
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setImageUrl(downloadURL);
  
          setAvatarUrl(downloadURL);
        }
      );
    }
  };

  const reauthDialog = (
    <Dialog open={reauthDialogOpen} onClose={() => setReauthDialogOpen(false)}>
      <DialogTitle>Please Enter Your Current Email and Password to Update</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          sx={{
            '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
              WebkitTextFillColor: 'black',
              transition: 'background-color 5000s ease-in-out 0s',
            },
          }}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{
            '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
              WebkitTextFillColor: 'black',
              transition: 'background-color 5000s ease-in-out 0s',
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setReauthDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => handleReauthentication(email, password)}>Re-authenticate</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className="signup-main-body-container">
        {reauthDialog}
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
                    <Avatar alt="Remy Sharp" src={imageUrl} sx={{marginTop: "20px", height: "80px", width: "80px", border: "2px solid black"}}/>
                    
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
