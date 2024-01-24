import React from 'react'
import { Search } from './Search'

export const Navbar = () => {
  return (
    <div className="navbar">
        <span className='logo'>Chatie</span>
        <div className='user'>
            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' alt=''/>
            <span>Anmol</span>
            <button>logout</button>
        </div>
    </div>
  )
}
