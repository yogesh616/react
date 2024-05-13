import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';

const Profile = () => {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [userList, setUserList] = useState();
  const navigate = useNavigate();
 const USERS = [];
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      
      setIsLoggedin(user);
      toast.success(`${user.displayName} logged in!`);
    });
  }, []);

  const logOut = async () => {
    try {
      // Update user status to offline before logging out
      if (isLoggedin) {
        const userRef = doc(db, 'users', isLoggedin.uid);
        await updateDoc(userRef, { 
          displayName: isLoggedin.displayName,
          photoURL: isLoggedin.photoURL,
          status: 'offline' });
      }

      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  useEffect(()=>{
    const getData = async ()=> {
     try {
        const docRef = collection(db, 'users')
        const res = await getDocs(docRef)
        res.forEach((doc)=> {
        
          USERS.push(doc.data())
          console.log(USERS)
          setUserList(USERS)
        })
     }
      catch (err) {
        console.log(err)
      }
      
    }
    
    return ()=> getData()
  }, [userList, USERS])
  

  return (
    <>
      {isLoggedin ? (
        <>
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <img src={isLoggedin.photoURL} className="navbar-brand photoURL" alt="User Photo" />
              <button className="border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
                <i className="fa-solid fa-bars-staggered" style={{ color: '#63E6BE' }}></i>
              </button>

              <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasScrollingLabel">{isLoggedin.displayName}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-4">
                  <p className='text-body-tertiary'>Your Email:  &nbsp; &nbsp; <span style={{ color: '#70c0fc' }}>{isLoggedin.email}</span></p>
                  <button onClick={logOut} className='btn btn-dark'>Log Out</button>
                </div>
              </div>
            </div>
          </nav>
          <Toaster />
          

{/* Conditional rendering for userList */}
          <div className="user-list py-5">
          <h2> Users </h2>
            {userList ? (
              <ul className='list-group'>
                { userList.map((user, index) =>
                (  <li className='list-group-item' key={index}>
                <img src={user.photoURL} />
                <p>{user.displayName}</p>
                <sub>{user.status}</sub>
                </li>)
    )  }
              </ul>
            ) : (
              <p>No Users.</p>
            )}
          </div>
          
        </>
      ) : (
        <div className="spinner-grow" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </>
  );
};

export default Profile;
