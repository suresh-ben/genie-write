import { GoogleGenerativeAI } from "@google/generative-ai";
import { fal } from "@fal-ai/client";

const GeminiApiKey = process.env.GEMINI_API_KEY;

fal.config({
    proxyUrl: "api/fal/proxy",
});
  
async function generateArticle(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(GeminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(
            `Write a well-structured, 1000-word article on the following topic: '${prompt}'`
        );

        return result.response.text();
    } catch (error) {
        console.error("Error generating article:", error);
        throw new Error("Failed to generate article");
    }
}

async function generateImage(prompt) {
    try {
        const result = await fal.subscribe("fal-ai/fast-sdxl", {
            input: {
                prompt: `Generate an image for blog article on topic: '${prompt}'`,
                image_size: "landscape_16_9",
            },
            pollInterval: 5000,
            logs: true,
            onQueueUpdate(update) {
                console.log("queue update", update);
            },
        });

        console.log(result, "error??")
        
        const imageUrl = result?.data?.images[0].url;
        return imageUrl;
    } catch (error) {
        console.error("Error generating image:", error);
    }
}

export const POST = async (request) => {
    try {
        const { prompt } = await request.json();

        // Run both article and image generation in parallel
        const [article, imageUrl] = await Promise.all([
            generateArticle(prompt),
            generateImage(prompt),
        ]);

        console.log(imageUrl, "img url");

        return new Response(
            JSON.stringify({ article, imageUrl }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in POST request:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
