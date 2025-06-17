    import React from 'react';
    import { useNavigate, useLocation } from 'react-router-dom'; // ← useLocation を追加
    //import styles from './home.module.css';

    const Bottan = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    const handlelogout = () => {
        navigate('/');
    };

    return (
        <div>bottan</div>
    );
    };

    export default Bottan;






