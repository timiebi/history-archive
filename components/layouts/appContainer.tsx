// components/layout/AppContainer.tsx
import { cn } from "@/lib/utils";

export function AppContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        "max-w-350", 
        className
      )}
    >
      {children}
    </div>
  );
}
