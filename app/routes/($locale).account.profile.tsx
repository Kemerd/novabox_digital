import type { CustomerFragment } from 'customer-accountapi.generated';
import type { CustomerUpdateInput } from '@shopify/hydrogen/customer-account-api-types';
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Profile' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, customerAccount } = context;
  const formData = await request.formData();

  // Double-check login
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return json(
      { error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }

  try {
    const {
      error,
      customer: updatedCustomer,
      errors,
    } = await customerAccount.updateCustomer({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    });

    if (errors?.length || error) {
      return json(
        { error: errors?.[0].message ?? error ?? 'Something went wrong' },
        { status: 400 },
      );
    }

    return json(
      { customer: updatedCustomer, success: true },
      { status: 200 },
    );
  } catch (error: any) {
    return json({ error: error.message, success: false }, { status: 400 });
  }
}

export default function AccountProfile() {
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent) => {
    setFormStatus('submitting');
  };

  if (actionData?.success && formStatus === 'submitting') {
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  } else if (actionData?.error && formStatus === 'submitting') {
    setFormStatus('error');
    setTimeout(() => setFormStatus('idle'), 3000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 style={{
        fontSize: theme.typography.sizes.heading.h2,
        color: theme.colors.primary,
        marginBottom: theme.spacing.lg,
        fontFamily: theme.typography.fonts.display.medium,
      }}>
        Personal Information
      </h2>

      <motion.div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          padding: theme.spacing.xl,
          border: `1px solid ${theme.colors.accent1}`,
          maxWidth: '550px',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Form method="post" onSubmit={handleSubmit} ref={formRef}>
          <fieldset
            style={{
              margin: 0,
              padding: 0,
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
            disabled={formStatus === 'submitting'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              <label
                htmlFor="firstName"
                style={{
                  color: theme.colors.accent2,
                  fontSize: theme.typography.sizes.body.small,
                  marginBottom: theme.spacing.xs,
                }}
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                aria-label="First name"
                defaultValue={actionData?.customer?.firstName ?? ''}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${theme.colors.accent1}`,
                  borderRadius: '8px',
                  padding: theme.spacing.md,
                  color: theme.colors.primary,
                  fontSize: theme.typography.sizes.body.regular,
                  width: '100%',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              <label
                htmlFor="lastName"
                style={{
                  color: theme.colors.accent2,
                  fontSize: theme.typography.sizes.body.small,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                aria-label="Last name"
                defaultValue={actionData?.customer?.lastName ?? ''}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${theme.colors.accent1}`,
                  borderRadius: '8px',
                  padding: theme.spacing.md,
                  color: theme.colors.primary,
                  fontSize: theme.typography.sizes.body.regular,
                  width: '100%',
                }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: theme.colors.gradient.accent,
                color: theme.colors.primary,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '10px',
                fontSize: theme.typography.sizes.body.regular,
                fontWeight: theme.typography.weights.medium,
                marginTop: theme.spacing.md,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
              }}
            >
              {formStatus === 'submitting' ? 'Updating...' : 'Update'}
            </motion.button>
          </fieldset>
        </Form>

        <AnimatePresence>
          {formStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(40, 167, 69, 0.1)',
                color: '#2ecc71',
                padding: theme.spacing.md,
                borderRadius: '8px',
                marginTop: theme.spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              ✓ Profile updated successfully
            </motion.div>
          )}

          {formStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(220, 53, 69, 0.1)',
                color: '#e74c3c',
                padding: theme.spacing.md,
                borderRadius: '8px',
                marginTop: theme.spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              ✕ {actionData?.error || 'Something went wrong'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
