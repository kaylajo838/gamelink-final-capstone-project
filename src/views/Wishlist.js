import {useState, useEffect } from 'react'
import './Wishlist.css';
import '@fontsource/roboto/500.css';
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
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};


export default function Wishlist() {
  const [gameData, setGameData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);


  const handleClickOpen = (game) => {
    setSelectedGame(game);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    const getWishlistGames = async () => {
      const subColRef = collection(db, "users", auth.currentUser.uid, "wishlist");
      const querySnapshot = await getDocs(subColRef);
      const gameArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        expanded: false,
        genre: doc.data().genre,
        platform: doc.data().platform,
        score: doc.data().score,
      }));
      setGameData(gameArray);
    };
    getWishlistGames()
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

                        <Button
                          onClick={() => handleClickOpen(game)}
                          sx={{ marginTop: "10px" }}
                        >
                          Click To See Game Info
                        </Button>
                        <BootstrapDialog
                          onClose={handleClose}
                          aria-labelledby="customized-dialog-title"
                          open={open}
                          style={{opacity: 0.4}}
                        >
                          <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleClose}
                            sx={{ textAlign: "center", fontSize: "30px" }}
                          >
                            {selectedGame?.title}
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textAlign: "center" }}
                            >
                              {selectedGame?.description}
                            </Typography>
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                  gap: "50px",
                                  marginBottom: "20px",
                                  marginTop: "20px"
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    mt="10px"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Genre(s):
                                  </Typography>
                                  {selectedGame?.genre.map((genre) => (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      key={genre}
                                      sx={{ textAlign: "center" }}
                                    >
                                      {genre}
                                    </Typography>
                                  ))}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    mt="10px"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Platform(s):
                                  </Typography>
                                  {selectedGame?.platform.map((platform) => (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      key={platform}
                                      sx={{ textAlign: "center" }}
                                    >
                                      {platform}
                                    </Typography>
                                  ))}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    mt="10px"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Rating:
                                  </Typography>
                                  {selectedGame?.rating.map((rating) => {
                                    let color = "";
                                    switch (rating.title) {
                                      case "exceptional":
                                        color = "#2ca627";
                                        break;
                                      case "meh":
                                        color = "orange";
                                        break;
                                      case "recommended":
                                        color = "blue";
                                        break;
                                      case "skip":
                                        color = "red";
                                        break;
                                      default:
                                        color = "black";
                                        break;
                                }
                                  return (
                                  <Typography variant="body2" color="text.secondary" key={rating} sx={{ textAlign: "center" }} style={{ color: color }}>
                                    {rating.title.charAt(0).toUpperCase() + rating.title.slice(1)}: {rating.count}
                                  </Typography>
                                  )
                                })}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    mt="10px"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Score:{" "}
                                    <Typography
                                      component="span"
                                      color="primary"
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                      }}
                                    >
                                      {selectedGame?.score}
                                    </Typography>
                                  </Typography>
                                </div>
                              </div>
                            </>
                          </DialogContent>
                        </BootstrapDialog>
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
