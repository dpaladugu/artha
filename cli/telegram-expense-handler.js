// File: cli/telegram-expense-handler.js

import TelegramBot from 'node-telegram-bot-api'; import dotenv from 'dotenv'; import { appendExpenseData } from '../cloudflare-worker/sheets-expense-income.js'; import { lookupAccount } from '../cloudflare-worker/account-utils.js';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true }); const authorizedUsers = process.env.AUTHORIZED_USER_IDS.split(',');

console.log('🤖 Artha Expense Bot is live...');

function parseFreeformExpense(text) { const parts = text.trim().split(/\s+/); if (parts.length < 2) throw new Error('❗ Please provide amount and source at minimum.');

const amount = parseFloat(parts[1]); if (isNaN(amount)) throw new Error('❗ Invalid amount. Example: /expense 120 phonepe vijetha milk tomatoes');

const [_, __, source, destination, category, ...noteParts] = parts; return { amount, source: source || 'UnknownSource', dest: destination || 'Misc', category: category || 'Uncategorized', notes: noteParts.join(' ') }; }

bot.onText(/^/expense(?:\s|$)/, async (msg) => { const chatId = msg.chat.id; const userId = msg.from.id.toString();

if (!authorizedUsers.includes(userId)) { return bot.sendMessage(chatId, '⛔ Unauthorized'); }

try { const data = parseFreeformExpense(msg.text);

// Optional: enrich account details from lookup
const accountInfo = lookupAccount(data.source);
const label = accountInfo ? `${accountInfo.bank} ${accountInfo.cardName}` : data.source;

const success = await appendExpenseData({
  amount: data.amount,
  category: data.category,
  source: label,
  dest: data.dest,
  notes: data.notes || ''
});

if (success) {
  bot.sendMessage(chatId, `💸 Expense logged: ₹${data.amount} [${data.category}] via ${label} → ${data.dest}`);
} else {
  bot.sendMessage(chatId, '⚠️ Failed to log expense');
}

} catch (err) { console.error('Error:', err); bot.sendMessage(chatId, ❌ ${err.message}); } });

