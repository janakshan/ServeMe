// components/LazyScreen.tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function createLazyScreen(importFunc: () => Promise<any>) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyScreen(props: any) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Usage in route files
export default createLazyScreen(() => import('@/screens/HeavyScreen'));