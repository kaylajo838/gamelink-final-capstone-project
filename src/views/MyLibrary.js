import {useState, useEffect, Component} from 'react'
import Grid from '@mui/material/Grid';
import './Library.modules.css';
import '@fontsource/roboto/500.css';
import steamLogo from '../images/steam-sprite.png'
import epicLogo from '../images/epic-logo.png'
import xboxLogo from '../images/xbox-logo.png'
import psLogo from '../images/playstation-logo.png'
import { db, auth } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import queryString from 'query-string';


export default function MyLibrary() {

    const [steamGames, setSteamGames] = useState([])
    const [epicGames, setEpicGames] = useState([])
    const [xboxGames, setXboxGames] = useState([])
    const [psGames, setPsGames] = useState([])
    
    const [steamConnect, setSteamConnect] = useState(false)
    const [epicConnect, setEpicConnect] = useState(false)

    const [xuid, setXuid] = useState(null);
    const [platformData, setPlatformData] = useState([])
    const [anchors, setAnchors] = useState([
      { id: "steam", active: false, logo: steamLogo },
      { id: "epic", active: false, logo: epicLogo },
      { id: "xbox", active: false, logo: xboxLogo },
      { id: "ps", active: false, logo: psLogo }
  ])
 
    // handles clicking main logos to set which ones are active 
    const handleActiveClassClick = (id) => {
      setAnchors((prevState) => {
        const updatedAnchors = prevState.map((anchor) =>
          anchor.id === id ? { ...anchor, active: !anchor.active } : anchor
        );
    
        const platformData = updatedAnchors.find((anchor) => anchor.id === id);
        if (platformData.active) {
          addPlatformToDb(id);
        } else {
          deletePlatformFromDb(id);
        }
    
        return updatedAnchors;
      });
    };


    // add platforms to database
    const addPlatformToDb = async (id) => {
      try {
        const platformData = { ...anchors.find((anchor) => anchor.id === id) };
        await setDoc(
          doc(db, "users", auth.currentUser.uid, "platforms", id),
          platformData
        );
        console.log("Data added to Firestore.");
        setPlatformData((prevState) => [...prevState, platformData]);
      } catch (error) {
        console.error("Error adding data to Firestore:", error);
      }
    };

    // delete platforms from database
    const deletePlatformFromDb = async (id) => {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "platforms", id));
        console.log("Data deleted from Firestore.");
        setPlatformData((prevState) =>
          prevState.filter((platform) => platform.id !== id)
        );
      } catch (error) {
        console.error("Error deleting data from Firestore:", error);
      }
    };

// ------------------- useEffect to find gaming platforms in database to display ---------------------------------
    
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });

      return () => {
        unsubscribe();
      };
    }, [auth]);

    useEffect(() => {
      if (user) {
        const getPlatforms = async () => {
          const subColRef = collection(db, "users", user.uid, "platforms");
          const querySnapshot = await getDocs(subColRef);
          const platformArray = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.data().id
          }));
          setPlatformData(platformArray);
    
          // Update the active state of anchors based on the fetched data
          setAnchors((prevState) =>
            prevState.map((anchor) => ({
              ...anchor,
              active: platformArray.some((platform) => platform.id === anchor.id)
            }))
          );
        };
        getPlatforms();
      }
    }, [user]);

// ------------------ everything to login -------------------------

const handleLogin = async (anchorId) => {
  if (anchorId === "steam") {
    // handle Steam login
    const steamOpenIdUrl =
      "https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=http://localhost:3000/my-library&openid.realm=http://localhost:3000/my-library&openid.mode=checkid_setup";
    window.location.replace(steamOpenIdUrl);
    
  } else if (anchorId === "epic") {
    // handle Epic Games login
    const clientId = "xyza7891rVxxPadunvcYDPG199ZYFzu4"

    const epicUrl = `https://www.epicgames.com/id/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/my-library&response_type=code&scope=basic_profile`
    window.location.replace(epicUrl)

  } else if (anchorId === "xbox") {
    // handle Xbox login
    // const xboxUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&scope=XboxLive.signin&response_type=token&redirect_uri=${redirectUri}&display=popup`
    const clientId = "599671a2-240a-4956-aecd-edb5af7f55d2"
    const redirectUri = "http://localhost:3000/my-library"
    const xboxUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&scope=XboxLive.signin%20XboxLive.offline_access&response_type=code&redirect_uri=${redirectUri}`;
    window.location.replace(xboxUrl);
    // handleXboxLogin();

  } else if (anchorId === "ps") {
    // handle PlayStation login
  }
};

  // This function handles the Steam login callback
  const handleSteamLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const claimed_id = params.get("openid.claimed_id");
    const identity = params.get("openid.identity");
    const return_to = params.get("openid.return_to");
    const response_nonce = params.get("openid.response_nonce");
    const assoc_handle = params.get("openid.assoc_handle");
    const signed = params.get("openid.signed");
    const sig = params.get("openid.sig");

    // Make a call to Steam to verify the user
    const verifyUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=check_authentication&openid.op_endpoint=https://steamcommunity.com/openid/login&openid.claimed_id=${claimed_id}&openid.identity=${identity}&openid.return_to=${return_to}&openid.response_nonce=${response_nonce}&openid.assoc_handle=${assoc_handle}&openid.signed=${signed}&openid.sig=${sig}`;
    const response = await fetch(verifyUrl);
    const text = await response.text();

    // If the user is valid, get their steamid and print it to the console
    if (text.includes("is_valid:true")) {
      const steamid = identity.replace("https://steamcommunity.com/openid/id/", "");
      console.log("Steam ID:", steamid);
      setSteamConnect(true);
      // Set a cookie with the user's Steam ID
      document.cookie = `steamid=${steamid}`;
    }
  };


  // This funciton handles the Epic login callback
  const handleEpicLogin = async () => {
    // const clientId = "xyza7891rVxxPadunvcYDPG199ZYFzu4";
    // const clientSecret = "T8BGgvAoPPVNAIjHIccAMKV/5ndZJzuM+bgcz4vPxmg";
    // const redirectUri = "http://localhost:3000/my-library";
    // const code = new URLSearchParams(window.location.search).get("code");
  
    // // Proxy server endpoint
    // const proxyEndpoint = "https://proxy.cors.sh/";
    // // const proxyEndpoint = "https://gobetween.oklabs.org/pipe/";
    // // const proxyEndpoint = "http://alloworigin.com/get?url=";
    // const tokenEndpoint = `${proxyEndpoint}https://api.epicgames.dev/auth/v1/oauth/token`;
  
    // const requestOptions = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    //   },
    //   body: new URLSearchParams({
    //     grant_type: "client_credentials",
    //     client_id: clientId,
    //     redirect_uri: redirectUri,
    //     code: code,
    //   }),
    // };
    // console.log(tokenEndpoint)
    // console.log(requestOptions)
    // fetch(tokenEndpoint, requestOptions)
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error(error));
  };


  // Call the handleSteamLogin function when the page loads if it's a Steam login callback
  if (window.location.search.includes("openid.mode=id_res")) {
    handleSteamLogin();
  } else if (window.location.search.includes("code")) {
    handleEpicLogin();
  } else if (window.location.search.includes("access_token")) {
    const code = new URLSearchParams(window.location.search).get("access_token")
    console.log(code)
    // handleXboxLogin();
  }

  // Check for the presence of the steamid cookie on subsequent requests
  const getSteamIdFromCookie = () => {
    const cookieValue = document.cookie.match('(^|;)\\s*steamid\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue[2] : null;
  };
  getSteamIdFromCookie()


  const handleGamesClick = async (anchorId) => {
    if (anchorId === 'steam') {
      const steamKey = 'FC2D918AD3BD91E640836B87D79105FF'
      let steamId = getSteamIdFromCookie()

      const url = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json&include_appinfo=1`)
      const data = await url.json()
      
      const games = data.response.games.map((game) => {
        const name = game.name
        return {
          title: name
        }
      })
      setSteamGames(games)

    } else if (anchorId === "epic") {
      // handle Epic Games
      const url = `https://api.epicgames.dev/epic/ecom/v1/platforms/EPIC/identities//ownership?nsCatalogItemId={{sandboxId:catalogItemId}}`

    } else if (anchorId === "xbox") {
      // handle Xbox 
    } else if (anchorId === "ps") {
      // handle PlayStation
    }
  }



  return (
    <div className="library-main-body-container">
      <div className="library-container">
        <div className="library-main-container">
          <div className="library-logo-container">
            <div className="library-logo-header">
              <h1 className="library-h1">Select Your Gaming Platforms</h1>
            </div>
            <div className="library-logo-imgs">
              <div className={`library-logo-box ${anchors.find((anchor) => anchor.id === "steam").active ? "active" : ""}`}
                onClick={() => handleActiveClassClick("steam")}
              >
                <a>
                  <img className="library-steam-logo-img" src={steamLogo} />
                </a>
              </div>
              <div className={`library-logo-box ${anchors.find((anchor) => anchor.id === "epic").active ? "active" : ""}`}
                onClick={() => handleActiveClassClick("epic")}
              >
                <a>
                  <img className="library-epic-logo-img" src={epicLogo} />
                </a>
              </div>
              <div className={`library-logo-box ${anchors.find((anchor) => anchor.id === "xbox").active ? "active" : ""}`}
                onClick={() => handleActiveClassClick("xbox")}
              >
                <a>
                  <img className="library-xbox-logo-img" src={xboxLogo} />
                </a>
              </div>
              <div className={`library-logo-box ${anchors.find((anchor) => anchor.id === "ps").active ? "active" : ""}`}
                onClick={() => handleActiveClassClick("ps")}
              >
                <a>
                  <img className="library-ps-logo-img" src={psLogo} />
                </a>
              </div>
            </div>
          </div>

          <div className="active-container">
            <Grid container spacing={6} justifyContent="center" gap="50px">
              {anchors.map((anchor, index) => {
                const platform = platformData.find((platform) => platform.id === anchor.id);

                if (platform) {
                  let buttonContent = "Connect";

                  if (platform.id === "steam" && steamGames.length > 0) {
                    buttonContent = "Connected";
                  } else if (platform.id === "epic") {
                    buttonContent = "Coming Soon";
                  } else if (platform.id === "xbox") {
                    buttonContent = "Coming Soon";
                  } else if (platform.id === "ps") {
                    buttonContent = "Coming Soon";
                  }

                  let pointerEvents =
                    (platform.id === "epic" || platform.id === "xbox" || platform.id === "ps") ? "none" : "auto";

                  return (
                    <Grid item key={index} sx={{ textAlign: "center" }}>
                      <div
                        className="library-logo-box active active-in-grid"
                        key={platform.id}
                      >
                        <div className="library-anchor" href={`${platform.id}`}>
                          <img
                            className={`library-${platform.id}-logo-img img-active-in-grid`}
                            src={platform.logo}
                          />
                          {/* <button
                            className="library-connect-btn"
                            onClick={() => handleLogin(platform.id)}
                            style={{ pointerEvents: pointerEvents }}
                          >
                            {buttonContent}
                          </button> */}
                        </div>
                      </div>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          </div>

{/* 
          <div className="library-game-list-main-container">
            <h1 className="library-h1-games">Games</h1>

            <div className="library-game-list-container">
              <div className="library-game-container">
                <div className="library-steam-header">
                  <h1 className="library-h1-games">Steam</h1>
                </div>
                <button
                  className="library-view-games-btn"
                  onClick={() => handleGamesClick("steam")}
                >
                  View Games
                </button>
                <div className="library-games">
                  {steamGames.map((game, index) => (
                    <>
                    <div key={index}>{game.title}</div>
                    <hr></hr>
                    </>
                  ))}
                </div>
              </div> */}

              {/* <div className="library-game-container">
                <div className="library-epic-header">
                  <h1 className="library-h1-games">Epic</h1>
                </div>
                <button
                  className="library-view-games-btn"
                  // onClick={() => handleGamesClick("epic")}
                >
                  Coming Soon
                </button>
              </div>

              <div className="library-game-container">
                <div className="library-xbox-header">
                  <h1 className="library-h1-games">Xbox</h1>
                </div>
                <button
                  className="library-view-games-btn"
                  onClick={() => handleGamesClick("xbox")}
                >
                  View Games
                </button>
              </div>

              <div className="library-game-container">
                <div className="library-ps-header">
                  <h1 className="library-h1-games">PlayStation</h1>
                </div>
                <button
                  className="library-view-games-btn"
                  // onClick={() => handleGamesClick("playstation")}
                >
                  Coming Soon
                </button>
              </div> */}
            {/* </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

  
