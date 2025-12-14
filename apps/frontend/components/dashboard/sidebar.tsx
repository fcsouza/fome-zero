'use client';

import {
  BarChart3,
  FileCheck,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SheetClose } from '@/components/ui/sheet';
import { useSession } from '@/lib/auth-client';

const navItems = [
  {
    href: '/dashboard/doador',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/doador/doacoes',
    label: 'Minhas Doações',
    icon: Heart,
  },
  {
    href: '/dashboard/doador/chatbot',
    label: 'Chatbot',
    icon: MessageCircle,
  },
  {
    href: '/dashboard/doador/certificados',
    label: 'Certificados',
    icon: FileCheck,
  },
  {
    href: '/dashboard/doador/relatorios',
    label: 'Relatórios',
    icon: BarChart3,
  },
  {
    href: '/dashboard/doador/configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
];

export function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const LinkWrapper = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    if (onLinkClick) {
      return (
        <SheetClose asChild>
          <Link href={href} onClick={onLinkClick}>
            {children}
          </Link>
        </SheetClose>
      );
    }
    return <Link href={href}>{children}</Link>;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-gray-200 border-b p-6">
        <LinkWrapper href="/dashboard/doador">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Doe Seguro</h1>
              <p className="text-gray-500 text-xs">Empresa Doadora</p>
            </div>
          </div>
        </LinkWrapper>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <LinkWrapper href={item.href} key={item.href}>
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            </LinkWrapper>
          );
        })}
      </nav>

      {/* User Profile */}
      {session?.user && (
        <div className="border-gray-200 border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-green-500 text-white">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900 text-sm">
                {session.user.name}
              </p>
              <p className="truncate text-gray-500 text-xs">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 border-gray-200 border-r bg-white lg:block">
      <SidebarContent />
    </aside>
  );
}
