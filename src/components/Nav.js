import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../images/game-logo.png'

import AuthState from "./AuthState";
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [authUser, setAuthUser] = useState('')
  const [firstNameInitial, setFirstNameInitial] = useState('');
  const [lastNameInitial, setLastNameInitial] = useState('');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate()

  const userSignOut = () => {
      signOut(auth).then(() => {
          // Sign-out successful.
          console.log('signed out')
          navigate('/sign-in')
        }).catch((error) => {
          // An error happened.
          console.log(error.message)
        });
    }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user)
          console.log(user)
          let splitUserName = user.displayName.split(' ')
          let firstName = splitUserName[0];
          let lastName = splitUserName[1];
          setFirstNameInitial(firstName ? firstName[0] : '');
          setLastNameInitial(lastName ? lastName[0] : '');
        } else {
          setAuthUser('')
          setFirstNameInitial('');
          setLastNameInitial('');
        }
      }, [authUser]);
  });

  

  

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(0.25turn, #21ac25, #4d88bb, #383838)",
        borderBottom: "2px solid white",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          marginLeft: "0",
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="My Logo"
              style={{ marginRight: "2rem", height: "2.5rem" }}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Home</Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/game-search"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Game Search</Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/my-library"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">My Library</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="My Logo"
              style={{ marginRight: "2rem", height: "2.5rem" }}
            />
          </Typography>

          {authUser ? (
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/game-search"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Game Search
            </Button>
            <Button
              component={Link}
              to="/my-library"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              My Library
            </Button>
          </Box>
          ) : null }

          {!authUser ? (
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              to="/sign-up"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Sign Up
            </Button>
            <Button
              component={Link}
              to="/sign-in"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Sign In
            </Button>
          </Box>
          ) : null }

          <Box>
           <AuthState/>
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
            {authUser ? (
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                <Avatar sx={{ bgcolor: "#479acd" }}>{firstNameInitial}{lastNameInitial}</Avatar>
              </IconButton>
            </Tooltip>
            ) : null}

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              {authUser ? (
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </Link>
              </MenuItem>
              ) : null}

              {authUser ? (
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/edit-profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Edit Profile</Typography>
                </Link>
              </MenuItem>
              ) : null}

              {authUser ? (
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/wishlist"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">My Wishlist</Typography>
                </Link>
              </MenuItem>
              ) : null}

              {authUser ? (
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/logout"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center" onClick={userSignOut}>Log Out</Typography>
                </Link>
              </MenuItem>
              ) : null}

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;