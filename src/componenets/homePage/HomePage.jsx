import { useNavigate } from 'react-router-dom'
import Button from '../button/Button'

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/game');
    };

    return (
        <div className="h-screen w-[95vw] mt-10">
            <Button variant="secondaryWhite">
                How to play?
            </Button>
            <div>
                <h1>LOGO</h1>
                <span className="">
                    Where every guess brings you closer to the truth.
                </span>
            </div>
            <div>
                <button onClick={handleNavigate} className="">
                    Get Started
                </button>
            </div>
        </div>
    )
}

export default HomePage