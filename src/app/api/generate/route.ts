import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const VALID_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const SYSTEM_PROMPT = `You are a weekly timetable assistant for a productivity app called SYNTHFOCUS.

Your task is to parse the user's natural language input and convert it into a structured recurring weekly schedule.

STRICT RULES:
1. Return ONLY a valid JSON array - no markdown, no explanation, no code blocks.
2. Each item in the array must have this EXACT schema:
   {
     "id": "unique_string_id",
     "dayOfWeek": "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat",
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

IMPORTANT RULES FOR DAYS:
1. The user might provide a TARGET_DAY (the day they are currently viewing).
2. IF the user's input is specific to that day (e.g., "plan for today", "my schedule for this day"), assign ALL tasks to TARGET_DAY.
3. IF the user asks for a "Weekly Plan", "Whole Week", "Full Week", or mentions multiple days, YOU MUST generate tasks across MULTIPLE days (sun, mon, tue, wed, thu, fri, sat) regardless of TARGET_DAY.
4. Output the specific "dayOfWeek" for each task based on context.
5. If the user mentions specific days like "Monday meeting, Thursday gym", use those days.
6. This is a RECURRING timetable - do NOT use specific calendar dates.

Example 1 - Single Day Request:
User says: "morning class at 8, then dicoding until lunch, meeting at 2pm"
Target Day: mon
Output: All tasks have "dayOfWeek": "mon"

Example 2 - Weekly Plan Request:
User says: "plan my week: gym on Monday and Wednesday, classes Tuesday/Thursday, weekend rest"
Target Day: mon (ignored for weekly plan)
Output: Tasks distributed across mon, wed, tue, thu, sat, sun with appropriate dayOfWeek values.

IMPORTANT: Return ONLY the JSON array, nothing else.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, targetDay } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 });
    }

    if (!targetDay || !VALID_DAYS.includes(targetDay)) {
      return NextResponse.json(
        { error: "Valid target day is required (sun, mon, tue, wed, thu, fri, sat)" },
        { status: 400 }
      );
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
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 4096,
      },
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nTARGET_DAY: ${targetDay}\n\nUser input: "${prompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log("AI Response received:", text.substring(0, 500)); // Debug log

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

    console.log("Cleaned JSON:", jsonText.substring(0, 500)); // Debug log

    // Parse and validate JSON
    let scheduleItems;
    try {
      scheduleItems = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try rephrasing your input." },
        { status: 422 }
      );
    }

    // Validate array structure
    if (!Array.isArray(scheduleItems)) {
      return NextResponse.json({ error: "AI response was not an array. Please try again." }, { status: 422 });
    }

    // Validate and sanitize each item - trust AI's dayOfWeek, fallback to targetDay
    const validCategories = ["work", "college", "coding", "other"];
    const validatedItems = scheduleItems.map((item, index) => ({
      id: item.id || `task_${Date.now()}_${index}`,
      dayOfWeek: VALID_DAYS.includes(item.dayOfWeek) ? item.dayOfWeek : targetDay, // Trust AI first, fallback to targetDay
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
