'use client';

import { Menu, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthGuard } from '@/components/dashboard/auth-guard';
import { Sidebar, SidebarContent } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function DoadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGuard redirectTo="/login/doador" requiredRole="doador">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        {/* Mobile Header */}
        <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center gap-4 border-gray-200 border-b bg-white px-4 lg:hidden">
          <Button
            className="h-9 w-9"
            onClick={() => setMobileMenuOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link className="flex items-center gap-2" href="/dashboard/doador">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Doe Seguro</span>
          </Link>
        </div>

        {/* Mobile Drawer */}
        <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
          <SheetContent className="w-64 p-0" side="left">
            <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="w-full flex-1 pt-16 lg:ml-64 lg:pt-0">{children}</main>
      </div>
    </AuthGuard>
  );
}
