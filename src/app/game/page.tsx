import GameClient from '@/components/game-client';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function GamePageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="flex justify-between w-full">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
        </div>
        <Skeleton className="w-full aspect-square max-w-xl" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={<GamePageFallback />}>
      <GameClient />
    </Suspense>
  );
}
