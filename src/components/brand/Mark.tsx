import { cn } from "@/lib/utils";

export function LeafMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/leaf.svg"
      alt=""
      className={cn("outline-none", className)}
    />
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <img
      src="/brand/almeera-lockup.jpg"
      alt="almeera"
      className={cn("outline-none object-cover", className)}
    />
  );
}
