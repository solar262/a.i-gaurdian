
import React, { useEffect, useRef } from 'react';

interface ScanningProgressProps {
  messages: string[];
}

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const ScanningProgress: React.FC<ScanningProgressProps> = ({ messages }) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const completedMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Performing Simulated Network Scan...</h3>
        <div className="font-mono text-sm bg-black rounded p-4 h-64 overflow-y-auto space-y-2">
            {completedMessages.map((msg, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-400">
                    <CheckCircleIcon />
                    <span>{msg}</span>
                </div>
            ))}
            {currentMessage && (
                 <div ref={lastMessageRef} className="flex items-center space-x-2 text-blue-300 animate-pulse">
                    <Spinner />
                    <span>{currentMessage}</span>
                </div>
            )}
        </div>
    </div>
  );
};
