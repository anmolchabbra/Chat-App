import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {auth, storage, db} from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate ,Link } from 'react-router-dom';

export const Register = () => {
  const[err, setErr] = useState(false);
  //navigate hook
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
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
            //Update prfile
            await updateProfile(res.user, {
              displayName,
              photoURL:downloadURL,
            });
            //Add user to cloud firestore collection users
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL : downloadURL
            });

            //Set users chat document
            await setDoc(doc(db, "userChats", res.user.uid), {})

            //after registering we go to home page
            navigate("/");

          });
        }
      );

      
      
    } catch(err) {
      setErr(true);
    }
    
  }


  const[selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
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
                <input style={{ }} type='file' id='file' onChange={handleFileChange} />
                {(selectedFile != null) && (<p>Uploaded File: {selectedFile.name}</p>)}
                <label htmlFor='file'>
                  <img src={Add} alt=""/>
                  <span>Add an Avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Something wen't wrong</span>}
            </form>
            <p>Already has an account? <Link to="/login">Please Login</Link></p>
        </div>
    </div>
  )
}
