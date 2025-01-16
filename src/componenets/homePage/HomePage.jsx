import { useNavigate } from 'react-router-dom'
import Button from '../button/Button'
import Logo from '../../assets/logo.svg'

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/game');
    };

    return (
        <div className="h-screen w-screen">
            <div className="mx-5 lg:mx-10 pt-5">
                <Button 
                    variant="secondaryWhite"
                    onClick={handleNavigate}>
                    How to play?
                </Button>
                <div className="flex flex-col items-center justify-center gap-8 lg:gap-4 mt-5">
                    <h1>
                        <img 
                            src={Logo} 
                            alt="logo" 
                        />
                    </h1>
                    <span className="text-lg lg:text-2xl font-bold uppercase text-center">
                        Where every guess brings <br /> you closer to the truth.
                    </span>
                </div>
            </div>
            <div className="bg-white w-full h-[20vh] lg:h-[17vh] flex items-center justify-center rounded-tr-[35px] rounded-tl-[35px] absolute bottom-0">
                <Button 
                    variant="primaryWhite" 
                    onClick={handleNavigate}>
                    Start
                </Button>
            </div>
        </div>
    )
}

export default HomePage