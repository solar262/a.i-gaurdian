
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ErrorMessage } from './components/ErrorMessage';
import { ReportDisplay } from './components/ReportDisplay';
import { InitialState } from './components/InitialState';
import { AnalysisProgress } from './components/AnalysisProgress';
import type { SecurityBriefing } from './types';
import { generateSecurityBriefing } from './services/geminiService';
import { fetchHeaders } from './services/headerService';

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [briefing, setBriefing] = useState<SecurityBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ messages: string[]; percentage: number } | null>(null);

  const handleGenerateBriefing = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a website URL to analyze.');
      return;
    }
    if (!URL_REGEX.test(trimmedUrl)) {
      setError('Please enter a valid website URL.');
      return;
    }

    // Normalize URL to include a protocol for the fetch API
    let fullUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = `https://${fullUrl}`;
    }

    setIsLoading(true);
    setError(null);
    setBriefing(null);
    setProgress(null);
    
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
        let baseMessages: string[] = [];

        // --- Stage 1: Fetching Headers ---
        setProgress({ messages: ['Initiating secure connection...'], percentage: 5 });
        await sleep(500);
        baseMessages.push('✓ Initiating secure connection...');
        
        setProgress({ messages: [...baseMessages, 'Fetching server headers...'], percentage: 15 });
        const headers = await fetchHeaders(fullUrl);
        
        baseMessages.push('✓ Headers received successfully.');
        
        setProgress({ messages: [...baseMessages], percentage: 25 });
        await sleep(500);
        
        // --- Stage 2: AI Analysis (run API call and progress animation in parallel) ---
        const briefingPromise = generateSecurityBriefing(fullUrl, headers);
        
        const progressPromise = async () => {
            const aiSteps = [
                'Submitting data to CyberGuard AI...',
                'AI is assessing server configuration...',
                'AI is identifying potential threat vectors...',
                'AI is formulating mitigation strategies...',
                'Compiling final security report...'
            ];
            let completedAiSteps: string[] = [];
            for (let i = 0; i < aiSteps.length; i++) {
                const percentage = 25 + Math.round(((i + 1) / aiSteps.length) * 75);
                setProgress({ messages: [...baseMessages, ...completedAiSteps, aiSteps[i]], percentage });
                await sleep(1800); // Wait for the animation of this step
                completedAiSteps.push(`✓ ${aiSteps[i]}`);
            }
        };

        const [result] = await Promise.all([briefingPromise, progressPromise()]);
        
        setBriefing(result);
        setProgress(null);

    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console and API key.');
        setProgress(null);
    } finally {
        setIsLoading(false);
    }
  }, [url]);

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisProgress messages={progress?.messages || []} percentage={progress?.percentage || 0} />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (briefing) {
      return <ReportDisplay briefing={briefing} />;
    }
    return <InitialState />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="w-full max-w-4xl mx-auto">
          <SearchForm
            url={url}
            setUrl={setUrl}
            onSubmit={handleGenerateBriefing}
            isLoading={isLoading}
          />
        </div>
        <div className="flex-grow mt-8 w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>CyberGuard AI &copy; 2024. All analyses are AI-generated and should be independently verified.</p>
      </footer>
    </div>
  );
};

export default App;
