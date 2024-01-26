import React, { useContext, useState } from 'react'
import {db,} from "../firebase";
import { collection, getDocs, doc , query, setDoc, where, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';


export const Search = () => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("displayName", "<=", username))
        
        try {
            
            const queryRes = await getDocs(q);
            queryRes.empty == false && 
            queryRes.forEach((doc) => {
                setUser(doc.data())
                console.log("user" + doc.data());
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
        console.log("Here" + currentUser);
        const combineID = currentUser.uid > user.uid 
        ? currentUser.uid + user.uid : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combineID));

            if (res.exists()) {
                //create chat in chats collection
                await setDoc(doc(db, "chats", combineID), { messages:[] });


                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combineID+".userInfo"] : {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combineID+".date"] : serverTimestamp()
                })


                await updateDoc(doc(db, "userChats", user.uid), {
                    [combineID+".userInfo"] : {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combineID+".date"] : serverTimestamp()
                })


            }    
        } catch (err) {
            setErr(true);
        }
        setUser(null);
        setUsername(null);
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type='text' placeholder='find a user' onClick={handleKey} onChange = {(e)=> {setUsername(e.target.value); handleSearch()}} value  = {username} />
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
