import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chat.module.css';
import classNames from 'classnames';

const Chat = ({ theme }) => {
    const navigate = useNavigate();
    // 入力欄の文字
    const [inputText, setInputText] = useState('');
    // 吹き出し用の配列
    const [messages, setMessages] = useState([]);
    //最後のメッセージ位置を示すための参照を用意
    const messageEnd = useRef(null);
    //入力文字数の制限
    const MAX_LENGTH = 200;

    const [isComposing, setIsComposing] = useState(false);
    // 戻るボタンの設置
    const returnButton = () => {
        navigate('/')
    }

    // メッセージが追加されるたびに一番下に移動
    useEffect(() => {
        messageEnd.current?.scrollIntoView({ behavior: 'smooth'});
    }, [messages]);   // messagesが変わるたびにスクロール

    const sendMessage = async () => {
        // 入力欄が空なら何もしない
        if (inputText.trim() === '') return;

        //ユーザー側のメッセージを追加
        const userMessage = { text : inputText, sender: 'user'};
        //チャットからの返答を待っている際のメッセージ
        const thinkingMessage = { text: '考え中...(残り10秒)', sender: 'bot'};
        // 配列に追加
        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        // 入力欄を空に
        setInputText('');

        //画面の色に応じて分野をGASに送信できるようにする
        let category;
        if (theme === 'orange') {
            category = 'communication';
        } else if (theme === 'blue') {
            category = 'medical';
        } else if (theme === 'green') {
            category = 'security';
        } else {
            category = 'error';
        }

        try {
            //GASにリクエストを送信
            const response = await fetch(process.env.REACT_APP_GAS_URL, {
                method: 'POST',
                headers: { 'content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    message: inputText,
                    category: category
                }),
            });

            //GASからのレスポンスをテキストで取得
            const gasReply = await response.text();

            //考え中を上書きする
            //setMessages(prev => [...prev, { text: gasReply, sender: 'bot'}]);
            setMessages(prev => {
                const updated = [...prev];
                //最新のbotメッセージを探す
                const lastIndex = updated.length - 1;
                if (updated[lastIndex]?.sender === 'bot') {
                    updated[lastIndex] = { text: gasReply, sender: 'bot'};
                }
                return updated;
            });
        } catch (error) {
            //エラー処理
            console.error('GAS通信エラー', error);
        }
    };

    //ポスターを見るボタンの設定
    const posterPageButton = () => {
        if (theme === 'orange') {
            navigate('/communication/poster');
        } else if (theme === 'green') {
            navigate('/security/poster');
        } else if (theme === 'blue') {
            navigate('/medical/poster');
        }
    };

    //背景メッセージ
    const backMessages = {
        orange: `チャットボットに質問してみよう！
            質問例
            どんな研究をしてるの?
            オンラインコミュニケーションの課題は?`,
        blue: `チャットボットに質問してみよう！
            質問例
            どんな研究をしてるの？
            骨格推定って何?`,
        green: `チャットボットに質問してみよう！
            質問例
            どんな研究をしてるの?
            ナッジってなに?`,
    };

    return (
        <div className={classNames(styles.body, styles[theme])}>
            {/* ヘッダー */}
            <div className={classNames(styles.header, styles[`${theme}Header`])}>
                <div className={styles.headerLeft}>
                    Shikidalab
                </div>
                <div className={styles.headerRight}>
                    <button
                        onClick={posterPageButton}
                        className={styles.posterButton}
                    >
                        ポスターはこちら
                    </button>
                    <button
                        onClick={returnButton}
                        className={styles.backButton}>
                            back
                    </button>
                </div>
            </div>

            {/* 背景メッセージ */}
            {/* 何もメッセージがない場合に表示 */}
            {messages.length === 0 && (
                <div className={styles.backMessage} style={{ whiteSpace: 'pre-line'}}>
                    {backMessages[theme] || 'チャットボットに質問してみよう!'}
                </div>
            )}

            {/* チャットエリア */}
            <div className={styles.messageArea}>
                {messages.map((msg, index) => (
                    msg.sender === 'bot' ? (
                        // Botの吹き出し＋アイコン(横並び)
                        <div key={index} className={styles.messageWrapperBot}>
                            <img
                            src="/fig/Shikida_lab_logo.png"
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
                        if (e.key === 'Enter' && !isComposing) sendMessage();
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
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