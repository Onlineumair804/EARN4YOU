/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB7gXkvPCRuDfvKkfvkaCcaXb1PH0fUZ98",
  authDomain: "earn4pkr.firebaseapp.com",
  databaseURL: "https://earn4pkr-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "earn4pkr",
  storageBucket: "earn4pkr.firebasestorage.app",
  messagingSenderId: "179213291780",
  appId: "1:179213291780:web:0af687f4b9ff2fd26e0051"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
