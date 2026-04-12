import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LocalLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRealLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative">
            {/* Soft decorative blur blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal/10 blur-[120px] rounded-full animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden animate-fade-in relative z-10">

                {/* Left Side: Brand/Marketing Info */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-teal/90 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal via-teal/80 to-teal/60 opacity-50" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">AssetLink</span>
                        </div>

                        <h2 className="text-4xl font-extrabold leading-tight mb-6">
                            Smart Asset Management for Modern Schools.
                        </h2>
                        <p className="text-teal-50/80 text-lg leading-relaxed mb-8">
                            Empower your institution with real-time tracking, automated maintenance scheduling, and comprehensive reporting.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Centralized Inventory Tracking",
                                "Automated Repair Workflows",
                                "School-Level Role Management",
                                "Real-time Analytics Dashboard"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-teal-50">
                                    <CheckCircle2 className="w-5 h-5 text-teal-200" />
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-teal bg-teal-100 flex items-center justify-center text-teal-800 text-xs font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-teal-50/60">
                            Joined by over <span className="text-white font-bold">50+</span> local institutions.
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white/60 backdrop-blur-sm">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center shadow-lg shadow-teal/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">AssetLink</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500 font-medium">Enter your details to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleRealLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@school.edu"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-white/50 border-slate-200 focus:ring-teal focus:border-teal rounded-xl transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                                <button type="button" className="text-xs font-bold text-teal hover:underline px-1">Forgot password?</button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-white/50 border-slate-200 focus:ring-teal focus:border-teal rounded-xl transition-all"
                            />
                        </div>
                        {error && (
                            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in">
                                <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-600 leading-snug">{error}</p>
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-13 bg-teal hover:bg-teal-600 text-white font-bold rounded-xl shadow-xl shadow-teal/20 transition-all group flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100/60">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-medium text-slate-400">Authorized access only.</p>
                            <nav className="flex gap-4">
                                <a href="#" className="text-xs font-bold text-slate-400 hover:text-teal transition-colors">Privacy</a>
                                <a href="#" className="text-xs font-bold text-slate-400 hover:text-teal transition-colors">Support</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 tracking-widest uppercase">
                &copy; 2026 AssetLink Unified Systems
            </p>
        </div>
    );
}
