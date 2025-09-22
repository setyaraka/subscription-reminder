"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({
  withText = false,
  className,
  size = 24,
}: { withText?: boolean; className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo-mark.svg"
        alt="Subscription Helper"
        width={size}
        height={size}
        className="dark:invert-0"
        priority
      />
      {withText && (
        <span className="font-semibold tracking-tight">Subscription Helper</span>
      )}
    </span>
  );
}
