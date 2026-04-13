import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/firebaseAdmin';
import { userRepository } from '../repositories';

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        role?: string;
        school_id?: string;
        full_name?: string;
    };
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const email = decodedToken.email;

        if (!email) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Email is mandatory in token' });
        }

        // Switch to email lookup to handle UID mismatch between Seed and Firebase
        console.log(`[Auth] Verifying token for: ${email}`);
        const localUser = await userRepository.findByEmail(email);
        
        if (!localUser) {
            console.log(`[Auth] User not found in DB: ${email}. Available in Firebase but not in Local DB.`);
            // If user is authenticated in Firebase but not in our DB yet
            // If user is authenticated in Firebase but not in our DB yet
            // This might happen on first login
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: 'guest' // Default role
            };
        } else {
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: localUser.role,
                school_id: localUser.school_id || undefined,
                full_name: localUser.full_name || undefined
            };
        }

        next();
    } catch (error) {
        console.error('[AuthMiddleware] Token Verification Failed:', error);
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
};

export const checkRole = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role || '')) {
            return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
