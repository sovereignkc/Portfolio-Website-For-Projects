"use client";

import { useMemo, useState } from "react";
import { Icon } from "./icon";
import { MarkdownMessage } from "./markdown-message";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const modelOptions = [
  { id: "groq/compound", label: "groq/compound" },
  { id: "groq/compound-mini", label: "groq/compound-mini" }
];

export function AssistantPanel() {
  const [model, setModel] = useState(modelOptions[1].id);
  const [input, setInput] = useState("What is KEvlar's Recsys about?");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I can explain the portfolio, summarize projects, or help you edit the dashboard once you’re logged in."
    }
  ]);
  const [isSending, setIsSending] = useState(false);

  const previewPrompt = useMemo(
    () => `Model ${model} is connected to the Groq API.`,
    [model]
  );

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    const nextMessages = [...messages, { role: "user", content: trimmed } as Message];
    setMessages(nextMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: nextMessages
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { message?: string };
      setMessages([...nextMessages, { role: "assistant", content: data.message ?? "No response." }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I couldn’t reach Groq just now. Check your API key and try again."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="glass flex h-full min-h-[720px] flex-col border-l border-white/10">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80">
            <Icon name="settings" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white/90">AI Architectural Assistant</div>
            <div className="text-xs text-white/45">groq/compound · groq/compound-mini · edge runtime</div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-3">
        <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-white/40">
          Model
        </label>
        <div className="flex gap-2">
          {modelOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setModel(option.id)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                model === option.id
                  ? "border-violet-400/40 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/8"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-soft ${
                message.role === "user"
                  ? "border border-white/10 bg-white/95 text-zinc-900"
                  : "border border-white/10 bg-white/6 text-white/78"
              }`}
            >
              {message.role === "assistant" ? (
                <MarkdownMessage content={message.content} />
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/35">
          {previewPrompt}
        </div>
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Query the architecture..."
            rows={2}
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={isSending}
            className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/90 text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="send" />
          </button>
        </div>
        <div className="mt-2 text-xs text-white/30">context: locked · system prompt immutable</div>
      </div>
    </aside>
  );
}
