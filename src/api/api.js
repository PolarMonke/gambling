const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

const register = async ({ Login: username, Email: email, Password: password }) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return handleResponse(response);
};

const login = async ({ Login: username, Password: password }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await handleResponse(response);
  return { token: data.token, user: data.user };
};

const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return {
    login: data.login,
    email: data.email,
    balance: data.balance,
    isAdmin: data.isAdmin,
    creditCard: data.creditCard ? JSON.parse(data.creditCard) : null
  };
};

const saveCreditCard = async (cardData) => {
  const response = await fetch(`${API_BASE_URL}/save_credit_card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(cardData)
  });
  return handleResponse(response);
};

const deposit = async (amount) => {
  const response = await fetch(`${API_BASE_URL}/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ amount })
  });
  const data = await handleResponse(response);
  return { newBalance: data.newBalance };
};

const getQuests = async () => {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return data.quests;
};

const completeQuest = async (questId) => {
  const response = await fetch(`${API_BASE_URL}/complete_quest/${questId}`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return { reward: data.reward, newBalance: data.newBalance };
};

const recordAction = async (actionName) => {
  const response = await fetch(`${API_BASE_URL}/record_action/${actionName}`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

const pullGacha = async () => {
  const response = await fetch(`${API_BASE_URL}/pull_gacha`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return {
    id: data.id,
    name: data.name,
    rarity: data.rarity,
    imagePath: data.imagePath,
    audioPath: data.audioPath,
    newBalance: data.newBalance,
    count: data.count
  };
};

const getInventory = async () => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return data.inventory;
};

const buyAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/buy_admin`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  const data = await handleResponse(response);
  return data;
};

const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

const adminCreateUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/admin/create_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

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
  pullGacha,
  getInventory,
  buyAdmin,
  getAllUsers,
  adminCreateUser
};

export default api;
export { api };