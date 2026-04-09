import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Package, AlertTriangle, Wrench, 
    BarChart3, School, ShieldAlert, PlusCircle, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const bottomNavItems = [
    { id: 'home', path: '/', label: 'Home', icon: LayoutDashboard, roles: ['admin', 'teacher', 'principal', 'maintenance', 'supervisor'] },
    { id: 'assets', path: '/assets', label: 'Assets', icon: Search, roles: ['admin', 'teacher', 'principal', 'supervisor'] },
    { id: 'requests', path: '/repair-requests', label: 'Requests', icon: AlertTriangle, roles: ['admin', 'teacher', 'principal', 'supervisor'] },
    { id: 'tasks', path: '/tasks', label: 'Tasks', icon: Wrench, roles: ['maintenance'] },
    { id: 'report', path: '/report-damage', label: 'Report', icon: PlusCircle, roles: ['teacher', 'admin'] },
    { id: 'oversight', path: '/supervisor-oversight', label: 'Oversight', icon: ShieldAlert, roles: ['admin', 'supervisor'] },
    { id: 'analytics', path: '/analytics', label: 'Stats', icon: BarChart3, roles: ['principal'] },
];

export default function BottomNav() {
    const location = useLocation();
    const { currentUser } = useAuth();
    const role = currentUser?.role || 'teacher';

    // Filter items based on role AND limited to 5 items max for mobile ergonomics
    const items = bottomNavItems
        .filter(item => item.roles.includes(role))
        .slice(0, 5);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4">
            <nav className="bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl h-16 flex items-center justify-around px-2 relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal/5 to-transparent pointer-events-none" />
                
                {items.map(({ path, label, icon: Icon, id }) => {
                    // Check if path is root for exact match, otherwise startsWith
                    const active = path === '/' 
                        ? location.pathname === '/' 
                        : location.pathname.startsWith(path);
                        
                    return (
                        <Link
                            key={id}
                            to={path}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative group",
                                active ? "text-teal" : "text-slate-400"
                            )}
                        >
                            {/* Active Indicator Bar */}
                            {active && (
                                <div className="absolute top-0 w-8 h-1 bg-teal rounded-b-full shadow-[0_2px_10px_rgba(20,184,166,0.4)] animate-in slide-in-from-top-full duration-300" />
                            )}
                            
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-300",
                                active ? "bg-teal/10" : "group-hover:bg-slate-100"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    active ? "scale-110" : "scale-100"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-semibold tracking-wide transition-all duration-300",
                                active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                            )}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
