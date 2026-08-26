import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Compass,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/polaris/core";
import { ResearchDetailModal } from "@/components/polaris/cards";
import { useApp } from "@/lib/store";
import type { ResearchItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/user/assistant")({
  head: () => ({
    meta: [
      { title: "POLARIS AI Science Assistant with Voice — POLARIS" },
      {
        name: "description",
        content:
          "Conversational AI assistant with voice recognition and audio playback for polar science exploration.",
      },
      { property: "og:title", content: "POLARIS AI Assistant" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantPage,
});

interface ChatMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  citations?: string[]; // IDs of research items
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  "How does Antarctic ice melt affect global sea levels?",
  "Tell me about India's Maitri and Bharati research stations.",
  "Why is Arctic sea ice loss connected to the Indian Monsoon?",
  "What is the IndARC underwater observatory in Svalbard?",
  "How do satellites like GRACE-FO measure polar ice sheets?",
];

/* Hatbot / Polar Mascot Component */
function PolarHatbot({ isListening, isSpeaking }: { isListening: boolean; isSpeaking: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 backdrop-blur-md glow-soft">
      {/* Mascot Graphic with Winter Ushanka Hat & Goggles */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-chart-2/20 border border-primary/40 shadow-inner">
        <svg viewBox="0 0 64 64" className="h-11 w-11">
          {/* Ushanka Polar Hat (Blue Fur) */}
          <path d="M 12 28 C 12 12, 52 12, 52 28 L 54 36 L 46 36 L 46 28 C 46 18, 18 18, 18 28 L 18 36 L 10 36 Z" fill="#0284c7" />
          <path d="M 16 22 Q 32 10 48 22" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Hat Ear Flaps */}
          <rect x="8" y="28" width="8" height="14" rx="4" fill="#0369a1" />
          <rect x="48" y="28" width="8" height="14" rx="4" fill="#0369a1" />
          {/* Robot Face Screen */}
          <rect x="18" y="26" width="28" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Polar Goggles */}
          <rect x="21" y="30" width="10" height="7" rx="3" fill="#06b6d4" opacity="0.9" />
          <rect x="33" y="30" width="10" height="7" rx="3" fill="#06b6d4" opacity="0.9" />
          <line x1="31" y1="33" x2="33" y2="33" stroke="#f8fafc" strokeWidth="1.5" />
          {/* Cute Smile / Voice Wave */}
          {isSpeaking ? (
            <path d="M 26 43 Q 32 47 38 43" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-pulse" />
          ) : (
            <circle cx="32" cy="43" r="2" fill="#38bdf8" />
          )}
          {/* Antenna */}
          <line x1="32" y1="12" x2="32" y2="4" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="32" cy="4" r="2.5" fill="#f59e0b" className={isListening ? "animate-ping" : ""} />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-bold text-foreground">POLARIS Hatbot AI</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 font-mono text-[9px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {isListening
            ? "🎙️ Listening to your voice query…"
            : isSpeaking
              ? "🔊 Speaking response aloud…"
              : "Ask questions by typing or speaking in your microphone."}
        </p>
      </div>
    </div>
  );
}

function AssistantPage() {
  const { allResearch } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      sender: "assistant",
      text: "Hello! I am **POLARIS Hatbot AI**, your voice-enabled research assistant for polar science. I can answer questions regarding Arctic and Antarctic climate systems, ice mass loss, ocean currents, satellite remote sensing, and the Indian Polar Program (NCPOR / MoES). What would you like to explore today?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<ResearchItem | null>(null);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        toast.success(`Heard: "${transcript}"`);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Microphone voice recognition error or permission denied.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not supported by your current browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Listening... Speak your polar science question!");
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#`_-]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const generateAnswer = (query: string): { text: string; citations: string[] } => {
    const q = query.toLowerCase();

    if (q.includes("sea level") || q.includes("ice melt") || q.includes("thwaites")) {
      return {
        text: `### Impact of Polar Ice Melt on Global Sea Level Rise\n\n1. **Massive Freshwater Reservoirs**: Antarctica holds ~26.5 million km³ of ice, equivalent to **~58 metres of potential global sea-level rise**. Greenland adds another ~7.4 metres.\n2. **Current Acceleration**: Global sea levels are currently rising at **~4.5 mm/year**, with melting land ice (glaciers and ice sheets) contributing over 55% of this rate, and ocean thermal expansion contributing ~40%.\n3. **Buttressing Ice Shelves**: Floating ice shelves don't directly raise sea level when they melt, but they act as dams restraining grounded tributary glaciers. When shelves like Larsen B or Thwaites weaken, upstream ice accelerates into the ocean.\n\n*Key takeaway*: The rate of Antarctic mass discharge has more than tripled since the 1990s, monitored by satellite radar and gravimetry.`,
        citations: ["res-001", "res-004"],
      };
    }

    if (q.includes("maitri") || q.includes("bharati") || q.includes("station") || q.includes("dakshin")) {
      return {
        text: `### India's Antarctic Research Stations\n\nIndia has a historic and continuous presence in Antarctica managed by **NCPOR (Goa)** under the Ministry of Earth Sciences:\n\n- **Dakshin Gangotri (1983)**: India's 1st base, built during the 3rd expedition. Now submerged under ice and maintained as a historic heritage monument and supply depot.\n- **Maitri (1989)**: Permanent year-round base located in the rocky ice-free **Schirmacher Oasis**. Conducts atmospheric physics, glaciology, geology, and human biology.\n- **Bharati (2012)**: India's 3rd state-of-the-art green station located in the **Larsemann Hills**. Features automated energy conservation, dedicated satellite data downlink relays for ISRO, and environmental laboratories.\n\nIndia is also preparing a replacement station for Maitri (Maitri-II) to incorporate next-generation automated environmental monitoring.`,
        citations: ["res-002", "res-008"],
      };
    }

    if (q.includes("monsoon") || q.includes("arctic") || q.includes("teleconnection")) {
      return {
        text: `### Arctic Warming and the Indian Summer Monsoon Connection\n\nRecent scientific studies by Indian and international researchers show a direct **climatic teleconnection** between Arctic sea-ice decline and weather extremes over the Indian subcontinent:\n\n1. **Arctic Amplification**: The Barents-Kara Sea region is warming ~3.8× faster than the global average due to ice-albedo feedbacks.\n2. **Jet Stream Modulation**: Loss of sea ice reduces the pole-to-equator temperature gradient, causing the Northern Hemisphere Polar Jet Stream to become wavier and meander more.\n3. **Atmospheric Rossby Waves**: These meandering jet waves propagate southward, triggering blocking highs over Eurasia and altering moisture transport during the Indian Summer Monsoon (ISM), leading to extended dry spells punctuated by localized extreme rainfall bursts.`,
        citations: ["res-003", "res-005"],
      };
    }

    if (q.includes("indarc") || q.includes("svalbard") || q.includes("himadri")) {
      return {
        text: `### India's Arctic Research & IndARC Observatory\n\n- **Himadri Station (2008)**: India's permanent Arctic research base located at the International Arctic Research base in Ny-Ålesund, Spitsbergen (Svalbard), Norway.\n- **IndARC (2014)**: India's first multi-sensor underwater moored observatory deployed at Kongsfjorden (79°N), midway between Norway and the North Pole at a depth of 192 metres.\n- **Significance**: IndARC continuously records salinity, temperature, ocean velocity, and chlorophyll data across all seasons, even through pitch-black polar winters when surface research vessels cannot enter the frozen fjord.`,
        citations: ["res-005"],
      };
    }

    if (q.includes("grace") || q.includes("satellite") || q.includes("remote sensing")) {
      return {
        text: `### Satellite Remote Sensing of Polar Ice\n\nScientists monitor polar ice using three complementary spaceborne techniques:\n\n1. **Satellite Gravimetry (GRACE / GRACE-FO)**: Twin satellites measure micro-variations in Earth's gravitational pull, effectively 'weighing' the ice sheets every 30 days.\n2. **Laser Altimetry (ICESat-2)**: Fires 10,000 laser pulses per second to measure surface ice elevation changes with centimetre-scale precision.\n3. **Synthetic Aperture Radar (SAR / NISAR / CryoSat-2)**: Penetrates cloud cover and polar winter darkness to map glacier flow speeds, ice shelf crevassing, and grounding line positions.`,
        citations: ["res-004", "res-007"],
      };
    }

    return {
      text: `Polar science integrates glaciology, oceanography, atmospheric chemistry, and satellite telemetry. In both the Arctic and Antarctic, feedback loops such as ice-albedo reduction, Southern Ocean upwelling, and sub-ice shelf thermal erosion drive changes with global ramifications for sea level rise, monsoonal circulations, and carbon sequestration.\n\n*Would you like to explore a specific research paper or delve into expedition findings?*`,
      citations: ["res-001", "res-003"],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const response = generateAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: response.text,
        citations: response.citations,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleClear = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: "m-0",
        sender: "assistant",
        text: "Conversation cleared. How can I assist with your polar science exploration?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Portal · AI Assistant & Hatbot"
        title="POLARIS AI Science Assistant"
        description="Ask scientific questions by typing or using your microphone. Listen to audio playback and discover verified research citations."
      >
        <button
          onClick={handleClear}
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw size={14} /> Clear Chat
        </button>
      </PageHeader>

      {/* Polar Mascot Hatbot Banner */}
      <PolarHatbot isListening={isListening} isSpeaking={!!speakingId} />

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
          <Sparkles size={13} className="text-primary" /> Suggested:
        </span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:glow-primary"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="glass rounded-3xl p-4 md:p-6 glow-soft flex flex-col h-[560px] border border-border/80">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const isThisSpeaking = speakingId === msg.id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3 max-w-[88%]", isUser ? "ml-auto flex-row-reverse" : "")}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs",
                    isUser
                      ? "bg-secondary text-foreground border border-border"
                      : "bg-primary text-primary-foreground glow-primary",
                  )}
                >
                  {isUser ? <User size={15} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary/70 border border-border text-foreground rounded-tl-sm shadow-sm",
                  )}
                >
                  <div className="space-y-2 whitespace-pre-line prose prose-invert prose-sm max-w-none">
                    {msg.text.split("\n").map((line, i) => {
                      if (line.startsWith("### ")) {
                        return (
                          <h4 key={i} className="font-display font-bold text-primary mt-2 mb-1">
                            {line.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("- **")) {
                        const parts = line.split("**");
                        return (
                          <p key={i} className="text-xs pl-2 border-l-2 border-primary/40 my-1">
                            <strong className="text-foreground">{parts[1]}</strong>
                            {parts.slice(2).join("")}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className={cn(line.startsWith("*") ? "text-xs italic text-muted-foreground" : "")}>
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Cited Research Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                        <FileText size={12} /> Cited Knowledge Repository Papers:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((citeId) => {
                          const item = allResearch.find((r) => r.id === citeId);
                          if (!item) return null;
                          return (
                            <button
                              key={citeId}
                              onClick={() => setActiveModalItem(item)}
                              className="group flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-left text-xs text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                              <span className="font-medium line-clamp-1 max-w-[200px] text-[11px]">
                                {item.title}
                              </span>
                              <span className="font-mono text-[9px] opacity-75">({item.year})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Voice Output Player Bar */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-mono font-semibold transition-all",
                          isThisSpeaking
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : "bg-background/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {isThisSpeaking ? <Pause size={12} /> : <Volume2 size={12} />}
                        {isThisSpeaking ? "Pause Audio" : "Listen Audio"}
                      </button>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {isUser && (
                    <div className="mt-1 text-[10px] text-right opacity-60 font-mono">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[80%]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary/70 border border-border px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Consulting polar science literature & telemetry…</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar with Microphone Voice button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background/80 p-2 backdrop-blur-md"
        >
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                : "border border-border bg-secondary/80 text-muted-foreground hover:text-primary hover:border-primary/40",
            )}
            title={isListening ? "Stop listening" : "Click to speak with microphone"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening... Speak now..."
                : "Ask about sea ice, Maitri/Bharati, ice cores, or polar climate..."
            }
            className="flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 glow-primary"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Detail Modal if clicked on citations */}
      {activeModalItem && (
        <ResearchDetailModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </div>
  );
}
