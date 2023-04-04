import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NativeSelect } from '@mui/material';
import Nav from "./components/Nav";
import Footer from "./components/Footer"
import Home from "./views/Home";
import GameSearch from './views/GameSearch';
import MyLibrary from './views/MyLibrary';

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
          </Routes>

          <Footer/>
        </div>
      </BrowserRouter>
  
    </div>
  );
}

export default App;
