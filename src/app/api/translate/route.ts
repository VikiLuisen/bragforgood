import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, targetLang } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!targetLang || !(targetLang in SUPPORTED_LANGUAGES)) {
      return NextResponse.json({ error: "Invalid target language" }, { status: 400 });
    }

    const langName = SUPPORTED_LANGUAGES[targetLang as LanguageCode];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Translation not available" }, { status: 503 });
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: `You are a translator. Translate the given text to ${langName}. Return ONLY the translated text, nothing else. Preserve the original tone and meaning. If the text is already in ${langName}, return it as-is.`,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    });

    const translated =
      response.content[0].type === "text" ? response.content[0].text : text;

    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
