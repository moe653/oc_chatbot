import React from "react";
import styles from './poster.module.css';
import classNames from "classnames";
import { Navigate, useNavigate } from "react-router-dom";

const Poster = ({ theme }) => {
    const navigate = useNavigate();
    //戻るボタンの設置
    const backButton = () => {
        if (theme === 'orange') {
            navigate('/communication');
        } else if (theme === 'green') {
            navigate('/security');
        } else if (theme === 'blue') {
            navigate('/medical');
        }
    }
    return (
        // ポスター
        <div className={classNames(styles.body, styles[theme])}>
            <button
                onClick={backButton}
                className={styles.backButton}
            >
                back
            </button>
            <div className={styles.posterArea}>
                {theme === 'green' && (
                    <img
                        src="/fig/poster_security.png"
                        alt="ポスター"
                        className={styles.posterImage}
                    />
                )}
                {theme === 'blue' && (
                    <>
                        <img
                            src="/fig/poster_medical_chatbot.png"
                            alt="医療ポスター1"
                            className={styles.posterImage}
                        />
                        <img
                            src="/fig/poster_medical_kokkaku.png"
                            alt="医療ポスター2"
                            className={styles.posterImage}
                        />
                    </>
                )}
                {theme === 'orange' && (
                    <>
                        <img
                            src="/fig/poster_communication_2024.png"
                            alt="コミュニケーションポスター2024"
                            className={styles.posterImage}
                        />
                        <img
                            src="/fig/poster_communication_2023.png"
                            alt="コミュニケーションポスター2023"
                            className={styles.posterImage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Poster;
