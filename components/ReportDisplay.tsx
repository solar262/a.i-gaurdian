
import React from 'react';
import type { SecurityBriefing } from '../types';
import { SeverityLevel, MitigationDifficulty } from '../types';

const severityConfig = {
  [SeverityLevel.CRITICAL]: { color: 'bg-red-600 border-red-500', text: 'text-white' },
  [SeverityLevel.HIGH]: { color: 'bg-orange-600 border-orange-500', text: 'text-white' },
  [SeverityLevel.MEDIUM]: { color: 'bg-yellow-500 border-yellow-400', text: 'text-gray-900' },
  [SeverityLevel.LOW]: { color: 'bg-green-600 border-green-500', text: 'text-white' },
  [SeverityLevel.INFORMATIONAL]: { color: 'bg-sky-600 border-sky-500', text: 'text-white' },
};

const difficultyConfig = {
  [MitigationDifficulty.EASY]: { color: 'bg-green-600 border-green-500', text: 'text-white' },
  [MitigationDifficulty.MEDIUM]: { color: 'bg-yellow-500 border-yellow-400', text: 'text-gray-900' },
  [MitigationDifficulty.HARD]: { color: 'bg-red-600 border-red-500', text: 'text-white' },
};

const Card: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md overflow-hidden">
    <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center space-x-3">
      <div className="text-blue-400">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </div>
);

const Section: React.FC<{title: string, content: string}> = ({title, content}) => (
    <div>
        <h4 className="font-semibold text-blue-300">{title}</h4>
        <p className="text-gray-300">{content}</p>
    </div>
);

// Icons
const SummaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VulnerabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ThreatActorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TechStackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l.354-.354a3.75 3.75 0 0 0-5.303-5.303l-.354.353.354.354 5.303 5.303-.354.353Zm0 0-2.829-2.829m5.658 5.658L14.25 12l-2.829 2.829" /></svg>;


export const ReportDisplay: React.FC<{ briefing: SecurityBriefing }> = ({ briefing }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-blue-300 break-all">
        Security Report for: <span className="text-white">{briefing.url}</span>
      </h2>
      
      <Card title="Executive Summary & Attack Surface" icon={<SummaryIcon/>}>
        <Section title="Summary" content={briefing.summary} />
        <Section title="Attack Surface Analysis" content={briefing.attackSurface} />
      </Card>

      <Card title="Assumed Technology Stack" icon={<TechStackIcon/>}>
        <p className="text-sm text-gray-400">The following analysis is based on the assumption that the website uses these or similar technologies, inferred from server headers.</p>
        <div className="flex flex-wrap gap-2">
            {briefing.technologyStackAssumptions.map(tech => (
              <span key={tech} className="px-3 py-1 text-sm bg-gray-700 text-cyan-300 rounded-full">{tech}</span>
            ))}
        </div>
      </Card>

      <Card title="HTTP Header Analysis" icon={<CodeIcon/>}>
          <div className="overflow-x-auto bg-gray-900/50 rounded-md max-h-72">
              <table className="w-full text-sm text-left font-mono">
                  <thead className="bg-gray-800 text-xs text-gray-300 uppercase tracking-wider sticky top-0">
                      <tr>
                          <th className="p-3">Header Name</th>
                          <th className="p-3">Value</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                      {briefing.headerAnalysis.map(({ key, value }) => (
                          <tr key={key}>
                              <td className="p-2 text-cyan-300 whitespace-nowrap">{key}</td>
                              <td className="p-2 text-gray-300 break-all">{value}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </Card>

      <Card title="Vulnerabilities & Mitigations" icon={<VulnerabilityIcon/>}>
        {briefing.potentialVulnerabilities.map((vuln) => {
           const linkedMitigations = briefing.mitigationStrategies.filter(
                mit => vuln.mitigation_ids?.includes(mit.id)
           );
           return (
            <div key={vuln.id} className="p-4 bg-gray-900/70 border border-gray-700 rounded-md">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-semibold text-blue-300">{vuln.name}</h4>
                <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full border ${severityConfig[vuln.severity].color} ${severityConfig[vuln.severity].text}`}>
                  {vuln.severity}
                </span>
              </div>
              <p className="text-gray-300 mt-1">{vuln.description}</p>
              
              {linkedMitigations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-600/50">
                  <h5 className="text-sm font-semibold text-gray-300 flex items-center space-x-2 mb-3">
                    <WrenchIcon />
                    <span>Recommended Actions</span>
                  </h5>
                  <div className="space-y-3">
                    {linkedMitigations.map(mit => (
                      <div key={mit.id} className="p-3 bg-gray-800/50 rounded-md border border-gray-700/50">
                        <div className="flex justify-between items-start gap-2">
                           <h6 className="font-semibold text-blue-300 text-sm">{mit.strategy}</h6>
                           <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full border ${difficultyConfig[mit.difficulty].color} ${difficultyConfig[mit.difficulty].text}`}>
                            {mit.difficulty}
                           </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{mit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
           );
        })}
      </Card>
      
      <Card title="Relevant Threat Actors" icon={<ThreatActorIcon/>}>
        {briefing.relevantThreatActors.map((actor) => (
          <div key={actor.id} className="p-3 bg-gray-900/70 border border-gray-700 rounded-md">
            <h4 className="font-semibold text-blue-300">{actor.name}</h4>
            <p className="text-gray-300 mt-1"><span className="font-semibold text-gray-400">Motivation:</span> {actor.motivation}</p>
            <div className="mt-2">
              <h5 className="font-semibold text-gray-400">Common Tactics:</h5>
              <div className="flex flex-wrap gap-2 mt-1">
                {actor.common_tactics.map(tactic => (
                  <span key={tactic} className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded-md">{tactic}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};