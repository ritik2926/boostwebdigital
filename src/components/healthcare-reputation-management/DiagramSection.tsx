import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { DecisionDiagram } from "@/components/healthcare-reputation-management/DecisionDiagram";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HrmDiagramSection() {
  return (
    <section id="diagram" className={cn("relative", SECTION_PADDING.default)}>
      <Container size="prose">
        <Kicker>Before You Reply</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Three Questions, in Order</h2>
        <p className={cn(STACK.headingToSub, "text-white/70")}>
          This is the same check we run before any reply goes out on a client&rsquo;s behalf. It takes longer to read
          than to use.
        </p>
      </Container>
      <div className={cn(STACK.subToContent, "px-4")}>
        <DecisionDiagram />
      </div>
    </section>
  );
}
