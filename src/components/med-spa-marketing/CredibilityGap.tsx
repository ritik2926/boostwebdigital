import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const ROWS: Array<[string, string, string]> = [
  [
    "Who performs the treatment",
    "Often a registered nurse, nurse practitioner, or physician assistant, delegated by a medical director",
    "The dermatologist personally, or clinical staff under that same physician's license",
  ],
  [
    "How much on-site physician oversight",
    "Varies by state — some require the physician on-site, others only immediate availability for consultation",
    "The physician is on-site by definition; it's their own appointment",
  ],
  [
    "What the business itself is licensed as",
    "Often not a licensed medical facility in its own right — the medical acts inside it are what's regulated, not the storefront",
    "A licensed medical practice, regulated as one",
  ],
  [
    "What \"medical grade\" or \"medical director\" actually means",
    "Marketing language with no single fixed legal definition — worth asking who that person is and how involved they are",
    "A board-certified physician's own name and license, checkable directly",
  ],
  [
    "Who a patient can verify",
    "The injector's individual license, separately from the business",
    "One name, one license, one practice",
  ],
  [
    "What must be proven to compete",
    "Credibility the arrangement doesn't supply automatically",
    "Credibility the license already implies",
  ],
];

export function MedSpaCredibilityGap() {
  return (
    <section id="credibility" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Credibility Gap</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>
          A Med Spa Has to Earn Credibility a Dermatology Practice Gets by Default
        </h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Both compete for the same cash-pay procedures and often look identical on a website. Underneath, they
          answer to different rules, and a patient rarely knows that going in.
        </p>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Medical director requirements and who may legally inject <strong className="text-white">vary by state</strong>.
          In Texas, for example, the Texas Medical Board treats non-surgical cosmetic injections as the practice of
          medicine — delegable, but only under a licensed physician's supervision. Other states draw that line
          differently. Nothing here is legal advice; confirm your state's rules with a licensed attorney.
        </p>

        <div className={cn(STACK.subToContent, "overflow-x-auto")}>
          <table className="w-full min-w-160 border-collapse text-left">
            <thead>
              <tr className="border-b border-white/8">
                <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white/50">
                  What a patient is really asking
                </th>
                <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white/50">
                  Med spa
                </th>
                <th scope="col" className="pb-3 text-sm font-semibold text-white">
                  Dermatology practice
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-white/8">
                  <td className="py-4 pr-4 font-semibold text-white">{row[0]}</td>
                  <td className="py-4 pr-4 text-white/70">{row[1]}</td>
                  <td className="py-4 text-white/70">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-lg")}>
          <span className="font-semibold text-white">
            The website that answers these questions first wins the comparison before pricing ever comes up.
          </span>{" "}
          <span className="text-white/70">
            Most med spa marketing skips straight to the price list, and never answers the question a dermatology
            practice never has to.
          </span>
        </p>
      </Container>
    </section>
  );
}
