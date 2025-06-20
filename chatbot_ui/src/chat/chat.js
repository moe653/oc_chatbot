import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chat.module.css';

const Chat = () => {
    const navigate = useNavigate();
    // 入力欄の文字
    const [inputText, setInputText] = useState('');
    // 吹き出し用の配列
    const [messages, setMessages] = useState([]);

    const sendMessage = async() => {
        if (inputText.trim() === '') return;

        //ユーザー側のメッセージを追加
        const userMessage = { text : inputText, sender: 'user'};
        // 配列に追加
        setMessages(prev => [...prev, userMessage]);
        // 入力欄を空に
        setInputText('');

        try {
            //GASから返された応答を取得
            const response = await fetch('GasURL', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({message: inputText}),
            });

            //GASからのレスポンスをテキストで取得
            const gasReply = await response.text();

            //ボット側からのメッセージを追加
            setMessages(prev => [...prev, { text: gasReply, sender: 'bot'}]);
        } catch (error) {
            console.error('GAS通信エラー', error);
        }
    };

    return (
        <div className={styles.body}>
            {/* 背景メッセージ */}
            {messages.length === 0 && (
                <div className={styles.backMessage} style={{ whiteSpace: 'pre-line' }}>
                    チャットボットに質問してみよう！{"\n"}質問例
                </div>
            )}

            {/* 吹き出しエリア */}
            <div className={styles.messageArea}>
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={
                        msg.sender === 'bot' ? styles.messageBubbleBot : styles.messageBubbleUser
                    }
                    >
                        {msg.text}  {/*オブジェクトのtextのみを表示*/}
                    </div>
                ))}
            </div>

            {/* 入力欄 */}
            <div className={styles.sendArea}>
                <input
                    type="text"
                    value={inputText}
                    placeholder="質問を入力してね"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    送信
                </button>
            </div>
        </div>
    );
};

export default Chat;
