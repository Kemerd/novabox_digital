import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';
import { CartStyles } from '~/styles/CartStyles';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * Premium cart component with animations and modern styling
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity && cart?.totalQuantity > 0;

  return (
    <motion.div
      style={{
        ...CartStyles.container,
        padding: theme.spacing.lg,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={animations.transitions.quick}
    >
      <AnimatePresence mode="wait">
        {!linesCount ? (
          <CartEmpty hidden={false} layout={layout} />
        ) : (
          <motion.div
            key="cart-contents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animations.transitions.quick}
          >
            <div style={{ marginBottom: theme.spacing.xl }}>
              <motion.ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.md,
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                <AnimatePresence>
                  {(cart?.lines?.nodes ?? []).map((line) => (
                    <CartLineItem key={line.id} line={line} layout={layout} />
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>
            {cartHasItems && <CartSummary cart={cart} layout={layout} />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();

  return (
    <motion.div
      hidden={hidden}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animations.transitions.quick}
      style={{
        textAlign: 'center',
        padding: theme.spacing.xl,
      }}
    >
      <motion.p
        style={{
          fontSize: theme.typography.sizes.body.large,
          color: theme.colors.accent2,
          marginBottom: theme.spacing.lg,
        }}
      >
        Your cart is empty
      </motion.p>
      <Link
        to="/collections"
        onClick={close}
        style={{
          color: theme.colors.accent3,
          textDecoration: 'none',
          fontSize: theme.typography.sizes.body.regular,
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <motion.span whileHover={{ x: 5 }}>
          Continue shopping →
        </motion.span>
      </Link>
    </motion.div>
  );
}
