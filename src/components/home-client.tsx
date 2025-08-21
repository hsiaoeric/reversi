
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AIStrategy } from "@/lib/reversi-logic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PlayerType = "human" | "ai";

export function HomeClient() {
  const [player1Type, setPlayer1Type] = useState<PlayerType>("human");
  const [player2Type, setPlayer2Type] = useState<PlayerType>("ai");
  const [player1Strategy, setPlayer1Strategy] = useState<AIStrategy>("Max ev2");
  const [player2Strategy, setPlayer2Strategy] = useState<AIStrategy>("Max ev2");

  const router = useRouter();

  const handleStartGame = () => {
    const params = new URLSearchParams();
    params.set("p1", player1Type);
    if (player1Type === 'ai') {
      params.set("p1strategy", player1Strategy);
    }
    params.set("p2", player2Type);
    if (player2Type === 'ai') {
      params.set("p2strategy", player2Strategy);
    }
    router.push(`/game?${params.toString()}`);
  };

  const aiStrategies: { value: AIStrategy; label: string; description: string }[] = [
    { value: "random", label: "Random", description: "隨機下" },
    { value: "Max ev1", label: "Max ev1", description: "使用的是封鎖對方行動力的策略，他會讓對手可下的棋步越來越少。" },
    { value: "Max ev2", label: "Max ev2", description: "喜歡佔領的 AI ，他會想讓自己的棋子越多越好。" },
    { value: "Max ev3", label: "Max ev3", description: "結合了以上兩個的優點，比以上兩個的棋力還強。" },
    { value: "Min ev3", label: "Min ev3", description: "策略與 Max ev3 相同， 只是最大化的是對手的利益" }
  ];

  const AIStrategySelect = ({ value, onValueChange }: { value: AIStrategy, onValueChange: (value: AIStrategy) => void }) => {
    const selectedStrategy = aiStrategies.find(s => s.value === value);

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Select value={value} onValueChange={(v) => onValueChange(v as AIStrategy)}>
              <SelectTrigger className="bg-black">
                <SelectValue placeholder="Select AI Strategy" />
              </SelectTrigger>
              <SelectContent>
                {aiStrategies.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          {selectedStrategy && (
            <TooltipContent side="top" align="start">
              <p className="font-bold">{selectedStrategy.label}</p>
              <p>{selectedStrategy.description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };


  return (
    <>
      <Card className="w-full max-w-lg shadow-2xl bg-gray-900 border-gray-700 text-white">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-4xl font-bold font-headline">
            Reversi
          </CardTitle>
          <CardDescription className="text-lg pt-2 text-gray-300">
            A classic strategy board game.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-around">
            {/* Player 1 Settings */}
            <div className="flex-1 space-y-3">
              <Label htmlFor="p1-type" className="text-xl font-semibold">Player 1 (Black)</Label>
              <Select value={player1Type} onValueChange={(v) => setPlayer1Type(v as PlayerType)}>
                <SelectTrigger id="p1-type" className="bg-black">
                  <SelectValue placeholder="Select Player Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
              {player1Type === "ai" && (
                <div className="space-y-2">
                  <Label htmlFor="p1-strategy">AI Strategy</Label>
                   <AIStrategySelect value={player1Strategy} onValueChange={setPlayer1Strategy} />
                </div>
              )}
            </div>

            {/* Player 2 Settings */}
            <div className="flex-1 space-y-3">
              <Label htmlFor="p2-type" className="text-xl font-semibold">Player 2 (White)</Label>
               <Select value={player2Type} onValueChange={(v) => setPlayer2Type(v as PlayerType)}>
                <SelectTrigger id="p2-type" className="bg-black">
                  <SelectValue placeholder="Select Player Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
              {player2Type === "ai" && (
                <div className="space-y-2">
                  <Label htmlFor="p2-strategy">AI Strategy</Label>
                  <AIStrategySelect value={player2Strategy} onValueChange={setPlayer2Strategy} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleStartGame} className="w-full" size="lg">
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
