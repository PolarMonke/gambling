const mockUsers = [
  { 
    id: 1, 
    username: 'test', 
    email: 'test@test.com', 
    password: 'test123', 
    balance: 1000,
    creditCard: null
  }
];

const gachaCharacters = [
  {
    id: 1,
    name: "Billy Herrington",
    rarity: 4,
    imagePath: "characters/billy herrington.png",
    audioPath: "audio/billy herrington.mp3"
  },
  {
    id: 2,
    name: "Van Darkholme", 
    rarity: 4,
    imagePath: "characters/van darkholme.png",
    audioPath: "audio/van darkholme.mp3"
  },
  {
    id: 3,
    name: "Mark Wolf",
    rarity: 5, 
    imagePath: "characters/mark wolf.png",
    audioPath: "audio/mark wolf.mp3"
  },
  {
    id: 4,
    name: "Danny Lee",
    rarity: 5,
    imagePath: "characters/danny lee.png",
    audioPath: "audio/danny lee.mp3"
  },
  {
    id: 5,
    name: "Steve Harley",
    rarity: 5,
    imagePath: "characters/steve harley.png",
    audioPath: "audio/steve harley.mp3"
  },
  {
    id: 6,
    name: "Brad McGuire",
    rarity: 3,
    imagePath: "characters/brad mcguire.png",
    audioPath: "audio/steve brad mcguire.mp3"
  },
  {
    id: 7,
    name: "Steve Rambo",
    rarity: 3,
    imagePath: "characters/steve rambo.png",
    audioPath: "audio/steve rambo.mp3"
  },
  {
    id: 8,
    name: "Rey Harley",
    rarity: 3,
    imagePath: "characters/rey harley.png",
    audioPath: "audio/rey harley.mp3"
  },
];

const mockQuests = [
  { id: 1, title: "Play 3 Slots Games", reward: 50, requiredCount: 3, currentProgress: 0 },
  { id: 2, title: "Make a Deposit", reward: 100, requiredCount: 1, currentProgress: 0 }
];

let mockAuthToken = null;
let actionCounts = {};

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));
const register = async ({ Login, Email, Password }) => {
  await simulateNetworkDelay();
  const exists = mockUsers.some(u => u.username === Login || u.email === Email);
  if (exists) throw new Error('User already exists');
  
  const newUser = { 
    id: mockUsers.length + 1, 
    username: Login, 
    email: Email, 
    password: Password, 
    balance: 0,
    creditCard: null
  };
  mockUsers.push(newUser);
  return { success: true };
};
const login = async ({ Login, Password }) => {
  await simulateNetworkDelay();
  const user = mockUsers.find(u => u.username === Login && u.password === Password);
  if (!user) throw new Error('Invalid credentials');
  
  const token = `mock-token-${user.id}`;
  localStorage.setItem('authToken', token);
  return { token };
};
const logout = async () => {
    await simulateNetworkDelay();
    localStorage.removeItem('authToken');
    mockAuthToken = null;
    return { success: true };
};
const getProfile = async () => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Unauthorized');
    
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      localStorage.removeItem('authToken');
      throw new Error('User not found');
    }
    
    return { 
      login: user.username, 
      email: user.email, 
      balance: user.balance,
      creditCard: user.creditCard 
    };
};
const saveCreditCard = async (cardData) => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken') || mockAuthToken;
    if (!token) throw new Error('Unauthorized');
    
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.creditCard = cardData;
    return { success: true };
};
const deposit = async (amount) => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken') || mockAuthToken;
    if (!token) throw new Error('Unauthorized');
    
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.balance += amount;
    return { newBalance: user.balance };
};
const getQuests = async () => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken') || mockAuthToken;
    if (!token) throw new Error('Unauthorized');
    
    return mockQuests.map(quest => ({
      ...quest,
      isReadyForReward: quest.currentProgress >= quest.requiredCount
    }));
};
const completeQuest = async (questId) => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken') || mockAuthToken;
    if (!token) throw new Error('Unauthorized');
    
    const quest = mockQuests.find(q => q.id === questId);
    if (!quest) throw new Error('Quest not found');
    if (quest.currentProgress < quest.requiredCount) throw new Error('Quest not ready for completion');
    
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    user.balance += quest.reward;
    
    quest.currentProgress = 0;
    
    return { reward: quest.reward, newBalance: user.balance };
};
const recordAction = async (actionName) => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('authToken') || mockAuthToken;
    if (!token) return;

    actionCounts[actionName] = (actionCounts[actionName] || 0) + 1;

    mockQuests.forEach(quest => {
        if (quest.title.includes(actionName) || 
            (actionName === 'slots' && quest.title.includes('Slots'))) {
        quest.currentProgress = Math.min(
            quest.currentProgress + 1, 
            quest.requiredCount
        );
        }
    });
}

const pullGacha = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Unauthorized');
    
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    if (user.balance < 300) {
      throw new Error('Not enough currency');
    }
    
    user.balance -= 300;
    
    const pullRarity = () => {
      const roll = Math.random();
      if (roll < 0.1) return 5;  
      if (roll < 0.3) return 4; 
      return 3;  
    };
    
    const rarity = pullRarity();
    const charactersOfRarity = gachaCharacters.filter(c => c.rarity === rarity);
    const pulledCharacter = charactersOfRarity[
      Math.floor(Math.random() * charactersOfRarity.length)
    ];
    
    return {
      ...pulledCharacter,
      newBalance: user.balance
    };
}

const api = {
  register,
  login,
  logout,
  getProfile,
  saveCreditCard,
  deposit,
  getQuests,
  completeQuest,
  recordAction,
  pullGacha
};

export default api;
export { api };