import { useState, useEffect } from 'react'
import './Home.css'
import '@fontsource/roboto/500.css';
import GamepadTwoToneIcon from '@mui/icons-material/GamepadTwoTone';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Typography, Grid } from '@mui/material';
// image imports
import logo from '../images/game-logo.png'
import steamLogo from '../images/steam-sprite.png'
import epicLogo from '../images/epic-logo.png'
import xboxLogo from '../images/xbox-logo.png'
import psLogo from '../images/playstation-logo.png'


export default function Home() {

  const [recentGameTitle, setRecentGameTitle] = useState([])
  const [alltimeGameTitle, setAlltimeGameTitle] = useState([])
  const [currentDate, setCurrentDate] = useState('')
  const [currentYear, setCurrentYear] = useState('')

  let getCurrentDate = () => {
      let newDate = new Date()
      let date = newDate.getDate().toString().padStart(2, '0');
      let month = (newDate.getMonth() + 1).toString().padStart(2, '0');
      let year = newDate.getFullYear();
      
      
      setCurrentDate(`${year}-${month}-${date}`)
      return `${year}-${month}-${date}`
  }

  let getCurrentYear = () => {
    let newDate = new Date()
    let year = newDate.getFullYear();

    setCurrentYear(`${year}`)
    return `${year}`
  }
  
  useEffect(() => {
    getCurrentDate();
    getCurrentYear();
  }, []);

  useEffect(() => {
    if (currentDate) {
      trendingApi();
    }
    alltimeTrendingApi()
  }, [currentDate]);
    

  const trendingApi = async () => {
    const apiKey = 'abec424581074dfd9006811f98107886';
    try {
      const url = await fetch(
        `https://api.rawg.io/api/games?ordering=-score&page=1&page_size=20&dates=${currentYear}-01-01,${currentDate}&key=${apiKey}`
      );
      const data = await url.json();
  
      if (data && data.results) {
        let results = data.results
        const gameTitleArray = results.map((gameInfo) => {

          const gameTitle = gameInfo.name
          const gameImg = gameInfo.background_image

          return {
            title: gameTitle,
            image: gameImg
          }
        })
        setRecentGameTitle(gameTitleArray)
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const alltimeTrendingApi = async () => {
    const apiKey = 'abec424581074dfd9006811f98107886';
    try {
      const url = await fetch(
        `https://api.rawg.io/api/games?ordering=score&page=1&page_size=20&key=${apiKey}`
      );
      const data = await url.json();
  
      if (data && data.results) {
        let results = data.results

        const gameTitleArray = results.map((gameInfo) => {
          const gameTitle = gameInfo.name
          const gameImg = gameInfo.background_image

          return {
            title: gameTitle,
            image: gameImg
          }
        })
        setAlltimeGameTitle(gameTitleArray)
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  return (
    <div className='home-main-body-container'>
     <div className="home-main-div">
      <div className="home-main-body">

      <div className='home-trending-body'>
      <Typography variant="h5" component="div" align="center" gutterBottom sx={{
          backgroundColor: "#4c4c4b", 
          color: "white", 
          width: "100%", 
          paddingTop: "5px", 
          paddingBottom: "5px", 
          border: "2px solid #2ca627",
          borderRadius: "0.5em",
          boxShadow: "0 0 15px 10px white",
          marginBottom: "30px"
        }}>
          This Year's Trending Games
        </Typography>
        <Grid container justifyContent="center">
          <ImageList sx={{ width: 400, height: 550, border: "5px solid #2ca627", borderRadius: "0.5em", boxShadow: "0 0 15px 20px black" }}>
          {recentGameTitle && recentGameTitle.map((game) => (
            <ImageListItem
              key={game.image}
              cols={2}
              rows={2}
            >
              {game.image && (
                <img
                  src={`${game.image}?w=248&fit=crop&auto=format`}
                  srcSet={`${game.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={game.title}
                  loading="lazy"
                />
              )}
              <ImageListItemBar title={game.title} />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
        </div>
      
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

        <div className='home-trending-body-2'>
        <Typography variant="h5" component="div" align="center" gutterBottom sx={{
            backgroundColor: "#4c4c4b", 
            color: "white", 
            width: "100%", 
            paddingTop: "5px", 
            paddingBottom: "5px", 
            border: "2px solid #2ca627",
            borderRadius: "0.5em",
            boxShadow: "0 0 15px 10px white",
            marginBottom: "30px"
          }}>
            Top Games of All Time
          </Typography>
          <Grid container justifyContent="center">
            <ImageList sx={{ width: 400, height: 550, border: "5px solid #2ca627", borderRadius: "0.5em", boxShadow: "0 0 15px 20px black" }}>
              {alltimeGameTitle && alltimeGameTitle.map((game) => (
                <ImageListItem
                key={game.image}
                cols={2}
                rows={2}
              >
                {game.image && (
                  <img
                    src={`${game.image}?w=248&fit=crop&auto=format`}
                    srcSet={`${game.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={game.title}
                    loading="lazy"
                  />
                )}
                <ImageListItemBar title={game.title} />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        </div>

      </div>
     </div>
    </div>
  );
}

