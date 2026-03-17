"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, Square } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============ Speech-to-Text Hook ============
interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  supported: boolean;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        setSupported(true);
        const recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    } catch {
      // Speech recognition not available
      setSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, supported };
}

// ============ Text-to-Speech Hook ============
interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  supported: boolean;
  autoSpeak: boolean;
  setAutoSpeak: (auto: boolean) => void;
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/^- /gm, "")
    .replace(/^\d+\. /gm, "")
    .replace(/`[^`]+`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/•/g, "")
    .trim();
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  useEffect(() => {
    try {
      setSupported("speechSynthesis" in window);
    } catch {
      setSupported(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.includes("Microsoft Zira") || v.name.includes("Karen")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, supported, autoSpeak, setAutoSpeak };
}

// ============ Mic Button Component ============
interface MicButtonProps {
  isListening: boolean;
  onToggle: () => void;
  supported: boolean;
  disabled?: boolean;
}

export function MicButton({ isListening, onToggle, supported, disabled }: MicButtonProps) {
  if (!supported) return null;

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`p-3 rounded-apple transition-all duration-200 ${
        isListening
          ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
          : "bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-700"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
      title={isListening ? "Stop listening" : "Speak to Otium"}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}

// ============ Speaker Button (per message) ============
interface SpeakButtonProps {
  text: string;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onStop: () => void;
}

export function SpeakButton({ text, isSpeaking, onSpeak, onStop }: SpeakButtonProps) {
  return (
    <button
      onClick={() => isSpeaking ? onStop() : onSpeak(text)}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-caption transition-all ${
        isSpeaking
          ? "bg-accent-100 text-accent-600"
          : "bg-surface-100 text-surface-400 hover:bg-surface-200 hover:text-surface-600"
      }`}
      title={isSpeaking ? "Stop speaking" : "Listen to response"}
    >
      {isSpeaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      <span>{isSpeaking ? "Stop" : "Listen"}</span>
    </button>
  );
}

// ============ Auto-speak toggle ============
interface AutoSpeakToggleProps {
  autoSpeak: boolean;
  onToggle: (value: boolean) => void;
  supported: boolean;
}

export function AutoSpeakToggle({ autoSpeak, onToggle, supported }: AutoSpeakToggleProps) {
  if (!supported) return null;

  return (
    <button
      onClick={() => onToggle(!autoSpeak)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
        autoSpeak
          ? "bg-accent-100 text-accent-600 border border-accent-200"
          : "bg-surface-100 text-surface-400 border border-surface-200 hover:text-surface-600"
      }`}
      title={autoSpeak ? "Auto-narrate ON" : "Auto-narrate OFF"}
    >
      {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      {autoSpeak ? "Voice On" : "Voice Off"}
    </button>
  );
}
