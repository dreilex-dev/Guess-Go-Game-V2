import { useState, useEffect } from 'react';
import Logo from '../../assets/logo.svg';
import './Loader.css';

const Loader = ({ onLoadingComplete }) => {
    const [startReveal, setStartReveal] = useState(false);

    useEffect(() => {
        
        setTimeout(() => {
            setStartReveal(true);
        }, 1000);

        setTimeout(() => {
            onLoadingComplete?.();
        }, 1500);

    }, [onLoadingComplete]);

    return (
        <div className={`loader-container ${startReveal ? 'reveal' : ''}`}>
            <div className="loader-content">
                <img src={Logo} alt="logo" className="loader-logo" />
            </div>
        </div>
    );
};

export default Loader;
