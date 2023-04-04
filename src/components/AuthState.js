import {useState, useEffect} from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'


export default function AuthState() {
    const [authUser, setAuthUser] = useState('')
    const [firstName, setFirstName] = useState('')
    const [firstNameInitial, setFirstNameInitial] = useState('');
    const [lastNameInitial, setLastNameInitial] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setAuthUser(user)
              console.log(user)
              let splitUserName = user.displayName.split(' ')
              let firstName = splitUserName[0];
              setFirstName(firstName)
            } else {
              setAuthUser('')
              setFirstName(firstName)
            }
          }, [authUser]);
      });


  return (
    <div className='auth-user-div'>
        { authUser ? <><p>Hello, {firstName}</p></> : ""}
        </div>
  )
}