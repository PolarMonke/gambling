import "../styles/QuestsBox.css";

const QuestsBox = () => {
    const questsNum = 4;
    const quests = [
        {
            "Id": 1,
            "Title": "Deposit 1000 BYN",
            "Reward": 50.0,
            "ReqiredAction": 'deposit',
            "RequiredCount": 1000
        },
        {
            "Id": 2,
            "Title": "Deposit 1000 BYN",
            "Reward": 50.0,
            "ReqiredAction": 'deposit',
            "RequiredCount": 1000
        },
        {
            "Id": 3,
            "Title": "Deposit 1000 BYN",
            "Reward": 50.0,
            "ReqiredAction": 'deposit',
            "RequiredCount": 1000
        },
        {
            "Id": 4,
            "Title": "Deposit 1000 BYN",
            "Reward": 50.0,
            "ReqiredAction": 'deposit',
            "RequiredCount": 1000
        },
    ]
    return (
        <div className="quest-box-container">
            <div className="quest-box">
                {quests.map((quest) => (
                    <div key={quest.Id} className="quest">
                        <h3>{quest.Title}</h3>
                        <div className="quest-actions">
                            <p className="reward">Reward: {quest.Reward} <img src="src/assets/currency.png" className="currency"/></p>
                            <button className="claim-button">Claim</button>
                        </div>
                        <progress className="quest-progress" value="32" max="100"></progress>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default QuestsBox;