import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LocalLogin from './pages/LocalLogin';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import RepairRequests from './pages/RepairRequests';
import ReportDamage from './pages/ReportDamage';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Schools from './pages/Schools';
import MaintenanceCalendar from './pages/MaintenanceCalendar';
import AssetPublic from './pages/AssetPublic';
import SupervisorOversight from './pages/SupervisorOversight';

import RoleRoute from './lib/RoleRoute';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

    // Show loading spinner while checking app public settings or auth
    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Handle authentication errors
    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        }
    }

    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LocalLogin />} />
                <Route path="*" element={<LocalLogin />} />
            </Routes>
        );
    }

    // Render the main app with Role Based Access Control
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                
                <Route path="/assets" element={
                    <RoleRoute allowedRoles={['admin', 'teacher', 'principal', 'supervisor']}>
                        <Assets />
                    </RoleRoute>
                } />
                
                <Route path="/repair-requests" element={
                    <RoleRoute allowedRoles={['admin', 'teacher', 'principal', 'supervisor']}>
                        <RepairRequests />
                    </RoleRoute>
                } />
                
                <Route path="/report-damage" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}>
                        <ReportDamage />
                    </RoleRoute>
                } />
                
                <Route path="/tasks" element={
                    <RoleRoute allowedRoles={['admin', 'maintenance']}>
                        <Tasks />
                    </RoleRoute>
                } />
                
                <Route path="/analytics" element={
                    <RoleRoute allowedRoles={['admin', 'principal']}>
                        <Analytics />
                    </RoleRoute>
                } />
                
                <Route path="/schools" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Schools />
                    </RoleRoute>
                } />
                
                <Route path="/calendar" element={
                    <RoleRoute allowedRoles={['admin', 'maintenance', 'principal']}>
                        <MaintenanceCalendar />
                    </RoleRoute>
                } />
                
                <Route path="/asset-view" element={<AssetPublic />} />
                
                <Route path="/supervisor-oversight" element={
                    <RoleRoute allowedRoles={['admin', 'supervisor']}>
                        <SupervisorOversight />
                    </RoleRoute>
                } />
                
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
};


function App() {

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App