import type { SVGProps } from "react";
import type { Player } from "@/lib/reversi-logic";
import { PLAYER_1, PLAYER_2 } from "@/lib/reversi-logic";

interface SeedIconProps extends SVGProps<SVGSVGElement> {
  player: Player;
}

export function SeedIcon({ player, ...props }: SeedIconProps) {
  const color = player === PLAYER_1 ? "hsl(var(--foreground))" : "hsl(var(--primary))";

  return (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <g transform="rotate(45 50 50)">
        <path 
            d="M 50,10 C 80,10 90,40 90,50 C 90,60 80,90 50,90 C 20,90 10,60 10,50 C 10,40 20,10 50,10 Z" 
            fill={color} 
            stroke="hsl(var(--border))" 
            strokeWidth="3"
        />
        {player === PLAYER_2 && (
             <path 
                d="M 50,15 C 75,15 85,42 85,50 C 85,58 75,85 50,85 C 25,85 15,58 15,50 C 15,42 25,15 50,15 Z" 
                fill="none" 
                stroke="hsl(var(--accent))" 
                strokeWidth="4"
            />
        )}
      </g>
    </svg>
  );
}
