import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chatselect.module.css'

const Chatselect = () => {
    const navigate = useNavigate();

    const brownButton = () => {
        navigate('/select/brownchat');
    };

    const orangeButton = () => {
        navigate('/select/orangechat')
    }

    const blueButton = () => {
        navigate('/select/bluechat')
    }

    return (
        <div className={styles.body}>
            カラー選択
            <div className={styles.button}>
                <button
                className={styles.brownButton}
                onClick={brownButton}
                >
                    brown
                </button>
                <button
                className={styles.orangeButton}
                onClick={orangeButton}
                >
                    orange
                </button>
                <button
                className={styles.blueButton}
                onClick={blueButton}
                >
                    blue
                </button>
            </div>
        </div>
    );
};

export default Chatselect;