'use client';

import { useEffect, useState } from 'react';
import { AppProvider } from '@/src/context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return <AppProvider>{children}</AppProvider>;
}
