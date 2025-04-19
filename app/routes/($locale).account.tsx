import {
  data as remixData,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { Logout } from '~/components/Logout';

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    { customer: data.customer },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function Account() {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: `${theme.spacing.xl} ${theme.spacing.md}`,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 style={{
          fontSize: theme.typography.sizes.heading.h1,
          color: theme.colors.primary,
          marginBottom: theme.spacing.lg,
          fontFamily: theme.typography.fonts.display.bold,
        }}>
          {heading}
        </h1>

        <AccountMenu />

        <div style={{
          marginTop: theme.spacing.xl,
          minHeight: '50vh',
        }}>
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

function AccountMenu() {
  return (
    <motion.nav
      role="navigation"
      style={{
        display: 'flex',
        gap: theme.spacing.sm,
        background: 'rgba(255, 255, 255, 0.03)',
        padding: theme.spacing.md,
        borderRadius: '12px',
        marginBottom: theme.spacing.xl,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        overflow: 'auto',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <MenuLink to="/account/orders">Orders</MenuLink>
      <MenuDivider />
      <MenuLink to="/account/profile">Profile</MenuLink>
      <MenuDivider />
      <MenuLink to="/account/addresses">Addresses</MenuLink>
      <MenuDivider />
      <Logout
        style={{
          background: 'rgba(255, 77, 77, 0.1)',
          color: '#ff4d4d',
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          borderRadius: '8px',
          fontSize: theme.typography.sizes.body.small,
          fontWeight: theme.typography.weights.medium,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </motion.nav>
  );
}

function MenuLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: '8px',
        color: theme.colors.primary,
        textDecoration: 'none',
        background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        fontWeight: isActive ? theme.typography.weights.medium : 'normal',
        fontSize: theme.typography.sizes.body.regular,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      })}
    >
      {children}
    </NavLink>
  );
}

function MenuDivider() {
  return (
    <span style={{
      color: 'rgba(255, 255, 255, 0.2)',
      alignSelf: 'center',
      margin: `0 ${theme.spacing.xs}`,
    }}>
      •
    </span>
  );
}
