import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, EXTRACT_PROMPT } from "@/lib/ai";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages = [] } = body;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    );
  }

  // Convert messages to Anthropic format (no system role in messages array)
  const claudeMessages = messages
    .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
    .map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

  try {
    // Step 1: Stream from Claude
    const streamResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16384,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error("Anthropic API error:", streamResponse.status, errorText);
      return NextResponse.json(
        { error: `API error: ${streamResponse.status}` },
        { status: 502 }
      );
    }

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = streamResponse.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);

                // Claude streaming events
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  const text = parsed.delta.text;
                  fullResponse += text;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                  );
                }
              } catch {
                // Skip unparseable
              }
            }
          }

          // Process any remaining buffer
          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                const text = parsed.delta.text;
                fullResponse += text;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                );
              }
            } catch {
              // Skip
            }
          }

          // Step 2: Extract structured data
          // First, try to parse the direct JSON block from Claude's response
          let directJsonParsed = false;
          const jsonStartMarker = "|||COURSE_JSON|||";
          const jsonEndMarker = "|||END_COURSE_JSON|||";
          const jsonStartIdx = fullResponse.indexOf(jsonStartMarker);
          const jsonEndIdx = fullResponse.indexOf(jsonEndMarker);

          if (jsonStartIdx !== -1 && jsonEndIdx !== -1 && jsonEndIdx > jsonStartIdx) {
            const jsonStr = fullResponse.slice(jsonStartIdx + jsonStartMarker.length, jsonEndIdx).trim();
            try {
              const courseData = JSON.parse(jsonStr);
              // Build structured data from the direct JSON, merging with default fields
              const structured: Record<string, unknown> = {
                quickReplies: [],
                creators: [],
                coursePlan: courseData.coursePlan || null,
                courseDays: courseData.courseDays || [],
                onboardingComplete: courseData.onboardingComplete ?? (courseData.courseDays?.length > 0),
              };
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ structured })}\n\n`
                )
              );
              directJsonParsed = true;

              // Strip the JSON block from the displayed content by sending a replace event
              const cleanContent = fullResponse.slice(0, jsonStartIdx).trimEnd();
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ replaceContent: cleanContent })}\n\n`
                )
              );
            } catch (parseErr) {
              console.error("Direct course JSON parse failed:", parseErr, "Raw:", jsonStr?.slice(0, 200));
            }
          }

          // Fallback: Extract structured data using OpenAI (cheap/fast for parsing)
          // Only if direct JSON was not found/parsed
          if (!directJsonParsed && openaiKey) {
            try {
              // Truncate very long responses to avoid token limits
              const truncatedResponse = fullResponse.length > 24000 
                ? fullResponse.slice(0, 24000) + "\n\n[TRUNCATED - extract from what's shown above]"
                : fullResponse;
              
              const extractResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "user", content: EXTRACT_PROMPT + truncatedResponse },
                  ],
                  temperature: 0,
                  max_tokens: 16000,
                  response_format: { type: "json_object" },
                }),
              });

              if (extractResponse.ok) {
                const extractData = await extractResponse.json();
                const extractContent = extractData.choices?.[0]?.message?.content || "{}";
                try {
                  const structured = JSON.parse(extractContent);
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ structured })}\n\n`
                    )
                  );
                } catch (parseErr) {
                  console.error("Structured data parse failed:", parseErr, "Raw:", extractContent?.slice(0, 200));
                }
              } else {
                const errText = await extractResponse.text();
                console.error("OpenAI extraction failed:", extractResponse.status, errText.slice(0, 500));
              }
            } catch (extractErr) {
              console.error("Extraction call error:", extractErr);
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
