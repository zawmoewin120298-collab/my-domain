import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import {
    Shield, Mail, Lock, Eye, EyeOff, Loader2, Check, X,
    Edit2, KeyRound, Globe, Info, MapPin, Link2, Twitter,
    Building2, Calendar, User2, Smartphone, Copy, Download, AlertTriangle
} from "lucide-react";
import { subdomainAPI } from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Toggle({ enabled, onChange, loading }) {
    return (
        <button
            type="button"
            onClick={() => !loading && onChange(!enabled)}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-white/20"} ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

function PwField({ label, value, onChange, show, onToggle, placeholder, error }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none pr-9 transition-colors bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white ${error ? "border-red-400" : "border-slate-200/80 dark:border-white/10 focus:border-slate-900 dark:focus:border-white"}`}
                />
                <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white hover:opacity-70 transition-opacity">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function Settings() {
    const { user, checkAuth } = useAuth();

    // Email
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);

    // Password
    const [showPwForm, setShowPwForm] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showC, setShowC] = useState(false);
    const [showN, setShowN] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    // WHOIS privacy
    const [whoisPrivacy, setWhoisPrivacy] = useState(user?.whoisPrivacy !== false);
    const [privacyLoading, setPrivacyLoading] = useState(false);

    // 2FA State
    const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false);
    const [show2FASetupModal, setShow2FASetupModal] = useState(false);
    const [show2FADisableModal, setShow2FADisableModal] = useState(false);
    const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
    const [twoFALoading, setTwoFALoading] = useState(false);
    const [twoFASetupStep, setTwoFASetupStep] = useState(1); // 1: password, 2: qr code, 3: verify, 4: backup codes
    const [twoFAPassword, setTwoFAPassword] = useState("");
    const [show2FAPassword, setShow2FAPassword] = useState(false);
    const [twoFAQRCode, setTwoFAQRCode] = useState("");
    const [twoFASecret, setTwoFASecret] = useState("");
    const [twoFACode, setTwoFACode] = useState("");
    const [backupCodes, setBackupCodes] = useState([]);
    const [disablePassword, setDisablePassword] = useState("");
    const [disableCode, setDisableCode] = useState("");
    const [showDisablePassword, setShowDisablePassword] = useState(false);
    const [twoFAError, setTwoFAError] = useState("");
    const [disableError, setDisableError] = useState("");

    // Update 2FA status when user changes
    useEffect(() => {
        setTwoFAEnabled(user?.twoFactorEnabled || false);
    }, [user?.twoFactorEnabled]);

    const handleEmailUpdate = async () => {
        if (!newEmail?.includes("@")) return toast.error("Enter a valid email");
        if (newEmail.toLowerCase() === user.email.toLowerCase()) return setIsEditingEmail(false);
        try {
            setEmailLoading(true);
            await subdomainAPI.post("/auth/email/change-email", { newEmail });
            toast.success("Verification email sent");
            window.location.href = `/verify-email?email=${encodeURIComponent(newEmail)}`;
        } catch (err) {
            toast.error(err.data?.error || err.message || "Failed");
        } finally { setEmailLoading(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPw !== confirmPw) return toast.error("Passwords do not match");
        if (newPw.length < 8) return toast.error("Min 8 characters");
        try {
            setPwLoading(true);
            const res = await fetch(`${API_BASE}/auth/email/change-password`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(data.message || "Password updated!");
            setCurrentPw(""); setNewPw(""); setConfirmPw(""); setShowPwForm(false);
        } catch (err) { toast.error(err.message); }
        finally { setPwLoading(false); }
    };

    const handlePrivacyToggle = async (enabled) => {
        try {
            setPrivacyLoading(true);
            const res = await fetch(`${API_BASE}/subdomains/whois-privacy`, {
                method: "PATCH", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setWhoisPrivacy(data.whoisPrivacy);
            toast.success(data.message);
        } catch (err) { toast.error(err.message); }
        finally { setPrivacyLoading(false); }
    };

    // 2FA Handlers
    const reset2FAModal = () => {
        setTwoFASetupStep(1);
        setTwoFAPassword("");
        setTwoFAQRCode("");
        setTwoFASecret("");
        setTwoFACode("");
        setBackupCodes([]);
        setShow2FAPassword(false);
        setTwoFAError("");
    };

    const handleStart2FASetup = async () => {
        if (!twoFAPassword) {
            setTwoFAError("Password is required");
            return;
        }
        setTwoFAError("");
        try {
            setTwoFALoading(true);
            const res = await fetch(`${API_BASE}/auth/2fa/setup`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: twoFAPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setTwoFAError(data.error || "Failed to start setup");
                return;
            }
            setTwoFAQRCode(data.qrCode);
            setTwoFASecret(data.secret);
            setTwoFASetupStep(2);
        } catch (err) { setTwoFAError(err.message); }
        finally { setTwoFALoading(false); }
    };

    const handleVerify2FASetup = async () => {
        if (!twoFACode || twoFACode.length !== 6) {
            setTwoFAError("Enter a 6-digit code");
            return;
        }
        setTwoFAError("");
        try {
            setTwoFALoading(true);
            const res = await fetch(`${API_BASE}/auth/2fa/verify-setup`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: twoFACode }),
            });
            const data = await res.json();
            if (!res.ok) {
                setTwoFAError(data.error || "Invalid code. Please try again.");
                return;
            }
            setBackupCodes(data.backupCodes);
            setTwoFAEnabled(true);
            setTwoFASetupStep(3);
            toast.success("2FA enabled successfully!");
            checkAuth(); // Refresh user data
        } catch (err) { setTwoFAError(err.message); }
        finally { setTwoFALoading(false); }
    };

    const handleDisable2FA = async () => {
        if (!disablePassword) {
            setDisableError("Password is required");
            return;
        }
        if (!disableCode) {
            setDisableError("2FA code is required");
            return;
        }
        setDisableError("");
        try {
            setTwoFALoading(true);
            const res = await fetch(`${API_BASE}/auth/2fa/disable`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: disablePassword, code: disableCode }),
            });
            const data = await res.json();
            if (!res.ok) {
                setDisableError(data.error || "Invalid password or code");
                return;
            }
            setTwoFAEnabled(false);
            setShow2FADisableModal(false);
            setDisablePassword("");
            setDisableCode("");
            setDisableError("");
            toast.success("2FA disabled successfully");
            checkAuth(); // Refresh user data
        } catch (err) { setDisableError(err.message); }
        finally { setTwoFALoading(false); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const downloadBackupCodes = () => {
        const content = `Stackryze Domains - Backup Codes\n${"=".repeat(40)}\nGenerated: ${new Date().toLocaleString()}\n\nSave these codes in a secure location. Each code can only be used once.\n\n${backupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}\n\n${"=".repeat(40)}\nIf you lose access to your authenticator app, you can use these codes to log in.`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stackryze-backup-codes.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })
        : null;

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings & Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                {/* ── LEFT: Profile sidebar ── */}
                <div className="space-y-4">
                    {/* Avatar + name card */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 text-center shadow-sm">
                        <div className="relative inline-block mb-3">
                            <img
                                src={user?.avatarUrl || "https://github.com/shadcn.png"}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md"
                            />
                            {user?.githubVerified && (
                                <span title="GitHub Verified" className="absolute bottom-0 right-0 w-6 h-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800">✓</span>
                            )}
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{user?.name || "User"}</h2>
                        <p className="text-xs text-slate-900 dark:text-white font-mono mt-0.5">@{user?.username || "—"}</p>
                        {user?.bio && <p className="text-xs text-slate-900 dark:text-white italic mt-2 leading-relaxed">"{user.bio}"</p>}
                    </div>

                    {/* Details card */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 space-y-2.5 shadow-sm">
                        {user?.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <MapPin className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user?.company && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Building2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>{user.company}</span>
                            </div>
                        )}
                        {user?.blog && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Link2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="hover:text-orange-500 hover:underline truncate">
                                    {user.blog.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}
                        {user?.twitterUsername && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Twitter className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>@{user.twitterUsername}</span>
                            </div>
                        )}
                        {memberSince && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Calendar className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>Joined {memberSince}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                            <User2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                            <span>{user?.githubId ? "GitHub account" : "Email account"}</span>
                        </div>
                    </div>

                    {/* Account stats */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Domain Limits</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-900 dark:text-white">indevs.in</span>
                                <span className="font-bold text-slate-900 dark:text-white">{user?.domainLimit || 1} domain{(user?.domainLimit || 1) > 1 ? "s" : ""}</span>
                            </div>
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">sryze.cc</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.sryzeDomainsLimit || 1} domain{(user?.sryzeDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">ryzedns.org</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.ryzeDnsDomainsLimit || 1} domain{(user?.ryzeDnsDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">nx.kg</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.nxKgDomainsLimit || 1} domain{(user?.nxKgDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* ── RIGHT: Settings panels ── */}
                <div className="space-y-4">

                    {/* Email */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Address</h3>
                        </div>
                        {isEditingEmail ? (
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    autoFocus
                                    className="flex-1 px-3 py-2 text-sm border border-slate-200/80 dark:border-white/10 focus:border-slate-900 dark:focus:border-white rounded-lg outline-none bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white"
                                />
                                <button onClick={handleEmailUpdate} disabled={emailLoading} className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors disabled:opacity-50">
                                    {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { setIsEditingEmail(false); setNewEmail(""); }} className="px-3 py-2 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-sm text-slate-900 dark:text-white font-medium truncate">{user?.email}</span>
                                    {!user?.isEmailVerified && <span className="shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>}
                                    {user?.email?.includes("noreply.github.com") && (
                                        <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            Change required
                                        </span>
                                    )}
                                </div>
                                {user?.githubId && user?.email?.includes("noreply.github.com") && (
                                    <button onClick={() => { setIsEditingEmail(true); setNewEmail(""); }} className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg transition-colors shadow-sm">
                                        <Edit2 className="w-3 h-3" /> Change
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Security / Password */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <KeyRound className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Security</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Password</p>
                                <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">{user?.hasPassword ? "Change using your current password" : "No password set — use forgot password to create one"}</p>
                            </div>
                            {user?.hasPassword ? (
                                <button
                                    onClick={() => setShowPwForm(!showPwForm)}
                                    className="shrink-0 text-xs font-bold px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors rounded-lg shadow-sm"
                                >
                                    {showPwForm ? "Cancel" : "Change"}
                                </button>
                            ) : (
                                <a href="/forgot-password" className="shrink-0 text-xs font-bold px-3 py-1.5 bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-lg shadow-sm">
                                    Set password
                                </a>
                            )}
                        </div>

                        {showPwForm && user?.hasPassword && (
                            <form onSubmit={handlePasswordChange} className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
                                <PwField label="Current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} show={showC} onToggle={() => setShowC(!showC)} placeholder="Your current password" />
                                <PwField label="New password" value={newPw} onChange={e => setNewPw(e.target.value)} show={showN} onToggle={() => setShowN(!showN)} placeholder="At least 8 characters" />
                                <PwField label="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} show={showCf} onToggle={() => setShowCf(!showCf)} placeholder="Repeat new password" error={confirmPw && newPw !== confirmPw ? "Passwords don't match" : ""} />
                                <button
                                    type="submit"
                                    disabled={pwLoading || (confirmPw && newPw !== confirmPw)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    {pwLoading ? "Saving…" : "Update password"}
                                </button>
                            </form>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-900 dark:text-white">Forgot your password?</p>
                            <a href="/forgot-password" className="text-xs font-bold text-slate-900 dark:text-white hover:text-orange-500 underline">Reset via email</a>
                        </div>

                        {/* 2FA Section */}
                        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                        {twoFAEnabled && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Enabled</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">
                                        {twoFAEnabled 
                                            ? "Your account is protected with 2FA" 
                                            : "Add extra security using an authenticator app"}
                                    </p>
                                </div>
                                {user?.hasPassword ? (
                                    twoFAEnabled ? (
                                        <button
                                            onClick={() => setShow2FADisableModal(true)}
                                            className="shrink-0 text-xs font-bold px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg shadow-sm"
                                        >
                                            Disable
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { reset2FAModal(); setShow2FASetupModal(true); }}
                                            className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors rounded-lg shadow-sm"
                                        >
                                            <Smartphone className="w-3 h-3" /> Enable
                                        </button>
                                    )
                                ) : (
                                    <span className="text-xs text-slate-900 dark:text-white font-medium italic">Set a password first</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Privacy / WHOIS */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Privacy</h3>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">WHOIS Privacy</p>
                                <p className="text-xs font-medium text-slate-900 dark:text-white mt-0.5 leading-relaxed">
                                    Hide your email from public domain WHOIS lookups.
                                </p>
                                <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-xs font-bold ${whoisPrivacy ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${whoisPrivacy ? "bg-green-500" : "bg-amber-400"}`} />
                                    {whoisPrivacy ? "Email hidden" : "Email visible"}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-1 mt-0.5">
                                <Toggle enabled={whoisPrivacy} onChange={handlePrivacyToggle} loading={privacyLoading} />
                                {privacyLoading && <span className="text-[10px] font-bold text-slate-900 dark:text-white">Saving…</span>}
                            </div>
                        </div>

                        <p className="mt-3 text-xs font-medium text-slate-900 dark:text-white">Name, address &amp; phone are always redacted regardless of this setting.</p>
                    </div>

                    {/* Official Channels */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-slate-900 dark:text-white" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Official Contact Channels</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {["support@stackryze.com", "reportabuse@stackryze.com", "security@stackryze.com", "no-reply@stackryze.com"].map(e => (
                                <div key={e} className="flex items-center gap-2 text-xs bg-white/50 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 rounded-lg px-3 py-2">
                                    <Mail className="w-3 h-3 text-slate-900 dark:text-white shrink-0" />
                                    <span className="font-mono font-medium text-slate-900 dark:text-white truncate">{e}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-slate-900 dark:text-white">We will <strong className="text-red-500">never</strong> contact you from any other domain. Report fakes to <span className="font-mono font-bold">reportabuse@stackryze.com</span>.</p>
                    </div>

                </div>
            </div>

            {/* 2FA Setup Modal */}
            <Dialog open={show2FASetupModal} onOpenChange={(open) => { if (!open) reset2FAModal(); setShow2FASetupModal(open); }}>
                <DialogContent className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border-slate-200/80 dark:border-white/10 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <Smartphone className="w-5 h-5 text-orange-500" />
                            {twoFASetupStep === 3 ? "Backup Codes" : "Enable Two-Factor Authentication"}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-900 dark:text-white">
                            {twoFASetupStep === 1 && "Enter your password to begin setup."}
                            {twoFASetupStep === 2 && "Scan the QR code with your authenticator app."}
                            {twoFASetupStep === 3 && "Save these backup codes in a secure location."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Step 1: Password */}
                    {twoFASetupStep === 1 && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={show2FAPassword ? "text" : "password"}
                                        value={twoFAPassword}
                                        onChange={(e) => setTwoFAPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-3 py-2.5 text-sm border border-slate-200/80 dark:border-white/10 focus:border-slate-900 dark:focus:border-white rounded-lg outline-none pr-14 bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white"
                                    />
                                    <button type="button" onClick={() => setShow2FAPassword(!show2FAPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white hover:opacity-70">
                                        {show2FAPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleStart2FASetup}
                                disabled={twoFALoading || !twoFAPassword}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {twoFALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: QR Code + Verify */}
                    {twoFASetupStep === 2 && (
                        <div className="space-y-4 mt-4">
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-3 rounded-xl border border-slate-200/80 dark:border-white/10 mb-3 shadow-sm">
                                    <img src={twoFAQRCode} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                                <p className="text-xs font-medium text-slate-900 dark:text-white text-center mb-2">Scan with Google Authenticator, Authy, or similar</p>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 rounded-lg px-3 py-2 w-full">
                                    <code className="text-xs font-mono font-bold text-slate-900 dark:text-white flex-1 break-all">{twoFASecret}</code>
                                    <button onClick={() => copyToClipboard(twoFASecret)} className="shrink-0 text-slate-900 dark:text-white hover:opacity-70">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-slate-900 dark:text-white mt-1">Can't scan? Enter this code manually.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Enter 6-digit code from your app</label>
                                <input
                                    type="text"
                                    value={twoFACode}
                                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-3 py-2.5 text-sm border border-slate-200/80 dark:border-white/10 focus:border-slate-900 dark:focus:border-white rounded-lg outline-none text-center font-mono text-lg tracking-widest bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={handleVerify2FASetup}
                                disabled={twoFALoading || twoFACode.length !== 6}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {twoFALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Verify & Enable
                            </button>
                        </div>
                    )}

                    {/* Step 3: Backup Codes */}
                    {twoFASetupStep === 3 && (
                        <div className="space-y-4 mt-4">
                            <div className="bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 flex items-start gap-2 shadow-sm">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Save these codes now! They won't be shown again. Each code can only be used once.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {backupCodes.map((code, i) => (
                                    <div key={i} className="bg-slate-100 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 rounded-lg px-3 py-2 text-center">
                                        <code className="text-sm font-mono font-bold text-slate-900 dark:text-white">{code}</code>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm"
                                >
                                    <Copy className="w-4 h-4" /> Copy
                                </button>
                                <button
                                    onClick={downloadBackupCodes}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                            <button
                                onClick={() => { setShow2FASetupModal(false); reset2FAModal(); }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors shadow-sm"
                            >
                                <Check className="w-4 h-4" /> Done
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* 2FA Disable Modal */}
            <Dialog open={show2FADisableModal} onOpenChange={(open) => { setShow2FADisableModal(open); if (!open) { setDisablePassword(""); setDisableCode(""); setDisableError(""); } }}>
                <DialogContent className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border-slate-200/80 dark:border-white/10 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Disable Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-900 dark:text-white">
                            This will make your account less secure. Enter your password and a 2FA code to confirm.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Error Banner */}
                    {disableError && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg flex items-start gap-2 shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-red-800 dark:text-red-300 flex-1">{disableError}</p>
                            <button onClick={() => setDisableError("")} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold">×</button>
                        </div>
                    )}

                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showDisablePassword ? "text" : "password"}
                                    value={disablePassword}
                                    onChange={(e) => { setDisablePassword(e.target.value); setDisableError(""); }}
                                    placeholder="Enter your password"
                                    className={`w-full px-3 py-2.5 text-sm border ${disableError ? 'border-red-400' : 'border-slate-200/80 dark:border-white/10'} focus:border-slate-900 dark:focus:border-white rounded-lg outline-none pr-14 bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white`}
                                />
                                <button type="button" onClick={() => setShowDisablePassword(!showDisablePassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white hover:opacity-70">
                                    {showDisablePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">2FA Code or Backup Code</label>
                            <input
                                type="text"
                                value={disableCode}
                                onChange={(e) => { setDisableCode(e.target.value.toUpperCase().slice(0, 8)); setDisableError(""); }}
                                placeholder="Enter code"
                                maxLength={8}
                                className={`w-full px-3 py-2.5 text-sm border ${disableError ? 'border-red-400' : 'border-slate-200/80 dark:border-white/10'} focus:border-slate-900 dark:focus:border-white rounded-lg outline-none text-center font-mono tracking-widest bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white`}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setShow2FADisableModal(false); setDisablePassword(""); setDisableCode(""); }}
                                className="flex-1 py-2.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisable2FA}
                                disabled={twoFALoading || !disablePassword || !disableCode}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {twoFALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Disable 2FA
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
