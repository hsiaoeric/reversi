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
import { WatermelonIcon } from "@/components/icons/watermelon-icon";
import type { AIStrategy } from "@/lib/reversi-logic";

export function HomeClient() {
  const [aiStrategy, setAiStrategy] = useState<AIStrategy>("Greedy");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`/game?mode=pva&strategy=${aiStrategy}`);
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <WatermelonIcon className="h-24 w-24 mb-4" />
          <CardTitle className="text-4xl font-bold font-headline">
            Watermelon Reversi
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            A fresh and juicy take on a classic game.
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Choose AI Opponent</DialogTitle>
                <DialogDescription>
                  Select a strategy for your computer opponent.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup
                  defaultValue={aiStrategy}
                  onValueChange={(value: AIStrategy) => setAiStrategy(value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Strategic" id="r1" />
                    <Label htmlFor="r1" className="flex flex-col">
                      <span className="font-semibold">Strategic</span>
                      <span>Thinks a few moves ahead.</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Greedy" id="r2" />
                    <Label htmlFor="r2" className="flex flex-col">
                      <span className="font-semibold">Greedy</span>
                      <span>Tries to take the most pieces.</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Random" id="r3" />
                    <Label htmlFor="r3" className="flex flex-col">
                      <span className="font-semibold">Random</span>
                      <span>Makes unpredictable moves.</span>
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
