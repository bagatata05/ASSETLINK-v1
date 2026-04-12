import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * A wrapper component for routes that requires specific user roles.
 * If the user is not authenticated, it will be handled by the main App logic.
 * If the user is authenticated but doesn't have the correct role, it redirects to Dashboard.
 */
export default function RoleRoute({ children, allowedRoles }) {
    const { currentUser, isAuthenticated, isLoadingAuth } = useAuth();

    // While auth is loading, we don't do anything yet
    // App.jsx handles the global loading spinner
    if (isLoadingAuth) {
        return null;
    }

    // If not authenticated, let App.jsx handle the redirect to login
    if (!isAuthenticated) {
        return null;
    }

    const userRole = currentUser?.role;

    // Check if user's role is in the allowed list
    const isAuthorized = allowedRoles.includes(userRole);

    if (!isAuthorized) {
        console.warn(`Access denied to ${window.location.pathname} for role: ${userRole}`);
        // Redirect unauthorized users to the dashboard
        return <Navigate to="/" replace />;
    }

    return children;
}
