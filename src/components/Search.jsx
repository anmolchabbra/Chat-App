import React from 'react'

export const Search = () => {
  return (
    <div className="search">
        <div className="searchForm">
            <input type='text' placeholder='find a user' />
        </div>
        <div className='userChat'>
            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' alt=''/>
            <div className="userChatInfo">
                <span>
                    Jane
                </span>
            </div>
        </div>
    </div>
  )
}
