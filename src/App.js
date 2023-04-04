import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NativeSelect } from '@mui/material';
import Nav from "./components/Nav";
import Footer from "./components/Footer"
import Home from "./views/Home";
import GameSearch from './views/GameSearch';
import MyLibrary from './views/MyLibrary';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Nav />

          <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/game-search' element={<GameSearch/>}/>
          <Route path="/my-library" element={<MyLibrary/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          </Routes>

          <Footer/>
        </div>
      </BrowserRouter>
  
    </div>
  );
}

export default App;
