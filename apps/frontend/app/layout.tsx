import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Doe Seguro - Doação de Alimentos com Segurança Jurídica',
  description:
    'Transforme a incerteza em impacto social. O Doe Seguro utiliza Inteligência Artificial para garantir validação jurídica e sanitária em cada doação, em conformidade com a Lei 14.016/2020.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} antialiased font-sans`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            classNames: {
              toast: 'bg-zinc-800 border border-zinc-700 text-white',
              title: 'text-white',
              description: 'text-zinc-400',
              success: 'bg-green-500/10 border-green-500 text-green-400',
              error: 'bg-red-500/10 border-red-500 text-red-400',
              warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
              info: 'bg-blue-500/10 border-blue-500 text-blue-400',
            },
          }}
        />
      </body>
    </html>
  );
}
