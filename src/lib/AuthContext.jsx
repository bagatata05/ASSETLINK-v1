import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    setIsLoadingAuth(true);
                    // Force refresh of token
                    const token = await firebaseUser.getIdToken(true);
                    localStorage.setItem('auth_token', token);

                    // Call backend to get user details/role
                    const currentUser = await base44.auth.me();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Auth state change error:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    setIsLoadingAuth(false);
                }
            } else {
                localStorage.removeItem('auth_token');
                setUser(null);
                setIsAuthenticated(false);
                setIsLoadingAuth(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoadingAuth(true);
            await signInWithEmailAndPassword(auth, email, password);
            // We don't set isLoadingAuth(false) here because the 
            // onAuthStateChanged listener will handle it once the 
            // profile is fetched from the backend.
        } catch (error) {
            console.error('Login error:', error);
            setAuthError({
                type: 'auth_failed',
                message: error.message,
            });
            setIsLoadingAuth(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuthenticated(false);
            // Optional: force reload to clear all states
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigateToLogin = () => {
        // Since we are using Firebase, we just navigate to our own login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            currentUser: user,  // alias used by pages
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            authError,
            appPublicSettings,
            logout,
            login,
            navigateToLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
