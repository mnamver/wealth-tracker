import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

const DashboardPage = lazy(() => import('../features/dashboard'));
const StocksPage = lazy(() => import('../features/stocks'));
const DepositsPage = lazy(() => import('../features/deposits'));
const FundsPage = lazy(() => import('../features/funds'));
const CurrencyPage = lazy(() => import('../features/currency'));

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'stocks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StocksPage />
          </Suspense>
        ),
      },
      {
        path: 'deposits',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DepositsPage />
          </Suspense>
        ),
      },
      {
        path: 'funds',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FundsPage />
          </Suspense>
        ),
      },
      {
        path: 'currency',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CurrencyPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
