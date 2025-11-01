'use server';
/**
 * @fileOverview A flow to sync Firestore user data to a Google Sheet.
 * 
 * - syncUsersToSheet - A function that handles the sync process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
  // IMPORTANT: You must set up Google Application Default Credentials for this to work.
  // This can be done by running `gcloud auth application-default login` in your terminal.
  // The GOOGLE_APPLICATION_CREDENTIALS environment variable should point to a service account key file.
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
  });
}

const db = admin.firestore();

// IMPORTANT: Replace with your actual Google Sheet ID and range
const SPREADSHEET_ID = '1r4kxtq2bSMzsvgYyOzLu4ha-dAXe_vPIVFMAxD6-FwE';
const SHEET_NAME = 'Users'; // e.g., 'Sheet1'
const RANGE = `${SHEET_NAME}!A1`;


const SyncToSheetOutputSchema = z.object({
  status: z.string(),
  rowsAdded: z.number(),
});

type SyncToSheetOutput = z.infer<typeof SyncToSheetOutputSchema>;

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    // Scopes needed to read and write to Google Sheets
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

export async function syncUsersToSheet(): Promise<SyncToSheetOutput> {
  return syncToSheetFlow();
}

const syncToSheetFlow = ai.defineFlow(
  {
    name: 'syncToSheetFlow',
    outputSchema: SyncToSheetOutputSchema,
  },
  async () => {
    try {
      console.log('Starting sync to Google Sheet...');

      // 1. Fetch users from Firestore
      const usersSnapshot = await db.collection('users').get();
      if (usersSnapshot.empty) {
        console.log('No users found in Firestore.');
        return { status: 'No users found', rowsAdded: 0 };
      }

      const users = usersSnapshot.docs.map(doc => doc.data());
      console.log(`Found ${users.length} users in Firestore.`);
      
      // 2. Prepare data for Google Sheets
      const headerRow = ['id', 'name', 'email', 'registrationDate', 'college', 'skills', 'bio'];
      const rows = users.map(user => [
        user.id || '',
        user.name || '',
        user.email || '',
        user.registrationDate || '',
        user.college || '',
        Array.isArray(user.skills) ? user.skills.join(', ') : '',
        user.bio || '',
      ]);

      const values = [headerRow, ...rows];

      // 3. Write data to Google Sheets
      const sheets = await getGoogleSheetsClient();
      
      // Clear the sheet first to avoid duplicate data
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
      });
      console.log('Cleared existing data from sheet.');


      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      console.log('Successfully synced data to Google Sheet.');
      return { status: 'Success', rowsAdded: users.length };

    } catch (error) {
      console.error('Error syncing to Google Sheet:', error);
      // This will throw an error that can be caught by the calling action.
      throw new Error(`Failed to sync to Google Sheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
