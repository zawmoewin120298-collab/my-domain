import { Link, useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function CompleteProfile() {
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get('email') || '';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: emailParam,
        password: '', // We need password to authenticate the update
        legalName: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (!formData.legalName || !formData.address.street || !formData.address.city ||
                !formData.address.state || !formData.address.postalCode || !formData.address.country) {
                throw new Error("Please fill in all profile fields");
            }
            // Password validation: Not required if user is already authenticated via session
            // The backend will handle session-based authentication
            // if (!formData.password) {
            //     throw new Error("Please enter your password to confirm changes");
            // }

            const res = await subdomainAPI.post('/auth/email/complete-profile', formData);

            if (res.message) {
                toast({
                    title: "Profile Updated",
                    description: "Redirecting to verification...",
                });
                window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
            }

        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: err.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans py-10" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-12 w-auto dark:hidden" />
                        <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-12 w-auto hidden dark:block" />
                <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-2xl bg-white dark:bg-[#111] border-2 border-[#E5E3DF] dark:border-[#27272a] p-8 md:p-10 rounded-xl">
                <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
                    <div>
                        <p className="font-bold mb-1">Action Required</p>
                        <p>To continue using Stackryze Domains, we need you to complete your profile with your legal name and address in accordance with our updated policies.</p>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Complete Your Profile</h1>
                    <p className="text-[#4A4A4A] dark:text-slate-400">Please provide the missing details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Account Verification */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Verification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly // Email is read-only here
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-xs text-gray-500">(optional if already logged in)</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter your password for verification"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wider">Personal Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name</label>
                            <input
                                type="text"
                                name="legalName"
                                required
                                value={formData.legalName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="John Doe"
                            />
                            <p className="text-xs text-gray-500 mt-1">Required for domain registration compliance.</p>
                        </div>

                        {/* Address Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    required
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="123 Main St"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        required
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        required
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="NY"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        name="address.postalCode"
                                        required
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="10001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        required
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="United States"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50 mt-6"
                    >
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Updating Profile...</span> : "Save & Verify Email"}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-gray-500 hover:text-black hover:underline">Cancel and go back to login</Link>
                    </div>

                </form>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-black font-medium hover:underline">support@stackryze.com</a>
            </div>

            <p className="mt-8 text-xs text-[#888]">
                &copy; 2026 Stackryze domains
            </p>
        </div>
    );
}
