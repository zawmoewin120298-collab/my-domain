import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Header } from "../components/header";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords Don't Match",
                description: "Please ensure both password fields match.",
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                variant: "destructive",
                title: "Weak Password",
                description: "Password must be at least 8 characters.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/reset-password', {
                email,
                otp,
                newPassword
            });

            toast({
                title: "Password Reset",
                description: "Your password has been reset successfully.",
            });

            navigate('/login');

        } catch (err) {
            console.error('Reset password error:', err);
            const errorMessage = err.response?.data?.error || err.message || "Failed to reset password.";

            toast({
                variant: "destructive",
                title: "Reset Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-10" style={{ paddingTop: 'calc(4rem + var(--incident-height, 0px) + 2.5rem)' }}>
                <div className="w-full max-w-md bg-white dark:bg-transparent rounded-[24px] border border-slate-200/80 dark:border-white/5 p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"></div>
                    
                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Enter Reset Code</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Sent to <strong>{email}</strong></p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 w-auto dark:hidden" />
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    <form onSubmit={handleReset} className="space-y-5 text-left">
                        <div className="flex flex-col items-center">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 w-full text-left">Reset Code</label>
                            <InputOTP maxLength={6} value={otp} onChange={setOtp} required>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 focus:border-transparent transition-all dark:text-white dark:placeholder-slate-500"
                                placeholder="Minimum 8 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 focus:border-transparent transition-all dark:text-white dark:placeholder-slate-500"
                                placeholder="Confirm password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length < 6}
                            className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Resetting...</span> : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 text-center">
                        <p className="text-xs text-slate-500 mb-2">Code expires in 10 minutes.</p>
                        <Link to="/login" className="text-sm font-medium text-slate-900 dark:text-white hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-medium hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-slate-900 dark:text-white font-medium hover:underline">support@stackryze.com</a>
                </div>

                <p className="mt-8 text-xs text-slate-400">
                    &copy; 2026 Stackryze domains
                </p>
            </div>
        </>
    );
}
