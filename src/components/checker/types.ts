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

export interface QueryAnswer {
  label: string;
  query: string;
  ok: boolean;
  answer: string;
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  sources: string[];
  error?: string;
}

export interface RankedSource {
  url: string;
  citedByCount: number;
  citedIn: string[];
  isOwnDomain: boolean;
}

export interface Competitor {
  name: string;
  appearedIn: number;
}

export interface CheckerReport {
  id: string | null;
  status: "ok" | "no-answer";
  message?: string;
  model: string;
  queries: Array<{ label: string; query: string }>;
  answers: QueryAnswer[];
  namedCount: number;
  totalQueries: number;
  sources: RankedSource[];
  score: number;
  breakdown: ScoreBreakdownRow[];
  competitors: Competitor[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: Recommendation[] | null;
  partialFailure: boolean;
  failedQueries: string[];
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
  queries: Array<{ label: string; query: string }>;
  answers: QueryAnswer[];
  namedCount: number;
  totalQueries: number;
  sources: RankedSource[];
  score: number;
  competitors: Competitor[];
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: Recommendation[] | null;
  status: string;
}

export type BlockReason = "visitor-limit" | "daily-cap";
