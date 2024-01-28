import React, { useEffect, useState, useContext} from 'react';
import { Message } from './Message'; // Assuming 'Message' is the named export in './Message'
import { onSnapshot } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import {db} from "../firebase";
import { ChatContext } from '../context/ChatContext';



export const Messages = () => {

    const {data} = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    
    
    useEffect(() => {
        
        console.log('Chat ID:', data.chatId);

        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return ()=> {
            unSub();
        };

    }, [data.chatId])

  return (
    <div className='messages'>
        {messages?.map(m => (
            <Message message={m} key={m.id}/>
        ))}
    </div>
  )
}
