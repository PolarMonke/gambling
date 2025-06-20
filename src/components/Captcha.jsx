import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Captcha.css';
import { useTranslation } from 'react-i18next';

const Captcha = ({ onVerification }) => {
    const { t } = useTranslation();
    const icons = ['👨', '👩', '👧', '👦', '👴', '👵', '🤖', '👽', '🤡'];
    const humanIcons = icons.slice(0, 6);

    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');

    const reelsRef = useRef([React.createRef(), React.createRef(), React.createRef()]);
    const slotContainersRef = useRef([React.createRef(), React.createRef(), React.createRef()]);

    const ICON_HEIGHT = 120;

    useEffect(() => {
        initializeReels();
    }, []);

    const initializeReels = useCallback(() => {
        reelsRef.current.forEach((reelRef) => {
            if (reelRef.current) {
                reelRef.current.innerHTML = '';

                const totalIcons = icons.length * 30;

                for (let i = 0; i < totalIcons; i++) {
                    const icon = icons[i % icons.length];
                    const iconEl = document.createElement('div');
                    iconEl.className = 'slot-icon';
                    iconEl.textContent = icon;
                    reelRef.current.appendChild(iconEl);
                }

                const randomStartIndex = Math.floor(Math.random() * icons.length);
                const initialOffset = randomStartIndex * ICON_HEIGHT;
                reelRef.current.style.transition = 'none';
                reelRef.current.style.transform = `translateY(-${initialOffset}px)`;
            }
        });
    }, [icons]);

    const spinAll = useCallback(async () => {
        if (spinning) return;

        setSpinning(true);
        setMessage('');
        setMessageClass('');

        slotContainersRef.current.forEach(containerRef => {
            if (containerRef.current) {
                containerRef.current.classList.add('spinning');
            }
        });

        const targets = reelsRef.current.map(() => Math.floor(Math.random() * icons.length));

        const cycles = 10;

        const animations = reelsRef.current.map((reelRef, index) => {
            return new Promise(resolve => {
                if (!reelRef.current) return resolve(-1);

                const targetIndex = targets[index];
                const totalIcons = icons.length * 10;
                const finalPosition = (cycles * icons.length + targetIndex) * ICON_HEIGHT;

                reelRef.current.style.transition = 'transform 3s cubic-bezier(0.33, 1, 0.68, 1)';
                reelRef.current.style.transform = `translateY(-${finalPosition}px)`;

                const onTransitionEnd = () => {
                    reelRef.current.removeEventListener('transitionend', onTransitionEnd);

                    reelRef.current.style.transition = 'none';
                    
                    const resetPosition = targetIndex * ICON_HEIGHT;
                    reelRef.current.style.transform = `translateY(-${resetPosition}px)`;

                    resolve(targetIndex);
                };

                reelRef.current.addEventListener('transitionend', onTransitionEnd);
            });
        });

        const results = await Promise.all(animations);

        slotContainersRef.current.forEach(containerRef => {
            if (containerRef.current) {
                containerRef.current.classList.remove('spinning');
            }
        });

        const isHuman = results.every(index => index < humanIcons.length);

        if (isHuman) {
            setMessage('Success! You proved you\'re human.');
            setMessageClass('success');
        } else {
            setMessage('Failed! Try again to prove you\'re human.');
            setMessageClass('error');
        }

        if (onVerification) {
            onVerification(isHuman);
        }

        setSpinning(false);

        return isHuman;
    }, [spinning, humanIcons.length, icons.length, onVerification]);

    return (
        <div className="slot-machine-container">
            <h1>{t("Human Verification")}</h1>
            <p>{t("Spin the slots to prove you're human (3 humans win!)")}</p>

            <div className={`message ${messageClass}`}>{message}</div>

            <div className="slot-machine">
                {[0, 1, 2].map((index) => (
                    <div className="slot-container" key={index} ref={slotContainersRef.current[index]}>
                        <div className="slot">
                            <div className="slot-reel" ref={reelsRef.current[index]}></div>
                        </div>
                        <div className="slot-overlay">{t('Spinning...')}</div>
                    </div>
                ))}
            </div>

            <button onClick={spinAll} disabled={spinning}>
                {spinning ? t('Spinning...') : t('Spin Slots')}
            </button>
        </div>
    );
};

export default Captcha;