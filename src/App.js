import { useEffect, useState, useContext } from 'react';
import { auth } from './firebase';
import LoadingSpinner from '../src/components/LoadingSpinner';

import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer"
import Home from "./views/Home";
import GameSearch from './views/GameSearch';
import MyLibrary from './views/MyLibrary';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Wishlist from './views/Wishlist';
import EditProfile from './views/EditProfile';
import Profile from './views/Profile';


import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Nav />

          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/" element={<Home/>}/> */}
            <Route path="/game-search" element={<GameSearch />} />
            <Route path="/my-library" element={<MyLibrary />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
