import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useRef } from 'react';
import { FetcherWithComponents } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';
import { CartStyles } from '~/styles/CartStyles';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

/**
 * Premium cart summary component with animations and modern styling
 */
export function CartSummary({ cart, layout }: CartSummaryProps) {
  const summaryStyles = {
    container: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      padding: theme.spacing.lg,
      border: `1px solid ${theme.colors.accent1}`,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    label: {
      color: theme.colors.accent2,
      fontSize: theme.typography.sizes.body.regular,
    },
    value: {
      color: theme.colors.primary,
      fontSize: theme.typography.sizes.body.large,
      fontFamily: theme.typography.fonts.hero,
    },
    divider: {
      height: '1px',
      background: theme.colors.accent1,
      margin: `${theme.spacing.md} 0`,
    },
  };

  return (
    <motion.div
      style={summaryStyles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animations.transitions.quick}
    >
      <h4 style={{
        fontSize: theme.typography.sizes.hero.secondary,
        color: theme.colors.primary,
        marginBottom: theme.spacing.lg,
        fontFamily: theme.typography.fonts.hero,
      }}>
        Summary
      </h4>

      <div style={summaryStyles.row}>
        <span style={summaryStyles.label}>Subtotal</span>
        <span style={summaryStyles.value}>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      <CartDiscounts
        discountCodes={cart.discountCodes}
        summaryStyles={summaryStyles}
      />

      <div style={summaryStyles.divider} />

      <CartGiftCard
        giftCardCodes={cart.appliedGiftCards}
        summaryStyles={summaryStyles}
      />

      <CartCheckoutActions
        checkoutUrl={cart.checkoutUrl}
        summaryStyles={summaryStyles}
      />
    </motion.div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  summaryStyles,
}: {
  checkoutUrl?: string;
  summaryStyles: any;
}) {
  if (!checkoutUrl) return null;

  return (
    <motion.a
      href={checkoutUrl}
      target="_self"
      style={{
        background: theme.colors.gradient.accent,
        color: theme.colors.primary,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        borderRadius: '12px',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'block',
        fontSize: theme.typography.sizes.body.large,
        fontFamily: theme.typography.fonts.body,
        fontWeight: theme.typography.weights.medium,
        marginTop: theme.spacing.lg,
      }}
      whileHover={animations.hover}
      whileTap={{ scale: 0.98 }}
    >
      Continue to Checkout
    </motion.a>
  );
}

function CartDiscounts({
  discountCodes,
  summaryStyles,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  summaryStyles: any;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      <AnimatePresence>
        {codes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={summaryStyles.row}
          >
            <span style={summaryStyles.label}>Discounts</span>
            <UpdateDiscountForm>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <code style={{ color: theme.colors.accent3 }}>
                  {codes?.join(', ')}
                </code>
                <motion.button
                  style={{
                    ...CartStyles.quantityButton,
                    color: theme.colors.error,
                  }}
                  whileHover={{ scale: 1.1, background: 'rgba(255, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  ×
                </motion.button>
              </div>
            </UpdateDiscountForm>
          </motion.div>
        )}
      </AnimatePresence>

      <UpdateDiscountForm discountCodes={codes}>
        <motion.div
          style={{
            display: 'flex',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.md,
          }}
        >
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${theme.colors.accent1}`,
              borderRadius: '8px',
              padding: theme.spacing.sm,
              color: theme.colors.primary,
              fontSize: theme.typography.sizes.body.regular,
            }}
          />
          <motion.button
            type="submit"
            style={{
              background: theme.colors.accent1,
              color: theme.colors.primary,
              border: 'none',
              borderRadius: '8px',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
            }}
            whileHover={animations.hover}
            whileTap={{ scale: 0.98 }}
          >
            Apply
          </motion.button>
        </motion.div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  summaryStyles,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  summaryStyles: any;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      <AnimatePresence>
        {codes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={summaryStyles.row}
          >
            <span style={summaryStyles.label}>Applied Gift Card(s)</span>
            <UpdateGiftCardForm>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <code style={{ color: theme.colors.accent3 }}>
                  {codes?.join(', ')}
                </code>
                <motion.button
                  style={{
                    ...CartStyles.quantityButton,
                    color: theme.colors.error,
                  }}
                  whileHover={{ scale: 1.1, background: 'rgba(255, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  ×
                </motion.button>
              </div>
            </UpdateGiftCardForm>
          </motion.div>
        )}
      </AnimatePresence>

      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.md,
          }}
        >
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${theme.colors.accent1}`,
              borderRadius: '8px',
              padding: theme.spacing.sm,
              color: theme.colors.primary,
              fontSize: theme.typography.sizes.body.regular,
            }}
          />
          <motion.button
            type="submit"
            style={{
              background: theme.colors.accent1,
              color: theme.colors.primary,
              border: 'none',
              borderRadius: '8px',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
            }}
            whileHover={animations.hover}
            whileTap={{ scale: 0.98 }}
          >
            Apply
          </motion.button>
        </motion.div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
