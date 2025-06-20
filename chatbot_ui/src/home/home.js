import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css'

const Home = () => {
    const navigate = useNavigate();

    const chatButton = () => {
        navigate('/chat');
    };

    return (
        <div className={styles.body}>
            敷田研チャットボット
            <button
            className={styles.chatButton}
            onClick={chatButton}
            >
                Start
            </button>
        </div>
    );
};

export default Home;