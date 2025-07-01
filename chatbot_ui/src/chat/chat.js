import React, { useState, useRef, useEffect } from 'react';
import styles from './chat.module.css';
import classNames from 'classnames';

const Chat = ({ theme }) => {
    // 入力欄の文字
    const [inputText, setInputText] = useState('');
    // 吹き出し用の配列
    const [messages, setMessages] = useState([]);
    //最後のメッセージ位置を示すための参照を用意
    const messageEnd = useRef(null);
    //入力文字数の制限
    const MAX_LENGTH = 10;

    // メッセージが追加されるたびに一番下に移動
    useEffect(() => {
        messageEnd.current?.scrollIntoView({ behavior: 'smooth'});
    }, [messages]);   // messagesが変わるたびにスクロール

    const sendMessage = async () => {
        // 入力欄が空なら何もしない
        if (inputText.trim() === '') return;

        //ユーザー側のメッセージを追加
        const userMessage = { text : inputText, sender: 'user'};
        // 配列に追加
        setMessages(prev => [...prev, userMessage]);
        // 入力欄を空に
        setInputText('');

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
        <div className={classNames(styles.body, styles[theme])}>
            {/* ヘッダー */}
            <div className={classNames(styles.header, styles[`${theme}Header`])}>
                Shikidalab
            </div>

            {/* 背景メッセージ */}
            {/* 何もメッセージがない場合に表示 */}
            {messages.length === 0 && (
                <div className={styles.backMessage} style={{ whiteSpace: 'pre-line'}}>
                    チャットボットに質問してみよう！ {"\n"}
                    質問例
                </div>
            )}

            {/* チャットエリア */}
            <div className={styles.messageArea}>
                {messages.map((msg, index) => (
                    msg.sender === 'bot' ? (
                        // Botの吹き出し＋アイコン(横並び)
                        <div key={index} className={styles.messageWrapperBot}>
                            <img
                            src="/fig/free_man.jpg"
                            alt="Bot"
                            className={styles.botIcon}
                            />
                            <div className={classNames(styles.messageBubbleBot, styles[`${theme}Bot`])}>
                                {msg.text}
                            </div>
                        </div>
                    ) : (
                        // ユーザーの吹き出し(右寄せ)
                        <div key={index} className={classNames(styles.messageBubbleUser, styles[`${theme}User`])}>
                            {msg.text}
                        </div>
                    )
                ))}
                {/* 目印となるから要素 */}
                <div ref={messageEnd} />
            </div>

            {/* 入力欄 */}
            <div className={classNames(styles.sendArea, styles[`${theme}Send`])}>
                <input
                    type='text'
                    value={inputText}
                    placeholder='質問を入力してね'
                    maxLength={MAX_LENGTH}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    送信
                </button>
                <div className={styles.charCount} style={{ whiteSpace: 'pre-line'}}>
                    残り {"\n"}{MAX_LENGTH - inputText.length} 文字
                </div>
            </div>
        </div>
    );
};

export default Chat;