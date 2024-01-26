import { onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { doc, setDoc } from "firebase/firestore";
import {db} from "../firebase";

export const Chats = () => {
    // const [chats, setChats] = useState([]);

    // const {currentUser} = useContext(AuthContext);

    // useEffect(() => {

    //     //intially userID won't exist so wrapping the data
    //     const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
    //         setChats(doc.data());
    //     });


    //     return ()=> {
    //         unsub();
    //     };

    // }, []);
    
  return (
    <div className="chats">
        <div className='userChat'>
            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' alt=''/>
            <div className="userChatInfo">
                <span>
                    Jane
                </span>
                <p>Hello</p>
            </div>
        </div>
        <div className='userChat'>
            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' alt=''/>
            <div className="userChatInfo">
                <span>
                    Jane
                </span>
                <p>Hello</p>
            </div>
        </div>
       
    </div>
  )
}
