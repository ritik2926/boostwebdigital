import { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const CONTAINER_STYLES = {
  page: "max-w-(--container-page) px-6 md:px-10 lg:px-16",
  heading: "max-w-(--container-heading)",
  prose: "max-w-(--container-prose)",
  "prose-narrow": "max-w-(--container-prose-narrow)",
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
