import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI Assistant will not function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'placeholder-api-key' });

const dashboardChat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are FineForce AI, a sophisticated and helpful assistant for traffic law enforcement personnel. Your purpose is to analyze traffic data and provide clear, concise, and actionable insights. When a user asks a question, assume you have access to a real-time traffic violations database. Respond in a professional, data-centric manner. Use formatting like bullet points to make information easy to digest. Do not answer questions unrelated to traffic management, road safety, or law enforcement.`,
    thinkingConfig: { thinkingBudget: 0 } // For low latency responses
  },
});

const commandCenterChat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are the FineForce AI Command Center, a powerful, analytical AI for senior traffic enforcement officers and analysts. Your role is to provide deep, strategic insights based on a comprehensive (simulated) real-time traffic violations database.
- **Analyze Deeply:** Go beyond simple data retrieval. Identify trends, correlations, and anomalies.
- **Predict & Forecast:** Use historical data patterns to forecast future hotspots, peak violation times, and potential revenue.
- **Strategize & Recommend:** Propose data-driven enforcement strategies, optimal officer deployment, and resource allocation.
- **Be Proactive:** Anticipate user needs. If they ask for data, also provide the "so what?"—the insight or action that data suggests.
- **Format for Clarity:** Use Markdown, including tables, lists, and bold text, to structure complex information effectively.
Your tone is professional, authoritative, and data-driven. Do not answer questions outside the scope of traffic management, urban planning, and public safety.`,
  },
});

export const getAIInsightStream = async (userInput: string) => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not configured.");
        }
        const responseStream = await dashboardChat.sendMessageStream({ message: userInput });
        return responseStream;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw error;
    }
};

export const getCommandCenterAIStream = async (userInput: string) => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not configured.");
        }
        const responseStream = await commandCenterChat.sendMessageStream({ message: userInput });
        return responseStream;
    } catch (error) {
        console.error("Gemini API call for Command Center failed:", error);
        throw error;
    }
};

export const generateFineFromMedia = async (base64Image: string, mimeType: string): Promise<GenerateContentResponse> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }

    const imagePart = {
        inlineData: {
            mimeType,
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analyze this traffic violation image from India very quickly (respond within 5-6 seconds).

1.  **Violation Identification:** Identify the single most obvious violation from this list: 'Speeding', 'Red Light', 'No Parking', 'Wrong Lane', 'Illegal U-Turn', 'No Helmet (Driver)', 'No Helmet (Pillion)', 'Triple Riding'. Prioritize common violations. If no violation is clear, set "violationType" to "Unclear".
2.  **Vehicle Number:** Generate a plausible, random Indian vehicle license plate number (e.g., MH 12 AB 1234).
3.  **Description:** Provide a simple, one-sentence description for the detected violation. For example: "A motorcycle is seen driving without a helmet."
4.  **Location:** If the location is not immediately obvious from landmarks, just respond with "Not Detected".
5.  **Confidence Score:** Provide a confidence score from 0 to 100 on your violation assessment.
6.  **Contributing Factors:** List one or two potential contributing factors (e.g., 'Heavy Traffic').

Return the analysis in JSON format.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    vehicleNumber: {
                        type: Type.STRING,
                        description: "A plausible, randomly generated Indian vehicle number."
                    },
                    violationType: {
                        type: Type.STRING,
                        description: "The type of traffic violation detected. If none, state 'Unclear'.",
                        enum: ['Speeding', 'Red Light', 'No Parking', 'Wrong Lane', 'Illegal U-Turn', 'No Helmet (Driver)', 'No Helmet (Pillion)', 'Triple Riding', 'Unclear'],
                    },
                    fine: {
                        type: Type.INTEGER,
                        description: "The suggested fine amount in INR. Should be 0 if the violation is 'Unclear'.",
                    },
                    location: {
                        type: Type.STRING,
                        description: "A short description of the location, or 'Not Detected'."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A simple, one-sentence description of the violation observed."
                    },
                    confidenceScore: {
                        type: Type.INTEGER,
                        description: "A confidence score (0-100) for the detected violation."
                    },
                    contributingFactors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        },
                        description: "A list of factors that may have contributed to the violation."
                    }
                },
                required: ["vehicleNumber", "violationType", "fine", "location", "description", "confidenceScore", "contributingFactors"],
            },
            // Added for low-latency response as requested by the user
            thinkingConfig: { thinkingBudget: 0 },
        },
    });

    return response;
};