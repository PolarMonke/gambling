import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';
import '../styles/Inventory.css';

const Inventory = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await api.getInventory();
        setInventory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventory();
  }, []);

  if (isLoading) return <div className="loading">{t('Loading...')}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inventory-container">
      <h2>{t('Character Inventory')}</h2>
      
      {inventory.length === 0 ? (
        <p className="empty-inventory">{t('Your inventory is empty. Pull some characters!')}</p>
      ) : (
        <div className="inventory-grid">
          {inventory.map((character) => (
            <div 
              key={character.id} 
              className={`inventory-card rarity-${character.rarity}`}
            >
              <img 
                src={character.imagePath} 
                alt={character.name}
                className="character-image"
              />
              <div className="character-info">
                <h3>{t(character.name)}</h3>
                <div className="character-count">
                  {t('Owned')}: {character.count}
                </div>
                <div className="rarity-stars">
                  {'★'.repeat(character.rarity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;