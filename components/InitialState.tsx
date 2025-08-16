
import React from 'react';

const FeatureCard: React.FC<{ title: string; description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-start space-x-4">
        <div className="flex-shrink-0 text-blue-400 mt-1">{icon}</div>
        <div>
            <h3 className="font-semibold text-gray-100">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const VulnerabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MitigationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;


export const InitialState: React.FC = () => {
    return (
        <div className="text-center p-8 bg-gray-900/50 border border-dashed border-gray-700 rounded-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome to CyberGuard AI</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Your AI-powered partner for website security. Enter a URL above to fetch and analyze its live HTTP headers, generating an instant, AI-driven security assessment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <FeatureCard 
                    icon={<CodeIcon/>}
                    title="Analyze Live Headers"
                    description="Begin with a real-time fetch of the server's HTTP headers to inspect its configuration."
                />
                <FeatureCard
                    icon={<VulnerabilityIcon/>}
                    title="Identify Potential Threats"
                    description="Our AI analyzes the headers to find misconfigurations and missing security features."
                />
                <FeatureCard
                    icon={<MitigationIcon/>}
                    title="Get Actionable Mitigations"
                    description="Receive clear, prioritized strategies to harden your website's server configuration."
                />
            </div>
        </div>
    );
};
