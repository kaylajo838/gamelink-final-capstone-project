import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { db, auth } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { height } from '@mui/system';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function GameCard({gameTitleData}) {

  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false)

  const [open, setOpen] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);  
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const MAX_CHARACTERS = 300;

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


//   // add to our database
//   const addToWishlist = async () => {
//     try {
//       await setDoc(doc(db, "users", auth.currentUser.uid, "wishlist", gameTitleData.title), {
//         title: gameTitleData.title,
//         description: gameTitleData.description,
//         genre: gameTitleData.genre,
//         score: gameTitleData.score,
//         platform: gameTitleData.platform,
//         coverImg: gameTitleData.coverImg,
//       })
//       if (Object.keys(gameTitleData).length !== 0){
//         // console.log('added to firebase')
//         addToFirebase()
//       }
//     } catch (error) {
//       // console.error('Error adding to wishlist:', error);
//     }
//   }
// }
 

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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {gameTitleData.description}
        </Typography>
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
              Score:{" "}
              <Typography component="span" color="primary">
                {gameTitleData.score}
              </Typography>
            </Typography>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleExpandClick} sx={{ marginTop: "10px" }}>
            {expanded ? "See Less" : "See More"}
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





    // <div>

    // <Card
    //   onClick={handleOpen}
    //   sx={{
    //     maxWidth: 345,
    //     minWidth: 345,
    //     border: "5px solid #2ca627",
    //     boxShadow: "0 0 30px 40px black",
    //   }}
    // >
    //   <CardMedia
    //     component="img"
    //     alt="game cover img"
    //     height="auto"
    //     image={gameTitleData.coverImg}
    //   />
    //   <CardContent>
    //     <Typography
    //       gutterBottom
    //       variant="h5"
    //       component="div"
    //       sx={{ textAlign: "center" }}
    //     >
    //       {gameTitleData.title}
    //     </Typography>
    //     {/* <Typography
    //       variant="body2"
    //       color="text.secondary"
    //       sx={{ textAlign: "center" }}
    //       dangerouslySetInnerHTML={{ __html: gameTitleData.description }}
    //     /> */}
        
    //   </CardContent>
    //   {/* <CardActions sx={{ justifyContent: "center" }} >
    //     <Button size="small" sx={{
    //         backgroundColor: "#8e3dc6", 
    //         width: "fit-content",
    //         color: "white",
    //         border: "2px solid black",
    //         borderRadius: "0.5em",
    //         margin: "0 0 10px 0",
    //         padding: "10px 10px",
    //         "&:hover": {
    //             backgroundColor: "#a35ad0"
    //         }
    //     }}><FavoriteIcon sx={{ marginRight: "5px" }}/>Add To Wishlist</Button>
    //   </CardActions> */}
    // </Card>

    // <Modal
    // open={open}
    // onClose={handleClose}
    // aria-labelledby="modal-modal-title"
    // aria-describedby="modal-modal-description"
    
    // sx={{
    //   position: "absolute",
    //   margin: "auto",
    //   overflowY: "scroll",
    //   maxHeight: "80%"
    //   // height: "800px"
    // }}
    // >
    // <Box sx={style}>
    // <Typography
    //       gutterBottom
    //       variant="h5"
    //       component="div"
    //       sx={{ textAlign: "center" }}
    //     >
    //       {gameTitleData.title}
    //     </Typography>
    //     <Typography
    //       variant="body2"
    //       color="text.secondary"
    //       sx={{ textAlign: "center" }}
    //       dangerouslySetInnerHTML={{ __html: gameTitleData.description }}
    //     />
    //     {expanded && (
    //       <>
    //         <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
    //           Genre(s):
    //         </Typography>
    //         {gameTitleData.genre.map((genre) => (
    //           <Typography variant="body2" color="text.secondary" key={genre} sx={{ textAlign: "center" }}>
    //             {genre}
    //           </Typography>
    //         ))}
    //         <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
    //           Platform(s):
    //         </Typography>
    //         {gameTitleData.platform.map((platform) => (
    //           <Typography variant="body2" color="text.secondary" key={platform} sx={{ textAlign: "center" }}>
    //             {platform}
    //           </Typography>
    //         ))}
    //         <Typography gutterBottom variant="h6" component="div" mt="10px" sx={{ textAlign: "center" }}>
    //           Score:{" "}
    //           <Typography component="span" color="primary">
    //             {gameTitleData.score}
    //           </Typography>
    //         </Typography>
    //       </>
    //     )}
    //     <div style={{ display: "flex", justifyContent: "center" }}>
    //       <Button onClick={handleExpandClick} sx={{ marginTop: "10px" }}>
    //         {expanded ? "See Less" : "See More"}
    //       </Button>
    //     </div>
    //     <Button size="small" sx={{
    //         backgroundColor: "#8e3dc6", 
    //         width: "fit-content",
    //         color: "white",
    //         border: "2px solid black",
    //         borderRadius: "0.5em",
    //         margin: "0 0 10px 0",
    //         padding: "10px 10px",
    //         "&:hover": {
    //             backgroundColor: "#a35ad0"
    //         }
    //     }}><FavoriteIcon sx={{ marginRight: "5px" }}/>Add To Wishlist</Button>
    // </Box>
    // </Modal>

    // </div>