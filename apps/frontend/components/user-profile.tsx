'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost">
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Link
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          href="/profile"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session.user.name}</p>
            <p className="text-muted-foreground text-sm">
              {session.user.email}
            </p>
          </div>
        </Link>
      </div>
      <Button onClick={handleSignOut} type="button" variant="secondary">
        Sign Out
      </Button>
    </div>
  );
}
