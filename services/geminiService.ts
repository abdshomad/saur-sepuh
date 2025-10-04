import { GoogleGenAI, Type } from "@google/genai";
import { GameEvent, Resource } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const eventSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "Judul yang singkat dan menarik untuk event tersebut."
        },
        description: {
            type: Type.STRING,
            description: "Satu atau dua kalimat deskripsi tentang peristiwa yang terjadi pada pemain."
        },
        choices: {
            type: Type.ARRAY,
            description: "Tepat dua pilihan yang bisa dibuat oleh pemain.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: {
                        type: Type.STRING,
                        description: "Teks untuk tombol pilihan, mendeskripsikan tindakan."
                    },
                    consequences: {
                        type: Type.ARRAY,
                        description: "Hasil dari pilihan ini. Bisa positif atau negatif.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                resource: {
                                    type: Type.STRING,
                                    enum: Object.values(Resource),
                                    description: "Sumber daya yang terpengaruh."
                                },
                                amount: {
                                    type: Type.INTEGER,
                                    description: "Jumlah sumber daya yang didapat (positif) atau hilang (negatif)."
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const generateGameEvent = async (): Promise<GameEvent | null> => {
    if (!API_KEY) return null;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Buat sebuah peristiwa acak untuk game RTS kerajaan Jawa abad pertengahan yang terinspirasi dari saga Saur Sepuh. Pemain adalah seorang Prabu (Raja). Peristiwa ini harus berupa skenario sederhana dengan dua pilihan, masing-masing dengan konsekuensi sumber daya yang jelas (keuntungan atau kerugian).",
            config: {
                responseMimeType: "application/json",
                responseSchema: eventSchema,
            },
        });
        
        const jsonText = result.text.trim();
        const eventData = JSON.parse(jsonText);

        // Basic validation
        if (eventData.title && eventData.description && Array.isArray(eventData.choices) && eventData.choices.length === 2) {
            return eventData as GameEvent;
        }
        return null;

    } catch (error) {
        console.error("Error generating game event with Gemini:", error);
        return null;
    }
};
