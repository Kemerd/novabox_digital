import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { theme } from '~/styles/theme';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const priceStyle = {
    color: theme.colors.primary, // White color for prices
    fontSize: theme.typography.sizes.body.large,
    fontFamily: theme.typography.fonts.display.medium,
  };

  const compareAtPriceStyle = {
    ...priceStyle,
    opacity: 0.6,
    textDecoration: 'line-through',
    marginLeft: theme.spacing.sm,
  };

  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale" style={{ display: 'flex', alignItems: 'center' }}>
          {price ? <div style={priceStyle}><Money data={price} /></div> : null}
          <s style={compareAtPriceStyle}>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <div style={priceStyle}><Money data={price} /></div>
      ) : (
        <span style={priceStyle}>&nbsp;</span>
      )}
    </div>
  );
}
