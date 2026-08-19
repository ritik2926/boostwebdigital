import { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Every variant carries the same gutters — only max-width differs. `heading`
// previously had none at all (0px padding at every breakpoint), which is why
// text sat 1px from the viewport edge on About, the blog post, and Contact's
// FAQ — three unrelated pages independently hit the same gap. See
// docs/DESIGN-CRAFT.md: no Container variant may ship without horizontal
// padding.
const GUTTERS = "px-6 md:px-10 lg:px-16";
const CONTAINER_STYLES = {
  page: `max-w-(--container-page) ${GUTTERS}`,
  heading: `max-w-(--container-heading) ${GUTTERS}`,
  prose: `max-w-(--container-prose) ${GUTTERS}`,
  "prose-narrow": `max-w-(--container-prose-narrow) ${GUTTERS}`,
} as const;

type ContainerSize = keyof typeof CONTAINER_STYLES;

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "size">;

export function Container<T extends ElementType = "div">({
  as,
  size = "page",
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn("mx-auto w-full", CONTAINER_STYLES[size], className)}
      {...props}
    />
  );
}
