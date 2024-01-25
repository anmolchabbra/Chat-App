import React, { useContext, useState } from 'react'
import {db,} from "../firebase";
import { collection, getDocs, doc , query, setDoc, where } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';


export const Search = () => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const {currrentUser} = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(collection(db, "users"),where("displayName", "==", username));

        try {
            const queryRes = await getDocs(q);
            queryRes.forEach((doc) => {
                setUser(doc.data())
            });
        } catch (err) {
            setErr(true);
        }

    }

    const handleKey = (e) => {
        e.code == "Enter" && handleSearch();
    };


    const handleSelect = async () => {
        //first we checks if the user and other (group) exists in firestore, if not we create
        const combineID = currrentUser.uid > user.uid 
        ? currrentUser.uid + user.uid : user.uid + currrentUser.uid;

        try {
            const res = await getDocs(db, "chats", combineID);

            if (res.exists()) {
                //create chat in chats collection
                await setDoc(doc(db, "chats", combineID), { messages:[] });
            }

          

        } catch (err) {
            setErr(true);
        }




        const res = await getDocs(db, "chats");



        //create user chats

    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type='text' placeholder='find a user' onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} />
            </div>
            {err && <span>User not found!</span>}
            {user && <div className='userChat' onClick={handleSelect}>
                <img src={user.photoURL} alt=''/>
                <div className="userChatInfo">
                    <span>
                        {user.displayName}
                    </span>
                </div>
            </div>}
        </div>
    )
}
