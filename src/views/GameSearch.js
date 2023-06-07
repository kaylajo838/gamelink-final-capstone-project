import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Search.css';
import '@fontsource/roboto/500.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import GameCard from '../components/GameCard'
import Grid from '@mui/material/Grid';

import { auth } from '../firebase';


export default function GameSearch() {

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

  const [gameTitle, setGameTitle] = useState("");
  const [selectedValues, setSelectedValues] = useState({
    genre: '',
    platform: ''
  })
  const [gameTitleData, setGameTitleData] = useState([])
  const [titleExists, setTitleExists] = useState(false)
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
 
// ------------ Section handling fetching to api when title is entered into form ------------ //
  
const handleTitleSubmit = async (event) => {
  // const url = await fetch(`https://api.rawg.io/api/games/assassins-creed-valhalla?key=${apiKey}`)
  // const data = await url.json()
  event.preventDefault();
  setGameTitleData([]);
  setTitleExists(false)
  const apiKey = 'abec424581074dfd9006811f98107886'
  const title = gameTitle;
  const gameData = await fetchGameData(title, apiKey);

  const gameDataTitle = gameData.name;
  const gameDescription = gameData.description_raw;
  const gameGenre = gameData.genres;
  const gameGenreArray = gameGenre.map((genre) => genre.name);
  const gameScore = gameData.metacritic;
  const gamePlatforms = gameData.platforms;
  const platformNamesArray = gamePlatforms.map(
    (platform) => platform.platform.name
  );
  const gameCover = gameData.background_image
  
  const ratings = gameData.ratings.map((rating) => ({
    title: rating.title,
    count: rating.count
  }))

  const gameTitleArray = [{
    title: gameDataTitle,
    description: gameDescription,
    genre: gameGenreArray,
    score: gameScore,
    platform: platformNamesArray,
    coverImg: gameCover,
    rating: ratings
  }];
  setGameTitleData(gameTitleArray);
  setGameTitle("");
  setIsSearchSubmitted(true);
  setTitleExists(false)
}

  // Remove previous search results from the DOM
  const cleanup = () => {
    setIsSearchSubmitted(false);
    setGameTitleData([]);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  // fetch to api to get game by title search 
  async function fetchGameData(title, apiKey) {
    const slugTitle = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const url = `https://api.rawg.io/api/games/${slugTitle}?key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      setTitleExists(true)
      return data;
    } catch (error) {
      console.error(error);
      setTitleExists(false)
      return null;
    }
  }


// ---------------------------------------------------------------------------------------------------------//

// ------------ Section handling fetching to api when genre and/or platform is entered into form ------------ //

// Object holding genres with their id's as the value
const genreIds = {
  "Action": 4,
  "Adventure": 3,
  "Arcade": 11,
  "Casual": 40,
  "Educational": 34,
  "Family": 19,
  "Fighting": 6,
  "Indie": 51,
  "Massively Multiplayer": 59,
  "Puzzle": 7,
  "Racing": 1,
  "RPG": 5,
  "Shooter": 2,
  "Simulation": 14,
  "Sports": 15,
  "Strategy": 10,
}

// Object holding platforms with their id's as their value
const platformIds = {
  "Macintosh": 5,
  "Nintendo Switch": 7,
  "Playstation": 27,
  "Playstation 2": 15,
  "Playstation 3": 16,
  "Playstation 4": 18,
  "Playstation 5": 187,
  "Xbox": 80,
  "Xbox 360": 14,
  "Xbox One": 1,
  "Xbox Series S|X": 186,
  "Windows": 4
}


  const handleGenreChange = (event) => {
    // event.preventDefault();
    // setGenre(event.target.value);
    setSelectedValues({ ...selectedValues, genre: event.target.value })
  };

  const handlePlatformChange = (event) => {
    // event.preventDefault();
    // setPlatform(event.target.value);
    setSelectedValues({ ...selectedValues, platform: event.target.value })
  };

  const handleSelectedSubmit = async (event) => {
    setTitleExists(false)
    const apiKey = 'abec424581074dfd9006811f98107886';
    event.preventDefault();
    console.log(selectedValues);

    const selectedGameData = await fetchPlatformGenreData(
      selectedValues.genre,
      selectedValues.platform
    );
    console.log(selectedGameData);

    const games = selectedGameData.results;
    const gameSlugTitles = games.map(game => game.slug) 

    // Use the slug value to make a second API request to retrieve the full details of each game
    const gameDetailsResponses = await Promise.all(
      gameSlugTitles.map(slugTitle => fetch(`https://api.rawg.io/api/games/${slugTitle}?key=${apiKey}&fields=genres.name,platforms.platform.name`))
    );

    // Parse the JSON responses from the second API requests
    const gameDetailsData = await Promise.all(
      gameDetailsResponses.map(response => response.json())
    );

    console.log(gameDetailsData)

    const gameTitleArray = gameDetailsData.map((game) => {
      const gameTitle = game.name;
      const gameDescription = game.description_raw;
      const gameGenre = game.genres;
      const gameGenreArray = gameGenre.map((genre) => genre.name);
      const gameScore = game.metacritic;
      const gamePlatforms = game.platforms;
      const platformNamesArray = gamePlatforms.map(
        (platform) => platform.platform.name
      );
      const gameCover = game.background_image;
      const ratings = game.ratings.map((rating) => ({
        title: rating.title,
        count: rating.count
      }))

      return {
        title: gameTitle,
        description: gameDescription,
        genre: gameGenreArray,
        score: gameScore,
        platform: platformNamesArray,
        coverImg: gameCover,
        rating: ratings
      };

    });
    
    setGameTitleData(gameTitleArray);
    console.log(gameTitleArray)
  }


  const fetchPlatformGenreData = async (genre, platform) => {
    const apiKey = 'abec424581074dfd9006811f98107886';

    // get genre id from genreIds object
    const genreId = genreIds[genre]

    // get platform id from platformIds object
    const platformId = platformIds[platform]

    try {
        if (genre === '' && platform) {
            // get games data from playform id passed in
            const gamesPlatformResponse = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&platforms=${platformId}&ordering=-metacritic&page_size=40`)
            const gamePlatformData = await gamesPlatformResponse.json()
            // console.log(gamePlatformData)
            return gamePlatformData
        } else if (platform === '' && genre) {
            // get games data from genre id passed in
            const gameGenreResponse = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=${genreId}&ordering=-metacritic&page_size=40`)
            const gameGenreData = await gameGenreResponse.json()
            // console.log(gameGenreData)
            return gameGenreData
        } else {
            // get games data from platform and genre id's passed in
            const gameResponse = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=${genreId}&platforms=${platformId}&ordering=-metacritic&page_size=40`)
            const gameData = await gameResponse.json()
            // console.log(gameData)
            return gameData
        }
    } catch(error) {
        console.log(error)
    }
}



  return (
    <div className='search-main-body-container'>
      <div className="search-container">
        <div className="search-main-body">
          <div className="search-main-container">
            <div className='serach-form-main-container'>
            <div className="search-form-container">
              <h1 className='search-h1'>Find Your Game!</h1>
              <p className='search-p'>Search By Title</p>

              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "& > :not(style)": { m: 1, width: "25ch" },
                  "& label.Mui-focused": { color: "#2ca627" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleTitleSubmit}
              >
                <TextField
                  id="gameTitle"
                  label="Title of Game"
                  name="gameTitle"
                  variant="outlined"
                  onChange={(event) => {
                    setGameTitle(event.target.value);
                  }}
                  value={gameTitle}
                  sx={{
                    input: { color: "white" },
                    fieldset: { borderColor: "#2ca627" },
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2ca627",
                      },
                    },
                    "& label": {
                      color: "#2ca627",
                    },
                  }}
                />
                {titleExists &&
                <Grid container justifyContent="center" className='search-error'>
                    <Grid item sx={{ color: "#ff2222", fontSize: "12px" }}>
                    Game Doesn't Exist
                    </Grid>
                  </Grid>
                }
                <Button
                  variant="contained"
                  type="submit"
                  className="search-title-btn"
                >
                  Search
                </Button>
              </Box>

              <div className="search-line">
                <hr className='search-hr'/>
                <p className='search-p'>OR</p>
                <hr className='search-hr'/>
              </div>

              <p className="search-second-search">Search By Genre and/or Platform</p>

              <div>
                <form onSubmit={handleSelectedSubmit}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          sx={{ paddingRight: "10px", color: "#2ca627" }}
                        >
                          Genre
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={selectedValues.genre}
                          onChange={handleGenreChange}
                          label="Genre"
                          variant="outlined"
                          sx={{
                            "& .MuiSelect-select": {
                              paddingRight: "10px",
                              color: "white",
                            },
                            "&.MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#2ca627",
                              },
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"Action"}>Action</MenuItem>
                          <MenuItem value={"Adventure"}>Adventure</MenuItem>
                          <MenuItem value={"Arcade"}>Arcade</MenuItem>
                          <MenuItem value={"Casual"}>Casual</MenuItem>
                          <MenuItem value={"Educational"}>Educational</MenuItem>
                          <MenuItem value={"Family"}>Family</MenuItem>
                          <MenuItem value={"Fighting"}>Fighting</MenuItem>
                          <MenuItem value={"Indie"}>Indie</MenuItem>
                          <MenuItem value={"Massively Multiplayer"}>MMO</MenuItem>
                          <MenuItem value={"Puzzle"}>Puzzle</MenuItem>
                          <MenuItem value={"Racing"}>Racing</MenuItem>
                          <MenuItem value={"RPG"}>RPG</MenuItem>
                          <MenuItem value={"Shooter"}>Shooter</MenuItem>
                          <MenuItem value={"Simulation"}>Simulation</MenuItem>
                          <MenuItem value={"Sports"}>Sports</MenuItem>
                          <MenuItem value={"Strategy"}>Strategy</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel
                          id="demo-simple-select-outlined-label"
                          sx={{ paddingRight: "10px", color: "#2ca627" }}
                        >
                          Platform
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={selectedValues.platform}
                          onChange={handlePlatformChange}
                          label="Platform"
                          variant="outlined"
                          sx={{
                            "& .MuiSelect-select": {
                              paddingRight: "10px",
                              color: "white",
                            },
                            "&.MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#2ca627",
                              },
                              "&:hover fieldset": {
                                borderColor: "#2ca627",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2ca627",
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"Macintosh"}>Mac</MenuItem>
                          <MenuItem value={"Nintendo Switch"}>
                            Nintendo Switch
                          </MenuItem>
                          <MenuItem value={"Playstation"}>Playstation</MenuItem>
                          <MenuItem value={"Playstation 2"}>
                            Playstation 2
                          </MenuItem>
                          <MenuItem value={"Playstation 3"}>
                            Playstation 3
                          </MenuItem>
                          <MenuItem value={"Playstation 4"}>
                            Playstation 4
                          </MenuItem>
                          <MenuItem value={"Playstation 5"}>
                            Playstation 5
                          </MenuItem>
                          <MenuItem value={"Xbox"}>Xbox</MenuItem>
                          <MenuItem value={"Xbox 360"}>Xbox 360</MenuItem>
                          <MenuItem value={"Xbox One"}>Xbox One</MenuItem>
                          <MenuItem value={"Xbox Series S|X"}>Xbox Series S|X</MenuItem>
                          <MenuItem value={"Windows"}>
                            PC
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      type="submit"
                      className="search-selected-btn"
                      sx={{
                        margin: "auto",
                        marginTop: 1,
                        width: "fit-content"
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            </div>
            <div className="search-card-container">
              <Grid container spacing={6} justifyContent="center" gap='50px'>
                {gameTitleData.map((gameData, index) => (
                  <Grid item key={index} sx={{ textAlign: "center" }}>
                    <GameCard gameTitleData={gameData} style={{ margin: "auto" }}/>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
