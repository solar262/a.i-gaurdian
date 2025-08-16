/**
 * PRODUCTION NOTE:
 * To bypass browser CORS (Cross-Origin Resource Sharing) policies reliably, this application
 * now uses a server-side proxy to fetch HTTP headers. A direct client-side request to a
 * third-party domain is typically blocked by the browser for security reasons.
 *
 * This implementation uses a public, third-party proxy for demonstration purposes.
 * For a production environment, it is STRONGLY recommended to deploy your own private
 * CORS proxy to ensure stability, security, and avoid rate-limiting.
 *
 * The flow is now:
 * 1. Client (this app) sends request to the proxy, passing the target URL.
 * 2. The proxy server makes the actual request to the target URL.
 * 3. The target server responds to the proxy (no CORS issue here).
 * 4. The proxy forwards the headers back to the client.
 */

// Using a public proxy for demonstration. Replace with your own in production.
// Defunct proxies: 'https://proxy.cors.sh/', 'https://api.allorigins.win/raw?url=', 'https://thingproxy.freeboard.io/fetch/', 'https://cors.eu.org/'
const PROXY_URL = 'https://corsproxy.io/?';

export const fetchHeaders = async (url: string): Promise<Record<string, string>> => {
  // This proxy expects the target URL to be appended directly to its path/query.
  const proxyFetchUrl = `${PROXY_URL}${url}`;
  
  try {
    const response = await fetch(proxyFetchUrl, {
      // Using 'GET' instead of 'HEAD' for better compatibility, as some servers
      // don't correctly handle or explicitly block HEAD requests.
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
        if (response.status === 525) {
            // Specific handling for SSL Handshake Failed error. This is often caused by a simple typo in the domain.
            throw new Error(`SSL Handshake Failed (Status 525): A secure connection to "${url}" could not be established. Please double-check the URL for spelling errors. This issue can also be caused by an invalid or expired SSL certificate on the target website.`);
        } else if (response.status === 521) {
            // Specific handling for Web Server is Down error. This often happens when the origin server refuses connections from the proxy,
            // which is a common security measure for sites using services like Cloudflare.
            throw new Error(`Web Server Is Down (Status 521): The web server for "${url}" is not responding to our proxy. This can happen if the server is temporarily offline or is configured to block proxy connections (a common security measure on services like Cloudflare).`);
        }
        // Proxy might return an error if the target is unreachable or if the proxy itself has an issue.
        throw new Error(`Proxy request failed with status ${response.status}: ${response.statusText}. Please try again later or use a different URL.`);
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Filter out headers added by the proxy to keep the analysis clean.
      if (!lowerKey.startsWith('x-cors-') && !lowerKey.startsWith('access-control-')) {
          headers[key] = value;
      }
    });

    return headers;
  } catch (error) {
    console.error("Header fetch via proxy failed:", error);
    // If we've thrown a specific, user-friendly error from the `!response.ok` block, re-throw it directly.
    if (error instanceof Error && (error.message.startsWith('SSL Handshake Failed') || error.message.startsWith('Web Server Is Down') || error.message.startsWith('Proxy request failed'))) {
        throw error;
    }
    // For generic network errors (e.g., fetch failed), wrap it in our standard user-friendly message.
    throw new Error(`Could not fetch live headers for "${url}". This may be due to a network issue, an invalid URL, or the proxy service being temporarily unavailable.`);
  }
};