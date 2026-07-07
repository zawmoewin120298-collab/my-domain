import { Github, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/auth-context";
import { Header } from "../components/header";
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login() {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState('github');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorBanner, setErrorBanner] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(import.meta.env.DEV ? "dev-bypass" : "");
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const { toast } = useToast();

    useEffect(() => {
        if (error) {
            let title = "Login Failed";
            let description = "An unknown error occurred.";

            switch (error) {
                case 'banned':
                    title = "Account Suspended";
                    description = "Your account has been banned for violating our terms.";
                    break;
                case 'registration_closed':
                    title = "Registration Closed";
                    description = "New sign-ups are currently disabled by the administrator.";
                    break;
                case 'github_failed':
                    title = "Authentication Failed";
                    description = "Could not sign in with GitHub. Please try again later.";
                    break;
                case 'server_error':
                    title = "Server Error";
                    description = "Something went wrong on our end. Please try later.";
                    break;
                case 'github_account_too_new':
                    const daysRequired = searchParams.get('days') || '7';
                    title = "Account Looks Suspicious";
                    description = `Your GitHub account appears to be recently created. We cannot proceed at this time. Please refrain from using alt or spam accounts. If you believe this is a mistake, please contact support. (Account must be at least 7 days old, ${daysRequired} day(s) remaining)`;
                    break;
                case 'no_public_email':
                    title = "Public Email Required";
                    description = "We need a public email from your GitHub account to create your account and send important notifications.";
                    break;
                case 'registration_closed_use_email':
                    title = "GitHub Signups Paused";
                    description = "New accounts must use Email/Password. Existing users can still login with GitHub.";
                    setActiveTab('email');
                    break;
                default:
                    title = "Login Failed";
                    description = error || "An unknown error occurred. Please try again.";
                    break;
            }

            setErrorBanner({ title, description });

            toast({
                variant: "destructive",
                title,
                description,
                duration: 6000,
            });
        }
    }, [error, toast, searchParams]);

    const handleGithubLogin = () => login("github");

    const handleEmailLogin = async (e) => {
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
            const res = await subdomainAPI.post('/auth/email/login', {
                email,
                password,
                captchaToken
            });

            // Check if 2FA is required
            if (res.requires2FA) {
                toast({
                    title: "2FA Required",
                    description: "Redirecting to verification...",
                });
                window.location.href = `/verify-2fa?email=${encodeURIComponent(res.email || email)}`;
                return;
            }

            if (res.success) {
                // Force full page reload to refresh auth context
                window.location.href = '/dashboard';
            }
        } catch (err) {
            if (err.status === 403) {
                if (err.message === 'Please verify your email address first.') {
                    toast({
                        title: "Verification Required",
                        description: "Redirecting to verification page...",
                    });
                    window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
                    return;
                }

                if (err.data && err.data.error === 'profile_incomplete') {
                    toast({
                        title: "Profile Completion Required",
                        description: "Redirecting to complete your profile...",
                    });
                    window.location.href = `/complete-profile?email=${encodeURIComponent(email)}`;
                    return;
                }
            }

            toast({
                variant: "destructive",
                title: "Login Failed",
                description: err.message || "Invalid credentials",
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
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Welcome back</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to manage your subdomains</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 w-auto dark:hidden" />
                        <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    {/* Error Banner */}
                    {errorBanner && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 mb-1 text-sm">{errorBanner.title}</h3>
                                    <p className="text-xs text-red-800">{errorBanner.description}</p>
                                </div>
                                <button
                                    onClick={() => setErrorBanner(null)}
                                    aria-label="Dismiss error"
                                    className="text-red-900 hover:text-red-700 font-bold text-xl leading-none"
                                >×</button>
                            </div>
                        </div>
                    )}

                    {error === 'banned' && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
                            Your account is banned for violating our terms of use. Please <a href="mailto:support@stackryze.com" className="underline hover:text-red-800">contact support</a> if you think this is a mistake.
                        </div>
                    )}

                    {error === 'github_account_too_new' && (
                        <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl text-sm">
                            <p className="font-bold mb-2">⚠️ Account Looks Suspicious</p>
                            <p className="mb-3">Your GitHub account appears to be recently created. We cannot proceed at this time.</p>
                            <p className="mb-2"><strong>Please refrain from using alt or spam accounts.</strong></p>
                            <p className="text-xs text-orange-600">
                                💡 <strong>Think this is a mistake?</strong> Please <a href="mailto:support@stackryze.com" className="underline font-medium">contact support</a> with your GitHub username.
                            </p>
                        </div>
                    )}

                    {error === 'no_public_email' && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm">
                            <p className="font-bold mb-2">📧 Public Email Required</p>
                            <p className="mb-3">We need your email to send important account notifications and updates. Please make your email public on GitHub:</p>
                            <ol className="list-decimal list-inside space-y-1 mb-3 text-left">
                                <li>Go to <a href="https://github.com/settings/emails" target="_blank" rel="noopener noreferrer" className="underline font-medium">GitHub Email Settings</a></li>
                                <li>Uncheck "Keep my email addresses private"</li>
                                <li>Come back and try logging in again</li>
                            </ol>
                            <p className="text-xs text-blue-600">💡 <strong>Tip:</strong> Use a separate email for GitHub if you're worried about spam.</p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-white/5 mb-8 relative">
                        <button
                            className={`flex-1 pb-4 text-sm font-medium transition-colors ${activeTab === 'github' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-white'}`}
                            onClick={() => setActiveTab('github')}
                        >
                            GitHub
                        </button>
                        <button
                            className={`flex-1 pb-4 text-sm font-medium transition-colors ${activeTab === 'email' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-white'}`}
                            onClick={() => setActiveTab('email')}
                        >
                            Email
                        </button>
                    </div>

                    {activeTab === 'github' ? (
                        <button
                            onClick={handleGithubLogin}
                            className="w-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-sm"
                        >
                            <Github className="w-5 h-5" />
                            Login with GitHub
                        </button>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all dark:text-white dark:placeholder-slate-500"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all dark:text-white dark:placeholder-slate-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <Link to="/forgot-password" className="text-xs font-medium text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-white transition-colors">Forgot Password?</Link>
                            </div>

                            {/* Captcha */}
                            {!import.meta.env.DEV && (
                                <div className="flex justify-center py-2">
                                    <Turnstile
                                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => setCaptchaToken(token)}
                                        onError={(error) => {
                                            console.error('Turnstile error:', error);
                                            toast({ variant: "destructive", title: "CAPTCHA Error", description: "Unable to load verification. Please refresh." });
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
                                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Logging in...</span> : "Login"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                        <p className="text-sm text-slate-600 dark:text-[#888]">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-slate-900 dark:text-white hover:underline">
                                Sign up
                            </Link>
                        </p>
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
