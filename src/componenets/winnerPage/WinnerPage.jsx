import { useNavigate } from 'react-router-dom'
import Button from '../button/Button'
import Background from '../../assets/winnerbg.svg'
import First from '../../assets/first.svg'
import Second from '../../assets/second.svg'
import Third from '../../assets/third.svg'
import Avatar from '../../assets/avatar.svg'

const WinnerPage = () => {
    // const [isOpen, setIsOpen] = useState(false);

    const navigateHome = () => {
        if(!showLoader) {
            setShowLoader(true);
            navigate('/home', { replace: true });
        }
    }

    return (
        <section>
           <div className="mx-4 my-4 h-fit lg:h-[90vh] w-[90vw] relative bg-white bg-opacity-[0.5] backdrop-blur-lg border border-white rounded-lg text-center">
                <div className='flex flex-col justify-center items-center content-center gap-[5vh] relative'>
                    <h2 className='text-[24px] font-bold uppercase text-blue-dark mt-[20px]'>Top scorers!</h2>
                    <ul className='px-5 py-5 flex flex-col lg:flex-row items-center justify-center gap-5'>
                        <li className='flex flex-col items-center justify-center text-center w-[250px] h-[320px] bg-blue-lighter backdrop-blur-lg border border-white rounded-[15px] text-[18px]'> 
                            <h2>Nickname</h2>
                            <img 
                                src={Avatar} 
                                className="max-w-[150px] hrounded-full"
                                alt="avatar" />
                            <span className="mt-[15px] text-[16px] uppercase">Score</span>
                            <p className='font-bold'>3000</p>
                        </li>
                        <li className='flex flex-col items-center justify-center text-center w-[250px] h-[320px] bg-blue-lighter backdrop-blur-lg border border-white rounded-[15px] text-[18px]'> 
                            <h2>Nickname</h2>
                            <img 
                                src={Avatar} 
                                className="max-w-[150px] hrounded-full"
                                alt="avatar" />
                            <span className="mt-[15px] text-[16px] uppercase">Score</span>
                            <p className='font-bold'>2000</p>
                        </li>
                        <li className='flex flex-col items-center justify-center text-center w-[250px] h-[320px] bg-blue-lighter backdrop-blur-lg border border-white rounded-[15px] text-[18px]'> 
                            <h2>Nickname</h2>
                            <img 
                                src={Avatar} 
                                className="max-w-[150px] hrounded-full"
                                alt="avatar" />
                            <span className="mt-[15px] text-[16px] uppercase">Score</span>
                            <p className='font-bold'>1000</p>
                        </li>
                    </ul>
                    <div className='flex flex-col gap-3 w-fit mb-[25px]'>
                        <Button
                            variant='secondaryBlue'
                            // onClick={() => setIsOpen(true)}
                        >
                            See all players
                        </Button>
                        <Button
                            variant='primaryWhite'
                            onClick={navigateHome}
                        >
                            Back home
                        </Button>
                    </div>
                </div>
           </div>
        </section>
    )
}

export default WinnerPage;
