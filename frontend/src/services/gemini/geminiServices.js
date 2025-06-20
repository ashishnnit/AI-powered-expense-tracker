import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const token = getUserFromStorage();

export const startChatSessionAPI = async () => {
  const res = await axios.post(`${BASE_URL}/gemini/start`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const sendGeminiMessageAPI = async (prompt) => {
  const res = await axios.post(`${BASE_URL}/gemini/chat`, { prompt }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
