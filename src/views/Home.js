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


  const itemData = [
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[0].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[0].title : '',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[1].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[1].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[2].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[2].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[3].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[3].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[4].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[4].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[5].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[5].title : '',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[6].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[6].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[7].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[7].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[8].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[8].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[9].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[9].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[10].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[10].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[11].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[11].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[12].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[12].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[13].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[13].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[14].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[14].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[15].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[15].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[16].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[16].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[17].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[17].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[18].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[18].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: recentGameTitle.length > 0 ? recentGameTitle[19].image : '',
      title: recentGameTitle.length > 0 ? recentGameTitle[19].title : '',
      rows: 2,
      cols: 2,
    },
  ];

  const alltimeItemData = [
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[0].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[0].title : '',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[1].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[1].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[2].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[2].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[3].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[3].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[4].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[4].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[5].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[5].title : '',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[6].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[6].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[7].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[7].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[8].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[8].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[9].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[9].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[10].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[10].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[11].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[11].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[12].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[12].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[13].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[13].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[14].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[14].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[15].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[15].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[16].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[16].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[17].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[17].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[18].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[18].title : '',
      rows: 2,
      cols: 2,
    },
    {
      img: alltimeGameTitle.length > 0 ? alltimeGameTitle[19].image : '',
      title: alltimeGameTitle.length > 0 ? alltimeGameTitle[19].title : '',
      rows: 2,
      cols: 2,
    },
  ];


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

