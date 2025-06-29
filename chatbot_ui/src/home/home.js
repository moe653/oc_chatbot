import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css'

const Home = () => {
    const navigate = useNavigate();

    const brownchatButton = () => {
        navigate('/select');
    };

    return (
        <div className={styles.body}>
            敷田研チャットボット
            <button
            className={styles.brownchatButton}
            onClick={brownchatButton}
            >
                Start
            </button>
        </div>
    );
};

export default Home;