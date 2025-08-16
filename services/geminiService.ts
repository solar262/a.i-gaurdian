
import { GoogleGenAI, Type } from "@google/genai";
import type { SecurityBriefing } from '../types';
import { SeverityLevel, MitigationDifficulty } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    url: { type: Type.STRING, description: "The website URL that was analyzed." },
    summary: { type: Type.STRING, description: "A high-level executive summary of the website's security assessment based on its HTTP headers, 2-3 sentences long." },
    attackSurface: { type: Type.STRING, description: "A brief analysis of the potential attack surface for this specific website, considering the information revealed in the headers." },
    technologyStackAssumptions: {
        type: Type.ARRAY,
        description: "A list of technologies (e.g., WordPress, React, Nginx) the AI assumes the site is built with, based on headers like 'Server' or 'X-Powered-By'.",
        items: { type: Type.STRING }
    },
    headerAnalysis: {
        type: Type.ARRAY,
        description: "A copy of the HTTP headers returned by the server that were used for analysis, formatted as an array of objects, each with a 'key' and a 'value'.",
        items: {
            type: Type.OBJECT,
            properties: {
                key: { type: Type.STRING, description: "The HTTP header name." },
                value: { type: Type.STRING, description: "The HTTP header value." }
            },
            required: ["key", "value"]
        }
    },
    potentialVulnerabilities: {
      type: Type.ARRAY,
      description: "A list of potential vulnerabilities identified from the HTTP headers, such as missing security headers or information disclosure, ranked from most to least critical.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique slug-like identifier, e.g., 'missing-csp-header'."},
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "A description of the vulnerability in the context of the analyzed website's headers."},
          severity: { type: Type.STRING, enum: Object.values(SeverityLevel) },
          mitigation_ids: { 
            type: Type.ARRAY, 
            description: "A list of IDs of mitigation strategies that address this vulnerability.",
            items: { type: Type.STRING }
          },
        },
        required: ["id", "name", "description", "severity"],
      },
    },
    mitigationStrategies: {
      type: Type.ARRAY,
      description: "A list of actionable strategies to mitigate the identified header-based vulnerabilities. Each must have a unique id.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique slug-like identifier, e.g., 'implement-csp'."},
          strategy: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: Object.values(MitigationDifficulty) },
        },
        required: ["id", "strategy", "description", "difficulty"],
      },
    },
    relevantThreatActors: {
      type: Type.ARRAY,
      description: "A list of threat actor groups or types that might exploit the weaknesses found in the header analysis.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique slug-like identifier for the actor, e.g., 'automated-scanners'."},
          name: { type: Type.STRING },
          motivation: { type: Type.STRING, description: "Primary motivations (e.g., financial, defacement, data theft)." },
          common_tactics: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["id", "name", "motivation", "common_tactics"],
      },
    },
  },
  required: ["url", "summary", "attackSurface", "technologyStackAssumptions", "headerAnalysis", "potentialVulnerabilities", "mitigationStrategies", "relevantThreatActors"],
};


export const generateSecurityBriefing = async (url: string, headers: Record<string, string>): Promise<SecurityBriefing> => {
  const prompt = `
    Act as an expert cybersecurity analyst performing a non-invasive, AI-driven security assessment of a website based on its HTTP headers.
    Your task is to generate a comprehensive security report for the URL: "${url}".

    You have been provided with the following HTTP headers fetched from the server.
    
    HTTP HEADERS:
    ${JSON.stringify(headers, null, 2)}

    IMPORTANT: Your analysis must be based SOLELY on your knowledge of web technologies and the HTTP headers provided above. Do not infer information you cannot see.

    Based on the headers, infer the likely technology stack (e.g., from the 'Server' or 'X-Powered-By' headers). State these assumptions clearly.
    
    Provide a detailed analysis covering:
    1.  A brief, high-level summary of the website's likely security posture based on its headers.
    2.  An overview of the potential attack surface revealed by the headers.
    3.  A list of technologies you assume the site is using, based on evidence from the headers.
    4.  A copy of the provided HTTP headers.
    5.  A list of the top 3-5 most critical potential vulnerabilities identified from the headers (e.g., missing 'Content-Security-Policy', verbose 'Server' header, missing 'X-Frame-Options', etc.).
    6.  A list of actionable mitigation strategies for those vulnerabilities. Each strategy must have a unique 'id'.
    7.  For each vulnerability you identify, you MUST associate it with one or more mitigation strategies by populating its 'mitigation_ids' field with the corresponding 'id' from the 'mitigationStrategies' list. Every vulnerability should have at least one mitigation linked.
    8.  A list of 2-3 relevant threat actor types who would exploit these weaknesses.
    
    Format your entire response as a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, markdown, or explanations outside of the JSON object itself.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse as SecurityBriefing;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate security briefing. The model may have returned an invalid response or the API key may be invalid.");
  }
};