import { useState, useEffect } from 'react';
import "./SignUp.css"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to="https://github.com/kaylajo838">
        Kayla Imming
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [user, setUser] = useState({})
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName")
    });

    // check if email already exists
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      console.log("Email already exists!");
      setEmailExists(true)
      return;
    } else {
      setEmailExists(false)
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
            console.log(user)
            updateProfile(user, {
                displayName: firstName + " " + lastName
            })
            // add data to user
            const data = {
              uid: user.uid,
              email: user.email,
            }

            setUser(data)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    });
  };

  useEffect(() => {
    // firebase functionality
    const addUserToFirebase = async () => {
      console.log(user)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
      })
    }
    if (Object.keys(user).length > 0) {
      addUserToFirebase()
    }
    
  }, [user])


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
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
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
                        required
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
                        required
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
                        required
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
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, width: "fit-content", pr: 3, pl: 3 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item sx={{ color: "red", fontSize: "18px", mb: 2, mt: 1 }}>
                      { emailExists ? "This email already exists! Please sign in" : ""}
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link to="/sign-in" variant="body2" sx={{ fontSize: "18px" }}> 
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 5, color: "white" }} />
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
