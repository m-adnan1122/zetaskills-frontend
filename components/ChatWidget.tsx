"use client";

import Link from "next/link";
import { Bot, ChevronDown, MessageSquareText, Mic, MicOff, RotateCcw, Send, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatLink = { label: string; href: string };
type Message = { role: "user" | "assistant"; content: string; links?: ChatLink[]; mode?: "basic" | "ai" };
type SpeechResult = { isFinal: boolean; 0: { transcript: string } };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const welcome: Message = { role: "assistant", content: "Assalam o Alaikum! Main ZetaSkills ka assistant hoon. Courses, syllabus, enrollment ya contact ke baare mein pooch sakte hain.", links: [{ label: "Explore courses", href: "/courses" }] };
const suggestions = ["Kaun se courses hain?", "Enrollment kaise karein?", "Campus location kya hai?"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [supportsMic, setSupportsMic] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState("ur-PK");
  const recognition = useRef<Recognition | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const browser = window as SpeechWindow;
    setSupportsMic(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    setSupportsSpeech("speechSynthesis" in window);
    return () => { recognition.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);
  useEffect(() => { if (open) bottom.current?.scrollIntoView({ block: "nearest" }); }, [messages, busy, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  function close() {
    recognition.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setListening(false); setSpeaking(false); setOpen(false);
    launcherRef.current?.focus();
  }

  function toggleMic() {
    if (listening) { recognition.current?.stop(); return; }
    const browser = window as SpeechWindow;
    const Speech = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Speech) { setError("Voice input is not available in this browser. Please type your message."); return; }
    const instance = new Speech();
    recognition.current = instance;
    instance.lang = voiceLanguage; instance.continuous = false; instance.interimResults = false;
    instance.onresult = (event) => {
      const words: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) words.push(event.results[i][0].transcript);
      setInput((current) => [current.trim(), words.join(" ")].filter(Boolean).join(" ").slice(0, 2000));
    };
    instance.onerror = (event) => { setListening(false); if (event.error !== "aborted") setError(event.error === "not-allowed" ? "Microphone permission is blocked. Please allow it or type your message." : "Could not hear you. Please try again or type your message."); };
    instance.onend = () => { setListening(false); if (recognition.current === instance) recognition.current = null; };
    try { setError(""); instance.start(); setListening(true); } catch { setError("Microphone could not start. Please try again or type your message."); }
  }

  function readAloud(text: string) {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u0600-\u06ff]/.test(text) ? "ur-PK" : "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setError("Voice playback is not available. You can read the reply above."); };
    window.speechSynthesis.cancel(); setSpeaking(true); window.speechSynthesis.speak(utterance);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    if (content.length > 2000) { setError("Please keep your message under 2,000 characters."); return; }
    recognition.current?.abort(); setListening(false); setError(""); setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next); setBusy(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10).map(({ role, content }) => ({ role, content })) }), signal: AbortSignal.timeout(30000) });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("reply" in result) || typeof result.reply !== "string") throw new Error("Chat unavailable");
      const rawLinks = "links" in result && Array.isArray(result.links) ? result.links : [];
      const links: ChatLink[] = rawLinks.filter((link): link is ChatLink => Boolean(link && typeof link.label === "string" && typeof link.href === "string" && /^\/(courses(?:\/[a-z0-9-]+)?|enroll|contact)$/.test(link.href)));
      const mode = "mode" in result && result.mode === "ai" ? "ai" : "basic";
      setMessages((current) => [...current, { role: "assistant", content: result.reply as string, links, mode }]);
    } catch { setError("Message send nahi hua. Please dobara try karein ya WhatsApp par rabta karein."); setInput(content); }
    finally { setBusy(false); }
  }

  function reset() {
    recognition.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setListening(false); setSpeaking(false); setMessages([welcome]); setInput(""); setError("");
  }

  return <>
    <button ref={launcherRef} type="button" className="chat-launcher" aria-label={open ? "Close ZetaSkills assistant" : "Open ZetaSkills assistant"} aria-expanded={open} aria-controls="zetaskills-chat" onClick={() => open ? close() : setOpen(true)}>
      {open ? <ChevronDown size={22} /> : <MessageSquareText size={22} />}<span>Ask ZetaSkills</span>
    </button>
    {open && <section id="zetaskills-chat" className="chat-panel" role="dialog" aria-label="ZetaSkills assistant" onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
      <header className="chat-header"><div className="chat-header-icon"><Bot size={22} aria-hidden="true" /></div><div><strong>ZetaSkills Assistant</strong><span>Courses, enrollment &amp; more</span></div><button type="button" className="chat-header-button" title="Start a new conversation" aria-label="Start a new conversation" onClick={reset} disabled={busy}><RotateCcw size={18} /></button><button type="button" className="chat-header-button" aria-label="Close chat" onClick={close}><ChevronDown size={21} /></button></header>
      <div className="chat-body" role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((message, index) => <div className={`chat-message-row ${message.role}`} key={index}><div className="chat-message"><p>{message.content}</p>{message.mode === "basic" && <small className="chat-mode">Quick answer</small>}{message.links && message.links.length > 0 && <div className="chat-links">{message.links.map((link) => <Link key={link.href} href={link.href} onClick={close}>{link.label} <span aria-hidden="true">↗</span></Link>)}</div>}{message.role === "assistant" && supportsSpeech && <button type="button" className="chat-speak" onClick={() => readAloud(message.content)} aria-label={speaking ? "Stop voice playback" : "Listen to this reply"}>{speaking ? <VolumeX size={15} /> : <Volume2 size={15} />} {speaking ? "Stop" : "Listen"}</button>}</div></div>)}
        {messages.length === 1 && <div className="chat-suggestions">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => send(suggestion)} disabled={busy}>{suggestion}</button>)}</div>}
        {busy && <div className="chat-typing" role="status">Thinking<span aria-hidden="true">...</span></div>}<div ref={bottom} />
      </div>
      <div className="chat-footer"><p className="chat-privacy">Chat may use Google AI; voice may use browser services. Please don&apos;t share CNIC, passwords or payment details.</p>{error && <p className="chat-error" role="alert">{error}</p>}<form className="chat-compose" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); send(input); }}><label className="sr-only" htmlFor="chat-message">Your message</label><textarea ref={inputRef} id="chat-message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(input); } }} placeholder="Apna sawal likhein..." rows={1} maxLength={2000} /><button type="button" className={`chat-icon-button${listening ? " listening" : ""}`} aria-label={listening ? "Stop listening" : "Use microphone"} title={supportsMic ? "Use microphone" : "Voice input is not available in this browser"} onClick={toggleMic} disabled={!supportsMic || busy}>{listening ? <MicOff size={20} /> : <Mic size={20} />}</button><button type="submit" className="chat-send" aria-label="Send message" disabled={busy || !input.trim()}><Send size={19} /></button></form><div className="chat-voice-row"><label htmlFor="chat-language">Voice input</label><select id="chat-language" value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)} disabled={listening}><option value="ur-PK">Urdu</option><option value="en-US">English</option></select><span>{listening ? "Listening..." : supportsMic ? "Tap mic to speak" : "Type to chat"}</span></div></div>
    </section>}
  </>;
}
