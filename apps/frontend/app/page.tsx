'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8">
        <h1 className="font-bold text-6xl">fome zero</h1>
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
      </main>
    </div>
  );
}
