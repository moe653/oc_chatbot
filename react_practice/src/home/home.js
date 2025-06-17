    import React from 'react';
    import { useNavigate, useLocation } from 'react-router-dom'; // ← useLocation を追加
    import styles from './home.module.css';
    //import styles from './home.module.css';

    const Home = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    const bottan = () => {
        navigate('/bottan');
    };

    return (
        <div className={styles.body}> test
            <button
            className={styles.recButton}
            onClick={bottan}
            >
                button
            </button>
        </div>
    );
    };

    export default Home;






