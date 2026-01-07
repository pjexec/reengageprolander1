
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFirstName('');
            setEmail('');
            setFormState('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!firstName.trim() || !email.trim()) {
            setFormState('error');
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setFormState('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setFormState('loading');

        try {
            // Call our backend API endpoint (keeps API key secure on server)
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    email: email.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit. Please try again.');
            }

            setFormState('success');
        } catch (err) {
            setFormState('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden animate-[slideUp_0.3s_ease-out]">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className="p-8 sm:p-10">
                    {formState === 'success' ? (
                        // Success state
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">
                                You're In!
                            </h3>
                            <p className="text-slate-400 mb-6">
                                We'll reach out shortly with your next steps. Check your inbox!
                            </p>
                            <button
                                onClick={onClose}
                                className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Close this window
                            </button>
                        </div>
                    ) : (
                        // Form state
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-4">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Limited Beta Access</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                                    Get Early Access
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Apply for a Beta Account and lock in your grandfathered pricing.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        disabled={formState === 'loading'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        disabled={formState === 'loading'}
                                    />
                                </div>

                                {/* Error message */}
                                {formState === 'error' && (
                                    <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <AlertCircle size={16} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={formState === 'loading'}
                                    className="group w-full flex items-center justify-center space-x-3 bg-emerald-500 text-white px-6 py-4 rounded-xl text-lg font-black hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                                >
                                    {formState === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Get Early Access</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer note */}
                            <p className="text-center text-xs text-slate-500 mt-6">
                                No spam. Unsubscribe anytime.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Animation keyframes */}
            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default SignupModal;
