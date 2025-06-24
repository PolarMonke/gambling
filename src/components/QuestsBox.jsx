import React, { useState, useEffect } from "react";
import "../styles/QuestsBox.css";
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';

const QuestsBox = () => {
    const { t } = useTranslation();
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getQuests();
            setQuests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleCompleteQuest = async (questId) => {
        try {
            setLoading(true);
            const result = await api.completeQuest(questId);
            await fetchQuests();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="quest-box-container">{t('Loading quests...')}</div>;
    if (error) return <div className="quest-box-container">{t('Error')}: {error}</div>;
    if (quests.length === 0) return <div className="quest-box-container">{t('No active quests available')}</div>;

    return (
        <div className="quest-box-container">
            <div className="quest-box">
                {quests.map((quest) => (
                    <div key={quest.id} className="quest">
                        <h3>{t(quest.title)}</h3>
                        <div className="quest-actions">
                            <p className="reward">{t('Reward')}: {quest.reward} $</p>
                            <button 
                                className={`claim-button ${quest.isReadyForReward ? 'ready' : ''}`}
                                onClick={() => handleCompleteQuest(quest.id)}
                                disabled={!quest.isReadyForReward || loading}
                            >
                                {quest.isReadyForReward ? t('Claim Reward') : t('In Progress')}
                            </button>
                        </div>
                        <progress 
                            className="quest-progress" 
                            value={quest.currentProgress || 0} 
                            max={quest.requiredCount || 1}
                        ></progress>
                        <div className="progress-text">
                            {quest.currentProgress || 0}/{quest.requiredCount || 1}
                        </div>
                    </div>
                ))}
            </div>
            
            <img src="src/assets/chips.png" className="decoration chips" id="chips1" />
            <img src="src/assets/chips.png" className="decoration chips" id="chips2" />
        </div>
    );
};

export default QuestsBox;