export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getInterestEmoji(interest: string): string {
  const lower = interest.toLowerCase();
  const emojiMap: Record<string, string> = {
    photography: "📸",
    cooking: "👨‍🍳",
    guitar: "🎸",
    music: "🎵",
    painting: "🎨",
    drawing: "✏️",
    art: "🎨",
    gardening: "🌱",
    hiking: "🥾",
    running: "🏃",
    yoga: "🧘",
    chess: "♟️",
    reading: "📚",
    writing: "✍️",
    coding: "💻",
    programming: "💻",
    gaming: "🎮",
    fishing: "🎣",
    woodworking: "🪵",
    knitting: "🧶",
    astronomy: "🔭",
    baking: "🧁",
    cycling: "🚴",
    skateboarding: "🛹",
    surfing: "🏄",
    swimming: "🏊",
    tennis: "🎾",
    basketball: "🏀",
    soccer: "⚽",
    football: "🏈",
    dance: "💃",
    film: "🎬",
    podcast: "🎙️",
    piano: "🎹",
    singing: "🎤",
    climbing: "🧗",
    camping: "⛺",
    pottery: "🏺",
    "3d": "🖨️",
    electronics: "🔧",
    drone: "🛸",
    travel: "✈️",
    language: "🗣️",
    meditation: "🧘",
    martial: "🥋",
    boxing: "🥊",
    golf: "⛳",
    archery: "🏹",
  };

  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌟";
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    youtube: "▶️",
    instagram: "📷",
    tiktok: "🎵",
    podcast: "🎙️",
    twitter: "🐦",
    twitch: "🎮",
    website: "🌐",
    other: "🔗",
  };
  return icons[platform] || "🔗";
}

export const SYSTEM_PROMPT = `You are Otium, the ultimate hobby companion. You're like that one brilliant friend who knows a ridiculous amount about every hobby and gets genuinely fired up helping people explore theirs.

Your job: Help people discover, start, and grow in any hobby or interest they're curious about.

How to be great at this:
- Be genuinely enthusiastic. If someone says "I want to try pottery," you should light up like they just said the most exciting thing ever.
- Share REAL knowledge. Don't give generic advice. Name specific creators, specific YouTube channels, specific tools, specific techniques. Use real URLs when recommending creators (youtube.com/@channelname, instagram.com/handle, etc).
- Ask smart follow-up questions. Understand their experience level, what specifically excites them, how much time they have, what their goals are. But do it naturally, not like a survey.
- When you have enough context about someone, build them a personalized weekly learning roadmap. Make it specific — not "learn the basics" but "Watch this specific video, then try this specific exercise, then check out this community."
- Be thorough. Long, rich answers are good. You're not trying to save tokens — you're trying to genuinely help someone fall in love with a hobby.
- Use markdown formatting — headers, bold, bullet points, numbered lists. Make your responses scannable and beautiful.
- Use emojis naturally but don't overdo it.

What makes you special: You don't just point people to resources. You understand the JOURNEY of getting into a hobby — the excitement, the frustration, the breakthroughs. You're a companion through that whole process.`;

export const EXTRACT_PROMPT = `Analyze this hobby companion AI response and extract any structured data. Return ONLY valid JSON.

Extract:
1. "quickReplies" - If the AI asks a question with clear options, create 2-5 clickable options. Each needs: id (short unique string), label (the option text), emoji (relevant emoji). ALWAYS try to generate helpful quick replies based on what the AI is asking or suggesting.
2. "creators" - If real creators/channels are mentioned, extract: name, platform (youtube/instagram/tiktok/podcast/website/twitter/twitch/other), url (real URL), description (one line about them).
3. "coursePlan" - If a structured weekly plan/roadmap/course is laid out, extract: title, description, totalWeeks.
4. "courseWeeks" - If weekly content exists, extract each week with: weekNumber, title, description, tasks (array with id/label/description/type where type is learn|practice|create|explore, completed always false), resources (array with title/url/type where type is video|article|course|tool|community, plus platform string), unlocked (true for first 2 weeks, false for rest).
5. "onboardingComplete" - true ONLY if a full course/roadmap was generated in this response.

Return format:
{
  "quickReplies": [],
  "creators": [],
  "coursePlan": null,
  "courseWeeks": [],
  "onboardingComplete": false
}

AI Response:
`;
