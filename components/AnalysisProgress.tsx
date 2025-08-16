
import React, { useEffect, useRef } from 'react';

interface AnalysisProgressProps {
  messages: string[];
  percentage: number;
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

const AlertTriangleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z" />
    </svg>
);


export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ messages, percentage }) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Analysis in Progress...</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{width: `${percentage}%`}}
                ></div>
            </div>
        </div>
        <div className="font-mono text-sm bg-black rounded p-4 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, index) => {
                const isCurrent = index === messages.length - 1 && percentage < 100;
                const isCompleted = msg.startsWith('✓');
                const isWarning = msg.startsWith('⚠️');

                let icon = <span className="w-5 h-5 flex-shrink-0"></span>;
                if(isWarning) icon = <AlertTriangleIcon />;
                else if (isCompleted) icon = <CheckCircleIcon />;
                else if (isCurrent) icon = <Spinner />;

                let textColor = 'text-gray-400';
                if(isWarning) textColor = 'text-yellow-300';
                else if (isCurrent) textColor = 'text-blue-300 animate-pulse';

                return (
                    <div 
                        key={index} 
                        ref={isCurrent ? lastMessageRef : null} 
                        className={`flex items-start space-x-2 ${textColor}`}
                    >
                        {icon}
                        <span>{msg.replace(/^[✓⚠️]\s*/, '')}</span>
                    </div>
                )
            })}
        </div>
    </div>
  );
};
