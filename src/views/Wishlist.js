import {useState, useEffect } from 'react'
import './Wishlist.css';
import '@fontsource/roboto/500.css';
// import WishlistGameCard from '../components/WishlistGameCard';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardActions from '@mui/material/CardActions';
import { Button } from '@mui/material';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'


export default function Wishlist() {
  const [gameData, setGameData] = useState([]);
  const [expanded, setExpanded] = useState(false);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const getWishlistGames = async () => {
      const subColRef = collection(db, "users", auth.currentUser.uid, "wishlist");
      const querySnapshot = await getDocs(subColRef);
      const gameArray = querySnapshot.docs.map((doc) => doc.data());
      setGameData(gameArray);
    };
  
    getWishlistGames();
  }, []);


  // remove from firebase database
  const removeFromWishlist = async (title) => {
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "wishlist", title));
      const updatedGameData = gameData.filter((game) => game.title !== title);
      setGameData(updatedGameData);
      console.log('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };


  return (
    <div className="wishlist-main-body-container">
      <div className="wishlist-container">
        <div className="wishlist-main-container">
          <div className="wishlist-header-container">
            <h1 className="wishlist-h1">My Wishlist</h1>
          </div>
          <div className="wishlist-card-container">
            <Grid container spacing={6} justifyContent="center" gap="50px">
              {gameData.map((game) => {
                return (
                  <Grid item key={game.title} sx={{ textAlign: "center" }}>
                    <Card
                      sx={{
                        maxWidth: 345,
                        minWidth: 345,
                        border: "5px solid #2ca627",
                        boxShadow: "0 0 30px 40px black",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="game cover img"
                        height="auto"
                        image={game.coverImg}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ textAlign: "center" }}
                        >
                          {game.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          {game.description}
                        </Typography>
                        {expanded && (
                          <>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              mt="10px"
                              sx={{ textAlign: "center" }}
                            >
                              Genre(s):
                            </Typography>
                            {game.genre.map((genre) => (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                key={genre}
                                sx={{ textAlign: "center" }}
                              >
                                {genre}
                              </Typography>
                            ))}
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              mt="10px"
                              sx={{ textAlign: "center" }}
                            >
                              Platform(s):
                            </Typography>
                            {game.platform.map((platform) => (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                key={platform}
                                sx={{ textAlign: "center" }}
                              >
                                {platform}
                              </Typography>
                            ))}
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              mt="10px"
                              sx={{ textAlign: "center" }}
                            >
                              Score:{" "}
                              <Typography component="span" color="primary">
                                {game.score}
                              </Typography>
                            </Typography>
                          </>
                        )}
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            onClick={handleExpandClick}
                            sx={{ marginTop: "10px" }}
                          >
                            {expanded ? "See Less" : "See More"}
                          </Button>
                        </div>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "red",
                            width: "fit-content",
                            color: "white",
                            border: "2px solid black",
                            borderRadius: "0.5em",
                            margin: "0 0 10px 0",
                            padding: "10px 10px",
                            "&:hover": {
                              backgroundColor: "#fc4141",
                            },
                          }}
                          onClick={() => removeFromWishlist(game.title)}
                        >
                          <FavoriteIcon sx={{ marginRight: "5px" }} />
                          Remove from Wishlist
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
