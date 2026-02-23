import Anthropic from "@anthropic-ai/sdk";

interface ModerationResult {
  approved: boolean;
  reason?: string;
}

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

export async function moderateDeed(
  title: string,
  description: string,
  category: string
): Promise<ModerationResult> {
  const client = getClient();
  if (!client) return { approved: true };

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: `You are a content moderator for "bragforgood", a social platform where users brag about their good deeds — acts of kindness, volunteering, helping others, environmental care, community service, mentoring, and similar positive actions. The tone is cheeky and fun, but the content must still be genuinely good.

Analyze the submitted post and determine if it describes a GENUINE good deed or positive action.

APPROVE if the post:
- Describes helping someone, volunteering, environmental cleanup, mentoring, animal care, community service, or any act of kindness
- Is genuine and sincere (even if small or simple)
- Falls within the selected category
- Uses a playful or braggy tone (that's encouraged here!)

REJECT if the post:
- Is spam, self-promotion, or advertising
- Contains hate speech, negativity, complaints, or rants
- Is unrelated to doing good (random thoughts, opinions, memes, etc.)
- Describes harmful, illegal, or unethical actions
- Is clearly fake or trolling

Respond ONLY with valid JSON: {"approved": true} or {"approved": false, "reason": "brief friendly explanation of why this doesn't fit"}`,
      messages: [
        {
          role: "user",
          content: `Category: ${category}\nTitle: ${title}\nDescription: ${description}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    return {
      approved: parsed.approved === true,
      reason: parsed.reason,
    };
  } catch {
    // If moderation fails, approve to not block users
    return { approved: true };
  }
}

export async function moderateComment(body: string): Promise<ModerationResult> {
  const client = getClient();
  if (!client) return { approved: true };

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `You are a content moderator for "bragforgood", a fun social platform where people brag about good deeds. Comments should be positive, encouraging, hyping people up, or constructive.

APPROVE if the comment:
- Is encouraging, supportive, or congratulatory
- Hypes up the poster or celebrates their deed
- Asks genuine questions about the deed
- Shares related positive experiences
- Is neutral but respectful

REJECT if the comment:
- Contains hate speech, insults, or harassment
- Is spam or self-promotion
- Is negative, discouraging, or mean-spirited
- Contains offensive or inappropriate content

Respond ONLY with valid JSON: {"approved": true} or {"approved": false, "reason": "brief friendly explanation"}`,
      messages: [
        {
          role: "user",
          content: body,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    return {
      approved: parsed.approved === true,
      reason: parsed.reason,
    };
  } catch {
    return { approved: true };
  }
}
