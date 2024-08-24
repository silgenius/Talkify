import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

interface SideBarProps {
  title: string;
  description: string | JSX.Element;
  buttonText: string;
  className?: string;
}
const SideBar = ({ title, description, buttonText, className } : SideBarProps) => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const handleClick = () => {
    path.includes('/register') ? navigate('/login') : navigate('/register');
  }
  return (
    <div className={`${className} w-1/3 bg-gradient-to-tl from-secondary-purple to-primary-purple h-full flex flex-col items-center justify-center space-y-12`}>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className='text-white text-center'>
            {description}
        </p>
        <Button onClick={handleClick} type='outline' rounded={true} text={buttonText} />
    </div>
  )
}

export default SideBar