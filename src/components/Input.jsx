import React, { useContext, useState } from 'react';
import Img from '../img/img.png';
import Attach from '../img/attach.png';
import { arrayUnion, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { doc } from 'firebase/firestore';

export const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    const timestamp = new Date().getTime(); // Store the timestamp in a variable

    console.log("In input data id is: ", data.chatId);

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        'state_changed',
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
          console.error('Error uploading image:', error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: new Date().getTime(), // Use the stored timestamp variable
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: new Date().getTime(), // Use the stored timestamp variable
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"] : {
            text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"] : {
            text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className='input'>
      <input type='text' placeholder='Type something....' onChange={(e) => setText(e.target.value)} value={text} />
      <div className='send'>
        <img src={Attach} alt='' />
        <input type='file' style={{ display: 'none' }} id='file' onChange={(e) => setImg(e.target.files[0])} />
        <label htmlFor='file'>
          <img src={Img} alt='' />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
