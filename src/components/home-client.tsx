"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { AIStrategy } from "@/lib/reversi-logic";

export function HomeClient() {
  const [aiStrategy, setAiStrategy] = useState<AIStrategy>("Max ev2");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`/game?mode=pva&strategy=${aiStrategy}`);
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-2xl bg-gray-900 border-gray-700 text-white">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-4xl font-bold font-headline">
            Reversi
          </CardTitle>
          <CardDescription className="text-lg pt-2 text-gray-300">
            A classic strategy board game.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Select a game mode to begin.</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/game?mode=pvp">Player vs Player</Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" size="lg">
                Player vs AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Choose AI Opponent</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select a strategy for your computer opponent.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup
                  defaultValue={aiStrategy}
                  onValueChange={(value: AIStrategy) => setAiStrategy(value)}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="random" id="r1" className="mt-1"/>
                    <Label htmlFor="r1" className="flex flex-col">
                      <span className="font-semibold">random</span>
                      <span className="text-sm text-gray-400">隨機下</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="Max ev1" id="r2" className="mt-1"/>
                    <Label htmlFor="r2" className="flex flex-col">
                      <span className="font-semibold">Max ev1</span>
                      <span className="text-sm text-gray-400">使用的是封鎖對方行動力的策略，他會讓對手可下的棋步越來越少。</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="Max ev2" id="r3" className="mt-1"/>
                    <Label htmlFor="r3" className="flex flex-col">
                      <span className="font-semibold">Max ev2</span>
                      <span className="text-sm text-gray-400">喜歡佔領的 AI ，他會想讓自己的棋子越多越好。</span>
                    </Label>
                  </div>
                   <div className="flex items-start space-x-3">
                    <RadioGroupItem value="Max ev3" id="r4" className="mt-1"/>
                    <Label htmlFor="r4" className="flex flex-col">
                      <span className="font-semibold">Max ev3</span>
                      <span className="text-sm text-gray-400">結合了以上兩個的優點，比以上兩個的棋力還強。</span>
                    </Label>
                  </div>
                   <div className="flex items-start space-x-3">
                    <RadioGroupItem value="Min ev3" id="r5" className="mt-1"/>
                    <Label htmlFor="r5" className="flex flex-col">
                      <span className="font-semibold">Min ev3</span>
                      <span className="text-sm text-gray-400">策略與 Max ev3 相同， 只是最大化的是對手的利益</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={handleStartGame}>Start Game</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}
