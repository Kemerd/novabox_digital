import { Suspense } from 'react';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { siteConfig } from '~/root';

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({
  children = null,
}: PageLayoutProps) {
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
      <Header 
        navigationLinks={siteConfig.navigationLinks}
        siteInfo={siteConfig.siteInfo} 
      />
      <main style={{ flex: 1, padding: theme.spacing.lg }}>
        {children}
      </main>
      <Footer 
        siteInfo={siteConfig.siteInfo}
      />
    </motion.div>
  );
}
