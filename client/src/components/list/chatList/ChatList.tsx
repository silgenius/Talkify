import { useNavigate } from "react-router-dom"
import "./chatlist.css"
const Chatlist = () => {
  const navigate = useNavigate();
  return (
    <div className='chatList w-1/4'>
      <div className='header'>
        <div className='logoSection'>
          <img className=" hover:cursor-pointer" src='/talkify.png' onClick={() => navigate('/')} alt='Talkify Logo' />
          <div className="settingsIcon hover:cursor-pointer" onClick={() => navigate('/settings')}>
        <img src="/setting.png" alt="Settings" />
      </div>
      </div>
      <div className='chatLine'>
        <p className='chatTitle'>Chats</p>
        <div className="addSymbol">
            <img src="/plus.png" alt="" />
          </div>
          </div>
      </div>
      <div className="search">
        <div className="searchBar">
          <img src="/searchblack.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div onClick={() => navigate('/conversations/id')} className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>
      <div className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>

      <div className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>

      <div className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>
      <div className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>
      <div className="item">
        <img src="/user.png" alt="" />
        <div className="texts">
          <span>Julie Li</span>
          <p>Hey there</p>
        </div>
      </div>
    </div>
  )
}

export default Chatlist