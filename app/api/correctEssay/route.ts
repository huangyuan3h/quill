import { getGoogleGeminiClient } from "@/utils/googleGemini";
import { GenerateContentResponse } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, language, essayImages } = await request.json();

    const prompt = `
    Act as a ${language} writing teacher. Your task is to correct and improve my essay by addressing spelling errors,
    suggesting advanced expressions, assigning a score, and providing a summary. Please output your feedback in JSON format as shown below:
  
    {
      "corrections": [
        {"original": "<original text>", "corrected": "<corrected text>"}
      ],
      "advanced_suggestions": [
        {"text": "<improved expression>", "explanation": "<reason for suggestion>"}
      ],
      "score": "<integer score out of 100>",
      "summary": "<teacher-like feedback on strengths and weaknesses of the essay, with specific suggestions for improvement in Chinese>"
    }
  
    The summary should be provided in Chinese, focusing on the strengths and weaknesses of the essay rather than summarizing the content. Provide constructive feedback and suggestions as a teacher would.
    Respond only in JSON format without additional explanations.
  `;

    const model = getGoogleGeminiClient();

    if (!model) {
      throw new Error("Google Gemini client not found");
    }

    const content =
      essayImages && essayImages.length > 0
        ? await model.generateContent([prompt, ...essayImages])
        : await model.generateContent([prompt, message]);

    const result: GenerateContentResponse = await content.response;

    if (!result.candidates) {
      throw new Error("candidates not exist, generate error");
    }

    const firstResult = result.candidates[0];

    const actualResult = firstResult.content.parts[0].text;

    const resultJSON = JSON.parse(actualResult ?? "");

    return NextResponse.json(resultJSON);
  } catch (error) {
    console.error("Error processing essay correction:", error);
    return NextResponse.json(
      { error: "Error processing your essay." },
      { status: 500 }
    );
  }
}
