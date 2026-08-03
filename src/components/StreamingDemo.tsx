import React, { useEffect, useState } from 'react';
import styles from './StreamingDemo.module.css';

interface StreamingDemoProps {
    text?: string;
    speed?: number;
}

const StreamingDemo: React.FC<StreamingDemoProps> = ({
    text = "The image shows a crescent moon against a black background. The moon is rendered in shades of gray, appearing as a smooth, curved shape.",
    speed = 50
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-start the animation (no loop)
    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    const chunks = [
        'data: {"chunk": "The"}',
        'data: {"chunk": " image"}',
        'data: {"chunk": " shows"}',
        'data: {"chunk": " a"}',
        'data: {"chunk": " crescent"}',
        'data: {"chunk": " moon"}',
        'data: {"chunk": " against"}',
        'data: {"chunk": " a"}',
        'data: {"chunk": " black"}',
        'data: {"chunk": " background"}',
        'data: {"chunk": "."}',
    ];

    // Calculate which chunks to show based on how much text is displayed
    const words = displayedText.split(' ');
    const chunksToShow = currentIndex >= text.length ? chunks : chunks.slice(0, Math.min(words.length + 1, chunks.length - 1));

    return (
        <div className={styles.container}>
            <div className={styles.terminal}>
                <div className={styles.terminalBody}>
                    {chunksToShow.map((chunk, i) => (
                        <div key={i} className={styles.chunk}>
                            {chunk}
                        </div>
                    ))}
                    {currentIndex < text.length && (
                        <span className={styles.cursor}>▊</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreamingDemo;
