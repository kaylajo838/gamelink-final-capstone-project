import React from 'react'
import './Home.css'
import '@fontsource/roboto/500.css';
import GamepadTwoToneIcon from '@mui/icons-material/GamepadTwoTone';

// image imports
import logo from '../images/game-logo.png'
import steamLogo from '../images/steam-sprite.png'
import epicLogo from '../images/epic-logo.png'
import xboxLogo from '../images/xbox-logo.png'
import psLogo from '../images/playstation-logo.png'

export default function Home() {
  return (
    <div className='home-main-body-container'>
     <div className="home-main-div">
      <div className="home-main-body">
        <div className="home-body-container">
          <div className="home-container">
            <img className="home-img" src={logo} />
            <p className="home-p">
              <span className="home-icon-span-start"><GamepadTwoToneIcon /></span>Welcome to the ultimate one-stop gaming page!<span className="home-icon-span-end"><GamepadTwoToneIcon /></span>
            </p>
            <p className="home-p">
              <span className="home-icon-span-start"><GamepadTwoToneIcon /></span>Take control of your gaming destiny!<span className="home-icon-span-end"><GamepadTwoToneIcon /></span>
            </p>
            <p className="home-p">
              <span className="home-icon-span-start"></span>You can view all your gaming libraries from all game platforms you play on in one place.<span className="home-icon-span-end"><GamepadTwoToneIcon /></span>
            </p>
            <div className="multi-line-container">
              <span className="home-icon-span-start"><GamepadTwoToneIcon /></span>
              <div className="home-paragraph-container">
                <p className="home-p">You can search our gaming database by game or genre, and add games</p>
                <p className="home-p">you want to your wishlist.</p>
              </div>
              <span className="home-icon-span-end"><GamepadTwoToneIcon /></span>
            </div>
            <p className="home-p">
              <span className="home-icon-span-start"><GamepadTwoToneIcon /></span>Unleash your inner gamer!<span className="home-icon-span-end"><GamepadTwoToneIcon /></span>
            </p>
          </div>
          <div className="home-logo-container">
            <div className="home-logo-box">
              <img className="home-logo-img" src={steamLogo} />
            </div>
            <div className="home-logo-box">
              <img className="home-logo-img" src={epicLogo} />
            </div>
            <div className="home-logo-box">
              <img className="home-logo-img" src={xboxLogo} />
            </div>
            <div className="home-logo-box">
              <img className="home-logo-img" src={psLogo} />
            </div>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
}

