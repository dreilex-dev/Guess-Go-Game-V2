import { useNavigate } from 'react-router-dom'
import Button from '../button/Button'
import Background from '../../assets/winnerbg.svg'
import First from '../../assets/first.svg'
import Second from '../../assets/second.svg'
import Third from '../../assets/third.svg'
import Avatar from '../../assets/avatar.svg'

const WinnerPage = () => {

    return (
        <section>
           <div className="h-screen w-screen relative">

              <div className='mx-10 pt-5'>
                    <Button 
                        variant="secondaryBlue">
                        Home
                    </Button>
                  <ul className="flex flex-row gap-5 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1106px] mx-auto">
                    <li className="flex flex-col items-center text-center gap-4">
                        <div className="text-blue-lighter font-bold text-lg mt-auto">
                            <p className="text-xl uppercase mb-2">Second</p>
                            <img src={Avatar} alt="avatar" />
                            <span>Nickname</span>
                        </div>
                        <img src={Second} alt="first" />
                    </li>
                    <li className="flex flex-col items-center text-center gap-4">
                        <div className="text-blue-lighter font-bold text-lg mt-auto">
                            <p className="text-2xl uppercase mb-2">The winner!</p>
                            <img src={Avatar} alt="avatar" />
                            <span>Nickname</span>
                        </div>
                        <img src={First} alt="first" />
                    </li>
                    <li className="flex flex-col items-center text-center gap-4">
                        <div className="text-blue-lighter font-bold text-lg mt-auto">
                            <p className="text-xl uppercase mb-2">Third</p>
                            <img src={Avatar} alt="avatar" />
                            <span>Nickname</span>
                        </div>
                        <img src={Third} alt="first" />
                    </li>
                  </ul>
              </div>
                <img 
                    src={Background} 
                    alt="background figure" 
                    className="absolute top-0 left-0 w-screen h-screen -z-10 object-cover object-center" 
                />
           </div>
        </section>
    )
}

export default WinnerPage;
