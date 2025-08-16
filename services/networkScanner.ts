
import type { NetworkScanResult } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A list of common ports to check with their typical services
const commonPorts = [
    { port: 21, service: 'FTP', risk: 'Unencrypted file transfer, credentials can be intercepted.' },
    { port: 22, service: 'SSH', risk: 'Potential for brute-force login attacks if not secured.' },
    { port: 25, service: 'SMTP', risk: 'Could be exploited as a mail relay for spam.' },
    { port: 80, service: 'HTTP', risk: 'Standard web traffic, unencrypted.' },
    { port: 110, service: 'POP3', risk: 'Unencrypted email protocol.' },
    { port: 143, service: 'IMAP', risk: 'Unencrypted email protocol.' },
    { port: 443, service: 'HTTPS', risk: 'Standard secure web traffic.' },
    { port: 465, service: 'SMTPS', risk: 'Secure email submission.' },
    { port: 993, service: 'IMAPS', risk: 'Secure IMAP email.' },
    { port: 995, service: 'POP3S', risk: 'Secure POP3 email.' },
    { port: 3306, service: 'MySQL', risk: 'Exposing a database to the internet is highly risky.' },
    { port: 5432, service: 'PostgreSQL', risk: 'Exposing a database to the internet is highly risky.' },
    { port: 8080, service: 'HTTP-Alt', risk: 'Alternative HTTP port, often used for application servers.' },
];

export const simulateNetworkScan = async (
  url: string,
  progressCallback: (message: string) => void
): Promise<NetworkScanResult[]> => {
  const results: NetworkScanResult[] = [];
  const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

  await sleep(500);
  progressCallback(`Starting scan for ${domain}...`);
  
  await sleep(1000);
  progressCallback('Resolving domain to IP address...');

  await sleep(1500);
  progressCallback('Pinging host to check for responsiveness...');

  for (const item of commonPorts) {
    await sleep(200 + Math.random() * 300);
    progressCallback(`Scanning port ${item.port} (${item.service})...`);

    let status: 'OPEN' | 'CLOSED' = 'CLOSED';
    // Always assume HTTP and HTTPS are open for a website
    if (item.port === 80 || item.port === 443) {
      status = 'OPEN';
    } else {
      // Randomly open other ports to simulate misconfigurations
      // Lower probability for highly sensitive ports like databases
      const openProbability = [3306, 5432, 21, 22].includes(item.port) ? 0.1 : 0.2;
      if (Math.random() < openProbability) {
        status = 'OPEN';
      }
    }
    
    if (status === 'OPEN') {
      results.push({
        port: item.port,
        protocol: 'TCP',
        service: item.service,
        status: 'OPEN',
        potentialRisk: item.risk,
      });
    }
  }

  await sleep(1000);
  progressCallback('Finalizing report...');
  
  // Ensure the results are sorted by port number
  results.sort((a, b) => a.port - b.port);
  
  return results;
};
