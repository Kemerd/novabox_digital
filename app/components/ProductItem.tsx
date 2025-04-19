import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { Money } from '@shopify/hydrogen';
import { theme } from '~/styles/theme';

/**
 * A modern product item card component with frosted glass effect
 * Implements proper image handling and responsive design
 * Images are constrained to 720x500px maximum while maintaining aspect ratio
 */
export function ProductItem({
    product,
    loading,
}: {
    product: ProductItemFragment;
    loading?: 'eager' | 'lazy';
}) {
    const variantUrl = useVariantUrl(product.handle);

    return (
        <Link
            className="product-item"
            key={product.id}
            prefetch="intent"
            to={variantUrl}
            style={{
                display: 'block',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
                textDecoration: 'none',
                maxWidth: '500px', // Constrain card width
                margin: '0 auto', // Center the card
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%', // 1:1 Aspect ratio
                overflow: 'hidden',
                maxWidth: '500px', // Constrain image container width
                maxHeight: '500px', // Constrain image container height
            }}>
                {product.featuredImage && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image
                            alt={product.featuredImage.altText || product.title}
                            data={product.featuredImage}
                            loading={loading}
                            sizes="(min-width: 45em) 500px, 100vw" // Update sizes attribute
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                maxWidth: '500px', // Constrain actual image
                                maxHeight: '500px', // Constrain actual image
                            }}
                        />
                    </div>
                )}
            </div>

            <div style={{
                padding: theme.spacing.md,
                background: 'rgba(255, 255, 255, 0.03)',
            }}>
                <h4 style={{
                    margin: 0,
                    marginBottom: theme.spacing.xs,
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fonts.display.medium,
                    fontSize: theme.typography.sizes.body.large,
                }}>
                    {product.title}
                </h4>
                <div style={{
                    color: theme.colors.accent2,
                    fontFamily: theme.typography.fonts.text.light,
                    fontSize: theme.typography.sizes.body.base,
                }}>
                    <Money data={product.priceRange.minVariantPrice} />
                </div>
            </div>
        </Link>
    );
} 