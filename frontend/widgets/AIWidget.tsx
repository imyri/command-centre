"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api/client";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function AIWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post<{ response: string }>("/ai/chat", { message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", text: res.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Error: Could not reach AI." }]);
    } finally {
      setLoading(false);
    }
  }

  // --- THE VOICE LOGIC ---
  function startListening() {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Optional: Auto-send after speaking? 
      // For now, we just type it for you so you can review.
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  return (
    <div className="flex h-[300px] flex-col rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          {/* Status Dot changes color when listening */}
          <div className={`h-2 w-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
          <div className="text-sm font-medium text-zinc-200">
            {isListening ? "Listening..." : "Gemini Assistant"}
          </div>
        </div>
        <div className="text-xs text-zinc-500">gemini-flash</div>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.length === 0 && (
          <div className="mt-8 text-center text-xs text-zinc-600">
            Try saying: "Create a task to check Bitcoin"
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600/20 text-blue-100"
                  : "bg-zinc-800/40 text-zinc-300"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg bg-zinc-800/40 px-3 py-2 text-xs text-zinc-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area with MIC BUTTON */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={startListening}
          className={`flex items-center justify-center rounded-lg px-2 transition-colors ${
            isListening ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
          title="Speak"
        >
          {/* Microphone Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path fillRule="evenodd" d="M3.5 10a.75.75 0 00-1.5 0v.667a6.577 6.577 0 005.25 6.434v2.149H5.5a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-1.75v-2.149a6.577 6.577 0 005.25-6.434V10a.75.75 0 00-1.5 0v.667a5.078 5.078 0 01-10 0V10z" clipRule="evenodd" />
          </svg>
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Speak now..." : "Type or speak..."}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-200 focus:border-blue-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}