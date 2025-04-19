import { type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

export const meta: MetaFunction = () => {
  return [{ title: 'About | NovaBox Digital' }];
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <motion.div 
        className="about-header"
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
          fontSize: theme.typography.sizes.heading.h1,
          color: theme.colors.primary,
          marginBottom: theme.spacing.md,
        }}>
          About NovaBox Digital
        </h1>
        <p style={{
          fontFamily: theme.typography.fonts.text.regular,
          fontSize: theme.typography.sizes.body.large,
          color: theme.colors.accent2,
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          We're a team of passionate developers dedicated to building exceptional software.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: `0 ${theme.spacing.md}`,
        }}
      >
        <div style={{
          marginBottom: theme.spacing.xl,
        }}>
          <h2 style={{
            fontFamily: theme.typography.fonts.display.bold,
            fontSize: theme.typography.sizes.heading.h2,
            color: theme.colors.accent3,
            marginBottom: theme.spacing.md,
          }}>
            Our Mission
          </h2>
          <p style={{
            fontFamily: theme.typography.fonts.text.regular,
            fontSize: theme.typography.sizes.body.base,
            color: theme.colors.accent2,
            lineHeight: '1.6',
            marginBottom: theme.spacing.md,
          }}>
            At NovaBox Digital, our mission is to create software that doesn't just work, but excels. We focus on clean code, intuitive design, and delivering solutions that actually solve problems.
          </p>
        </div>

        <div style={{
          marginBottom: theme.spacing.xl,
        }}>
          <h2 style={{
            fontFamily: theme.typography.fonts.display.bold,
            fontSize: theme.typography.sizes.heading.h2,
            color: theme.colors.accent3,
            marginBottom: theme.spacing.md,
          }}>
            What We Do
          </h2>
          <p style={{
            fontFamily: theme.typography.fonts.text.regular,
            fontSize: theme.typography.sizes.body.base,
            color: theme.colors.accent2,
            lineHeight: '1.6',
            marginBottom: theme.spacing.md,
          }}>
            We specialize in web development, mobile applications, and custom software solutions. Our team is skilled in a wide range of technologies and frameworks, allowing us to select the right tools for each unique project.
          </p>
        </div>

        <div style={{
          marginBottom: theme.spacing.xl,
        }}>
          <h2 style={{
            fontFamily: theme.typography.fonts.display.bold,
            fontSize: theme.typography.sizes.heading.h2,
            color: theme.colors.accent3,
            marginBottom: theme.spacing.md,
          }}>
            Our Values
          </h2>
          <ul style={{
            fontFamily: theme.typography.fonts.text.regular,
            fontSize: theme.typography.sizes.body.base,
            color: theme.colors.accent2,
            lineHeight: '1.6',
            listStyleType: 'none',
            padding: 0,
          }}>
            {[
              'Quality over quantity - we believe in doing things right the first time',
              'Transparency in everything we do, from pricing to process',
              'Continuous learning and staying at the forefront of technology',
              'Building lasting relationships with our clients',
              'Delivering on our promises, every time'
            ].map((value, index) => (
              <li key={index} style={{
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.md,
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: theme.colors.accent3,
                }}>→</span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
} 