import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import { useState } from 'react'
import './home.css'
import { Button } from '../ui/button'

const Home = ({ showLoader, setShowLoader }) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const handleNavigate = () => {
        setShowLoader(true)
        navigate('/game', { replace: true })
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            setIsOpen(false)
        }, 300)
    }

    return (
        <section className='home'>
            <div className={`home-container ${showLoader ? 'invisible' : ''}`}>
                <div className='home-main'>
                    <Button onClick={() => setIsOpen(true)} className='how-to-play'>
                        How to play?
                    </Button>
                    <div className='home-content'>
                        <h1>
                            <img src={Logo} alt="logo" className='home-logo'/>
                        </h1>
                        <span className='home-content-moto'> 
                            Where every guess brings <br/> you closer to the truth.
                        </span>
                    </div>
                    <Button
                        className='start-game'
                        onClick={handleNavigate}
                        disabled={showLoader}>
                        Start Game
                    </Button>
                </div>    
            </div>

            {(isOpen || isClosing) && (
                <aside className={`modal-wrapper ${isClosing ? 'closing' : ''}`}>
                    <div className={`modal-backdrop ${isClosing ? 'closing' : ''}`} onClick={handleClose}></div>
                    <div className={`modal ${isClosing ? 'closing' : ''}`}>
                        <div className="modal-header">
                            <h2>How to Play</h2>
                            <Button className='modal-close' onClick={handleClose}>Close</Button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-section">
                                <h3>Game Rules:</h3>
                                <ul>
                                    <li>• Min. 4 players needed</li>
                                    <li>• Each player gets a secret identity</li>
                                    <li>• Chat pretending to be that person</li>
                                    <li>• Guess who's pretending to be who</li>
                                    <li>• Timer runs until game ends</li>
                                </ul>
                            </div>
                            <div className="modal-section">
                                <h3>Points:</h3>
                                <ul>
                                    <li>• Correct guess: +1</li>
                                    <li>• Warning: Each hint adds 30s penalty</li>
                                </ul>
                            </div>
                            <div className="modal-section">
                                <h3>Tips:</h3>
                                <ul>
                                    <li>• Watch how others chat</li>
                                    <li>• Mimic your secret identity's style</li>
                                    <li>• Don't be too obvious</li>
                                    <li>• Think before guessing - mistakes cost points!</li>
                                </ul>
                            </div>
                            <span>
                                Grab your friends and start the deception! 
                                Share the room code and let the mind games begin!
                                Remember: The best liar wins!
                            </span>
                            <footer>
                                <strong>Contributors:</strong>
                                <div className='modal-footer'>
                                    <a href="https://github.com/SilinaNassar">Silina Nassar</a>
                                    <a href="https://github.com/dreilex">Andrei Boacă</a>
                                    <a href="https://github.com/mhanna-github">Hanna Mandzyuk</a>
                                    <a href="#">Sary Nassar</a>
                                </div>
                            </footer>
                        </div>
                    </div>
                </aside>
            )}
        </section>
    )
}

export default Home
