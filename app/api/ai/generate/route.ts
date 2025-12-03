import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();
    
    // 1. Determine Key Source (User vs System)
    const userKey = req.headers.get("x-user-gemini-key");
    const apiKey = userKey || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key configured" }, { status: 500 });
    }

    // 2. Initialize Model (Modular)
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    // 3. Handle Chat vs Single Prompt
    // We use chat.sendMessage even for single tasks if we need 'history' (context)
    if (history && history.length > 0) {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);
      return NextResponse.json({ text: result.response.text() });
    } else {
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text() });
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
