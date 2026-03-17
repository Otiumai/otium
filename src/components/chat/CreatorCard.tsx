"use client";

import { Creator } from "@/types";
import { getPlatformIcon } from "@/lib/ai";

interface CreatorCardProps {
  creator: Creator;
}

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: "bg-red-50 text-red-600 border-red-100",
    instagram: "bg-pink-50 text-pink-600 border-pink-100",
    tiktok: "bg-gray-50 text-gray-800 border-gray-200",
    podcast: "bg-purple-50 text-purple-600 border-purple-100",
    twitter: "bg-blue-50 text-blue-500 border-blue-100",
    twitch: "bg-violet-50 text-violet-600 border-violet-100",
    website: "bg-emerald-50 text-emerald-600 border-emerald-100",
    other: "bg-surface-100 text-surface-600 border-surface-200",
  };
  return colors[platform] || colors.other;
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    podcast: "Podcast",
    twitter: "Twitter/X",
    twitch: "Twitch",
    website: "Website",
    other: "Link",
  };
  return labels[platform] || "Link";
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-apple bg-white border border-surface-200/60 hover:border-surface-300 hover:shadow-sm transition-all duration-200"
    >
      <span className="text-lg mt-0.5 shrink-0">{getPlatformIcon(creator.platform)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-body-sm font-semibold text-surface-800 group-hover:text-accent-600 transition-colors truncate">
            {creator.name}
          </span>
          <span className={`text-caption px-1.5 py-0.5 rounded-full border ${getPlatformColor(creator.platform)} shrink-0`}>
            {getPlatformLabel(creator.platform)}
          </span>
        </div>
        <p className="text-caption text-surface-400 line-clamp-2">{creator.description}</p>
      </div>
      <svg className="w-4 h-4 text-surface-300 group-hover:text-accent-500 mt-1 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

interface CreatorListProps {
  creators: Creator[];
}

export function CreatorList({ creators }: CreatorListProps) {
  if (!creators || creators.length === 0) return null;

  return (
    <div className="mt-3 space-y-2 animate-fade-in">
      <p className="text-caption font-medium text-surface-400 uppercase tracking-wide mb-2">
        Creators to Follow
      </p>
      {creators.map((creator, i) => (
        <CreatorCard key={`${creator.name}-${i}`} creator={creator} />
      ))}
    </div>
  );
}
