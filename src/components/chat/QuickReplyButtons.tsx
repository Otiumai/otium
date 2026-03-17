"use client";

import { QuickReply } from "@/types";

interface QuickReplyButtonsProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
}

export default function QuickReplyButtons({ replies, onSelect, disabled }: QuickReplyButtonsProps) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-surface-200 rounded-full text-body-sm font-medium text-surface-700 hover:bg-surface-100 hover:border-surface-300 hover:text-surface-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
        >
          {reply.emoji && <span>{reply.emoji}</span>}
          <span>{reply.label}</span>
        </button>
      ))}
    </div>
  );
}
