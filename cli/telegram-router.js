// File: cli/telegram-router.js

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { appendVehicleData } from '../cloudflare-worker/google-sheets-handler.js';
import { appendExpenseData, appendIncomeData } from '../cloudflare-worker/sheets-expense-income.js';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const authorizedUsers = process.env.AUTHORIZED_USER_IDS.split(',');

function parseCommandText(text) {
  const parts = text.trim().split(/\s+/);
  const params = {};
  parts.slice(1).forEach(part => {
    const [key, value] = part.split('=');
    params[key] = value;
  });
  return params;
}

console.log('🤖 Artha Bot is polling for commands...');

// /add_vehicle handler
bot.onText(/^\/add_vehicle(?:\s|$)/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (!authorizedUsers.includes(userId)) {
    return bot.sendMessage(chatId, '⛔ Unauthorized');
  }

  const params = parseCommandText(msg.text);

  try {
    const success = await appendVehicleData({
      vehicle: params.vehicle,
      odo: params.odo,
      fuel: params.fuel,
      notes: params.notes || ''
    });

    if (success) {
      bot.sendMessage(chatId, `✅ Vehicle '${params.vehicle}' updated (ODO: ${params.odo}, Fuel: ${params.fuel})`);
    } else {
      bot.sendMessage(chatId, '⚠️ Failed to update sheet');
    }
  } catch (err) {
    console.error('Error:', err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

// /add_expense handler
bot.onText(/^\/add_expense(?:\s|$)/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (!authorizedUsers.includes(userId)) {
    return bot.sendMessage(chatId, '⛔ Unauthorized');
  }

  const params = parseCommandText(msg.text);

  try {
    const success = await appendExpenseData({
      amount: params.amount,
      category: params.category,
      vehicle: params.vehicle || '',
      notes: params.notes || ''
    });

    if (success) {
      bot.sendMessage(chatId, `💸 Expense logged: ₹${params.amount} (${params.category})`);
    } else {
      bot.sendMessage(chatId, '⚠️ Failed to log expense');
    }
  } catch (err) {
    console.error('Error:', err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

// /add_income handler
bot.onText(/^\/add_income(?:\s|$)/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (!authorizedUsers.includes(userId)) {
    return bot.sendMessage(chatId, '⛔ Unauthorized');
  }

  const params = parseCommandText(msg.text);

  try {
    const success = await appendIncomeData({
      amount: params.amount,
      category: params.category || 'Income',
      notes: params.notes || ''
    });

    if (success) {
      bot.sendMessage(chatId, `💰 Income logged: ₹${params.amount} (${params.category})`);
    } else {
      bot.sendMessage(chatId, '⚠️ Failed to log income');
    }
  } catch (err) {
    console.error('Error:', err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});