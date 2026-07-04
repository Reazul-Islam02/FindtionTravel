"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginModal({ isOpen, onClose, redirectTo = null }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                onClose();
                if (redirectTo) {
                    router.push(redirectTo);
                } else {
                    router.refresh();
                }
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: redirectTo || "/" });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(8px)" }}
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header gradient strip */}
                <div className="h-1.5 bg-gradient-to-r from-sky-400 via-sky-600 to-indigo-600" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="px-8 pt-8 pb-8">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-sky-600/25 mb-4">
                            D
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
                            Sign In to Continue
                        </h2>
                        <p className="text-slate-500 text-sm mt-1.5 text-center">
                            You need an account to add destinations.
                        </p>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-6"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-slate-200" />
                        <span className="px-4 text-sm text-slate-400 font-medium bg-white">or</span>
                        <div className="flex-grow border-t border-slate-200" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Signing In...</>
                            ) : (
                                <><LogIn size={18} /> Sign In</>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Do not have an account?{" "}
                        <a
                            href="/register"
                            className="text-sky-600 font-bold hover:underline"
                            onClick={onClose}
                        >
                            Register for free
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
