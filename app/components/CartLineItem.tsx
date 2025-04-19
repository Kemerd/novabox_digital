import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from '@remix-run/react';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { motion } from 'framer-motion';
import { CartStyles } from '~/styles/CartStyles';
import { animations } from '~/styles/animations';
import { theme } from '~/styles/theme';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart with premium styling and animations
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  return (
    <motion.li
      key={id}
      style={CartStyles.lineItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animations.transitions.quick}
      whileHover={{ scale: 1.02 }}
    >
      <div style={CartStyles.imageContainer}>
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
          />
        )}
      </div>

      <div style={CartStyles.productDetails}>
        <Link
          to={lineItemUrl}
          onClick={() => layout === 'aside' && close()}
          style={CartStyles.productTitle}
        >
          <motion.p whileHover={{ color: theme.colors.accent3 }}>
            {product.title}
          </motion.p>
        </Link>

        <ProductPrice price={line?.cost?.totalAmount} />

        <ul style={CartStyles.optionsList}>
          {selectedOptions.map((option) => (
            <li key={option.name} style={CartStyles.optionItem}>
              {option.name}: {option.value}
            </li>
          ))}
        </ul>

        <CartLineQuantity line={line} />
      </div>
    </motion.li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div style={CartStyles.quantityControls}>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <motion.button
          style={CartStyles.quantityButton}
          whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
        >
          −
        </motion.button>
      </CartLineUpdateButton>

      <span style={{ color: theme.colors.primary }}>
        {quantity}
      </span>

      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <motion.button
          style={CartStyles.quantityButton}
          whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
        >
          +
        </motion.button>
      </CartLineUpdateButton>

      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <motion.button
        disabled={disabled}
        type="submit"
        style={{
          ...CartStyles.quantityButton,
          color: theme.colors.error,
          marginLeft: theme.spacing.sm,
        }}
        whileHover={{ scale: 1.1, background: 'rgba(255, 0, 0, 0.1)' }}
        whileTap={{ scale: 0.95 }}
      >
        ×
      </motion.button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
