import {useState, useEffect, Component} from 'react'
import './Library.modules.css';
import '@fontsource/roboto/500.css';
import steamLogo from '../images/steam-sprite.png'
import epicLogo from '../images/epic-logo.png'
import xboxLogo from '../images/xbox-logo.png'
import psLogo from '../images/playstation-logo.png'

// import { useNavigate } from 'react-router-dom';



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

    const handleLogin = (anchorId, res) => {
        if (anchorId === 'steam') {

        } else if (anchorId === 'epic') {

        } else if (anchorId === 'xbox') {

        } else if (anchorId === 'ps') {

        }
    }

    // async function handleLogin(anchorId) {
    //     try {
    //     // initiate OpenID authentication flow with Steam
    //     const response = await fetch('/auth/steam');
    //     const data = await response.json();
    
    //     // redirect to Steam sign-in page
    //     window.location.href = data.redirectUrl;
    //     } catch (error) {
    //     console.log(error);
    //     }
    // }

    //     const navigate = useNavigate();
    
    //     // handle successful authentication and redirect to app
    //     async function handleAuthentication() {
    //     try {
    //         // retrieve user data using SteamID
    //         const response = await fetch('/api/profile');
    //         const data = await response.json();
    
    //         // do something with user data
    //         navigate.push('/dashboard');
    //     } catch (error) {
    //         console.log(error);
    //     }
    //   }





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
                      <div className='library-anchor' href={`#${anchor.id}`}>
                        <img
                          className={`library-${anchor.id}-logo-img img-active-in-grid`}
                          src={anchor.logo}
                        />
                        <button className='library-connect-btn' onClick={() => handleLogin(anchor.id)}>Connect</button>
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
  
