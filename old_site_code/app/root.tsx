import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import contactStyles from '~/styles/contact.css?url';
import { PageLayout } from '~/components/PageLayout';

// Static site configuration for GitHub Pages
export const siteConfig = {
  siteInfo: {
    title: 'Novabox LLC',
    description: 'We make software that doesn\'t suck.',
  },
  navigationLinks: [
    { title: 'Home', url: '/' },
    { title: 'Services', url: '/services' },
    { title: 'About', url: '/about' },
    { title: 'Contact', url: '/contact' },
    { title: 'Blog', url: '/blog' },
  ]
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Home() {
  return <div className="page-content"><h1>Welcome to Novabox LLC</h1><p>We make software that doesn't suck.</p></div>;
}

function About() {
  return <div className="page-content"><h1>About Us</h1><p>Learn more about Novabox LLC.</p></div>;
}

function Contact() {
  return <div className="page-content"><h1>Contact Us</h1><p>Get in touch with our team.</p></div>;
}

function Services() {
  return <div className="page-content"><h1>Our Services</h1><p>Discover what we can do for you.</p></div>;
}

function Blog() {
  return <div className="page-content"><h1>Blog</h1><p>Read our latest articles.</p></div>;
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
