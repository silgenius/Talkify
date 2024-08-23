import React, { useState } from 'react'
import "./chatlist.css"
const chatlist = () => {
  const [addMode,setAddMode]= useState(false)
  return (
    <div className='chatList'>
      <div className='header'>
        <div className='logoSection'>
            <img src='./talkify.png' alt='Talkify Logo' />
            </div>
        <p className='chatTitle'>Chats</p>
        </div>
      <div className="search">
        <div className="searchBar">
          <img src="./searchblack.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        </div>
        <div className="item">
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Hey there</p>
      </div>
      </div>
      <div className="item">
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Hey there</p>
      </div>
      </div>

      <div className="item">
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Hey there</p>
      </div>
      </div>
      <div className="item">
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Hey there</p>
      </div>
      </div>
      <div className="item">
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Hey there</p>
      </div>
      </div>
    </div>
  )
}

export default chatlist