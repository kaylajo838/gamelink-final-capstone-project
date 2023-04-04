import { useState, useEffect } from 'react';
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


export default function GameSearch() {
  const [gameTitle, setGameTitle] = useState("");
  const [selectedValues, setSelectedValues] = useState({
    genre: '',
    platform: ''
  })
  const [gameTitleData, setGameTitleData] = useState([])
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

// ------------ Section handling fetching to api when title is entered into form ------------ //
  
//  Handles submit when title of game is inputted into form
  const handleTitleSubmit = async (event) => {
    event.preventDefault();
    setGameTitleData([]);
    setIsSearchSubmitted(true);
    const title = gameTitle;
    const apiKey = "moby_lNj1n04CgAI9jPfD6UCFtu6UKBF";
    const gameData = await fetchGameData(title, apiKey);
    const gameTitleArray = gameData.games.map((game) => {
      const gameTitle = game.title;
      const gameDescription = game.description;
      const gameGenre = game.genres;
      const gameGenreArray = gameGenre.map((genre) => genre.genre_name);
      const gameScore = game.moby_score;
      const gamePlatforms = game.platforms;
      const platformNamesArray = gamePlatforms.map(
        (platform) => platform.platform_name
      );
      const gameCover = game.sample_cover && game.sample_cover.image;
  
      return {
        title: gameTitle,
        description: gameDescription,
        genre: gameGenreArray,
        score: gameScore,
        platform: platformNamesArray,
        coverImg: gameCover,
      };
    });
    setGameTitleData(gameTitleArray);
    setGameTitle("");
  };
  
  // Remove previous search results from the DOM
  const cleanup = () => {
    setIsSearchSubmitted(false);
    setGameTitleData([]);
  };

  useEffect(() => {
    // Cleanup the DOM on component unmount
    return () => cleanup();
  }, []);

// // const parser = new DOMParser();
// // const htmlDoc = parser.parseFromString(gameData.games[0].description, 'text/html');
// // const firstParagraph = htmlDoc.querySelector('p');
// // const gameDescription = firstParagraph.innerHTML;

  
  // fetch to api to get game by title search 
  async function fetchGameData(title, apiKey) {
    const encodedTitle = encodeURIComponent(title);
    const encodedApiKey = encodeURIComponent(apiKey);

    const url = `https://api.mobygames.com/v1/games?title=${encodedTitle}&api_key=${encodedApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
// ---------------------------------------------------------------------------------------------------------//

// ------------ Section handling fetching to api when genre and/or platform is entered into form ------------ //

// Object holding genres with their id's as the value
  const genreIds = {
    "Action": 1,
    "Adventure": 2,
    "Educational": 12,
    "Gambling": 28,
    "Puzzle": 118,
    "Racing / Driving": 6,
    "Role-playing (RPG)": 50,
    "Simulation": 3,
    "Sports": 5,
    "Strategy": 4,
    "1st-person": 7,
    "3rd-person (Other)": 126
  }

// Object holding platforms with their id's as their value
  const platformIds = {
    "Macintosh": 74,
    "Nintendo Switch": 203,
    "Oculus Quest": 271,
    "Playstation": 6,
    "Playstation 2": 7,
    "Playstation 3": 81,
    "Playstation 4": 141,
    "Playstation 5": 288,
    "Xbox": 13,
    "Xbox 360": 69,
    "Xbox One": 142,
    "Xbox Series": 289,
    "Windows": 3
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
    event.preventDefault();
    console.log(selectedValues);
    // console.log(selectedValues.genre)
    // console.log(selectedValues.platform)

    const selectedGameData = await fetchPlatformGenreData(
      selectedValues.genre,
      selectedValues.platform
    );
    console.log(selectedGameData);
    const gameTitleArray = selectedGameData.games.map((game) => {
      const gameTitle = game.title;
      const gameDescription = game.description;
      const gameGenre = game.genres;
      const gameGenreArray = gameGenre.map((genre) => genre.genre_name);
      const gameScore = game.moby_score;
      const gamePlatforms = game.platforms;
      const platformNamesArray = gamePlatforms.map(
        (platform) => platform.platform_name
      );
      const gameCover = game.sample_cover && game.sample_cover.image;

      return {
        title: gameTitle,
        description: gameDescription,
        genre: gameGenreArray,
        score: gameScore,
        platform: platformNamesArray,
        coverImg: gameCover,
      };
    });

    // Sort the gameTitleArray by score in descending order
    gameTitleArray.sort((a, b) => b.score - a.score);
    
    setGameTitleData(gameTitleArray);
    //   setGameTitle("");
  }

  const fetchPlatformGenreData = async (genre, platform) => {
    const apiKey = 'moby_lNj1n04CgAI9jPfD6UCFtu6UKBF';
    const encodedApiKey = encodeURIComponent(apiKey);

    // get genre id from genreIds object
    const genreId = genreIds[genre]
    const encodedGenreId = encodeURIComponent(genreId);

    // get platform id from platformIds object
    const platformId = platformIds[platform]
    const encodedPlatformId = encodeURIComponent(platformId);

    try {
        if (genre === '' && platform) {
            // get games data from playform id passed in
            const gamesPlatformResponse = await fetch(`https://api.mobygames.com/v1/games?platforms=${encodedPlatformId}&api_key=${encodedApiKey}`)
            const gamePlatformData = await gamesPlatformResponse.json()
            // console.log(gamePlatformData)
            return gamePlatformData
        } else if (platform === '' && genre) {
            // get games data from genre id passed in
            const gameGenreResponse = await fetch(`https://api.mobygames.com/v1/games?genre=${encodedGenreId}&api_key=${encodedApiKey}`)
            const gameGenreData = await gameGenreResponse.json()
            // console.log(gameGenreData)
            return gameGenreData
        } else {
            // get games data from platform and genre id's passed in
            const gameResponse = await fetch(`https://api.mobygames.com/v1/games?genre=${encodedGenreId}&platforms=${encodedPlatformId}&api_key=${encodedApiKey}`)
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
                          <MenuItem value={"Educational"}>Educational</MenuItem>
                          <MenuItem value={"Gambling"}>Gambling</MenuItem>
                          <MenuItem value={"Puzzle"}>Puzzle</MenuItem>
                          <MenuItem value={"Racing / Driving"}>
                            Racing/Driving
                          </MenuItem>
                          <MenuItem value={"Role-playing (RPG)"}>
                            Role-Playing (RPG)
                          </MenuItem>
                          <MenuItem value={"Simulation"}>Simulation</MenuItem>
                          <MenuItem value={"Sports"}>Sports</MenuItem>
                          <MenuItem value={"Strategy"}>Strategy</MenuItem>
                          <MenuItem value={"1st-person"}>First Person</MenuItem>
                          <MenuItem value={"3rd-person (Other)"}>
                            Third Person
                          </MenuItem>
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
                          <MenuItem value={"Oculus Quest"}>
                            Oculus Quest
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
                          <MenuItem value={"Xbox Series"}>Xbox Series</MenuItem>
                          <MenuItem value={"Windows"}>
                            PC (Microsoft Windows)
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      type="submit"
                      className="search-selected-btn"
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            </div>
            <div className="search-card-container">
              <Grid container spacing={6} justifyContent="center">
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
