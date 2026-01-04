import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a schedule planner assistant for a productivity app called SYNTHFOCUS.

Your task is to parse the user's natural language input describing their daily plans and convert it into a structured schedule.

STRICT RULES:
1. Return ONLY a valid JSON array - no markdown, no explanation, no code blocks.
2. Each item in the array must have this EXACT schema:
   {
     "id": "unique_string_id",
     "time": "HH:MM" format (24-hour or with AM/PM),
     "activity": "description of the task",
     "category": "work" | "college" | "coding" | "other",
     "status": "pending"
   }
3. Infer reasonable times if not explicitly stated.
4. Categorize activities:
   - "work" = job tasks, meetings, professional work
   - "college" = classes, studying, assignments, exams
   - "coding" = programming, Dicoding modules, development projects
   - "other" = personal tasks, breaks, meals, exercise
5. Generate unique IDs using format: "task_" + timestamp + random suffix
6. Order tasks chronologically by time.

Example input: "morning class at 8, then work on dicoding until lunch, afternoon meeting at 2pm"
Example output:
[{"id":"task_1704261600_a","time":"08:00","activity":"Morning class","category":"college","status":"pending"},{"id":"task_1704272400_b","time":"10:00","activity":"Work on Dicoding modules","category":"coding","status":"pending"},{"id":"task_1704279600_c","time":"12:00","activity":"Lunch break","category":"other","status":"pending"},{"id":"task_1704286800_d","time":"14:00","activity":"Afternoon meeting","category":"work","status":"pending"}]

IMPORTANT: Return ONLY the JSON array, nothing else.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser input: "${prompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text().trim();

    // Clean up potential markdown code blocks
    let jsonText = text;
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    // Parse and validate JSON
    let scheduleItems;
    try {
      scheduleItems = JSON.parse(jsonText);
    } catch {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try rephrasing your input." },
        { status: 422 }
      );
    }

    // Validate array structure
    if (!Array.isArray(scheduleItems)) {
      return NextResponse.json({ error: "AI response was not an array. Please try again." }, { status: 422 });
    }

    // Validate and sanitize each item
    const validCategories = ["work", "college", "coding", "other"];
    const validatedItems = scheduleItems.map((item, index) => ({
      id: item.id || `task_${Date.now()}_${index}`,
      time: String(item.time || "00:00"),
      activity: String(item.activity || "Untitled task"),
      category: validCategories.includes(item.category) ? item.category : "other",
      status: "pending" as const,
    }));

    return NextResponse.json({ schedule: validatedItems });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Failed to generate schedule. Please try again." }, { status: 500 });
  }
}
