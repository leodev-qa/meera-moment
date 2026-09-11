import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-leaf text-ink hover:bg-leaf-deep",
        cream: "bg-cream text-ink hover:bg-cream-dim",
        ghost:
          "bg-transparent text-cream shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_18%,transparent)] hover:bg-cream/8",
        maroon: "bg-maroon text-cream hover:opacity-90",
        ink: "bg-forest-deep text-cream hover:bg-ink",
      },
      size: {
        md: "h-11 px-4 rounded-md text-sm",
        lg: "h-14 px-6 rounded-lg text-base",
        xl: "h-16 px-8 rounded-xl text-lg",
        pill: "h-10 px-4 rounded-full text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: Props) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
