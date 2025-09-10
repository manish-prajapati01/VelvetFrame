import { GoogleGenAI, Modality, Part } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image-preview';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMimeType = (base64: string): string => {
    const signature = base64.substring(0, 20); // First few bytes are enough to identify
    if (signature.includes('iVBORw0KGgo')) return 'image/png';
    if (signature.includes('/9j/')) return 'image/jpeg';
    if (signature.includes('UklGR')) return 'image/webp';
    return 'image/png'; // Default
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const transformImage = async (
    primaryImageBase64: string
): Promise<string | null> => {
    const primaryImagePart: Part = {
        inlineData: {
            data: primaryImageBase64,
            mimeType: getMimeType(primaryImageBase64),
        },
    };

    const promptText = `You are an expert cinematographer and colorist. Your task is to transform the provided image into a high-quality, movie-level cinematic shot. Focus on applying dramatic, professional lighting, a sophisticated cinematic color grade, and enhancing the overall mood and atmosphere to make it look like a still from a blockbuster film. Crucially, you must preserve the identity, features, and pose of any person in the photo, and maintain the core structure of any location. The transformation should be purely stylistic.`;

    const parts: Part[] = [primaryImagePart, { text: promptText }];

    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            const result = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            for (const part of result.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
            return null;
        } catch (error: any) {
            lastError = error;
            const status = error?.status || error?.error?.status;
            if (status === 429 || status === 'RESOURCE_EXHAUSTED') {
                // Parse RetryInfo if available: details: [{ '@type': '...RetryInfo', retryDelay: '56s' }]
                let retryMs = 60000; // default to 60s
                const details = error?.error?.details || error?.details;
                if (Array.isArray(details)) {
                    for (const d of details) {
                        if (d?.['@type']?.toString().includes('RetryInfo') && typeof d?.retryDelay === 'string') {
                            const match = d.retryDelay.match(/(\d+)s/);
                            if (match) {
                                retryMs = parseInt(match[1], 10) * 1000;
                            }
                        }
                    }
                }
                if (attempt === 0) {
                    await sleep(retryMs);
                    continue; // retry once
                }
            }
            throw error;
        }
    }
    throw lastError ?? new Error('Unknown error while transforming image');
};