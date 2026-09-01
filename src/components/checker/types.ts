/**
 * Mirrors the JSON shapes src/app/api/checker/{run,quota,history}/route.ts
 * actually return — deliberately NOT imported from src/lib/checker/* (parse
 * types, engine types, etc.). This file and everything under
 * src/components/checker/ talks to the checker exclusively over fetch() to
 * those three routes; it never imports server-only code, so there's no path
 * for a secret to reach the client bundle through here.
 */

export interface ScoreBreakdownRow {
  signal: string;
  points: number;
}

export interface Recommendation {
  title: string;
  why: string;
  effort: "low" | "medium" | "high";
}

export interface CheckerReport {
  id: string | null;
  status: "ok" | "no-answer";
  message?: string;
  query: string;
  model: string;
  answer: string;
  sources: string[];
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  score: number;
  breakdown: ScoreBreakdownRow[];
  competitors: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: Recommendation[] | null;
}

export interface HistoryReport {
  id: string;
  createdAt: string;
  businessName: string;
  website: string | null;
  keyword: string;
  city: string;
  region: string | null;
  country: string;
  model: string;
  query: string;
  answer: string;
  sources: string[];
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  score: number;
  competitors: string[];
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: Recommendation[] | null;
  status: string;
}

export type BlockReason = "visitor-limit" | "daily-cap";
