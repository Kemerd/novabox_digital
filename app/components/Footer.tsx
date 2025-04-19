import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';
import { PolicyModal } from '~/components/PolicyModal';

interface FooterProps {
  siteInfo?: {
    title: string;
    description: string;
  };
}

const PRIVACY_POLICY = `
<h2>Privacy Policy</h2>
<p>Last updated: March 2025</p>

<p>Novabox LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and disclosed by Novabox LLC.</p>

<h3>Information We Collect</h3>
<p>We collect information that you provide directly to us, including when you:</p>
<ul>
  <li>Submit a contact form</li>
  <li>Subscribe to our newsletter</li>
  <li>Engage with our services</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
  <li>Respond to your inquiries</li>
  <li>Provide and improve our services</li>
  <li>Send you marketing communications (with your consent)</li>
  <li>Analyze usage patterns to enhance user experience</li>
</ul>

<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at contact@novabox.digital</p>
`;

const TERMS_OF_SERVICE = `
<h2>Terms of Service</h2>
<p>Last updated: March 2025</p>

<p>By accessing and using Novabox LLC services, you agree to these terms.</p>

<h3>Use of Services</h3>
<p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>

<h3>Intellectual Property</h3>
<p>All content, designs, and intellectual property on this site belong to Novabox LLC.</p>

<h3>Limitation of Liability</h3>
<p>Novabox LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
`;

const footerStyles = {
  container: {
    background: 'rgba(10, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
    padding: `${theme.spacing.md} 0`,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing.sm,
    width: '100%',
  },
  logo: {
    height: '30px',
    width: 'auto',
    marginBottom: theme.spacing.sm,
    opacity: 0.8,
  },
  companyInfo: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: theme.typography.weights.light,
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing.md,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  link: {
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    fontSize: '0.75rem',
    transition: theme.animations.transition,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '8px',
    fontWeight: theme.typography.weights.light,
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: `${theme.spacing.sm} 0`,
    opacity: 0.1,
  },
};

export function Footer({
  siteInfo,
}: FooterProps) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handlePolicyClick = () => {
    setShowPrivacyPolicy(true);
  };

  const handleTermsClick = () => {
    setShowTerms(true);
  };

  return (
    <>
      <motion.footer
        style={footerStyles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={animations.transitions.quick}
      >
        <div style={footerStyles.inner}>
          <motion.img
            src="/logo.png"
            alt={siteInfo?.title || "Novabox LLC"}
            style={footerStyles.logo}
            whileHover={{ scale: 1.02 }}
            transition={animations.transitions.quick}
          />

          <div style={footerStyles.companyInfo}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Novabox LLC
              <br />
              All rights reserved © {new Date().getFullYear()}
            </motion.p>
          </div>

          <motion.div style={footerStyles.divider} />

          <nav style={footerStyles.nav}>
            <NavLink to="/" style={footerStyles.link}>Home</NavLink>
            <NavLink to="/contact" style={footerStyles.link}>Contact</NavLink>
            
            <motion.button
              onClick={handlePolicyClick}
              style={{
                ...footerStyles.link,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{
                scale: 1.02,
                color: theme.colors.accent3,
              }}
            >
              Privacy Policy
            </motion.button>
            <motion.button
              onClick={handleTermsClick}
              style={{
                ...footerStyles.link,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{
                scale: 1.02,
                color: theme.colors.accent3,
              }}
            >
              Terms of Service
            </motion.button>
          </nav>
        </div>
      </motion.footer>

      <PolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={PRIVACY_POLICY}
      />

      <PolicyModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
        content={TERMS_OF_SERVICE}
      />
    </>
  );
}
