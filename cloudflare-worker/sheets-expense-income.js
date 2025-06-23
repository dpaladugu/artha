// File: cloudflare-worker/sheets-expense-income.js

import { google } from 'googleapis'; import { readFileSync } from 'fs'; import path from 'path';

const CREDENTIALS_PATH = path.resolve('auth/credentials.json'); const authClient = new google.auth.GoogleAuth({ keyFile: CREDENTIALS_PATH, scopes: ['https://www.googleapis.com/auth/spreadsheets'], });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function appendExpenseData(data) { const client = await authClient.getClient(); const sheets = google.sheets({ version: 'v4', auth: client });

const row = [ new Date().toISOString(), data.amount || '', data.category || '', data.vehicle || '', data.notes || '' ];

const response = await sheets.spreadsheets.values.append({ spreadsheetId: SPREADSHEET_ID, range: 'transactions!A:E', valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row], }, });

return response.status === 200 || response.status === 201; }

export async function appendIncomeData(data) { const client = await authClient.getClient(); const sheets = google.sheets({ version: 'v4', auth: client });

const row = [ new Date().toISOString(), data.amount || '', data.category || 'Income', '', data.notes || '' ];

const response = await sheets.spreadsheets.values.append({ spreadsheetId: SPREADSHEET_ID, range: 'transactions!A:E', valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row], }, });

return response.status === 200 || response.status === 201; }

