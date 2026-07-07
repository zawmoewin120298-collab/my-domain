import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/auth-context";

export default function SetPassword() {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nextPage = searchParams.get('next'); // Get redirect target
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords Don't Match",
                description: "Please make sure both passwords are identical.",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                variant: "destructive",
                title: "Password Too Short",
                description: "Password must be at least 8 characters long.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/set-password', { password, confirmPassword });

            toast({
                title: "Password Set Successfully",
                description: nextPage === 'complete-profile'
                    ? "Redirecting to complete your profile..."
                    : "You can now login with your new password.",
            });

            // Refresh auth state to update 'hasPassword' flag
            await checkAuth();

            // Redirect based on 'next' parameter
            if (nextPage === 'complete-profile') {
                // Redirect to complete profile with email pre-filled
                window.location.href = `/complete-profile?email=${encodeURIComponent(user?.email || '')}`;
            } else {
                // Default: redirect to dashboard
                navigate('/dashboard');
            }

        } catch (err) {
            console.error('Set Password Error:', err);
            console.error('Error response:', err.response);

            let errorMessage = 'Failed to set password.';

            if (err.response?.status === 401) {
                errorMessage = 'Session expired. Please log in again.';
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <div className="w-full max-w-md bg-white dark:bg-[#111] border-2 border-[#E5E3DF] dark:border-[#27272a] p-8 md:p-10 rounded-xl text-center">
                <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Secure Your Account</h1>
                <p className="text-[#4A4A4A] dark:text-slate-400 mb-8">
                    To continue using the platform, please set a password. This ensures you can access your account even without GitHub.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Minimum 8 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Saving...</span> : "Set Password & Continue"}
                    </button>
                </form>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-black font-medium hover:underline">support@stackryze.com</a>
            </div>
        </div>
    );
}
