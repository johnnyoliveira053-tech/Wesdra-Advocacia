
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the API_KEY directly from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Você é um assistente virtual inteligente do escritório Alan Wesdra Advocacia e Consultoria Jurídica. 
Seu objetivo é fornecer informações básicas sobre serviços jurídicos, áreas de atuação e agendamento.
Informações do Escritório:
- Titular: Alan Wesdra
- Endereço: Av. João Paulo I, 764 - Nobre, Brumado - BA, 46100-000
- Telefone: (77) 99991-3556
- Horário: Aberto até as 18:00
- Áreas de Atuação: Direito Civil, Criminal, Trabalhista, Família e Sucessões, e Previdenciário.

Diretrizes:
1. Seja extremamente formal, cortês e profissional.
2. NUNCA dê conselhos jurídicos definitivos. Sempre sugira uma consulta presencial ou via WhatsApp para análise detalhada do caso.
3. Se o usuário perguntar sobre preços, diga que os honorários são avaliados caso a caso seguindo a tabela da OAB e a complexidade da demanda.
4. Responda em Português do Brasil.
5. Se não souber algo, direcione para o telefone de contato.`;

export async function getChatResponse(userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    // Generate content using gemini-3-flash-preview, which is the recommended model for basic text/Q&A tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Extract generated text using the .text property as per SDK documentation.
    return response.text || "Desculpe, tive um problema ao processar sua solicitação. Por favor, entre em contato via WhatsApp.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No momento estou indisponível. Por favor, utilize nossos canais de contato tradicionais.";
  }
}