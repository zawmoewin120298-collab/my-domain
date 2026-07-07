import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Smartphone, Loader2, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Verify2FA() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [code, setCode] = useState("");
    const [useBackupCode, setUseBackupCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        
        if (!emailParam) {
            toast.error("Invalid 2FA verification link");
            navigate("/login");
            return;
        }
        
        setEmail(emailParam);
    }, [searchParams, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!code || code.length < 6) {
            setError("Please enter a valid 6-digit code or backup code");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/auth/2fa/verify`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || "Invalid verification code. Please try again.");
                return;
            }

            toast.success(data.message || "Logged in successfully");
            
            if (data.usedBackupCode && data.remainingBackupCodes < 3) {
                toast.warning(`Only ${data.remainingBackupCodes} backup codes remaining. Consider regenerating them.`);
            }
            
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFCF5] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-[#111] border-2 border-[#E5E3DF] dark:border-[#27272a] rounded-2xl p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#E5E3DF] dark:border-[#27272a]">
                            <Shield className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Two-Factor Authentication</h1>
                        <p className="text-sm text-[#888]">
                            Enter the code from your authenticator app
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold">×</button>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div className="flex flex-col items-center">
                            <label className="block text-xs font-bold text-[#4A4A4A] dark:text-slate-400 mb-4 w-full text-left uppercase tracking-wider">
                                {useBackupCode ? "Backup Code" : "Verification Code"}
                            </label>
                            
                            {!useBackupCode ? (
                                <InputOTP maxLength={6} value={code} onChange={(v) => { setCode(v); setError(""); }} required autoFocus>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            ) : (
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => { setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)); setError(""); }}
                                    placeholder="Enter 8-character backup code"
                                    maxLength={8}
                                    autoFocus
                                    className={`w-full px-4 py-3 text-lg border-2 ${error ? 'border-red-300' : 'border-[#E5E3DF] dark:border-[#27272a]'} focus:border-[#1A1A1A] rounded-[14px] outline-none text-center font-mono tracking-[0.2em] transition-colors`}
                                />
                            )}
                            
                            <button 
                                type="button" 
                                onClick={() => { setUseBackupCode(!useBackupCode); setCode(""); setError(""); }}
                                className="text-xs text-[#888] mt-4 hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
                            >
                                {useBackupCode ? "Use Authenticator App Instead" : "Use a backup code"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.length < 6}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#FF6B35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Smartphone className="w-5 h-5" />
                            )}
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </form>

                    {/* Back to login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#1A1A1A] dark:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </button>
                    </div>
                </div>

                {/* Help text */}
                <p className="text-center text-xs text-[#888] mt-4">
                    Lost access to your authenticator app?{" "}
                    <a href="mailto:support@stackryze.com" className="text-[#FF6B35] hover:underline">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
}
