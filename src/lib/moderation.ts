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
  category: string,
  type: string = "BRAG"
): Promise<ModerationResult> {
  const client = getClient();
  if (!client) {
    console.warn("Moderation: ANTHROPIC_API_KEY not set — rejecting content (fail-secure)");
    return { approved: false, reason: "Content moderation is temporarily unavailable. Please try again later." };
  }

  const isCTA = type === "CALL_TO_ACTION";

  const systemPrompt = isCTA
    ? `You are a content moderator for "bragforgood", a social platform where users organize group activities for good — cleanups, volunteering, food drives, community events, and similar positive group actions.

Analyze the submitted Call to Action and determine if it describes a LEGITIMATE group activity.

APPROVE if the post:
- Describes a group volunteer event, cleanup, food drive, community gathering, or similar positive group activity
- Takes place in a public setting (park, community center, beach, street, etc.)
- Is genuinely aimed at doing good for the community
- Uses an enthusiastic or rallying tone (that's encouraged here!)

REJECT if the post:
- Suggests a private 1-on-1 meeting at someone's home or private location
- Contains a home address or private residential address
- Sounds like a personal date or private meetup rather than a group activity
- Is spam, self-promotion, or advertising
- Contains hate speech, negativity, or offensive content
- Describes harmful, illegal, or dangerous activities
- Seems designed to lure people to an unsafe situation

Respond ONLY with valid JSON: {"approved": true} or {"approved": false, "reason": "brief friendly explanation of why this doesn't fit"}`
    : `You are a content moderator for "bragforgood", a social platform where users brag about their good deeds — acts of kindness, volunteering, helping others, environmental care, community service, mentoring, and similar positive actions. The tone is cheeky and fun, but the content must still be genuinely good.

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

Respond ONLY with valid JSON: {"approved": true} or {"approved": false, "reason": "brief friendly explanation of why this doesn't fit"}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: systemPrompt,
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
  } catch (err) {
    console.error("Moderation API error:", err);
    return { approved: false, reason: "Content moderation is temporarily unavailable. Please try again later." };
  }
}

export async function moderateComment(body: string): Promise<ModerationResult> {
  const client = getClient();
  if (!client) {
    console.warn("Moderation: ANTHROPIC_API_KEY not set — rejecting comment (fail-secure)");
    return { approved: false, reason: "Content moderation is temporarily unavailable. Please try again later." };
  }

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
  } catch (err) {
    console.error("Comment moderation API error:", err);
    return { approved: false, reason: "Content moderation is temporarily unavailable. Please try again later." };
  }
}
