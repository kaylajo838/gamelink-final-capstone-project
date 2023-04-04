import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function GameCard({gameTitleData}) {

  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false)



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  

  const MAX_CHARACTERS = 300;

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
          dangerouslySetInnerHTML={{ __html: gameTitleData.description }}
        />
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
            backgroundColor: "#8e3dc6", 
            width: "fit-content",
            color: "white",
            border: "2px solid black",
            borderRadius: "0.5em",
            margin: "0 0 10px 0",
            padding: "10px 10px",
            "&:hover": {
                backgroundColor: "#a35ad0"
            }
        }}><FavoriteIcon sx={{ marginRight: "5px" }}/>Add To Wishlist</Button>
      </CardActions>
    </Card>
  );
}
