import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CALLOUT_STYLES = {
  info: { icon: Info, border: "border-white/15", bg: "bg-white/[0.03]", iconColor: "text-white/70" },
  warning: { icon: AlertTriangle, border: "border-amber-400/25", bg: "bg-amber-400/[0.04]", iconColor: "text-amber-400/80" },
  key: { icon: Sparkles, border: "border-accent/30", bg: "bg-accent/[0.06]", iconColor: "text-accent" },
} as const;

export function Callout({ type = "info", children }: { type?: keyof typeof CALLOUT_STYLES; children: ReactNode }) {
  const { icon: Icon, border, bg, iconColor } = CALLOUT_STYLES[type];
  return (
    <div className={cn("not-prose my-10 flex gap-4 rounded-2xl border-l-4 p-8", border, bg)}>
      <Icon className={cn("mt-1 h-6 w-6 shrink-0", iconColor)} aria-hidden />
      <div className="text-[1.0625rem] leading-[1.7] text-white/80 [&>p]:m-0 [&>p+p]:mt-4">{children}</div>
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="not-prose relative mx-auto my-12 max-w-[calc(100%+3rem)] px-2 text-center">
      <p className="font-display text-[1.625rem] font-medium italic leading-[1.35] tracking-[-0.01em] text-white sm:text-[1.875rem]">
        {children}
      </p>
      <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-accent/40" />
    </blockquote>
  );
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 1400,
  height = 875,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" sizes="(min-width: 1024px) 720px, 100vw" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-white/50">{caption}</figcaption>}
    </figure>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="not-prose my-10 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-10 text-center">
      <div className="font-display text-5xl font-extrabold tracking-[-0.02em] text-accent tabular-nums sm:text-6xl">{value}</div>
      <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] text-white/60">{label}</p>
    </div>
  );
}

export function InlineCTA({ heading, body, label, href }: { heading: string; body: string; label: string; href: string }) {
  return (
    <div className="not-prose my-12 rounded-2xl border border-white/12 bg-white/[0.04] p-8 sm:p-10">
      <h3 className="font-display text-xl font-semibold text-white">{heading}</h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/65">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent decoration-accent/40 underline-offset-4 hover:underline"
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

function Heading2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-4 mt-12 scroll-mt-32 font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-[2rem]">
      {children}
    </h2>
  );
}

function Heading3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mb-3 mt-8 scroll-mt-32 font-display text-[1.25rem] font-semibold leading-[1.25] text-white sm:text-[1.4rem]">
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-[1.125rem] leading-[1.75] text-white/80 last:mb-0">{children}</p>;
}

function Anchor({ href = "", children }: { href?: string; children: ReactNode }) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const Tag = isInternal ? Link : "a";
  return (
    <Tag
      href={href}
      className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white/70"
      {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Tag>
  );
}

function UnorderedList({ children }: { children: ReactNode }) {
  return <ul className="mb-6 ml-1 flex flex-col gap-3 text-[1.0625rem] leading-[1.7] text-white/80 marker:text-accent">{children}</ul>;
}

function OrderedList({ children }: { children: ReactNode }) {
  return <ol className="mb-6 ml-1 flex list-decimal flex-col gap-3 pl-5 text-[1.0625rem] leading-[1.7] text-white/80 marker:font-medium marker:text-white/50">{children}</ol>;
}

function ListItem({ children }: { children: ReactNode }) {
  return <li className="pl-2 marker:content-['—_']">{children}</li>;
}

function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-2 border-white/15 pl-6 text-[1.0625rem] italic leading-[1.7] text-white/65">{children}</blockquote>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return <code className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.875em] text-white/85">{children}</code>;
}

function HorizontalRule() {
  return <hr className="my-12 border-white/8" />;
}

function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-10 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-white/10 bg-white/[0.03]">{children}</thead>;
}

function TableHeaderCell({ children }: { children: ReactNode }) {
  return <th className="px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white/60">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-t border-white/8 px-5 py-3.5 text-white/75">{children}</td>;
}

export const mdxComponents = {
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  code: InlineCode,
  hr: HorizontalRule,
  table: TableWrap,
  thead: TableHead,
  th: TableHeaderCell,
  td: TableCell,
  Callout,
  PullQuote,
  ImageWithCaption,
  Stat,
  InlineCTA,
};
