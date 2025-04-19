import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import contactStyles from '~/styles/contact.css?url';
import { PageLayout } from '~/components/PageLayout';
import { LandingHero } from '~/components/LandingHero';
import { motion } from 'framer-motion';

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
  const contactEmail = 'contact@novabox.digital';

  return (
    <div className="contact-page">
      <motion.div 
        className="contact-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Contact Us</h1>
        <p>Have a project in mind? Let's discuss how we can help bring your vision to life.</p>
      </motion.div>

      <div className="contact-content">
        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Send us a message</h2>
          <form className="contact-form" name="contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="contact" />
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Your name"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Your email address"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                placeholder="What's this about?"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                placeholder="Tell us about your project"
                rows={6}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="submit-button"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="contact-info-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div className="contact-info-item">
              <h3>Email</h3>
              <a href={`mailto:${contactEmail}`} className="contact-link">
                {contactEmail}
              </a>
            </div>
            
            <div className="contact-info-item">
              <h3>Hours</h3>
              <p>Monday - Friday: 9am - 6pm EST</p>
            </div>
            
            <div className="contact-info-item">
              <h3>Let's Connect</h3>
              <div className="social-links">
                <a href="https://twitter.com/novaboxdigital" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://linkedin.com/company/novaboxdigital" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/novaboxdigital" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function NotFound() {
  return <div className="page-content"><h1>404 - Not Found</h1><p>The page you're looking for doesn't exist.</p></div>;
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
