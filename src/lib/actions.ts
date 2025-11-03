'use server';

import { summarizeJudgingFeedback } from '@/ai/flows/summarize-judging-feedback';
import { chat, type Message } from '@/ai/flows/chat-flow';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Helper function to initialize Firebase Admin SDK
function initializeAdminApp(): App {
  const adminApp = getApps().find(app => app.name === 'admin');
  if (adminApp) {
    return adminApp;
  }
  // By passing 'undefined' as the first argument, the SDK will automatically
  // use Application Default Credentials in the Google Cloud environment.
  return initializeApp(undefined, 'admin');
}

export async function generateSummaryAction(feedback: string) {
  try {
    const result = await summarizeJudgingFeedback({ feedback });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error(error);
    return { summary: null, error: 'Failed to generate summary.' };
  }
}

export async function chatWithAI(messages: Message[]) {
    try {
        const result = await chat({ messages });
        return { response: result.response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error: 'Failed to get response from AI.'};
    }
}

export async function makeAdminAction(email: string): Promise<{ success: boolean; message: string }> {
    try {
        const adminApp = initializeAdminApp();
        const auth = getAuth(adminApp);
        const firestore = getFirestore(adminApp);
        
        const userRecord = await auth.getUserByEmail(email);
        const uid = userRecord.uid;

        if (!uid) {
            return { success: false, message: 'User not found.' };
        }

        // Set the document in roles_admin collection with the user's UID as the document ID
        // and store the email inside the document.
        const adminRoleRef = firestore.collection('roles_admin').doc(uid);
        await adminRoleRef.set({ email: userRecord.email });

        return { success: true, message: `Successfully made ${email} an admin.` };
    } catch (error: any) {
        console.error('Error in makeAdminAction:', error);
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}

export async function removeAdminAction(uid: string): Promise<{ success: boolean; message: string }> {
    try {
        const adminApp = initializeAdminApp();
        const firestore = getFirestore(adminApp);

        const adminRoleRef = firestore.collection('roles_admin').doc(uid);
        await adminRoleRef.delete();

        return { success: true, message: 'Admin role removed successfully.' };
    } catch (error: any) {
        console.error('Error in removeAdminAction:', error);
        return { success: false, message: error.message || 'An unknown error occurred.' };
    }
}
