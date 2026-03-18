"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Plus, Trash2, ChevronRight, LogOut, Sparkles, Target, MessageCircle, Trophy, ArrowRight, Flame, Calendar, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Interest, ChatMessage, QuickReply, Creator, Course, CourseDay } from "@/types";
import { generateId, getInterestEmoji } from "@/lib/ai";
import { MobiusLogoMark } from "@/components/brand/MobiusLogo";
import QuickReplyButtons from "@/components/chat/QuickReplyButtons";
import { CreatorList } from "@/components/chat/CreatorCard";
import CourseView from "@/components/chat/CourseView";
import { useSpeechToText, useTextToSpeech, MicButton, SpeakButton, AutoSpeakToggle } from "@/components/chat/VoiceControls";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchInterests,
  createInterest,
  deleteInterest as dbDeleteInterest,
  saveMessage,
  saveCourse,
  addDaysToCourse,
  updateCourseCurrentDay,
  unlockDay,
  toggleTaskCompletion,
  getCourseId,
  getDayId,
  updateInterestOnboarding,
} from "@/lib/db";

function parseMarkdown(text: string): string {
  return text
    .replace(/### (.*)/g, '<h4 class="text-md font-semibold mt-4 mb-1.5 text-surface-800">$1</h4>')
    .replace(/## (.*)/g, '<h3 class="text-lg font-semibold mt-5 mb-2 text-surface-900">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-600 underline hover:text-accent-700">$1</a>')
    .replace(/^- (.*)/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^\d+\. (.*)/gm, '<li class="ml-4 mb-1">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function AppPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [activeInterestId, setActiveInterestId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "journey">("chat");
  const [journeyInput, setJourneyInput] = useState("");
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, signOut } = useAuth();
  const router = useRouter();

  // Voice controls
  const stt = useSpeechToText();
  const tts = useTextToSpeech();
  const lastSpokenMsgRef = useRef<string | null>(null);

  const activeInterest = interests.find((i) => i.id === activeInterestId) || null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load interests from database on mount
  useEffect(() => {
    if (!user) {
      setInitialLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const data = await fetchInterests(user?.id);
        setInterests(data);
      } catch (err) {
        console.error("Failed to load interests:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [activeInterest?.messages, scrollToBottom]);

  // Sync STT transcript to input
  useEffect(() => {
    if (stt.transcript) {
      setInputValue(stt.transcript);
    }
  }, [stt.transcript]);

  // Auto-send when STT stops and we have a transcript
  const sttJustStoppedRef = useRef(false);
  useEffect(() => {
    if (stt.isListening) {
      sttJustStoppedRef.current = true;
    } else if (sttJustStoppedRef.current && stt.transcript) {
      sttJustStoppedRef.current = false;
      sendMessage(stt.transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stt.isListening]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!tts.autoSpeak || !activeInterest?.messages.length) return;
    const lastMsg = activeInterest.messages[activeInterest.messages.length - 1];
    if (lastMsg.role === "assistant" && lastMsg.content && !isLoading && lastMsg.id !== lastSpokenMsgRef.current) {
      lastSpokenMsgRef.current = lastMsg.id;
      tts.speak(lastMsg.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeInterest?.messages, isLoading, tts.autoSpeak]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const sendMessage = async (content: string, switchToChat?: boolean) => {
    if (!content.trim() || isLoading) return;
    if (switchToChat) setActiveTab("chat");

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    let currentInterest: Interest;
    let isNewInterest = false;

    if (!activeInterest) {
      isNewInterest = true;
      const tempId = generateId();
      currentInterest = {
        id: tempId,
        name: content.trim(),
        emoji: getInterestEmoji(content),
        messages: [userMessage],
        progress: [],
        course: null,
        onboarding: { completed: false, answers: [] },
        createdAt: new Date(),
      };
      setInterests((prev) => [...prev, currentInterest]);
      setActiveInterestId(tempId);

      // Save to DB and get real ID (only if logged in)
      if (user) { try {
        const dbId = await createInterest(user?.id, currentInterest.name, currentInterest.emoji);
        currentInterest = { ...currentInterest, id: dbId };
        setInterests((prev) => prev.map((i) => (i.id === tempId ? { ...i, id: dbId } : i)));
        setActiveInterestId(dbId);
      } catch (err) {
        console.error("Failed to create interest:", err);
      }
    } else {
      currentInterest = {
        ...activeInterest,
        messages: [...activeInterest.messages, userMessage],
      };
      setInterests((prev) =>
        prev.map((i) => (i.id === currentInterest.id ? currentInterest : i))
      );
    }

    // Save user message to DB
    try {
      const dbMsgId = await saveMessage(currentInterest.id, userMessage);
      userMessage.id = dbMsgId;
    } catch (err) {
      console.error("Failed to save user message:", err);
    }

    setInputValue("");
    setJourneyInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentInterest.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          interest: currentInterest.name,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let structuredData: {
        quickReplies?: QuickReply[];
        creators?: Creator[];
        courseDays?: CourseDay[];
        onboardingComplete?: boolean;
        coursePlan?: { title: string; description: string; totalDays: number } | null;
      } = {};

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setInterests((prev) =>
        prev.map((i) =>
          i.id === currentInterest.id
            ? { ...i, messages: [...currentInterest.messages, assistantMessage] }
            : i
        )
      );

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.structured) {
                structuredData = parsed.structured;
              } else {
                const text = parsed.content || "";
                fullContent += text;
                setInterests((prev) =>
                  prev.map((i) =>
                    i.id === currentInterest.id
                      ? { ...i, messages: i.messages.map((m) => m.id === assistantMessage.id ? { ...m, content: fullContent } : m) }
                      : i
                  )
                );
              }
            } catch { /* skip */ }
          }
        }
      }

      // Apply structured data
      setInterests((prev) =>
        prev.map((i) => {
          if (i.id !== currentInterest.id) return i;
          const updatedMessages = i.messages.map((m) => {
            if (m.id !== assistantMessage.id) return m;
            return {
              ...m,
              quickReplies: structuredData.quickReplies || undefined,
              creators: structuredData.creators && structuredData.creators.length > 0 ? structuredData.creators : undefined,
              courseUpdate: structuredData.courseDays && structuredData.courseDays.length > 0 ? structuredData.courseDays : undefined,
            };
          });

          let updatedInterest = { ...i, messages: updatedMessages };

          if (structuredData.onboardingComplete && structuredData.coursePlan && !i.course) {
            const days = (structuredData.courseDays || []).map((w, idx) => ({
              ...w,
              unlocked: idx < 7,
              tasks: w.tasks.map((t) => ({ ...t, completed: false })),
            }));
            updatedInterest.course = {
              title: structuredData.coursePlan.title,
              description: structuredData.coursePlan.description,
              totalDays: structuredData.coursePlan.totalDays,
              currentDay: 1,
              days,
              generatedAt: new Date(),
            };
            updatedInterest.onboarding = { ...i.onboarding, completed: true };
          } else if (i.course && structuredData.courseDays && structuredData.courseDays.length > 0) {
            const existingDayNums = new Set(i.course.days.map((w) => w.dayNumber));
            const newDays = structuredData.courseDays
              .filter((w) => !existingDayNums.has(w.dayNumber))
              .map((w) => ({ ...w, unlocked: true, tasks: w.tasks.map((t) => ({ ...t, completed: false })) }));
            if (newDays.length > 0) {
              updatedInterest.course = { ...i.course, days: [...i.course.days, ...newDays] };
            }
          }
          return updatedInterest;
        })
      );

      // Persist assistant message + structured data to DB
      const finalAssistantMsg: ChatMessage = {
        ...assistantMessage,
        content: fullContent,
        quickReplies: structuredData.quickReplies || undefined,
        creators: structuredData.creators && structuredData.creators.length > 0 ? structuredData.creators : undefined,
        courseUpdate: structuredData.courseDays && structuredData.courseDays.length > 0 ? structuredData.courseDays : undefined,
      };

      try {
        const dbAsstId = await saveMessage(currentInterest.id, finalAssistantMsg);
        assistantMessage.id = dbAsstId;
        // Update local state with the DB id
        setInterests((prev) =>
          prev.map((i) =>
            i.id === currentInterest.id
              ? { ...i, messages: i.messages.map((m) => m.id === assistantMessage.id || m.content === fullContent && m.role === "assistant" ? { ...m, id: dbAsstId } : m) }
              : i
          )
        );
      } catch (err) {
        console.error("Failed to save assistant message:", err);
      }

      // Persist course if newly created
      if (structuredData.onboardingComplete && structuredData.coursePlan) {
        try {
          const days = (structuredData.courseDays || []).map((w, idx) => ({
            ...w,
            unlocked: idx < 7,
            tasks: w.tasks.map((t) => ({ ...t, completed: false })),
          }));
          await saveCourse(currentInterest.id, {
            title: structuredData.coursePlan.title,
            description: structuredData.coursePlan.description,
            totalDays: structuredData.coursePlan.totalDays,
            days,
          });
          await updateInterestOnboarding(currentInterest.id, true);
        } catch (err) {
          console.error("Failed to save course:", err);
        }
      }

      // Persist new weeks added to existing course
      const currentInterestState = interests.find((i) => i.id === currentInterest.id);
      if (currentInterestState?.course && structuredData.courseDays && structuredData.courseDays.length > 0 && !structuredData.onboardingComplete) {
        try {
          const courseId = await getCourseId(currentInterest.id);
          if (courseId) {
            const existingDayNums = new Set(currentInterestState.course.days.map((w) => w.dayNumber));
            const newDays = structuredData.courseDays
              .filter((w) => !existingDayNums.has(w.dayNumber))
              .map((w) => ({ ...w, unlocked: true, tasks: w.tasks.map((t) => ({ ...t, completed: false })) }));
            if (newDays.length > 0) {
              await addDaysToCourse(courseId, newDays);
            }
          }
        } catch (err) {
          console.error("Failed to save new days:", err);
        }
      }

    } catch (error) {
      console.error("Error:", error);
      setInterests((prev) =>
        prev.map((i) =>
          i.id === currentInterest.id
            ? { ...i, messages: [...i.messages, { id: generateId(), role: "assistant" as const, content: "Sorry, I had trouble responding. Please try again.", timestamp: new Date() }] }
            : i
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => { sendMessage(reply.label); };
  const handleNewInterest = () => { setActiveInterestId(null); setActiveTab("chat"); inputRef.current?.focus(); };
  const handleMicToggle = () => { stt.isListening ? stt.stopListening() : stt.startListening(); };

  const handleDeleteInterest = async (id: string) => {
    setInterests((prev) => prev.filter((i) => i.id !== id));
    if (activeInterestId === id) setActiveInterestId(interests.length > 1 ? interests.find((i) => i.id !== id)?.id || null : null);
    try {
      await dbDeleteInterest(id);
    } catch (err) {
      console.error("Failed to delete interest:", err);
    }
  };

  const handleToggleTask = async (dayNumber: number, taskId: string) => {
    if (!activeInterest?.course) return;

    let newCompleted = false;
    setInterests((prev) =>
      prev.map((i) => {
        if (i.id !== activeInterest.id || !i.course) return i;
        const updatedDays = i.course.days.map((w) => {
          if (w.dayNumber !== dayNumber) return w;
          return { ...w, tasks: w.tasks.map((t) => {
            if (t.id === taskId) {
              newCompleted = !t.completed;
              return { ...t, completed: !t.completed };
            }
            return t;
          }) };
        });
        let currentDay = i.course.currentDay;
        const currentDayData = updatedDays.find((w) => w.dayNumber === currentDay);
        if (currentDayData && currentDayData.tasks.every((t) => t.completed)) {
          setShowMilestone(currentDay);
          setTimeout(() => setShowMilestone(null), 3000);
          const nextDay = updatedDays.find((w) => w.dayNumber === currentDay + 1);
          if (nextDay) { currentDay = nextDay.dayNumber; nextDay.unlocked = true; }
        }
        return { ...i, course: { ...i.course, days: updatedDays, currentDay } };
      })
    );

    // Persist task toggle to DB
    try {
      const courseId = await getCourseId(activeInterest.id);
      if (courseId) {
        const dayId = await getDayId(courseId, dayNumber);
        if (dayId) {
          await toggleTaskCompletion(dayId, taskId, newCompleted);
        }

        // Check if week is now complete and persist progression
        const interest = interests.find((i) => i.id === activeInterest.id);
        if (interest?.course) {
          const dayData = interest.course.days.find((w) => w.dayNumber === dayNumber);
          const allCompleted = dayData?.tasks.every((t) => t.id === taskId ? newCompleted : t.completed);
          if (allCompleted && dayNumber === interest.course.currentDay) {
            const nextDayNum = dayNumber + 1;
            await updateCourseCurrentDay(activeInterest.id, nextDayNum);
            await unlockDay(courseId, nextDayNum);
          }
        }
      }
    } catch (err) {
      console.error("Failed to persist task toggle:", err);
    }
  };

  const handleRequestMoreDays = () => {
    if (!activeInterest?.course) return;
    const lastDay = activeInterest.course.days[activeInterest.course.days.length - 1];
    sendMessage(`Generate days ${lastDay.dayNumber + 1} through ${lastDay.dayNumber + 7} of my course.`, true);
  };

  // Computed values
  const course = activeInterest?.course;
  const courseProgress = course
    ? (() => {
        const total = course.days.reduce((s, w) => s + w.tasks.length, 0);
        const done = course.days.reduce((s, w) => s + w.tasks.filter((t) => t.completed).length, 0);
        return total > 0 ? Math.round((done / total) * 100) : 0;
      })()
    : 0;

  const completedTaskCount = course ? course.days.reduce((s, w) => s + w.tasks.filter((t) => t.completed).length, 0) : 0;
  const totalTaskCount = course ? course.days.reduce((s, w) => s + w.tasks.length, 0) : 0;

  const currentDayData = course ? course.days.find((w) => w.dayNumber === course.currentDay) : null;
  const nextTask = currentDayData ? currentDayData.tasks.find((t) => !t.completed) : null;
  const completedDays = course ? course.days.filter((w) => w.tasks.length > 0 && w.tasks.every((t) => t.completed)).length : 0;

  const lastAssistantMsgIndex = activeInterest ? [...activeInterest.messages].reverse().findIndex((m) => m.role === "assistant") : -1;
  const lastAssistantMsgId = lastAssistantMsgIndex >= 0 ? activeInterest!.messages[activeInterest!.messages.length - 1 - lastAssistantMsgIndex]?.id : null;

  // Loading screen
  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-4" />
          <p className="text-body-sm text-surface-400">Loading your interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Milestone celebration overlay */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-apple-lg p-8 text-center shadow-xl max-w-sm mx-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-title font-display text-surface-900 mb-2">Day {showMilestone} Complete!</h3>
            <p className="text-body-sm text-surface-400">Amazing progress. Keep going — your next day is unlocked!</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${showSidebar ? "w-64" : "w-0"} transition-all duration-300 bg-surface-100 flex flex-col overflow-hidden border-r border-surface-200/60`}>
        <div className="p-5 border-b border-surface-200/60">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <MobiusLogoMark size={24} />
            <span className="text-body font-semibold text-surface-800 tracking-tight">Otium</span>
          </Link>
          <button onClick={handleNewInterest} className="w-full flex items-center justify-center gap-2 bg-surface-900 text-white text-body-sm font-medium py-2.5 rounded-apple hover:bg-surface-800 transition-colors">
            <Plus className="w-4 h-4" />
            New Interest
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {interests.length === 0 && (
            <p className="text-surface-400 text-body-sm text-center mt-8 px-4">Your interests will appear here.</p>
          )}
          {interests.map((interest) => {
            const prog = interest.course ? (() => { const t = interest.course.days.reduce((s, w) => s + w.tasks.length, 0); const d = interest.course.days.reduce((s, w) => s + w.tasks.filter((t2) => t2.completed).length, 0); return t > 0 ? Math.round((d / t) * 100) : 0; })() : 0;
            return (
              <div key={interest.id} className={`group flex items-center gap-3 px-3 py-2.5 rounded-apple cursor-pointer transition-all duration-200 ${activeInterestId === interest.id ? "bg-white shadow-sm text-surface-900" : "hover:bg-white/60 text-surface-600"}`} onClick={() => { setActiveInterestId(interest.id); }}>
                <span className="text-base">{interest.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="block truncate text-body-sm font-medium capitalize">{interest.name}</span>
                  {interest.course && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex-1 bg-surface-200 rounded-full h-1">
                        <div className="bg-accent-500 h-1 rounded-full transition-all" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="text-caption text-surface-400">{prog}%</span>
                    </div>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteInterest(interest.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-surface-200/60">
          <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-body-sm text-surface-400 hover:text-surface-600 transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-surface-200/60 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-surface-100 rounded-apple transition-colors">
              <ChevronRight className={`w-4 h-4 text-surface-400 transition-transform duration-300 ${showSidebar ? "rotate-180" : ""}`} />
            </button>
            {activeInterest ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeInterest.emoji}</span>
                <h2 className="text-body font-semibold text-surface-800 capitalize">{activeInterest.name}</h2>
              </div>
            ) : (
              <h2 className="text-body font-medium text-surface-400">New interest</h2>
            )}
          </div>
          {activeInterest && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-100 rounded-apple p-0.5">
                <button onClick={() => setActiveTab("chat")} className={`px-4 py-1.5 rounded-[10px] text-body-sm font-medium transition-all duration-200 ${activeTab === "chat" ? "bg-white shadow-sm text-surface-900" : "text-surface-400 hover:text-surface-600"}`}>
                  <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Chat</span>
                </button>
                <button onClick={() => setActiveTab("journey")} className={`px-4 py-1.5 rounded-[10px] text-body-sm font-medium transition-all duration-200 ${activeTab === "journey" ? "bg-white shadow-sm text-surface-900" : "text-surface-400 hover:text-surface-600"}`}>
                  <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> My Journey {course ? `(${courseProgress}%)` : ""}</span>
                </button>
              </div>
              <AutoSpeakToggle autoSpeak={tts.autoSpeak} onToggle={tts.setAutoSpeak} supported={tts.supported} />
            </div>
          )}
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-2xl mx-auto space-y-5">
                {!activeInterest && (
                  <div className="flex justify-center items-center h-full min-h-[400px]">
                    <div className="text-center">
                      <MobiusLogoMark size={56} className="mx-auto mb-6" />
                      <h2 className="text-headline text-surface-900 mb-2 font-display">What are you interested in?</h2>
                      <p className="text-body text-surface-400">Type any hobby or interest and I&apos;ll help you dive in.</p>
                    </div>
                  </div>
                )}

                {activeInterest?.messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-apple-lg px-5 py-3 ${message.role === "user" ? "bg-surface-900 text-white rounded-tr-md" : "bg-surface-100 rounded-tl-md"}`}>
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none text-surface-700 [&_h3]:text-surface-900 [&_h4]:text-surface-800 [&_li]:text-surface-600 [&_strong]:text-surface-800" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
                        ) : (
                          <p className="text-body">{message.content}</p>
                        )}
                      </div>
                    </div>
                    {message.role === "assistant" && message.creators && message.creators.length > 0 && (
                      <div className="mt-2 ml-0 max-w-[85%]"><CreatorList creators={message.creators} /></div>
                    )}
                    {/* Speak button + Quick replies */}
                    {message.role === "assistant" && message.content && !isLoading && (
                      <div className="mt-1.5 ml-0 max-w-[85%] flex items-center gap-2">
                        {tts.supported && (
                          <SpeakButton text={message.content} isSpeaking={tts.isSpeaking} onSpeak={tts.speak} onStop={tts.stop} />
                        )}
                      </div>
                    )}
                    {message.role === "assistant" && message.id === lastAssistantMsgId && message.quickReplies && message.quickReplies.length > 0 && !isLoading && (
                      <div className="mt-2 ml-0 max-w-[85%]"><QuickReplyButtons replies={message.quickReplies} onSelect={handleQuickReply} disabled={isLoading} /></div>
                    )}
                  </div>
                ))}

                {isLoading && activeInterest?.messages[activeInterest.messages.length - 1]?.content === "" && (
                  <div className="flex justify-start">
                    <div className="bg-surface-100 rounded-apple-lg rounded-tl-md px-5 py-4">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Course ready banner in chat */}
                {course && activeTab === "chat" && (
                  <div className="bg-gradient-to-r from-accent-50 to-emerald-50 border border-accent-200 rounded-apple-lg p-4 flex items-center gap-4">
                    <div className="bg-accent-100 rounded-full p-2"><Sparkles className="w-5 h-5 text-accent-600" /></div>
                    <div className="flex-1">
                      <p className="text-body-sm font-semibold text-surface-800">Your journey is ready!</p>
                      <p className="text-caption text-surface-400">{course.title} — {courseProgress}% complete</p>
                    </div>
                    <button onClick={() => setActiveTab("journey")} className="text-body-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1">
                      View Journey <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-surface-200/60 bg-white px-6 py-4">
              <div className="max-w-2xl mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }} className="flex items-center gap-3">
                  <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={activeInterest ? (stt.isListening ? "Listening..." : "Ask anything about this interest...") : "What are you interested in?"} className={`input-field flex-1 ${stt.isListening ? "border-red-300 ring-2 ring-red-100" : ""}`} disabled={isLoading} autoFocus />
                  <MicButton isListening={stt.isListening} onToggle={handleMicToggle} supported={stt.supported} disabled={isLoading} />
                  <button type="submit" disabled={!inputValue.trim() || isLoading} className="bg-surface-900 text-white p-3 rounded-apple hover:bg-surface-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* Journey Tab */
          <div className="flex-1 overflow-y-auto">
            {course ? (
              <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
                {/* Journey Header */}
                <div className="bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 rounded-apple-lg p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/5 rounded-full translate-y-6 -translate-x-6" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-title font-display mb-1">{course.title}</h3>
                        <p className="text-body-sm text-surface-300">{course.description}</p>
                      </div>
                      <span className="text-3xl">{activeInterest?.emoji}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div className="bg-gradient-to-r from-accent-400 to-emerald-400 h-3 rounded-full transition-all duration-700" style={{ width: `${courseProgress}%` }} />
                        </div>
                      </div>
                      <span className="text-body font-bold text-accent-300">{courseProgress}%</span>
                    </div>
                    <div className="flex items-center gap-6 text-caption">
                      <span className="flex items-center gap-1.5 text-surface-300"><BookOpen className="w-3.5 h-3.5" /> {completedTaskCount}/{totalTaskCount} tasks</span>
                      <span className="flex items-center gap-1.5 text-surface-300"><Trophy className="w-3.5 h-3.5" /> {completedDays} days done</span>
                      <span className="flex items-center gap-1.5 text-surface-300"><Calendar className="w-3.5 h-3.5" /> Day {course.currentDay}</span>
                    </div>
                  </div>
                </div>

                {/* Up Next Card */}
                {nextTask && currentDayData && (
                  <div className="bg-accent-50/50 border border-accent-200/60 rounded-apple-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-4 h-4 text-accent-600" />
                      <span className="text-caption font-semibold text-accent-600 uppercase tracking-wide">Up Next</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleToggleTask(currentDayData.dayNumber, nextTask.id)} className="mt-0.5 w-6 h-6 rounded-full border-2 border-accent-300 hover:border-accent-500 transition-colors shrink-0" />
                      <div>
                        <p className="text-body font-semibold text-surface-800">{nextTask.label}</p>
                        {nextTask.description && <p className="text-body-sm text-surface-400 mt-0.5">{nextTask.description}</p>}
                        <span className="inline-block mt-2 text-caption px-2 py-0.5 rounded-full bg-accent-100 text-accent-600 font-medium capitalize">{nextTask.type}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { sendMessage("How am I doing on my course? Any tips for what I should focus on?", true); }} className="flex items-center gap-3 p-4 bg-surface-100 rounded-apple-lg hover:bg-surface-200/80 transition-colors text-left">
                    <MessageCircle className="w-5 h-5 text-accent-500 shrink-0" />
                    <div>
                      <p className="text-body-sm font-medium text-surface-700">Check in with Otium</p>
                      <p className="text-caption text-surface-400">Get personalized advice</p>
                    </div>
                  </button>
                  <button onClick={() => { sendMessage("I want to adjust my course. Can we make some changes?", true); }} className="flex items-center gap-3 p-4 bg-surface-100 rounded-apple-lg hover:bg-surface-200/80 transition-colors text-left">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />
                    <div>
                      <p className="text-body-sm font-medium text-surface-700">Adjust my plan</p>
                      <p className="text-caption text-surface-400">Change pace or focus</p>
                    </div>
                  </button>
                </div>

                {/* Course Days */}
                <CourseView course={course} onToggleTask={handleToggleTask} onRequestMoreDays={handleRequestMoreDays} hideHeader />

                {/* Journey chat input */}
                <div className="bg-surface-100 rounded-apple-lg p-4">
                  <p className="text-caption font-medium text-surface-400 mb-2">Talk to Otium about your journey</p>
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(journeyInput, true); }} className="flex items-center gap-3">
                    <input type="text" value={journeyInput} onChange={(e) => setJourneyInput(e.target.value)} placeholder="I'm struggling with... / This is too easy / What should I try next?" className="input-field flex-1 text-body-sm" disabled={isLoading} />
                    <button type="submit" disabled={!journeyInput.trim() || isLoading} className="bg-surface-900 text-white p-2.5 rounded-apple hover:bg-surface-800 transition-colors disabled:opacity-30">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* No course yet */
              <div className="max-w-md mx-auto text-center py-20 px-6">
                <div className="bg-surface-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-7 h-7 text-surface-400" />
                </div>
                <h3 className="text-title font-display text-surface-900 mb-2">Your journey starts in chat</h3>
                <p className="text-body-sm text-surface-400 mb-6">Tell me about your interest, answer a few questions, and I&apos;ll build you a personalized program right here.</p>
                <button onClick={() => setActiveTab("chat")} className="btn-primary">
                  <MessageCircle className="w-4 h-4 mr-2" /> Start Chatting
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
