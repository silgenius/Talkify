import { Link } from 'react-router-dom'
import { talkifyLogo } from '../../../assets'

const Logo = () => {
  return (
    <Link to='/'>
      <img src={talkifyLogo} alt="talkify logo" className="absolute top-6 left-10 w-24" />
    </Link>
  )
}

export default Logo