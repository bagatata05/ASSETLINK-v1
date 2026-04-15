import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
    LayoutDashboard, Package, AlertTriangle, Wrench, BarChart3,
    School, Menu, X, Bell, LogOut, ChevronRight, Shield, CalendarDays, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import BottomNav from './BottomNav';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'principal', 'maintenance', 'supervisor'] },
    { path: '/assets', label: 'Assets', icon: Package, roles: ['admin', 'teacher', 'principal'] },
    { path: '/repair-requests', label: 'Repair Requests', icon: AlertTriangle, roles: ['admin', 'teacher', 'principal', 'supervisor'] },
    { path: '/report-damage', label: 'Report Damage', icon: AlertTriangle, roles: ['teacher'] },
    { path: '/tasks', label: 'My Tasks', icon: Wrench, roles: ['maintenance'] },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'principal'] },
    { path: '/schools', label: 'Schools', icon: School, roles: ['admin'] },
    { path: '/calendar', label: 'Calendar', icon: CalendarDays, roles: ['maintenance', 'principal'] },
    { path: '/supervisor-oversight', label: 'Oversight', icon: ShieldAlert, roles: ['admin', 'supervisor'] },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const role = currentUser?.role || 'teacher';

    const visibleItems = navItems.filter(item => item.roles.includes(role));

    return (
        <div className="min-h-screen bg-background flex overflow-x-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-all" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 h-full w-64 bg-sidebar z-[70] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto shadow-2xl lg:shadow-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full pb-20 lg:pb-0">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
                        <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-sm">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-sidebar-foreground font-bold text-lg tracking-tight">AssetLink</span>
                            <p className="text-xs text-sidebar-foreground/50 -mt-0.5">School Asset System</p>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Role badge */}
                    <div className="px-6 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal px-3 py-1 bg-teal/10 rounded-full border border-teal/20">
                            {role === 'admin' ? 'DepEd Supervisor (Admin)' : 
                             role === 'supervisor' ? 'Barangay Official' : 
                             role === 'principal' ? 'School Principal' :
                             role === 'maintenance' ? 'Maintenance Staff' :
                             'Teacher'}
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-2 space-y-1">
                        {visibleItems.map(({ path, label, icon: Icon }) => {
                            const active = location.pathname === path;
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                        active
                                            ? "bg-teal text-white shadow-sm"
                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                                    )}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{label}</span>
                                    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="px-3 py-4 border-t border-sidebar-border">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-teal">
                                    {currentUser?.full_name?.[0] || currentUser?.email?.[0] || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser?.full_name || 'User'}</p>
                                <p className="text-xs text-sidebar-foreground/50 truncate">{currentUser?.email}</p>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="text-sidebar-foreground/40 hover:text-destructive transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground/60 hover:text-foreground">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <button className="relative text-foreground/60 hover:text-foreground transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal rounded-full" />
                    </button>
                </header>

                <main className="flex-1 p-3 sm:p-4 lg:p-8 pb-24 lg:pb-8">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </div>
        </div>
    );
}