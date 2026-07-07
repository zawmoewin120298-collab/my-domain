import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, Mail, AlertCircle } from "lucide-react";

export default function ChangeEmail() {
    const [searchParams] = useSearchParams();
    const currentEmail = searchParams.get("email");
    const isRequired = searchParams.get("required") === "true";

    const [newEmail, setNewEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentEmail) {
            navigate('/login');
            return;
        }

        // IMPORTANT: This page is ONLY for noreply email users
        // Normal users should change their email from Settings page
        const isNoreplyEmail = currentEmail.includes('noreply.github.com');
        if (!isNoreplyEmail) {
            toast({
                title: "Not Required",
                description: "Email change from this page is only for GitHub noreply emails. Use Settings to change your email.",
            });
            navigate('/dashboard');
            return;
        }
    }, [currentEmail, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newEmail || !newEmail.includes('@')) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please enter a valid email address.",
            });
            return;
        }

        if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
            toast({
                variant: "destructive",
                title: "Same Email",
                description: "Please enter a different email address.",
            });
            return;
        }

        if (newEmail.includes('noreply')) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please use a valid personal email address, not a noreply address.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/change-email', { newEmail });

            // If we got here without error, email change was successful
            toast({
                title: "Email Updated",
                description: "Redirecting to verification...",
            });

            // Redirect to verification page with the new email
            setTimeout(() => {
                window.location.href = `/verify-email?email=${encodeURIComponent(newEmail)}`;
            }, 1000);

        } catch (err) {
            console.error("Email change failed", err);

            // Handle GitHub re-authentication requirement
            if (err.data?.error === 'github_reauth_required') {
                toast({
                    variant: "destructive",
                    title: "Re-authentication Required",
                    description: "Please log in with GitHub again to change your email.",
                });
                setTimeout(() => {
                    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/github`;
                }, 1500);
                return;
            }

            toast({
                variant: "destructive",
                title: "Failed to Update Email",
                description: err.data?.error || "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-12 w-auto dark:hidden" />
                        <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-12 w-auto hidden dark:block" />
                <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-white dark:bg-[#111] border-2 border-[#E5E3DF] dark:border-[#27272a] p-8 md:p-10 rounded-xl">
                <Mail className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2 text-center">Update Your Email</h1>

                {isRequired && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">Action Required</p>
                            <p>Your current email address is a GitHub noreply address and cannot receive verification emails. Please update it to a valid personal email to continue.</p>
                        </div>
                    </div>
                )}

                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Current Email</p>
                    <p className="font-mono text-sm text-gray-900 break-all">{currentEmail}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="your.email@example.com"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Use a valid personal email address that you can access.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !newEmail}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" /> Updating...
                            </span>
                        ) : "Update Email"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>After updating, you'll receive a verification code at your new email address.</p>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-black font-medium hover:underline">support@stackryze.com</a>
            </div>
        </div>
    );
}
