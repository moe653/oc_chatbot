import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chat.module.css';

const Chat = () => {
    // 入力欄の文字
    const [inputText, setInputText] = useState('');
    // 吹き出し用の配列
    const [messages, setMessages] = useState([]);
    //最後のメッセージ位置を示すための参照を用意
    const messageEnd = useRef(null);

    //スクロールして一番下に移動する
    useEffect(() => {
        messageEnd.current?.scrollIntoView({ behavior: 'smooth'});
    }, [messages]); //messagesが変わるたびにスクロール

    const sendMessage = async() => {
        //入力欄が空なら何もしない
        if (inputText.trim() === '') return;

        //ユーザー側のメッセージを追加
        const userMessage = { text : inputText, sender: 'user'};
        // 配列に追加
        setMessages(prev => [...prev, userMessage]);
        // 入力欄を空に
        setInputText('');
        //入力に対して"こんにちは"と返答するようにした
        /* const gasReply = "こんにちは"
        setMessages(prev => [...prev, { text: gasReply, sender: 'bot'}]); */

        try {
            //GASにリクエストを送信
            const response = await fetch(process.env.REACT_APP_GAS_URL, {
                method: 'POST',
                headers: { 'content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({message: inputText}),
            });

            //GASからのレスポンスをテキストで取得
            const gasReply = await response.text();

            //ボット側からのメッセージを追加
            setMessages(prev => [...prev, { text: gasReply, sender: 'bot'}]);
        } catch (error) {
            //エラー処理
            console.error('GAS通信エラー', error);
        }
    };

    return (
        <div className={styles.body}>
            {/* ヘッダー */}
            <div className={styles.header}>
                Shikidalab
            </div>
            {/* 背景メッセージ */}
            {/* 何も表示されていない場合に表示 */}
            {messages.length === 0 && (
                <div className={styles.backMessage} style={{ whiteSpace: 'pre-line' }}>     {/* 'pre-line追加により \n で改行されるように */}
                    チャットボットに質問してみよう！ {"\n"}
                    質問例
                </div>
            )}

            {/* チャットエリア */}
            <div className={styles.messageArea}>
            {messages.map((msg, index) => (
                msg.sender === 'bot' ? (
                // Botの吹き出し＋アイコン（横並び）
                <div key={index} className={styles.messageWrapperBot}>
                    <img
                    src="/fig/free_man.jpg"
                    alt="Bot"
                    className={styles.botIcon}
                    />
                    <div className={styles.messageBubbleBot}>
                    {msg.text}
                    </div>
                </div>
                ) : (
                // ユーザーの吹き出し（右寄せ）
                <div key={index} className={styles.messageBubbleUser}>
                    {msg.text}
                </div>
                )
            ))}
            {/* 目印となる空要素 */}
            <div ref={messageEnd} />
            </div>


            {/* 入力欄 */}
            <div className={styles.sendArea}>
                <input
                    type="text"
                    value={inputText}
                    placeholder="質問を入力してね"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();       {/* Enterキーでも送信可能に */}
                    }}
                />
                <button className={styles.sendButtan} onClick={sendMessage}>
                    送信
                </button>
            </div>

        </div>
    );
};

export default Chat;
