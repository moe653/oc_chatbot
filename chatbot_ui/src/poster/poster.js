import React from "react";
import styles from './poster.module.css';
import classNames from "classnames";

const Poster = ({ theme }) => {
    return (
        // ポスター
        <div className={classNames(styles.body, styles[theme])}>
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
