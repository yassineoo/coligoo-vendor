"use client";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "Looks like there are no products listed yet. Time to start adding your items!",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <div className="relative mb-8">
        <img
          src="/images/empty.png"
          alt="Empty box illustration"
          className="w-64 h-56 object-contain"
        />
      </div>

      <div className="max-w-sm text-center">
        <p className="text-lg text-foreground font-roboto leading-normal">
          "{message}"
        </p>
      </div>
    </div>
  );
}
