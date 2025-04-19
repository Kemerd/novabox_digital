import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
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
  type Fetcher,
} from '@remix-run/react';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Addresses' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        { error: { [addressId]: 'Unauthorized' } },
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: { address, defaultAddress },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: { addressId: decodeURIComponent(addressId) },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return { error: null, deletedAddress: addressId };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          { error: { [addressId]: 'Method not allowed' } },
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        { error: error.message },
        {
          status: 400,
        },
      );
    }
    return data(
      { error },
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  // Get the customer data from the outlet context and handle possible undefined case
  const context = useOutletContext<{ customer?: CustomerFragment }>();

  // Safety check to prevent undefined destructuring error
  if (!context || !context.customer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: theme.spacing.lg,
          textAlign: 'center'
        }}
      >
        Loading customer data...
      </motion.div>
    );
  }

  const { customer } = context;
  const { defaultAddress, addresses } = customer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: theme.spacing.lg,
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
      }}>
        <h1 style={{
          fontSize: theme.typography.sizes.heading.medium,
          fontWeight: theme.typography.weights.semibold,
          margin: 0,
          color: theme.colors.primary,
        }}>
          Your Addresses
        </h1>
      </div>

      {!addresses.nodes.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: theme.spacing.xl,
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: theme.typography.sizes.body.regular,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.lg,
          }}>
            You haven't saved any addresses yet. Add your first address to make checkout faster.
          </p>
          <NewAddressForm />
        </motion.div>
      ) : (
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}>
            <h2 style={{
              fontSize: theme.typography.sizes.heading.small,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.primary,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}>
              Add a new address
            </h2>
            <NewAddressForm />
          </div>

          <h2 style={{
            fontSize: theme.typography.sizes.heading.small,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.primary,
            margin: `${theme.spacing.lg} 0`,
          }}>
            Your saved addresses
          </h2>

          <ExistingAddresses
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
        </div>
      )}
    </motion.div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({ stateForMethod }) => (
        <div>
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            style={{
              background: theme.colors.gradient.accent,
              color: theme.colors.primary,
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: '8px',
              border: 'none',
              fontSize: theme.typography.sizes.body.small,
              fontWeight: theme.typography.weights.medium,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: stateForMethod('POST') !== 'idle' ? 0.7 : 1,
            }}
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating...' : 'Create Address'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: theme.spacing.lg,
    }}>
      {addresses.nodes.map((address) => (
        <div
          key={address.id}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: theme.spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {defaultAddress?.id === address.id && (
            <div style={{
              position: 'absolute',
              top: theme.spacing.md,
              right: theme.spacing.md,
              background: 'rgba(39, 174, 96, 0.2)',
              color: '#2ecc71',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: '6px',
              fontSize: theme.typography.sizes.body.small,
            }}>
              Default
            </div>
          )}

          <div style={{ marginBottom: theme.spacing.md }}>
            <p style={{
              fontSize: theme.typography.sizes.body.regular,
              color: theme.colors.primary,
              margin: 0,
              fontWeight: theme.typography.weights.medium
            }}>
              {address.firstName} {address.lastName}
            </p>
            {address.company && (
              <p style={{
                fontSize: theme.typography.sizes.body.small,
                color: theme.colors.accent2,
                margin: `${theme.spacing.xs} 0 0`,
              }}>
                {address.company}
              </p>
            )}
          </div>

          <div style={{ marginBottom: theme.spacing.md }}>
            <p style={{
              fontSize: theme.typography.sizes.body.small,
              color: theme.colors.accent2,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {address.address1}<br />
              {address.address2 && <>{address.address2}<br /></>}
              {address.city}, {address.zoneCode} {address.zip}<br />
              {address.territoryCode}
            </p>
          </div>

          {address.phoneNumber && (
            <p style={{
              fontSize: theme.typography.sizes.body.small,
              color: theme.colors.accent2,
              margin: 0,
            }}>
              {address.phoneNumber}
            </p>
          )}

          <AddressForm
            addressId={address.id}
            address={address}
            defaultAddress={defaultAddress}
          >
            {({ stateForMethod }) => (
              <div style={{
                display: 'flex',
                gap: theme.spacing.sm,
                marginTop: 'auto',
                paddingTop: theme.spacing.lg,
              }}>
                <button
                  disabled={stateForMethod('PUT') !== 'idle'}
                  formMethod="PUT"
                  type="submit"
                  style={{
                    background: 'rgba(52, 152, 219, 0.1)',
                    color: '#3498db',
                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: theme.typography.sizes.body.small,
                    fontWeight: theme.typography.weights.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: stateForMethod('PUT') !== 'idle' ? 0.7 : 1,
                    flex: 1,
                  }}
                >
                  {stateForMethod('PUT') !== 'idle' ? 'Saving...' : 'Edit'}
                </button>
                <button
                  disabled={stateForMethod('DELETE') !== 'idle'}
                  formMethod="DELETE"
                  type="submit"
                  style={{
                    background: 'rgba(231, 76, 60, 0.1)',
                    color: '#e74c3c',
                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: theme.typography.sizes.body.small,
                    fontWeight: theme.typography.weights.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: stateForMethod('DELETE') !== 'idle' ? 0.7 : 1,
                  }}
                >
                  {stateForMethod('DELETE') !== 'idle' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </AddressForm>
        </div>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  return (
    <Form id={addressId} style={{
      display: addressId === 'NEW_ADDRESS_ID' ? 'block' : 'none', // Hide existing address forms
    }}>
      <fieldset style={{
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.md,
      }}>
        <input type="hidden" name="addressId" defaultValue={addressId} />

        <div style={{ gridColumn: '1/2' }}>
          <label htmlFor="firstName" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>First name*</label>
          <input
            aria-label="First name"
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            id="firstName"
            name="firstName"
            placeholder="First name"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '2/3' }}>
          <label htmlFor="lastName" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Last name*</label>
          <input
            aria-label="Last name"
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            id="lastName"
            name="lastName"
            placeholder="Last name"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/3' }}>
          <label htmlFor="company" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Company</label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            id="company"
            name="company"
            placeholder="Company"
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/3' }}>
          <label htmlFor="address1" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Address line*</label>
          <input
            aria-label="Address line 1"
            autoComplete="address-line1"
            defaultValue={address?.address1 ?? ''}
            id="address1"
            name="address1"
            placeholder="Address line 1*"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/3' }}>
          <label htmlFor="address2" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Address line 2</label>
          <input
            aria-label="Address line 2"
            autoComplete="address-line2"
            defaultValue={address?.address2 ?? ''}
            id="address2"
            name="address2"
            placeholder="Address line 2"
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/2' }}>
          <label htmlFor="city" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>City*</label>
          <input
            aria-label="City"
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            id="city"
            name="city"
            placeholder="City"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '2/3' }}>
          <label htmlFor="zoneCode" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>State / Province*</label>
          <input
            aria-label="State/Province"
            autoComplete="address-level1"
            defaultValue={address?.zoneCode ?? ''}
            id="zoneCode"
            name="zoneCode"
            placeholder="State / Province"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/2' }}>
          <label htmlFor="zip" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Zip / Postal Code*</label>
          <input
            aria-label="Zip"
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            id="zip"
            name="zip"
            placeholder="Zip / Postal Code"
            required
            type="text"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '2/3' }}>
          <label htmlFor="territoryCode" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Country Code*</label>
          <input
            aria-label="territoryCode"
            autoComplete="country"
            defaultValue={address?.territoryCode ?? ''}
            id="territoryCode"
            name="territoryCode"
            placeholder="Country"
            required
            type="text"
            maxLength={2}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/3' }}>
          <label htmlFor="phoneNumber" style={{
            display: 'block',
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
            marginBottom: theme.spacing.xs,
          }}>Phone</label>
          <input
            aria-label="Phone Number"
            autoComplete="tel"
            defaultValue={address?.phoneNumber ?? ''}
            id="phoneNumber"
            name="phoneNumber"
            placeholder="+16135551111"
            pattern="^\+?[1-9]\d{3,14}$"
            type="tel"
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: theme.colors.primary,
            }}
          />
        </div>

        <div style={{ gridColumn: '1/3', display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            style={{
              accentColor: theme.colors.accent,
            }}
          />
          <label htmlFor="defaultAddress" style={{
            fontSize: theme.typography.sizes.body.small,
            color: theme.colors.accent2,
          }}>Set as default address</label>
        </div>

        {error ? (
          <div style={{ gridColumn: '1/3' }}>
            <p style={{
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#e74c3c',
              padding: theme.spacing.sm,
              borderRadius: '8px',
              fontSize: theme.typography.sizes.body.small,
              margin: `${theme.spacing.sm} 0`,
            }}>
              {error}
            </p>
          </div>
        ) : null}

        <div style={{ gridColumn: '1/3', marginTop: theme.spacing.sm }}>
          {children({
            stateForMethod: (method) => (formMethod === method ? state : 'idle'),
          })}
        </div>
      </fieldset>
    </Form>
  );
}