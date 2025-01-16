import { useNavigate } from 'react-router-dom'
import Button from '../button/Button'
import Logo from '../../assets/logo.svg'
import { useState } from 'react'
import clsx from 'clsx'

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/game');
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <section>
            <div className="h-screen w-screen">
                <div className="mx-4 lg:mx-10 pt-5">
                    <Button 
                        variant="secondaryWhite"
                        onClick={() => setIsOpen(true)}>
                        How to play?
                    </Button>
                    <div className="flex flex-col items-center justify-center gap-8 lg:gap-4 mt-10 lg:mt-5">
                        <h1>
                            <img 
                                src={Logo} 
                                alt="logo" 
                            />
                        </h1>
                        <span className="text-lg lg:text-2xl font-bold uppercase text-center">
                            Where every guess brings <br/> you closer to the truth.
                        </span>
                    </div>
                </div>
                <div className="bg-white w-full h-[17vh] flex items-center justify-center rounded-tr-[35px] rounded-tl-[35px] absolute bottom-0">
                    <Button 
                        variant="primaryWhite" 
                        onClick={handleNavigate}>
                        Start
                        </Button>
                </div>
            </div>
        

            <aside className={clsx(
                'fixed bottom-0 left-0 z-40 top-0 w-[460px] h-screen bg-white -translate-x-full transition-transform duration-300', 
                isOpen ? 'translate-x-0' : '-translate-x-full')}>
                <div className="relative">
                    <div className="absolute top-4 right-6">
                        <Button 
                            variant="secondaryBlue"
                            onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </aside>

            <div aria-hidden='true' onClick={() => setIsOpen(false)} className={clsx(
                'fixed inset-0 bg-black/50 z-20',
                'transition-opacity duration-300',
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
            </div>
        </section>

    )
}

export default HomePage