import React, { Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

// Lazy load the 3D components to avoid SSR issues
const ThreeScene = React.lazy(() => import('./ThreeScene'));

/**
 * Helper function to determine if we're in a development environment
 * Checks for localhost, 127.0.0.1, and NODE_ENV
 */
const isDevelopmentEnvironment = () => {
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const isDev = process.env.NODE_ENV === 'development';

  return isLocalhost || isDev;
};

/**
 * Get the appropriate path for environment assets based on current environment
 */
const getEnvironmentPath = () => {
  // In development, load from local path
  if (isDevelopmentEnvironment()) {
    return '/env/';
  }

  // In production, load from CDN or production path
  // You should replace this with your actual production CDN/path
  return 'https://cdn.yoursite.com/env/';
};

/**
 * Hero Section Component with premium 3D animations
 */
export function LandingHero() {
  const heroContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    position: 'relative' as const,
    padding: 0,
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
  };

  const heroTextStyle = {
    fontFamily: theme.typography.fonts.display.bold,
    fontSize: theme.typography.sizes.hero.primary,
    color: theme.colors.primary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.sm,
    letterSpacing: theme.typography.letterSpacing.tight,
    lineHeight: theme.typography.lineHeight.tight,
    zIndex: 2,
    position: 'relative' as const,
    marginTop: theme.spacing.md,
  };

  const taglineStyle = {
    fontFamily: theme.typography.fonts.display.light,
    fontSize: theme.typography.sizes.hero.secondary,
    color: theme.colors.accent2,
    textAlign: 'center' as const,
    letterSpacing: theme.typography.letterSpacing.normal,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.xl,
    zIndex: 2,
    position: 'relative' as const,
  };

  const canvasContainerStyle = {
    width: '100%',
    height: '80vh',
    position: 'relative' as const,
    marginTop: '-15vh',
    zIndex: 1,
  };

  return (
    <section className="content-section" style={{ padding: 0, margin: 0, width: '100%', overflow: 'hidden' }}>
      <motion.div style={heroContainerStyle}>
        <motion.h1
          style={{
            ...heroTextStyle,
            fontFamily: theme.typography.fonts.display.black,
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animations.transitions.hero}
        >
          We Make Software
        </motion.h1>

        <motion.h2
          style={taglineStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animations.transitions.hero, delay: 0.2 }}
        >
          That Doesn't Suck
        </motion.h2>

        <div style={canvasContainerStyle}>
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

        <motion.p
          style={{
            fontFamily: theme.typography.fonts.text.light,
            fontSize: theme.typography.sizes.body.large,
            color: theme.colors.accent2,
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            fontStyle: 'italic',
            padding: `${theme.spacing.xl} ${theme.spacing.md}`,
            position: 'relative',
            zIndex: 10,
            marginTop: '-10vh',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            ...animations.transitions.hero,
            delay: 0.4,
            duration: 0.8
          }}
        >
          Slide in instrument-panel 3-1/8" & 2-1/2" gloveboxes crafted with cutting-edge Fiberon™ Nylon Carbon Fiber, just one of our many products.        </motion.p>

        <FeatureRows />
      </motion.div>
    </section>
  );
}

// First, let's create a proper mask component that handles the animation
const FeatureImage = ({ image, maskIndex, isEven, title, containerStyle }: {
  image: string;
  maskIndex: number;
  isEven: boolean;
  title: string;
  containerStyle?: React.CSSProperties;
}) => {
  // Get primary color based on index
  const getPrimaryColor = (index: number) => {
    // Using the primary colors of light and their combinations
    // Maintaining full saturation but increasing brightness/intensity
    const colors = {
      1: '#00FF40',  // Intense Green (added some blue for more punch)
      2: '#4040FF',  // Electric Blue
      3: '#FF2020',  // Vibrant Red
      4: '#00FFFF',  // Bright Cyan (Green + Blue)
      5: '#FFFF00',  // Pure Yellow (Green + Red)
      6: '#FF00FF',  // Pure Magenta (Blue + Red)
      7: '#FFFFFF',  // White (All colors)
    };
    return colors[maskIndex as keyof typeof colors] || colors[1];
  };

  // Enhanced floating animation variant
  const floatingAnimation = {
    animate: {
      rotate: [0, isEven ? 2 : -2, 0],
      scale: [1, 1.03, 1],
      y: [0, isEven ? 15 : -15, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
        // Stagger the animations for more organic movement
        rotate: {
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        },
        scale: {
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        },
        y: {
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    }
  };

  return (
    <motion.div
      className="feature-image-container"
      style={{
        ...(containerStyle || {}),
        position: 'absolute',
        width: '65%',
        aspectRatio: '16/9',
        left: isEven ? '-15%' : '50%',
        right: isEven ? '50%' : 'auto',
        paddingRight: isEven ? theme.spacing.md : '0',
        paddingLeft: !isEven ? theme.spacing.md : '0',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-100px",
        amount: "some"
      }}
    >
      {/* Color splash background with swipe and floating animation */}
      <motion.div
        className="feature-mask-element"
        style={{
          position: 'absolute',
          top: isEven ? '1rem' : '1rem',
          left: isEven ? '-2rem' : '2rem',
          right: isEven ? '2rem' : '-2rem',
          bottom: '-2rem',
          background: getPrimaryColor(maskIndex),
          maskImage: `url(/img/masks/brush${maskIndex}.png)`,
          WebkitMaskImage: `url(/img/masks/brush${maskIndex}.png)`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          filter: 'blur(20px) brightness(1.4) contrast(1.2)',
          opacity: 0,
          transformOrigin: isEven ? 'left center' : 'right center',
        }}
        initial={{
          opacity: 0,
          x: isEven ? 100 : -100 // Start from opposite direction of the image
        }}
        whileInView={{
          opacity: 0.6,
          x: 0
        }}
        viewport={{
          once: true,
          margin: "-100px",
          amount: "some"
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 20,
          mass: 1,
          delay: 0.2 // Slight delay after the image starts
        }}
        animate={floatingAnimation.animate} // Apply floating animation after reveal
      />

      {/* Main image with swipe animation */}
      <motion.div
        className="feature-mask-element"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          bottom: '2rem',
          maskImage: `url(/img/masks/brush${maskIndex}.png)`,
          WebkitMaskImage: `url(/img/masks/brush${maskIndex}.png)`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          zIndex: 2,
          overflow: 'hidden',
        }}
        initial={{
          opacity: 0,
          x: isEven ? -100 : 100 // Start from opposite side
        }}
        whileInView={{
          opacity: 1,
          x: 0
        }}
        viewport={{
          once: true,
          margin: "-100px",
          amount: "some"
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 20,
          mass: 1
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
            transition: {
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Then update the feature row rendering to use this component
function FeatureRows() {
  const featureContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
    position: 'relative',
    overflow: 'visible',
  };

  const featureRowStyle = (isEven: boolean): React.CSSProperties => ({
    display: 'flex',
    position: 'relative',
    width: '100%',
    minHeight: '400px',
    height: 'auto',
    alignItems: 'center',
    marginBottom: '2rem',
    zIndex: 1,
  });

  const featureTextStyle = (isEven: boolean, accent: string): React.CSSProperties => ({
    position: 'relative',
    width: '45%',
    flex: '0 0 45%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    alignItems: isEven ? 'flex-start' : 'flex-end',
    textAlign: isEven ? 'left' : 'right',
    marginLeft: isEven ? '55%' : '0',
  });

  const featureImageStyle = (isEven: boolean): React.CSSProperties => ({
    position: 'absolute',
    width: '50%',
    aspectRatio: '16/9',
    left: isEven ? '0' : '50%',
    top: '50%',
    transform: 'translateY(-50%)',
  });

  const features = [
    {
      title: '🎯 Precision Engineering',
      description: 'Precision-engineered for uncompromising strength & durability. Our fine-tuned additive manufacturing process creates better, lighter, and stronger parts—without compromise.',
      image: '/img/showcase1.png',
      accent: theme.colors.accent1,
    },
    {
      title: '✨ Surface Excellence',
      description: 'Beautifully textured, high-performance surface finish that sets new standards. Each part showcases our commitment to perfection through advanced manufacturing.',
      image: '/img/showcase2.png',
      accent: theme.colors.accent2,
    },
    {
      title: '🛡️ Annealed Resilience',
      description: 'Heat, chemical, and impact-resistant for real-world reliability. From aerospace to automotive, our carbon fiber parts handle extreme conditions with unmatched resilience.',
      image: '/img/showcase3.png',
      accent: theme.colors.primary,
    },
    {
      title: '🔥 UL 94 Flame Retardancy',
      description: 'Flame-retardant and temperature-resistant, engineered for extreme environments and worst case scenarios. Don\'t settle for less.',
      image: '/img/showcase4.png',
      accent: theme.colors.accent1,
    },
    {
      title: '⚡ Engineered Efficiency',
      description: 'Lightweight yet incredibly strong. Our structurally reinforced carbon fiber parts redefine what is possible in advanced manufacturing.',
      image: '/img/showcase5.png',
      accent: theme.colors.accent2,
    },
  ];

  return (
    <div style={featureContainerStyle}>
      {features.map((feature, index) => {
        const isEven = index % 2 === 0;

        return (
          <motion.div
            key={index}
            style={featureRowStyle(isEven)}
            className="feature-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={animations.springs.dramatic}
          >
            <motion.div
              style={featureTextStyle(isEven, feature.accent)}
              className="feature-text"
              initial={{ opacity: 0, x: isEven ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...animations.springs.dramatic, delay: 0.2 }}
            >
              <h3 style={{
                fontSize: theme.typography.sizes.heading.h3,
                color: feature.accent,
                fontFamily: theme.typography.fonts.display.medium,
                letterSpacing: theme.typography.letterSpacing.tight,
                lineHeight: 1,
                marginBottom: theme.spacing.xs,
                whiteSpace: 'normal',
                width: '100%',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontWeight: 800,
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: theme.typography.sizes.body.large,
                fontFamily: theme.typography.fonts.text.light,
                color: theme.colors.accent2,
                lineHeight: 1.4,
                letterSpacing: theme.typography.letterSpacing.normal,
                maxWidth: '100%',
                opacity: 0.9,
                fontWeight: 300,
                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}>
                {feature.description}
              </p>
            </motion.div>

            <FeatureImage
              image={feature.image}
              maskIndex={index + 1}
              isEven={isEven}
              title={feature.title}
              containerStyle={featureImageStyle(isEven)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default LandingHero; 