// Gemini API Integration for Kisan Sathi
const API_KEY: string = (import.meta.env.VITE_GEMINI_API_KEY as string) || "";
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

class GeminiAPIService {
  private async makeRequest(
    prompt: string,
    language: string = "hi",
    context?: string
  ): Promise<string> {
    if (!API_KEY) {
      throw new Error(
        "❌ Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file"
      );
    }

    try {
      const systemInstruction = {
        role: "system",
        parts: [
          {
            text: `You are an expert agricultural AI assistant helping Indian farmers. Always respond in ${
              language === "hi"
                ? "Hindi"
                : language === "ta"
                ? "Tamil"
                : "English"
            } language.

Provide practical, actionable advice for farming issues. Focus on:
- Crop diseases and pest management
- Fertilizer and nutrition recommendations  
- Weather-based farming advice
- Best practices for Indian agriculture
- Local solutions using easily available resources

Keep responses concise but comprehensive. Use simple language that farmers can understand.

Do not use markdown or any other formatting.

${context ? `Context: ${context}` : ""}`,
          },
        ],
      };

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        system_instruction: systemInstruction,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  // Text queries
  async askQuestion(
    question: string,
    language: string = "hi",
    userLocation?: string
  ): Promise<string> {
    const context = userLocation ? `User location: ${userLocation}` : "";
    return this.makeRequest(question, language, context);
  }

  // Voice queries
  async processVoiceQuery(
    transcript: string,
    language: string = "hi",
    userLocation?: string
  ): Promise<string> {
    const context = userLocation
      ? `User location: ${userLocation}. This was spoken by voice.`
      : "This was spoken by voice.";
    return this.makeRequest(transcript, language, context);
  }

  // Image analysis (fixed: uses actual base64 image data, not placeholder)
  async analyzeImage(
    imageData: string,
    language: string = "hi",
    userLocation?: string
  ): Promise<string> {
    const context = userLocation
      ? `User location: ${userLocation}. Provide detailed farming advice based on what you see in the image.`
      : "Provide detailed farming advice based on what you see in the image.";

    const prompt =
      "Please analyze this crop image and provide farming advice.";

    // Send image data along with prompt
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageData } }, // base64 image
          ],
        },
      ],
      system_instruction: {
        role: "system",
        parts: [{ text: context }],
      },
    };

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data: GeminiResponse = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No response from AI (image)");
    }
  }

  // Weather-based farming advice
  async getWeatherAdvice(
    weatherCondition: string,
    temperature: number,
    humidity: number,
    language: string = "hi",
    userLocation?: string
  ): Promise<string> {
    const prompt = `Today's weather: ${weatherCondition}, Temperature: ${temperature}°C, Humidity: ${humidity}%. What farming activities should I do today? What should I avoid?`;
    const context = userLocation ? `User location: ${userLocation}` : "";
    return this.makeRequest(prompt, language, context);
  }

  // Crop disease identification
  async identifyPlantDisease(
    symptoms: string,
    cropName: string,
    language: string = "hi"
  ): Promise<string> {
    const prompt = `My ${cropName} crop shows these symptoms: ${symptoms}. What disease is this and how to treat it?`;
    return this.makeRequest(prompt, language);
  }

  // Fertilizer recommendations
  async getFertilizerAdvice(
    cropName: string,
    soilType: string,
    growthStage: string,
    language: string = "hi"
  ): Promise<string> {
    const prompt = `I'm growing ${cropName} in ${soilType} soil. The crop is in ${growthStage} stage. What fertilizers should I use and when?`;
    return this.makeRequest(prompt, language);
  }
}

export const geminiApi = new GeminiAPIService();
