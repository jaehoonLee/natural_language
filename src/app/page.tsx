"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error('코드 생성 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('클립보드에 복사되었습니다!');
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Flutter 코드 생성기</h1>
      <p className={styles.description}>
        자연어로 원하는 Flutter 위젯이나 기능을 설명해 보세요.
      </p>
      
      <div className={styles.inputContainer}>
        <textarea
          className={styles.promptInput}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 이미지와 텍스트가 있는 카드 위젯을 만들어줘"
          rows={4}
        />
        <button 
          className={styles.generateButton}
          onClick={generateCode}
          disabled={isLoading}
        >
          {isLoading ? '생성 중...' : '코드 생성하기'}
        </button>
      </div>

      {code && (
        <div className={styles.codeContainer}>
          <div className={styles.codeHeader}>
            <h3>생성된 Flutter 코드</h3>
            <button 
              className={styles.copyButton}
              onClick={copyToClipboard}
            >
              복사하기
            </button>
          </div>
          <pre className={styles.codeBlock}>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </main>
  );
}
