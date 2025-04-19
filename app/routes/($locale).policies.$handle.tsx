import { useLoaderData, useParams, type MetaFunction } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

interface PolicyData {
  title: string;
  content: string;
  lastUpdated: string;
}

interface LoaderData {
  policy: PolicyData | null;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const policyData = data as LoaderData;
  return [
    { title: policyData?.policy?.title || 'Policy Not Found' },
    { description: `${policyData?.policy?.title || 'Policy'} for NovaBox Digital` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const policyData = getPolicyData(params.handle || '');

  if (!policyData) {
    throw new Response('Policy not found', { status: 404 });
  }

  return json<LoaderData>({ policy: policyData });
}

export default function Policy() {
  const { policy } = useLoaderData<LoaderData>();
  const params = useParams();

  if (!policy) {
    return <div>Policy not found: {params.handle}</div>;
  }

  return (
    <div className="policy">
      <header>
        <h1>{policy.title}</h1>
        <p className="last-updated">Last updated: {policy.lastUpdated}</p>
      </header>
      <div
        className="policy-content"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </div>
  );
}

// Mock function to return policy data
function getPolicyData(handle: string): PolicyData | null {
  const policies: Record<string, PolicyData> = {
    'privacy': {
      title: 'Privacy Policy',
      lastUpdated: 'January 1, 2023',
      content: `
        <p>At NovaBox Digital, we value your privacy and are committed to protecting your personal information.</p>
        <h2>Information We Collect</h2>
        <p>We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.</p>
      `
    },
    'terms': {
      title: 'Terms of Service',
      lastUpdated: 'January 1, 2023',
      content: `
        <p>These Terms of Service ("Terms") govern your access to and use of our website, products, and services.</p>
        <h2>Using Our Services</h2>
        <p>You must follow any policies made available to you within the Services. You may not misuse our Services.</p>
        <h2>Your Account</h2>
        <p>You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your account.</p>
      `
    },
    'shipping': {
      title: 'Shipping Policy',
      lastUpdated: 'January 1, 2023',
      content: `
        <p>This Shipping Policy outlines how we handle shipments and deliveries of our products.</p>
        <h2>Shipping Methods</h2>
        <p>We offer various shipping methods depending on your location and the products you purchase.</p>
        <h2>Delivery Times</h2>
        <p>Delivery times vary based on your location and the shipping method selected at checkout.</p>
      `
    },
    'refund': {
      title: 'Refund Policy',
      lastUpdated: 'January 1, 2023',
      content: `
        <p>This Refund Policy outlines our procedures regarding refunds and returns.</p>
        <h2>Return Process</h2>
        <p>To initiate a return, please contact our customer service team with your order number and reason for return.</p>
        <h2>Refund Timeline</h2>
        <p>Once we receive your returned item, we will inspect it and process your refund within 5-7 business days.</p>
      `
    }
  };

  return policies[handle] || null;
}
