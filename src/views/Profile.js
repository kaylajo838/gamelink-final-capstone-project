import { useState, useEffect, useNavigate } from 'react'
import "./Profile.css"
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { FullscreenExitRounded } from '@mui/icons-material';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth'
import { doc, deleteDoc, collection, getDocs, query } from 'firebase/firestore'
import { db, auth } from "../firebase";
import { onSnapshot } from 'firebase/firestore';

export default function Profile() {

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

    const [authUser, setAuthUser] = useState('')
    const [firstNameInitial, setFirstNameInitial] = useState('');
    const [lastNameInitial, setLastNameInitial] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [wishlistNum, setWishlistNum] = useState(0)
    const [platforms, setPlatforms] = useState([])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setAuthUser(user);
      
            let splitUserName = user.displayName.split(' ');
            let firstName = splitUserName[0];
            let lastName = splitUserName[1];
            setFirstName(firstName)
            setLastName(lastName)
            setFirstNameInitial(firstName ? firstName[0] : '');
            setLastNameInitial(lastName ? lastName[0] : '');
            
            const storage = getStorage();
            const avatarRef = ref(storage, 'avatars/' + user.uid);
      
            try {
              const avatarUrl = await getDownloadURL(avatarRef);
              setAvatarUrl(avatarUrl);
            } catch (error) {
              console.error('Error fetching avatar image:', error.message);
              setAvatarUrl('');
            }
            setEmail(user.email);
          } else {
            setAuthUser('');
            setFirstNameInitial('');
            setLastNameInitial('');
            setAvatarUrl('');
            setEmail('');
          }
        });
      
        return () => {
          unsubscribe();
        };
      }, [auth]);


      useEffect(() => {
        const currentUser = auth.currentUser;
    
        if (!currentUser) {
          return;
        }
    
        const subColRef = collection(db, "users", currentUser.uid, "wishlist");
        const q = query(subColRef);
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const count = snapshot.size;
          setWishlistNum(count);
        });
    
        return unsubscribe;
    }, [auth, db]);


    useEffect(() => {
        const currentUser = auth.currentUser;
      
        if (!currentUser) {
          return;
        }
      
        const subColRef = collection(db, "users", currentUser.uid, "platforms");
        const q = query(subColRef);
      
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const platformData = [];
      
          snapshot.forEach((doc) => {
            platformData.push(doc.data());
          });
      
          setPlatforms(platformData);
        });
      
        return unsubscribe;
      }, [auth, db]);

  return (
    <div className="profile-main-body-container">
      <div className="profile-container">
        <div className='profile-form-container' style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "20px",
            }}>
            <Avatar 
                sx={{ 
                    width: 250, 
                    height: 250, 
                    margin: "auto",
                    border: "2px solid black"
                }} 
                src={avatarUrl}
                >
                {!avatarUrl && `${firstNameInitial}${lastNameInitial}`}
            </Avatar>

            <Typography variant="body1" gutterBottom sx={{fontSize: "20px"}}>
                Name: {firstName + " " + lastName}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{fontSize: "20px"}}>
                Email: {email}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{fontSize: "20px"}}>
                Wishlist Items: {wishlistNum}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{fontSize: "20px"}}>
            Platforms: {platforms.map((platform, index) => (
                <span key={platform.id}>
                {index > 0 && ', '}
                {platform.id.charAt(0).toUpperCase() + platform.id.slice(1)}
                </span>
            ))}
            </Typography>
        </div>
      </div>
    </div>
  )
}
