
import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const sections = [
        {
            title: "1. Information We Collect",
            content: "We collect information you provide directly, including account registration data (name, email, company), ESP connection credentials (securely encrypted), and subscriber engagement data from your connected email platforms. We also collect usage data such as log files, device information, and analytics to improve our service."
        },
        {
            title: "2. How We Use Your Information",
            content: "We use your information to provide and improve our re-engagement services, analyze subscriber engagement patterns, generate campaign recommendations, protect sender reputation, communicate service updates, and comply with legal obligations. We do not use your data for any purpose unrelated to delivering our service."
        },
        {
            title: "3. Data Storage & Security",
            content: "All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. We employ industry-standard security measures including regular security audits, access controls, and monitoring. Your ESP credentials are stored using secure vault technology and are never accessible in plain text."
        },
        {
            title: "4. Data Sharing",
            content: "We do not sell, rent, or share your personal information or subscriber data with third parties for their marketing purposes. We may share data only with service providers who assist in delivering our service (under strict confidentiality agreements), or when required by law or to protect our legal rights."
        },
        {
            title: "5. ESP Data & Subscriber Information",
            content: "When you connect your ESP, we access subscriber data solely to provide re-engagement analysis and campaign automation. This data remains your property. We act as a data processor on your behalf and process subscriber data only according to your instructions and our service functionality."
        },
        {
            title: "6. Data Retention",
            content: "We retain your account data for as long as your account is active. Upon account termination, we delete your data within 90 days, except where retention is required by law. You may request earlier deletion by contacting us. Aggregated, anonymized data may be retained for analytics purposes."
        },
        {
            title: "7. Your Rights (GDPR & CCPA)",
            content: "You have the right to access, correct, delete, or export your personal data. You may opt out of marketing communications at any time. California residents have additional rights under CCPA, including the right to know what data is collected and to request deletion. EU residents have rights under GDPR including data portability."
        },
        {
            title: "8. Cookies & Tracking",
            content: "We use essential cookies for authentication and service functionality. We may use analytics cookies to understand how our service is used. You can control cookie preferences through your browser settings. We do not use cookies for advertising purposes."
        },
        {
            title: "9. Third-Party Integrations",
            content: "Our service integrates with email service providers and other tools you choose to connect. These integrations are governed by their respective privacy policies. We recommend reviewing the privacy practices of any third-party services you connect to ReEngage Pro."
        },
        {
            title: "10. Children's Privacy",
            content: "ReEngage Pro is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly."
        },
        {
            title: "11. International Data Transfers",
            content: "Your data may be processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses where applicable. By using our service, you consent to such transfers."
        },
        {
            title: "12. Changes to This Policy",
            content: "We may update this Privacy Policy from time to time. We will notify you of material changes via email or through our service. Your continued use of ReEngage Pro after changes constitutes acceptance of the updated policy."
        },
        {
            title: "13. Contact Us",
            content: "For privacy-related inquiries, to exercise your data rights, or to file a complaint, please contact our Data Protection Officer at privacy@reengage.pro. We aim to respond to all requests within 30 days."
        }
    ];

    return (
        <div className="bg-[#1C3166] min-h-screen pt-28">
            {/* Header Section */}
            <section className="py-20 border-b border-white/5 bg-gradient-to-b from-slate-900 to-[#1C3166]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2.5 rounded-full mb-10">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Your Privacy Matters</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
                        We are committed to protecting your data and being transparent about our practices.
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                        Last updated: January 7, 2026
                    </p>
                    <div className="flex justify-center mt-12">
                        <div className="flex flex-col items-center animate-bounce opacity-40">
                            <ChevronDown className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 sm:p-16 shadow-2xl">
                        {/* Key Commitments */}
                        <div className="mb-16 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                            <h2 className="text-xl font-black text-emerald-400 mb-4">Our Privacy Commitments</h2>
                            <ul className="space-y-3 text-slate-300 font-medium">
                                <li className="flex items-start space-x-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>We never sell your data or subscriber information</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>Your ESP credentials are encrypted and never stored in plain text</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>You can delete your data at any time</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>GDPR and CCPA compliant</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-12">
                            {sections.map((section, idx) => (
                                <div key={idx} className="group">
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/10">
                            <p className="text-sm text-slate-500 font-medium text-center">
                                Your trust is essential to us. If you have any questions about this Privacy Policy, please don't hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
