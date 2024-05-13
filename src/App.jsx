 import { useEffect } from 'react';
import { auth, provider, db } from './firebase.js';
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import { doc, setDoc } from 'firebase/firestore';


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
      try {
        const dbRef = doc(db, 'users' ,user.uid );
        await setDoc(dbRef, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          status: 'online'});
         navigate('/profile'); 
      }
      catch (err) {
        console.log(err)
      }
      }
      
    });
    // Cleanup function
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithRedirect(auth, provider);
      console.log('Redirecting to sign-in page...');
    } catch (error) {
      console.log('Error during sign-in:', error);
    }
  };

  return (
    <>
    <div className='main container text-center p-3'>
      <h1 className='p-3'>Welcome to proDev</h1>
      <button onClick={signIn} className='btn btn-primary'>
        Sign In
      </button>
    </div>
    <Toaster />
    </>
  );
}

export default App;
