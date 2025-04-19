import { type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

export const meta: MetaFunction = () => {
  return [{ title: 'Our Services | NovaBox Digital' }];
};

interface Service {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern, responsive web applications built with cutting-edge technologies.',
    details: [
      'Custom web application development',
      'Progressive Web Apps (PWAs)',
      'Enterprise-level solutions',
      'E-commerce platforms',
      'Content management systems',
      'API development and integration'
    ],
    icon: '🌐'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications that deliver exceptional user experiences.',
    details: [
      'Native iOS and Android apps',
      'Cross-platform solutions (React Native, Flutter)',
      'App Store optimization',
      'Backend integrations',
      'Analytics implementation',
      'Continuous updates and maintenance'
    ],
    icon: '📱'
  },
  {
    id: 'custom-software',
    title: 'Custom Software',
    description: 'Tailored software solutions designed to solve your unique business challenges.',
    details: [
      'Enterprise software development',
      'Legacy system modernization',
      'Workflow automation tools',
      'Data processing applications',
      'Cloud-based solutions',
      'SaaS product development'
    ],
    icon: '💻'
  },
  {
    id: 'design',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that users love, backed by solid research.',
    details: [
      'User research and testing',
      'Wireframing and prototyping',
      'Visual design and branding',
      'Interaction design',
      'Design systems',
      'Accessibility compliance'
    ],
    icon: '🎨'
  },
  {
    id: 'cloud-services',
    title: 'Cloud Solutions',
    description: 'Scalable, reliable cloud infrastructure for your applications and services.',
    details: [
      'Cloud architecture design',
      'Migration to cloud platforms',
      'Serverless application development',
      'DevOps automation',
      'Containerization (Docker, Kubernetes)',
      'Monitoring and optimization'
    ],
    icon: '☁️'
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description: 'Expert guidance to help you make informed technology decisions.',
    details: [
      'Technology stack selection',
      'Software architecture review',
      'Performance optimization',
      'Security audits',
      'Team augmentation',
      'Digital transformation strategy'
    ],
    icon: '📊'
  }
];

export default function ServicesPage() {
  return (
    <div className="services-page">
      <motion.div 
        className="services-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          padding: `${theme.spacing.xl} ${theme.spacing.md}`,
          marginBottom: theme.spacing.xl,
        }}
      >
        <h1 style={{
          fontFamily: theme.typography.fonts.display.bold,
          fontSize: theme.typography.sizes.heading.primary,
          color: theme.colors.primary,
          marginBottom: theme.spacing.md,
        }}>
          Our Services
        </h1>
        <p style={{
          fontFamily: theme.typography.fonts.text.regular,
          fontSize: theme.typography.sizes.body.large,
          color: theme.colors.accent2,
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          We deliver cutting-edge software solutions tailored to your unique business needs. 
          Our team of experienced developers, designers, and consultants work together to 
          bring your vision to life.
        </p>
      </motion.div>

      <div className="services-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing.xl,
        padding: `0 ${theme.spacing.md}`,
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              background: 'rgba(20, 20, 20, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: theme.spacing.lg,
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>
              {service.icon}
            </div>
            <h2 style={{
              fontFamily: theme.typography.fonts.display.bold,
              fontSize: theme.typography.sizes.heading.tertiary,
              color: theme.colors.accent3,
              marginBottom: theme.spacing.sm,
            }}>
              {service.title}
            </h2>
            <p style={{
              fontFamily: theme.typography.fonts.text.regular,
              fontSize: theme.typography.sizes.body.regular,
              color: theme.colors.accent2,
              marginBottom: theme.spacing.md,
            }}>
              {service.description}
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              marginTop: 'auto',
            }}>
              {service.details.map((detail, i) => (
                <li 
                  key={i}
                  style={{
                    fontFamily: theme.typography.fonts.text.regular,
                    fontSize: theme.typography.sizes.body.small,
                    color: theme.colors.accent2,
                    padding: `${theme.spacing.xs} 0`,
                    borderBottom: i < service.details.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="services-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          margin: `${theme.spacing.xl * 2}px auto`,
          padding: theme.spacing.xl,
          textAlign: 'center',
          maxWidth: '800px',
          background: 'rgba(20, 20, 20, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
        }}
      >
        <h2 style={{
          fontFamily: theme.typography.fonts.display.bold,
          fontSize: theme.typography.sizes.heading.secondary,
          color: theme.colors.primary,
          marginBottom: theme.spacing.md,
        }}>
          Ready to start your project?
        </h2>
        <p style={{
          fontFamily: theme.typography.fonts.text.regular,
          fontSize: theme.typography.sizes.body.large,
          color: theme.colors.accent2,
          marginBottom: theme.spacing.lg,
        }}>
          Contact us today to discuss your requirements and get a free consultation.
        </p>
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
          Get in Touch
        </motion.a>
      </motion.div>
    </div>
  );
} 