import {useState, useEffect} from 'react'
import styles from './Library.modules.css';
import '@fontsource/roboto/500.css';
import steamLogo from '../images/steam-sprite.png'
import epicLogo from '../images/epic-logo.png'
import xboxLogo from '../images/xbox-logo.png'
import psLogo from '../images/playstation-logo.png'

// import { OpenIdClient } from 'openid'

export default function MyLibrary() {

    const [anchors, setAnchors] = useState([
        { id: "steam", active: true, logo: steamLogo },
        { id: "epic", active: false, logo: epicLogo },
        { id: "xbox", active: false, logo: xboxLogo },
        { id: "ps", active: false, logo: psLogo }
    ])

    // handles clicking main logos to set which ones are active 
    const handleActiveClassClick = (id) => {
        setAnchors((prevState) =>
        prevState.map((anchor) =>
        anchor.id === id ? { ...anchor, active: !anchor.active } : anchor
        )
        );
    };

// ------------------ everything to handle steam logins -------------------------





    // const steamClient = new OpenIdClient({
    //     providerUrl: 'https://steamcommunity.com/openid'
    // })

    // // button to handle steam login process
    // const handleLogin = async (id) => {
    //     console.log(id)
    //     const returnUrl = `${window.location.origin}/login/steam/callback`;
    //     const redirectUrl = steamClient.authorizationUrl({
    //       redirect_uri: returnUrl,
    //       scope: 'openid',
    //       state: 'login',
    //     });
    //     window.location = redirectUrl;
    //   }

    // // callback to handle steam response
    // useEffect(() => {
    //     const returnUrl = `${window.location.origin}/login/steam/callback`;
    //     const params = steamClient.callbackParams();
    //     steamClient.callback(returnUrl, params).then((claims) => {
    //       // Handle successful login
    //       console.log("Successfully logged into Steam")
    //     }).catch((error) => {
    //       // Handle login failure
    //       console.log(error)
    //     });
    //   }, []);


  return (
    <div className='library-main-body-container'>
      <div className="library-container">
          <div className="library-main-container">
            <div className="library-logo-container">
              <div className="library-logo-header">
                <h1 className='search-h1'>Select Your Gaming Platforms</h1>
              </div>
              <div className="library-logo-imgs">
                <div
                  className={`library-logo-box ${
                    anchors.find((anchor) => anchor.id === "steam").active
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleActiveClassClick("steam")}
                >
                  <a href="#">
                    <img className="library-steam-logo-img" src={steamLogo} />
                  </a>
                </div>
                <div
                  className={`library-logo-box ${
                    anchors.find((anchor) => anchor.id === "epic").active
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleActiveClassClick("epic")}
                >
                  <a href="#">
                    <img className="library-epic-logo-img" src={epicLogo} />
                  </a>
                </div>
                <div
                  className={`library-logo-box ${
                    anchors.find((anchor) => anchor.id === "xbox").active
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleActiveClassClick("xbox")}
                >
                  <a href="#">
                    <img className="library-xbox-logo-img" src={xboxLogo} />
                  </a>
                </div>
                <div
                  className={`library-logo-box ${
                    anchors.find((anchor) => anchor.id === "ps").active
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleActiveClassClick("ps")}
                >
                  <a href="#">
                    <img className="library-ps-logo-img" src={psLogo} />
                  </a>
                </div>
              </div>
            </div>
            
              <div className="active-container">
                {anchors
                  .filter((anchor) => anchor.active)
                  .map((anchor) => (
                    <div className="library-logo-box active active-in-grid">
                      <div href={`#${anchor.id}`}>
                        <img
                          className={`library-${anchor.id}-logo-img img-active-in-grid`}
                          src={anchor.logo}
                        />
                        <button className='search-connect-btn'>Connect</button>
                      </div>
                    </div>
                  ))}
              </div>

          </div>
      </div>
    </div>
  );
}

// export default function MyLibrary() {
//     return (
//       <div>
//         <div className={styles.container}>
//           <div className={styles.main_body}>
//             <div className={styles.main_container}>
//               <div className={styles.logo_container}>
//                   <div className={styles.logo_header}>
//                     <h1>Select Your Gaming Platforms</h1>
//                   </div>
//                   <div className={styles.logo_imgs}>
//                       <div className={styles.logo_box}>
//                       <img className="steam-logo-img" src={steamLogo} />
//                       </div>
//                       <div className={styles.logo_box}>
//                       <img className="epic-logo-img" src={epicLogo} />
//                       </div>
//                       <div className={styles.logo_box}>
//                       <img className="xbox-logo-img" src={xboxLogo} />
//                       </div>
//                       <div className={styles.logo_box}>
//                       <img className="ps-logo-img" src={psLogo} />
//                       </div>
//                   </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
