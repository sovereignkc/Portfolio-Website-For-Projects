import { NextRequest, NextResponse } from "next/server";
import { getDashboardContent } from "../../../lib/content-store";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function groqApiKey() {
  return process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
}

export async function POST(request: NextRequest) {
  const apiKey = groqApiKey();
  if (!apiKey) {
    return NextResponse.json({ message: "Missing GROQ_API_KEY." }, { status: 500 });
  }

  const body = (await request.json()) as {
    model?: string;
    messages?: ChatMessage[];
  };

  const model = body.model ?? "groq/compound-mini";
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const { projects, contacts, deploySteps } = await getDashboardContent();
  const projectContext = projects
    .map(
      (project) =>
        `${project.name}: ${project.subtitle} — ${project.description}\n` +
        `GitHub: ${project.githubUrl ?? ""}\nYouTube: ${project.youtubeUrl ?? ""}\nDocs: ${project.docsUrl ?? ""}`
    )
    .join("\n\n");
  const contactContext = contacts.map((contact) => `${contact.label}: ${contact.href}`).join("\n");
  const deployContext = deploySteps.map((step) => `${step.title}: ${step.body}`).join("\n");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      messages: [
        {
          role: "system",
          content:
            "You are a polished portfolio assistant. Keep answers concise, concrete, and aligned with the portfolio UI. Respond in markdown when helpful. Use bullets, code fences, and links when useful.\n\nCurrent projects:\n" +
            projectContext +
            "\n\nContacts:\n" +
            contactContext +
            "\n\nDeploy steps:\n" +
            deployContext
        },
        ...messages
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { message: `Groq request failed: ${response.status} ${errorText}` },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const message = data.choices?.[0]?.message?.content?.trim() ?? "No response returned.";
  return NextResponse.json({ message });
}
