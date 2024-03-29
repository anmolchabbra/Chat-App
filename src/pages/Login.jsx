import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../firebase";
import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const Login = () => {

  const[err, setErr] = useState(false);
  //navigate hook
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch(err) {
      setErr(true);
    }
  }


  return (
    <div className='formContainer'>
        <div className='formWrapper'>
           
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <button>Sign in</button>
                {err && <span>Something went wrong</span>}
            </form>
            <p>You don't have an account?<Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}