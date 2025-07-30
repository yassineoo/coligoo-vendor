import type { PropsWithChildren } from "react";

export default function Label({ children }: PropsWithChildren) {
  return <span className="text-sm font-medium text-gray-500">{children}</span>;
}
