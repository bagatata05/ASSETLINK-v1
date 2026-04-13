import admin from 'firebase-admin';
import { config } from '../config/unifiedConfig';

let firebaseApp: any;
let auth: any;

try {
    let serviceAccount = config.firebase.serviceAccountJson 
        ? JSON.parse(config.firebase.serviceAccountJson) 
        : undefined;

    // Robustly handle PEM formatting (newlines) for the private key
    if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    if (admin.apps.length === 0) {
        if (serviceAccount && serviceAccount.private_key) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: config.firebase.projectId,
            });
            console.log('[FirebaseAdmin] Initialized with Service Account');
        } else {
            // Fallback for local development
            firebaseApp = admin.initializeApp({
                projectId: config.firebase.projectId,
            });
            console.log('[FirebaseAdmin] Initialized with Default Credentials');
        }
    } else {
        firebaseApp = admin.app();
    }
} catch (error) {
    console.warn('[FirebaseAdmin] Initialization Warning:', error.message);
    console.warn('[FirebaseAdmin] Auth features may be limited until FIREBASE_SERVICE_ACCOUNT_JSON is set.');
}

// Ensure auth is accessible even if initialization was partial
try {
    auth = admin.auth();
} catch (e) {
    console.error('[FirebaseAdmin] Auth initialization failed');
}

export { auth, firebaseApp };
