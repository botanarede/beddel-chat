"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/beddel/chat",
      body: {
        // agentId: "assistant",
        agentId: "assistant-bedrock",
      },
    }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input });
    setInput("");
  };

  // Helper to extract text content from UIMessage parts
  const getMessageContent = (message: UIMessage): string => {
    if (!message.parts) return "";
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => (part as { type: "text"; text: string }).text)
      .join("");
  };

  const emptyState = messages.length === 0;

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Beddel Studio</h1>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
          Powered by Beddel Protocol
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full max-w-3xl mx-auto px-4">
          {emptyState ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center animate-in fade-in zoom-in duration-500">
              <div className="bg-primary/5 p-6 rounded-full ring-1 ring-primary/10">
                <Bot className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
              <p className="max-w-[500px] text-muted-foreground text-sm leading-relaxed">
                I&apos;m an intelligent assistant powered by the Beddel Protocol. I have memory of our conversation and can answer your questions efficiently.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4" ref={scrollRef}>
              <div className="flex flex-col gap-6 py-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className={`h-8 w-8 border ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.role === "user" ? (
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 text-pink-500"><Bot className="h-4 w-4" /></AvatarFallback>
                      )}
                    </Avatar>

                    <div className={`flex flex-col gap-1 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border rounded-tl-sm text-card-foreground"
                        }`}>
                        {m.role === "user" ? (
                          getMessageContent(m)
                        ) : (
                          <ReactMarkdown
                            components={{
                              hr: () => <hr className="my-3 border-border/50" />,
                              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            }}
                          >
                            {getMessageContent(m)}
                          </ReactMarkdown>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground opacity-50 px-1">
                        {m.role === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 rounded-xl border bg-background px-2 py-2 shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all"
          >
            <Input
              className="flex-1 border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            Beddel Protocol
          </div>
        </div>
      </footer>
    </div>
  );
}
