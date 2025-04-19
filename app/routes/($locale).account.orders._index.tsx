import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { useEffect } from 'react';
import { useAnalytics } from '@shopify/hydrogen';

export const meta: MetaFunction = () => {
  return [{ title: 'Your Orders' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return { customer: data.customer };
}

export default function Orders() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { orders } = customer;
  const { publish } = useAnalytics();

  // Publish analytics event when orders page is viewed
  useEffect(() => {
    publish('cart_viewed', {
      cart: orders
    });
  }, [publish, orders]);

  return (
    <motion.div
      className="orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        maxWidth: '850px',
        margin: '0 auto',
      }}
    >
      <h1 style={{
        fontSize: theme.typography.sizes.heading.h1,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xl,
        fontFamily: theme.typography.fonts.display.bold,
      }}>
        Your Orders
      </h1>

      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </motion.div>
  );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="account-orders">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({ node: order }) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: theme.spacing.xl,
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: theme.spacing.lg,
      }}
    >
      <p style={{
        color: theme.colors.accent2,
        fontSize: theme.typography.sizes.body.large,
        marginBottom: theme.spacing.lg,
      }}>
        You haven't placed any orders yet.
      </p>

      <Link to="/collections/all" style={{
        display: 'inline-block',
        background: theme.colors.gradient.accent,
        color: theme.colors.primary,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: theme.typography.sizes.body.regular,
        fontWeight: theme.typography.weights.medium,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        Start Shopping →
      </Link>
    </motion.div>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  // Determine status color for the badge
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return theme.colors.success;
      case 'fulfilled':
        return theme.colors.accent3;
      case 'partially_fulfilled':
        return theme.colors.warning;
      case 'unfulfilled':
        return theme.colors.accent1;
      default:
        return theme.colors.accent2;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{
        flex: '1',
        paddingRight: theme.spacing.md,
      }}>
        <Link to={`/account/orders/${btoa(order.id)}`} style={{
          color: theme.colors.primary,
          textDecoration: 'none',
          display: 'block',
          marginBottom: theme.spacing.xs,
          fontSize: theme.typography.sizes.body.large,
          fontFamily: theme.typography.fonts.display.medium,
        }}>
          Order #{order.number}
        </Link>

        <p style={{
          color: theme.colors.accent2,
          fontSize: theme.typography.sizes.body.regular,
          margin: `${theme.spacing.xs} 0`,
        }}>
          {new Date(order.processedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          marginTop: theme.spacing.sm,
          flexWrap: 'wrap',
        }}>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
          }}>
            {order.financialStatus}
          </span>

          {fulfillmentStatus && (
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.sizes.body.small,
              color: getStatusColor(fulfillmentStatus),
              borderLeft: `3px solid ${getStatusColor(fulfillmentStatus)}`,
            }}>
              {fulfillmentStatus}
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: theme.spacing.md,
      }}>
        <div style={{
          fontSize: theme.typography.sizes.body.large,
          color: theme.colors.primary,
          fontWeight: theme.typography.weights.medium,
        }}>
          <Money data={order.totalPrice} />
        </div>

        <Link to={`/account/orders/${btoa(order.id)}`} style={{
          display: 'inline-block',
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          color: theme.colors.primary,
          textDecoration: 'none',
          fontSize: theme.typography.sizes.body.small,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}
