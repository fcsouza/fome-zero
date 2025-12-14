'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfile } from '@/components/user-profile';
import { Button } from '@/components/ui/button';
import { Home, Plus, Package } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  showNavigation?: boolean;
}

export function DashboardHeader({
  title,
  showNavigation = true,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard/doador',
      label: 'Início',
      icon: Home,
      active: pathname === '/dashboard/doador',
    },
    {
      href: '/dashboard/doador/nova-doacao',
      label: 'Nova Doação',
      icon: Plus,
      active: pathname === '/dashboard/doador/nova-doacao',
    },
    {
      href: '/dashboard/doador/doacoes',
      label: 'Minhas Doações',
      icon: Package,
      active: pathname === '/dashboard/doador/doacoes',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-6xl px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-bold text-2xl text-gray-900">{title}</h1>
            {showNavigation && (
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={item.active ? 'default' : 'ghost'}
                      className={
                        item.active
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            )}
          </div>
          <UserProfile />
        </div>
        {showNavigation && (
          <nav className="mt-4 flex md:hidden items-center gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={item.active ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    item.active
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}

