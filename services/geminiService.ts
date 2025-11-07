
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, ScriptResult } from "../types";

const getPrompt = (gameTitle: string, language: string): string => {
    if (language.toLowerCase() === 'russian') {
        return `
Вы — экспертный игровой обозреватель и сценарист. Ваша задача — провести исследование по игре "${gameTitle}" и написать критический, но справедливый сценарий обзора на русском языке.

Сценарий должен включать следующие разделы:
1.  **Введение:** Кратко представьте игру, ее жанр и разработчика.
2.  **Основной геймплей:** Опишите основные механики и чем занимается игрок.
3.  **Вдохновение и сравнения:** На какие другие игры она похожа? Откуда черпает вдохновение?
4.  **Плюсы:** Перечислите как минимум 3 положительных аспекта игры. Будьте конкретны.
5.  **Минусы:** Перечислите как минимум 3 отрицательных аспекта или области для улучшения. Будьте конкретны и конструктивны.
6.  **Вердикт:** Итоговое заключение о том, кому понравится эта игра.
7.  **Информация о релизе:** Упомяните официальную дату выхода.

Поддерживайте профессиональный, но увлекательный тон, подходящий для обзора на YouTube или в подкасте. Используйте соответствующий игровой жаргон, где это уместно, чтобы звучать аутентично. Ваш обзор не должен быть чрезмерно хвалебным; он должен быть сбалансированным и критическим.
`;
    }

    // Default to English
    return `
You are an expert game reviewer and scriptwriter. Your task is to conduct research on the game "${gameTitle}" and write a critical but fair review script in English.

The script must include the following sections:
1.  **Introduction:** Briefly introduce the game, its genre, and the developer.
2.  **Core Gameplay:** Describe the main mechanics and what the player does.
3.  **Inspirations & Comparisons:** What other games is it similar to? Where does it draw inspiration from?
4.  **Pros:** List at least 3 positive aspects of the game. Be specific.
5.  **Cons:** List at least 3 negative aspects or areas for improvement. Be specific and constructive.
6.  **Verdict:** A concluding summary of who would enjoy this game.
7.  **Release Information:** Mention the official release date.

Maintain a professional yet engaging tone suitable for a YouTube or podcast review. Use relevant gaming jargon where appropriate to sound authentic. Your review should not be overly praiseful; it must be balanced and critical.
`;
}

export const generateGameReviewScript = async (gameTitle: string, language: string): Promise<ScriptResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(gameTitle, language);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const script = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        
        return { script, sources };
    } catch (error) {
        console.error("Error generating script:", error);
        throw new Error("Failed to generate script from Gemini API.");
    }
};
