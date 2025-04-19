import { useRouteLoaderData, type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { theme } from '~/styles/theme';
import type { RootLoader } from '~/root';

// Lazy load the 3D component to avoid SSR issues
const ThreeScene = lazy(() => import('~/components/ThreeScene'));

export const meta: MetaFunction = () => {
  return [{ title: 'NovaBox Digital | Software Solutions' }];
};

export default function Homepage() {
  const data = useRouteLoaderData<RootLoader>('root');
  
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            padding: `${theme.spacing.xl} ${theme.spacing.md}`,
          }}
        >
          <motion.h1 
            style={{
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.hero.primary,
              color: theme.colors.primary,
              marginBottom: theme.spacing.md,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We Build Exceptional Software
          </motion.h1>
          
          <motion.p
            style={{
              fontFamily: theme.typography.fonts.display.light,
              fontSize: theme.typography.sizes.hero.secondary,
              color: theme.colors.accent2,
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: theme.spacing.xl,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Innovative solutions for modern challenges
          </motion.p>

          <div style={{ height: '50vh', position: 'relative' }}>
            <Suspense fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.accent2,
                }}
              >
                Loading 3D Experience...
              </motion.div>
            }>
              <ThreeScene />
            </Suspense>
          </div>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="services-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            padding: `${theme.spacing.xl} ${theme.spacing.md}`,
            textAlign: 'center',
          }}
        >
          <motion.h2
            style={{
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.heading.primary,
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Our Services
          </motion.h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme.spacing.lg,
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {[
              {
                title: 'Web Development',
                description: 'Modern, responsive web applications built with cutting-edge technologies.',
                icon: '🌐'
              },
              {
                title: 'Mobile Apps',
                description: 'Cross-platform mobile applications that deliver exceptional user experiences.',
                icon: '📱'
              },
              {
                title: 'Custom Software',
                description: 'Tailored software solutions designed to solve your unique business challenges.',
                icon: '💻'
              },
              {
                title: 'UI/UX Design',
                description: 'Beautiful, intuitive interfaces that users love, backed by solid research.',
                icon: '🎨'
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  background: 'rgba(20, 20, 20, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: theme.spacing.lg,
                  flex: '1 1 250px',
                  maxWidth: '350px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontFamily: theme.typography.fonts.display.bold,
                  fontSize: theme.typography.sizes.heading.tertiary,
                  color: theme.colors.accent3,
                  marginBottom: theme.spacing.sm,
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: theme.typography.fonts.text.regular,
                  fontSize: theme.typography.sizes.body.regular,
                  color: theme.colors.accent2,
                }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            padding: `${theme.spacing.xl} ${theme.spacing.md}`,
            textAlign: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(10,10,10,0.8))',
          }}
        >
          <motion.h2
            style={{
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.heading.primary,
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Why Choose NovaBox Digital
          </motion.h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme.spacing.xl,
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {[
              {
                title: 'Innovative Approach',
                description: 'We leverage the latest technologies and methodologies to create forward-thinking solutions.',
              },
              {
                title: 'Client Partnership',
                description: 'We work closely with you as partners, ensuring your vision becomes reality.',
              },
              {
                title: 'Quality Focus',
                description: 'We're obsessed with quality code, robust architecture, and exceptional performance.',
              },
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  flex: '1 1 300px',
                  maxWidth: '380px',
                  textAlign: 'left',
                }}
              >
                <h3 style={{
                  fontFamily: theme.typography.fonts.display.bold,
                  fontSize: theme.typography.sizes.heading.tertiary,
                  color: theme.colors.accent3,
                  marginBottom: theme.spacing.sm,
                }}>
                  {point.title}
                </h3>
                <p style={{
                  fontFamily: theme.typography.fonts.text.regular,
                  fontSize: theme.typography.sizes.body.regular,
                  color: theme.colors.accent2,
                }}>
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            padding: `${theme.spacing.xl} ${theme.spacing.md}`,
            textAlign: 'center',
            background: 'rgba(20, 20, 20, 0.3)',
            backdropFilter: 'blur(10px)',
            marginTop: theme.spacing.xl,
            borderRadius: '12px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <motion.h2
            style={{
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.heading.secondary,
              color: theme.colors.primary,
              marginBottom: theme.spacing.md,
            }}
          >
            Ready to bring your idea to life?
          </motion.h2>
          
          <motion.p
            style={{
              fontFamily: theme.typography.fonts.text.regular,
              fontSize: theme.typography.sizes.body.large,
              color: theme.colors.accent2,
              maxWidth: '700px',
              margin: '0 auto',
              marginBottom: theme.spacing.lg,
            }}
          >
            Let's build something amazing together. Get in touch with our team to discuss your project.
          </motion.p>
          
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-block',
              background: theme.colors.accent3,
              color: '#000',
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: '30px',
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.body.large,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
