import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

export function DermatologyProblem() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Problem</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Two Practices, One Building</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Every dermatology practice with a cosmetic line is really running two practices at once. The medical
          side is insurance-adjacent and decided on clinical trust. The cosmetic side is cash-pay and decided
          partly on price, partly on confidence in the result. A single undifferentiated marketing plan optimizes
          for neither.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16")}>
          <div>
            <h3 className={H3}>Medical dermatology loses to indifference</h3>
            <p className="mt-3 text-white/70">
              A patient searching for a Mohs surgeon or the best local melanoma screening isn&apos;t comparing you
              against a med spa. They&apos;re comparing you against other board-certified dermatologists. Often
              that comparison happens on a referral, from a primary care physician who found you, or didn&apos;t,
              through the same public information a patient would find.
            </p>
            <p className="mt-3 text-white/70">
              A procedure page that reads like a generic services list doesn&apos;t answer the specific question
              being asked. It doesn&apos;t name melanoma, doesn&apos;t name Mohs surgery, doesn&apos;t say anything
              a competing dermatology practice&apos;s page couldn&apos;t also say. So it doesn&apos;t get named,
              and the referral goes somewhere else instead.
            </p>
          </div>
          <div>
            <h3 className={H3}>Cosmetic dermatology loses to med spas</h3>
            <p className="mt-3 text-white/70">
              A patient comparing Botox providers is asking a genuinely different question. Increasingly, an AI
              tool is the one answering it. The competitor isn&apos;t only the practice across town — it&apos;s the
              aesthetics-focused{" "}
              <Link href="/med-spa-marketing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
                med spa
              </Link>{" "}
              that isn&apos;t a medical practice at all.
            </p>
            <p className="mt-3 text-white/70">
              That med spa carries none of your clinical credentials, and it often invests more in the exact
              comparison content patients are reading before they choose. It doesn&apos;t need to win on safety or
              training. It only needs to answer the comparison question first.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Neither problem is solved by treating &ldquo;dermatology&rdquo; as one keyword category. They&apos;re
          solved by treating them as the two separate marketing problems they actually are, with two separate
          answers. Most practices only ever get one of those answers, and usually don&apos;t know which one is
          missing.
        </p>
      </Container>
    </section>
  );
}
