import { useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const EmojHandle = (e: any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  console.log(Text);
  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src="/user.png" alt="" />
          <div className="texts">
            <span>Julie Li</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="/call.png" alt="" />
          <img src="/info3.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message">
          <img src="/user.png" alt="" />
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
          <img src="/user.png" alt="" />
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
          <img src="/user.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur
              adipisicing elit, Voluptas provident
              iste ratione aspernatur nemo quis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>

        <div />

        <div className="bottom">
          <div className='icons'>
            <img src="/plusblack.png"></img>
            <img src="/camera.png"></img>
            <img src="/microphone.png"></img>
          </div>
          <input type="text"
            placeholder="Type a message..."
            value={text}
            alt=""
            onChange={(e) => setText(e.target.value)} />
          <div className="emoji">
            <img
              src="/emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={EmojHandle} />
            </div>
          </div>
          <button className="sendBotton">send</button>
        </div>
      </div>
    </div>


  )
}

export default Chat;