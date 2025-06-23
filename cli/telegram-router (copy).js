// artha-telegram-router.js
// English-only Telegram command router for Artha

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const AUTHORIZED_USER_IDS = process.env.AUTHORIZED_USER_IDS?.split(",") || [];
const API_ENDPOINT = process.env.ARTHA_API_ENDPOINT;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const handlers = {
  "/add_vehicle": async (params) => {
    return axios.post(`${API_ENDPOINT}/vehicles`, params);
  },
  "/service_vehicle": async (params) => {
    return axios.post(`${API_ENDPOINT}/vehicles/service`, params);
  },
  "/add_income": async (params) => {
    return axios.post(`${API_ENDPOINT}/income`, params);
  },
  "/add_expense": async (params) => {
    return axios.post(`${API_ENDPOINT}/expenses`, params);
  },
  "/net_worth": async () => {
    return axios.get(`${API_ENDPOINT}/reports/networth`);
  },
  "/vehicle_status": async (params) => {
    return axios.get(`${API_ENDPOINT}/vehicles/status`, { params });
  },
  "/gold_value": async () => {
    return axios.get(`${API_ENDPOINT}/gold/value`);
  },
};

bot.onText(/\/\w+\s?.*/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!AUTHORIZED_USER_IDS.includes(userId.toString())) {
    return bot.sendMessage(chatId, "🚫 Unauthorized user.");
  }

  const [command, ...argArray] = msg.text.split(" ");
  const params = Object.fromEntries(
    argArray.map((kv) => kv.split("=")).filter(([k, v]) => k && v)
  );

  const handler = handlers[command];

  if (!handler) {
    return bot.sendMessage(chatId, `❓ Unknown command: ${command}`);
  }

  try {
    const response = await handler(params);
    const data = response.data;
    const reply = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    bot.sendMessage(chatId, `✅ ${reply}`);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `❌ Failed to process command.`);
  }
});
