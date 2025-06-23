// File: cloudflare-worker/google-sheets-handler.js

import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';

// Load the service account credentials
const CREDENTIALS_PATH = path.resolve('auth/credentials.json');

const authClient = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function appendVehicleData(data) {
  const client = await authClient.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const row = [
    new Date().toISOString(),
    data.vehicle || '',
    data.odo || '',
    data.fuel || '',
    data.notes || ''
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'vehicles!A:E',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  return response.status === 200 || response.status === 201;
}