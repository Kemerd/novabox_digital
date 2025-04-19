import { type FetcherWithComponents } from '@remix-run/react';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const buttonStyles: React.CSSProperties = {
    background: theme.colors.gradient.accent,
    color: theme.colors.primary,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '12px',
    border: 'none',
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.body.regular,
    fontWeight: theme.typography.weights.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: theme.animations.transition,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  };

  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <motion.button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={buttonStyles}
            whileHover={disabled ? undefined : animations.hover}
            whileTap={disabled ? undefined : { scale: 0.98 }}
          >
            {fetcher.state !== 'idle' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                ◌
              </motion.div>
            ) : (
              children
            )}
          </motion.button>
        </>
      )}
    </CartForm>
  );
}
