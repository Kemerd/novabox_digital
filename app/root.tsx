import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import contactStyles from '~/styles/contact.css?url';
import { PageLayout } from '~/components/PageLayout';
import { LandingHero } from '~/components/LandingHero';
import { motion } from 'framer-motion';

// Import the Stripe pages from route files
import StripeSuccessPage from '~/routes/($locale).pages.stripe-success';
import StripeUpgradePage from '~/routes/($locale).pages.stripe-upgrade';
import StripeCancelPage from '~/routes/($locale).pages.stripe-cancel';
import StripeDowngradePage from '~/routes/($locale).pages.stripe-downgrade';

// Static site configuration for GitHub Pages
export const siteConfig = {
  siteInfo: {
    title: 'Novabox LLC',
    description: 'We make software that doesn\'t suck.',
  },
  navigationLinks: [
    { title: 'Home', url: '/' },
    { title: 'Contact', url: '/contact' },
  ]
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/stripe-success" element={<StripeSuccessPage />} />
      <Route path="/stripe-upgrade" element={<StripeUpgradePage />} />
      <Route path="/stripe-cancel" element={<StripeCancelPage />} />
      <Route path="/stripe-downgrade" element={<StripeDowngradePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Home() {
  return (
    <div className="homepage">
      <LandingHero />
    </div>
  );
}

function Contact() {
  const contactEmail = 'support@novabox.digital';

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Please reach out directly via email.</p>
      </div>

      <div className="contact-content-centered">
        <div className="contact-info-section">
          <div className="contact-info-item contact-email-large">
            <h3>Email Us</h3>
            <a href={`mailto:${contactEmail}`} className="email-link">{contactEmail}</a>
            <p className="contact-description">Send us an email and we'll get back to you as soon as possible, typically within 24-48 hours.</p>
          </div>

          <div className="contact-info-item">
            <h3>Hours</h3>
            <p>Monday - Friday: 9am - 5pm PST</p>
          </div>

          <div className="contact-info-item">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://twitter.com/novaboxdigital" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com/company/novaboxdigital" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://instagram.com/novaboxdigital" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return <div className="page-content"><h1>404 - Not Found</h1><p>The page you're looking for doesn't exist.</p></div>;
}

function StripeRedirect() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <img 
        src="/logo.png" 
        alt="Novabox Logo" 
        style={{
          maxWidth: '200px',
          marginBottom: '30px',
        }}
      />
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '500',
          margin: '0 0 10px'
        }}
      >
        Redirecting...
      </h1>
    </div>
  );
}

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Reset scroll position
    const scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Add loaded class to enable gradient
    const loadTimer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(loadTimer);
    };
  }, [location]);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0A0A0A',
        zIndex: -1
      }} />
      <PageLayout>
        <AppRoutes />
      </PageLayout>
    </>
  );
}

export default App;
