import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 200,
    temperature: 1,
  },
});

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should ne structured like this : 'Whats a hobby you have recently started?||If you could have dinner with an historical figure, who would it be?||Whats a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text;
    if (!aiMessage) {
      return Response.json(
        {
          success: false,
          message: "facing error while fetching the ai generated message",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message generated by ai successfully",
        aiMessage: aiMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error getting the AI generated message", error);
    return Response.json(
      {
        success: false,
        message: "facing error while fetching the ai generated message",
      },
      { status: 500 }
    );
  }
}