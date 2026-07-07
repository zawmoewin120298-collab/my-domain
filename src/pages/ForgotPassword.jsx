import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Header } from "../components/header";
import { Turnstile } from '@marsidev/react-turnstile';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(import.meta.env.DEV ? "dev-bypass" : "");
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            toast({
                variant: "destructive",
                title: "Verification Required",
                description: "Please complete the CAPTCHA verification.",
            });
            return;
        }

        setIsLoading(true);
        try {
            await subdomainAPI.post('/auth/email/forgot-password', {
                email,
                captchaToken
            });

            // Show success toast
            toast({
                title: "Code Sent!",
                description: "Check your inbox for the reset code.",
            });

            // Navigate to reset password page with email pre-filled
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.error || "Failed to send reset code.",
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
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Reset Password</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your email to receive a reset code</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 w-auto dark:hidden" />
                        <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 focus:border-transparent transition-all dark:text-white dark:placeholder-slate-500"
                                placeholder="name@example.com"
                            />
                        </div>

                        {!import.meta.env.DEV && (
                            <div className="flex justify-center py-2">
                                <Turnstile
                                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setCaptchaToken(token)}
                                    onError={(error) => {
                                        console.error('Turnstile error:', error);
                                        toast({ variant: "destructive", title: "CAPTCHA Error", description: "Unable to load verification." });
                                    }}
                                    options={{ theme: 'light' }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !captchaToken}
                            className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Sending...</span> : "Send Reset Code"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 text-center">
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
