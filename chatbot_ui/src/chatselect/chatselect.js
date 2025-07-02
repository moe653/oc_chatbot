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
            分野選択
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
                    Communication
                </button>
                {/* 青色 */}
                <button
                className={styles.blueButton}
                onClick={blueButton}
                >
                    Medical
                </button>
                {/* 緑色 */}
                <button
                className={styles.greenButton}
                onClick={greenButton}
                >
                    Security
                </button>
            </div>
        </div>
    );
};

export default Chatselect;