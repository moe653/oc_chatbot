import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chatselect.module.css'

const Chatselect = () => {
    const navigate = useNavigate();

    const orangeButton = () => {
        navigate('/communication')
    }

    const blueButton = () => {
        navigate('/medical')
    }

    const greenButton = () => {
        navigate('/security')
    }

    return (
        <div className={styles.body} style={{ whiteSpace: 'pre-line'}}>
            <p className={styles.title}>チャットボットに自由に質問してみよう！</p>
            <p className={styles.subtitle}>
            聞きたい分野にあったボタンを押してポスターのことを聞いてみてね
            </p>
            <div className={styles.button}>
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