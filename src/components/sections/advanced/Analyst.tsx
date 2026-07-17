"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Brain, User, RefreshCw, AlertCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Who wins the 2030 World Cup and why?",
  "Compare Messi and Mbappé's World Cup legacies",
  "What's the latest from the 2026 knockout stage?",
  "Which team is the dark horse for 2030?",
  "How does Brazil's 1970 squad compare to modern teams?",
  "Predict Argentina vs Brazil in a hypothetical final",
];

export function Analyst() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the Predictor Analyst. Ask me about World Cup history, team tactics, match predictions, or player comparisons. I have the full 1930-2026 dataset in context and can pull live news from the web.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMsg },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyst-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "(no response)" },
      ]);
    } catch (e: any) {
      setError(e?.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi, I'm the Predictor Analyst. Ask me about World Cup history, team tactics, match predictions, or player comparisons.",
      },
    ]);
    setError(null);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="analyst-chat">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Football Analyst · Live
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Ask the <span className="text-blue-gradient">Analyst</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            A conversational football analyst with full World Cup context (1930–2026) and live web access. Ask anything about tactics, history, player comparisons, or upcoming tournaments.
          </p>
        </motion.div>

        <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Brain className="w-5 h-5 text-[#00E1FF]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#22c55e] rounded-full border border-[#0B0B0B]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Predictor Analyst</div>
                <div className="text-[10px] text-[#22c55e]">● online</div>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-[#9a9a9a] hover:text-white p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)]"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#D4AF37] to-[#0066FF]"
                      : "bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Brain className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-[#9a9a9a]" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "assistant"
                      ? "glass-blue text-white"
                      : "bg-[#D4AF37] text-[#0B0B0B] font-medium"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#0066FF] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="glass-blue rounded-2xl px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-[#00E1FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[#00E1FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[#00E1FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-2xl px-4 py-2.5 text-sm text-[#f97316]">
                  {error}. Please try again.
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts (only show when conversation is short) */}
          {messages.length <= 2 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => send(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full glass text-[#9a9a9a] hover:text-[#D4AF37] hover:border-[rgba(212,175,55,0.3)] transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask the Analyst about World Cup football…"
                disabled={loading}
                className="flex-1 bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-[#9a9a9a] focus:outline-none focus:border-[rgba(212,175,55,0.5)] disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
