import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'fomezero',
  description: 'fomezero - Frontend Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
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
