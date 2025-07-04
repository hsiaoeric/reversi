import type { SVGProps } from "react";

export function WatermelonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 13c-2.5-2.2-2.5-6-2.5-6C19.5 4.8 17.2 3 14.5 3c-2.3 0-4.1 1.1-5.5 2.5" fill="#C1CDC1" stroke="hsl(var(--foreground))" />
      <path d="M22 13c-2.5-2.2-2.5-6-2.5-6C19.5 4.8 17.2 3 14.5 3c-2.3 0-4.1 1.1-5.5 2.5L2 13h20z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" />
      <path d="M11.5 13s-1.5-2-3-2" stroke="#FF00FF" />
      <path d="M16.5 13s-1.5-2-3-2" stroke="#FF00FF" />
      <circle cx="10" cy="10" r=".5" fill="hsl(var(--foreground))" />
      <circle cx="13" cy="8" r=".5" fill="hsl(var(--foreground))" />
      <circle cx="16" cy="10" r=".5" fill="hsl(var(--foreground))" />
    </svg>
  );
}
