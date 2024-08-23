import React, { useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'

const chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const EmojHandle = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };
  console.log(Text);
  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src="./user.png" alt=""/>
          <div className="texts">
            <span>Julie Li</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phoneblack.png" alt="" />
          <img src="./infoblack.png" alt="" />
        </div>
      </div>
      <div className="center">
      <div className="message">
        <img src="./user.png" alt=""/>
        <div className="texts">
          <p>
            Lorem ipsum dolor sit amet consectetur 
            adipisicing elit, Voluptas provident 
            iste ratione aspernatur nemo quis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
        <div className="texts">
          <p>
            Lorem ipsum dolor sit amet consectetur 
            adipisicing elit, Voluptas provident 
            iste ratione aspernatur nemo quis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
        <img src="./user.png" alt=""/>
        <div className="texts">
          <p>
            Lorem ipsum dolor sit amet consectetur 
            adipisicing elit, Voluptas provident 
            iste ratione aspernatur nemo quis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
        <div className="texts">
          <p>
            Lorem ipsum dolor sit amet consectetur 
            adipisicing elit, Voluptas provident 
            iste ratione aspernatur nemo quis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        
        <div/>

      <div className="bottom">
        <div className='icons'>
          <img src="./image.png"></img>
          <img src="./camera.png"></img>
          <img src="./micblack.png"></img>
        </div>
        <input type="text"
        placeholder="Type a message..."
        alt=""
        onClick={() =>setText(e.target.value)}/>
        <div className="emoji">
          <img
            src="emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)} 
          />
          <dic className="picker">
          <EmojiPicker open={open} onEmojiClick={EmojHandle}/>
          </dic>
          </div>
        <button className="sendBotton">Send</button>
        </div>
      </div>
      </div>


  )
}

export default chat;