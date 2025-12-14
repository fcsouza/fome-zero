'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { ShieldCheck, LayoutDashboard, Heart, FileCheck, BarChart3, Settings, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-gray-200 p-6">
          <Link href="/dashboard/doador" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Doe Seguro</h1>
              <p className="text-gray-500 text-xs">Empresa Doadora</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        {session?.user && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-500 text-white">
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

