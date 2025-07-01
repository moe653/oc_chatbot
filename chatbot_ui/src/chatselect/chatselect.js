import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chatselect.module.css'

const Chatselect = () => {
    const navigate = useNavigate();

    const brownButton = () => {
        navigate('/select/brown');
    };

    const orangeButton = () => {
        navigate('/select/orange')
    }

    const blueButton = () => {
        navigate('/select/blue')
    }

    const greenButton = () => {
        navigate('/select/green')
    }

    return (
        <div className={styles.body}>
            カラー選択
            <div className={styles.button}>
                {/* 茶色 */}
                {/* <button
                className={styles.brownButton}
                onClick={brownButton}
                >
                    brown
                </button> */}
                {/* オレンジ */}
                <button
                className={styles.orangeButton}
                onClick={orangeButton}
                >
                    orange
                </button>
                {/* 青色 */}
                <button
                className={styles.blueButton}
                onClick={blueButton}
                >
                    blue
                </button>
                {/* 緑色 */}
                <button
                className={styles.greenButton}
                onClick={greenButton}
                >
                    green
                </button>
            </div>
        </div>
    );
};

export default Chatselect;