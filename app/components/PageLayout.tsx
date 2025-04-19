import { useRouteLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import type { RootLoader } from '~/root';

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({
  children = null,
}: PageLayoutProps) {
  const data = useRouteLoaderData<RootLoader>('root');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: theme.colors.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {data && (
        <Header 
          navigationLinks={data.navigationLinks}
          siteInfo={data.siteInfo} 
        />
      )}
      <main style={{ flex: 1, padding: theme.spacing.lg }}>
        {children}
      </main>
      <Footer 
        siteInfo={data?.siteInfo}
      />
    </motion.div>
  );
}
