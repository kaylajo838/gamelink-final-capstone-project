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
import { signInWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link  to="https://github.com/kaylajo838" sx={{ color: "white", textDecoration: "underline", "&:hover": {color: "#2ca627"}}}>
        Kayla Imming
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigate('/')
        setErrorMessage('');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/invalid-email' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          setErrorMessage(errorMessage);
        }
    });
  };


  return (
    <div className="signup-main-body-container">
      <div className="signup-container">
        <div className="signup-form-container">
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
                  Sign In
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                        sx={{
                          input: { color: "white" },
                          fieldset: {
                            borderColor: "#2ca627",
                            borderWidth: "2px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#2ca627",
                            },
                          },
                          "& label": {
                            color: "#2ca627",
                            fontWeight: 500,
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
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                        sx={{
                          input: { color: "white" },
                          fieldset: {
                            borderColor: "#2ca627",
                            borderWidth: "2px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#2ca627",
                            },
                          },
                          "& label": {
                            color: "#2ca627",
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center">
                    {errorMessage && (
                      <Grid
                        item
                        sx={{ color: "red", fontSize: "15px", mb: 0, mt: 1 }}
                      >
                        {errorMessage}
                      </Grid>
                    )}
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, width: "fit-content", pr: 3, pl: 3 }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
              <Typography
                component="p"
                variant="h5"
                sx={{
                  fontSize: 16,
                }}
              >
                Don't have an account? Sign up <Link to="/sign-up" sx={{ color: "white", textDecoration: "underline", "&:hover": {color: "#2ca627"}}}>here</Link>.
              </Typography>
              <Copyright sx={{ mt: 2, color: "white" }} />
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
