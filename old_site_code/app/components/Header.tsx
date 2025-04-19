import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

interface HeaderProps {
  navigationLinks: Array<{
    title: string;
    url: string;
  }>;
  siteInfo: {
    title: string;
    description: string;
  };
}

export function Header({
  navigationLinks,
  siteInfo,
}: HeaderProps) {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: 'none',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        position: 'sticky',
        top: 0,
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        left: 0,
        right: 0,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      }}
    >
      <NavLink to="/" style={({isActive}) => activeLinkStyle({isActive, isPending: false})} end>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <img
            src="/logo.png"
            alt={siteInfo.title}
            style={{
              height: '40px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </motion.div>
      </NavLink>
      
      <nav 
        style={{
          display: 'flex',
          gap: theme.spacing.md,
        }}
        role="navigation"
      >
        {navigationLinks.map((item) => (
          <NavLink
            className="header-menu-item"
            end
            key={item.title}
            style={({isActive}) => activeLinkStyle({isActive, isPending: false})}
            to={item.url}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      
      {/* Mobile menu button, only shown on small screens */}
      <motion.button
        className="header-menu-mobile-toggle"
        aria-label="Open menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          color: theme.colors.accent2,
          fontSize: '1.5rem',
          padding: theme.spacing.xs,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'none',
        }}
      >
        ☰
      </motion.button>
    </motion.header>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive
      ? theme.colors.accent3
      : isPending
      ? theme.colors.accent2
      : theme.colors.primary,
    textDecoration: 'none',
  };
}
