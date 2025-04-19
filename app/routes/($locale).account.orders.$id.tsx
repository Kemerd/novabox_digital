import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction, Link } from '@remix-run/react';
import { Money, Image, flattenConnection } from '@shopify/hydrogen';
import type { OrderLineItemFullFragment } from 'customer-accountapi.generated';
import { CUSTOMER_ORDER_QUERY } from '~/graphql/customer-account/CustomerOrderQuery';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { useEffect } from 'react';
import { useAnalytics } from '@shopify/hydrogen';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Order ${data?.order?.name}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: { orderId },
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const { order } = data;

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const fulfillmentStatus =
    flattenConnection(order.fulfillments)[0]?.status ?? 'Unfulfilled';

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  const { publish } = useAnalytics();

  // Publish analytics event when order details are viewed
  useEffect(() => {
    publish('product_viewed', {
      products: lineItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price?.amount || '0',
        variantTitle: item.variantTitle,
      }))
    });
  }, [publish, lineItems]);

  // Format the order date nicely
  const orderDate = new Date(order.processedAt!).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return theme.colors.success;
      case 'fulfilled':
        return theme.colors.accent3;
      case 'partially_fulfilled':
        return theme.colors.warning;
      case 'unfulfilled':
      default:
        return theme.colors.accent1;
    }
  };

  const statusColor = getStatusColor(fulfillmentStatus);

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="account-order"
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      style={{
        maxWidth: '850px',
        margin: '0 auto',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
      }}>
        <div>
          <Link to="/account/orders" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: theme.colors.accent2,
            textDecoration: 'none',
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.sizes.body.small,
          }}>
            ← Back to Orders
          </Link>

          <h1 style={{
            fontSize: theme.typography.sizes.heading.h1,
            color: theme.colors.primary,
            fontFamily: theme.typography.fonts.display.bold,
            margin: 0,
          }}>
            Order {order.name}
          </h1>

          <p style={{
            color: theme.colors.accent2,
            fontSize: theme.typography.sizes.body.regular,
            marginTop: theme.spacing.sm,
          }}>
            Placed on {orderDate}
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          marginTop: theme.spacing.md,
        }}>
          <div style={{
            display: 'inline-block',
            background: `rgba(${statusColor.replace(/[^\d,]/g, '')}, 0.1)`,
            borderRadius: '8px',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            color: statusColor,
            fontWeight: theme.typography.weights.medium,
            marginBottom: theme.spacing.md,
            borderLeft: `3px solid ${statusColor}`,
          }}>
            {fulfillmentStatus}
          </div>

          <a
            target="_blank"
            href={order.statusPageUrl}
            rel="noreferrer"
            style={{
              display: 'inline-block',
              background: theme.colors.gradient.accent,
              color: theme.colors.primary,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: theme.typography.weights.medium,
            }}
          >
            Track Order →
          </a>
        </div>
      </div>

      {/* Order Items Section */}
      <motion.div
        variants={itemAnimation}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: theme.spacing.xl,
        }}
      >
        <div style={{
          padding: theme.spacing.md,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        }}>
          <h3 style={{
            fontSize: theme.typography.sizes.heading.h3,
            fontFamily: theme.typography.fonts.display.medium,
            color: theme.colors.primary,
            margin: 0,
          }}>
            Order Items
          </h3>
        </div>

        <div style={{ padding: theme.spacing.md }}>
          {lineItems.map((lineItem, index) => (
            <OrderLineRow key={lineItem.id} lineItem={lineItem} isLast={index === lineItems.length - 1} />
          ))}
        </div>
      </motion.div>

      {/* Order Summary Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing.xl,
      }}>
        {/* Shipping Address */}
        <motion.div
          variants={itemAnimation}
          style={{
            flex: '1',
            minWidth: '250px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: theme.spacing.md,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}>
            <h3 style={{
              fontSize: theme.typography.sizes.heading.h3,
              fontFamily: theme.typography.fonts.display.medium,
              color: theme.colors.primary,
              margin: 0,
            }}>
              Shipping Address
            </h3>
          </div>

          <div style={{ padding: theme.spacing.md }}>
            {order?.shippingAddress ? (
              <address style={{
                fontStyle: 'normal',
                color: theme.colors.accent2,
                lineHeight: 1.5,
              }}>
                <p style={{
                  color: theme.colors.primary,
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.weights.medium,
                }}>
                  {order.shippingAddress.name}
                </p>

                {order.shippingAddress.formatted ? (
                  <p style={{ margin: 0 }}>{order.shippingAddress.formatted}</p>
                ) : (
                  ''
                )}

                {order.shippingAddress.formattedArea ? (
                  <p style={{ margin: 0 }}>{order.shippingAddress.formattedArea}</p>
                ) : (
                  ''
                )}
              </address>
            ) : (
              <p style={{ color: theme.colors.accent2 }}>No shipping address defined</p>
            )}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          variants={itemAnimation}
          style={{
            flex: '1',
            minWidth: '300px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: theme.spacing.md,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}>
            <h3 style={{
              fontSize: theme.typography.sizes.heading.h3,
              fontFamily: theme.typography.fonts.display.medium,
              color: theme.colors.primary,
              margin: 0,
            }}>
              Order Summary
            </h3>
          </div>

          <div style={{ padding: theme.spacing.md }}>
            {/* Summary Rows */}
            <SummaryRow label="Subtotal" value={<Money data={order.subtotal!} />} />

            {((discountValue && discountValue.amount) || discountPercentage) && (
              <SummaryRow
                label="Discounts"
                value={
                  discountPercentage ? (
                    <span style={{ color: theme.colors.success }}>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )
                }
              />
            )}

            <SummaryRow label="Tax" value={<Money data={order.totalTax!} />} />

            <div style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.1)',
              margin: `${theme.spacing.md} 0`,
            }} />

            <SummaryRow
              label="Total"
              value={<Money data={order.totalPrice!} />}
              isTotal
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function OrderLineRow({
  lineItem,
  isLast
}: {
  lineItem: OrderLineItemFullFragment;
  isLast: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      padding: theme.spacing.md,
      borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
      gap: theme.spacing.md,
    }}>
      {/* Product Image */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'rgba(255, 255, 255, 0.02)',
      }}>
        {lineItem?.image ? (
          <Image
            data={lineItem.image}
            width={80}
            height={80}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.accent1,
          }}>
            No image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <p style={{
          color: theme.colors.primary,
          fontWeight: theme.typography.weights.medium,
          margin: 0,
        }}>
          {lineItem.title}
        </p>

        {lineItem.variantTitle && (
          <p style={{
            color: theme.colors.accent2,
            fontSize: theme.typography.sizes.body.small,
            margin: `${theme.spacing.xs} 0 0 0`,
          }}>
            {lineItem.variantTitle}
          </p>
        )}
      </div>

      {/* Quantity and Price */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <div style={{
          color: theme.colors.primary,
          fontWeight: theme.typography.weights.medium,
        }}>
          <Money data={lineItem.price!} />
        </div>

        <p style={{
          color: theme.colors.accent2,
          fontSize: theme.typography.sizes.body.small,
          margin: `${theme.spacing.xs} 0 0 0`,
        }}>
          Qty: {lineItem.quantity}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  isTotal = false
}: {
  label: string;
  value: React.ReactNode;
  isTotal?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    }}>
      <span style={{
        color: isTotal ? theme.colors.primary : theme.colors.accent2,
        fontWeight: isTotal ? theme.typography.weights.medium : 'normal',
        fontSize: isTotal ? theme.typography.sizes.body.large : theme.typography.sizes.body.regular,
      }}>
        {label}
      </span>

      <span style={{
        color: theme.colors.primary,
        fontWeight: isTotal ? theme.typography.weights.medium : 'normal',
        fontSize: isTotal ? theme.typography.sizes.body.large : theme.typography.sizes.body.regular,
      }}>
        {value}
      </span>
    </div>
  );
}
