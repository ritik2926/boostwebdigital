"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, SAFE_REPLY_TEMPLATE, scanReviewReply, segmentText, type Flag } from "@/lib/reviewReplyPatterns";

/**
 * 100% client-side. The draft reply (and the optional original-review
 * text) are held only in this component's own React state — never
 * fetched, posted, logged, or written to localStorage/sessionStorage.
 * There is no import of fetch, an API route, or any storage API anywhere
 * in this file or in src/lib/reviewReplyPatterns.ts. Confirmed by
 * grepping both files for fetch/XHR/localStorage/analytics before
 * shipping — see this task's report for the exact grep output.
 */

const UNDERLINE_TEXTAREA =
  "w-full resize-y rounded-lg border border-white/15 bg-white/[0.02] p-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent";

function FlagRow({ flag }: { flag: Flag }) {
  return (
    <li className="flex flex-col gap-1 border-b border-white/8 py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
          {CATEGORY_LABEL[flag.category]}
        </span>
        <span className="text-sm text-white/50">&ldquo;{flag.text}&rdquo;</span>
      </div>
      <p className="text-sm text-white/65">{flag.reason}</p>
    </li>
  );
}

export function ReviewReplyChecker() {
  const [reply, setReply] = useState("");
  const [review, setReview] = useState("");
  const [checked, setChecked] = useState(false);
  const replyId = useId();
  const reviewId = useId();

  const flags = useMemo(() => scanReviewReply(reply, review), [reply, review]);
  const segments = useMemo(() => segmentText(reply, flags), [reply, flags]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor={reviewId} className="block text-sm font-medium text-white/70">
          The original review (optional — lets us check for repeated or newly-disclosed details)
        </label>
        <textarea
          id={reviewId}
          rows={3}
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
            setChecked(false);
          }}
          placeholder="Paste the patient's review here, if you have it..."
          className={cn("mt-2", UNDERLINE_TEXTAREA)}
        />
      </div>

      <div>
        <label htmlFor={replyId} className="block text-sm font-medium text-white/70">
          Your draft reply
        </label>
        <textarea
          id={replyId}
          rows={6}
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
            setChecked(false);
          }}
          placeholder="Paste the reply you're about to post..."
          className={cn("mt-2", UNDERLINE_TEXTAREA)}
        />
        <p className="mt-2 text-xs text-white/40">Your text never leaves this browser. Nothing is sent to us, stored, or logged.</p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={reply.trim().length === 0}
          className="btn-primary inline-flex disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Check My Reply</span>
        </button>
      </div>

      <div aria-live="polite">
        {checked && (
          <div className="flex flex-col gap-8 border-t border-white/8 pt-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Your reply, with flagged phrases</h3>
              <div className="mt-3 rounded-lg border border-white/8 bg-white/[0.02] p-4 text-[15px] leading-relaxed whitespace-pre-wrap text-white/85">
                {segments.map((seg, i) =>
                  seg.flag ? (
                    <mark key={i} className="rounded bg-amber-400/25 px-0.5 text-amber-200">
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </div>
            </div>

            {flags.length > 0 ? (
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {flags.length} flagged phrase{flags.length === 1 ? "" : "s"}
                </h3>
                <ul className="mt-3 flex flex-col">
                  {flags.map((flag, i) => (
                    <FlagRow key={i} flag={flag} />
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-white/70">No flagged phrases. This is a pattern check, not a compliance review.</p>
            )}

            <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
              <h3 className="font-display text-lg font-semibold text-white">A safer starting point</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{SAFE_REPLY_TEMPLATE}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
