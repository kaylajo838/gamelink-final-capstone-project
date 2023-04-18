import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../views/Search.css'
import { db, auth } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import {Link} from "react-router-dom"
import Box from '@mui/material/Box';


export default function GameCard({gameTitleData}) {

  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false)
  const [inWishlist, setInWishlist] = useState(false);  

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore)
  }

  const description =
    showMore ? gameTitleData.description : `${gameTitleData.description.slice(0, 300)}....`;

  const showMoreLink = (
    <Box sx={{marginLeft: 1}}>
    <Link component="button" onClick={handleShowMoreClick}>
      {showMore ? 'Show less' : 'Show more'}
    </Link>
    </Box>
  );


  // check if game is in database
  useEffect(() => {
    const docRef = doc(db, "users", auth.currentUser.uid, "wishlist", gameTitleData.title);
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          setInWishlist(true);
        } else {
          setInWishlist(false);
        }
      })
      .catch((error) => {
        console.error('Error checking wishlist:', error);
      });
  }, [gameTitleData.title]);

  // add to firebase database
  const addToWishlist = async () => {
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid, "wishlist", gameTitleData.title), {
        title: gameTitleData.title,
        description: gameTitleData.description,
        genre: gameTitleData.genre,
        score: gameTitleData.score,
        platform: gameTitleData.platform,
        coverImg: gameTitleData.coverImg,
        rating: gameTitleData.rating
      });
      console.log('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // remove from firebase database
  const removeFromWishlist = async () => {
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "wishlist", gameTitleData.title));
      console.log('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  // handles wishlist click
  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist();
      setInWishlist(false);
    } else {
      addToWishlist();
      setInWishlist(true);
    }
  }


  return (
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
        image={gameTitleData.coverImg}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ textAlign: "center" }}
        >
          {gameTitleData.title}
        </Typography>
        <>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {description}
          {gameTitleData.description.length > 300 && showMoreLink}
        </Typography>
        <hr/>
        </>
        {expanded && (
          <>
            <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
              Genre(s):
            </Typography>
            {gameTitleData.genre.map((genre) => (
              <Typography variant="body2" color="text.secondary" key={genre} sx={{ textAlign: "center" }}>
                {genre}
              </Typography>
            ))}
            <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
              Platform(s):
            </Typography>
            {gameTitleData.platform.map((platform) => (
              <Typography variant="body2" color="text.secondary" key={platform} sx={{ textAlign: "center" }}>
                {platform}
              </Typography>
            ))}
            <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
              Rating:
            </Typography>
            {gameTitleData.rating.map((rating) => {
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
            <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
              Score:{" "}
              <Typography component="span" color="primary">
                {gameTitleData.score}
              </Typography>
            </Typography>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleExpandClick} sx={{ marginTop: "10px" }}>
            {expanded ? "See Less Details" : "See More Details"}
          </Button>
        </div>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }} >
        <Button size="small" sx={{
            backgroundColor: inWishlist ? "red" : "#8e3dc6", 
            width: "fit-content",
            color: "white",
            border: "2px solid black",
            borderRadius: "0.5em",
            margin: "0 0 10px 0",
            padding: "10px 10px",
            "&:hover": {
                backgroundColor: inWishlist ? "#fc4141" : "#a35ad0"
            }
        }}
        onClick={handleWishlistClick}
        >
          <FavoriteIcon sx={{ marginRight: "5px" }}/>
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
      </CardActions>
    </Card> 
  );
}

