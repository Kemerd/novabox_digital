import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'NovaBox Digital - Policies' },
    { description: 'Review our policies including privacy, terms, shipping, and refund policies.' }
  ];
};

export default function Policies() {
  return (
    <div className="policies">
      <h1>Our Policies</h1>
      <p>
        At NovaBox Digital, we strive to be transparent in how we operate. 
        Please review our policies below to understand how we handle various aspects of our business.
      </p>
      
      <div className="policies-grid">
        <div className="policy-card">
          <h2>Privacy Policy</h2>
          <p>Learn how we collect, use, and protect your personal information.</p>
          <Link to="/policies/privacy" className="button">Read Privacy Policy</Link>
        </div>
        
        <div className="policy-card">
          <h2>Terms of Service</h2>
          <p>Understand the rules and guidelines for using our services and products.</p>
          <Link to="/policies/terms" className="button">Read Terms of Service</Link>
        </div>
        
        <div className="policy-card">
          <h2>Shipping Policy</h2>
          <p>Information about shipping methods, timeframes, and related procedures.</p>
          <Link to="/policies/shipping" className="button">Read Shipping Policy</Link>
        </div>
        
        <div className="policy-card">
          <h2>Refund Policy</h2>
          <p>Details about our return process and refund procedures.</p>
          <Link to="/policies/refund" className="button">Read Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}
