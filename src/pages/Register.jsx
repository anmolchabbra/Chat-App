import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {auth, storage} from "../firebase"

export const Register = () => {
  const[err, setErr] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, file);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
          setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL:downloadURL,
            })
          });
        }
      );
      
    } catch(err) {
      setErr(true);
    }
    
  }


  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'>Chatties</span>
            <span className='title'>Register</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Profile name'/>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <input style={{display:"none"}} type='file' id='file' />
                <label htmlFor='file'>
                  <img src={Add} alt=""/>
                  <span>Add an Avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Something wen't wrong</span>}
            </form>
            <p>Already has an account? Please Login</p>
        </div>
    </div>
  )
}
