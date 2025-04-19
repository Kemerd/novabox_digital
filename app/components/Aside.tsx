import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PolicyModal } from '~/components/PolicyModal';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed' | 'privacy-policy' | 'terms';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

const PRIVACY_POLICY = `
<h2>Privacy Policy</h2>
<p>Last updated: March 2025</p>

<p>Novabox LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and disclosed by Novabox Works.</p>

<h3>Information We Collect</h3>
<p>We collect information that you provide directly to us, including when you:</p>
<ul>
  <li>Place an order</li>
  <li>Create an account</li>
  <li>Contact our support team</li>
  <li>Subscribe to our newsletter</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
  <li>Process your orders</li>
  <li>Communicate with you about your orders</li>
  <li>Send you marketing communications (with your consent)</li>
  <li>Improve our products and services</li>
</ul>

<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at support@novaboxworks.com</p>
`;

const TERMS_OF_SERVICE = `
<h2>Terms of Service</h2>
<p>Last updated: March 2025</p>

<p>By accessing and using Novabox Works services, you agree to these terms.</p>

<h3>Use of Services</h3>
<p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>

<h3>Intellectual Property</h3>
<p>All content, designs, and intellectual property on this site belong to Novabox LLC.</p>

<h3>Limitation of Liability</h3>
<p>Novabox LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
`;

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal },
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
      <PolicyModal
        isOpen={type === 'privacy-policy'}
        onClose={close}
        title="Privacy Policy"
        content={PRIVACY_POLICY}
      />
      <PolicyModal
        isOpen={type === 'terms'}
        onClose={close}
        title="Terms of Service"
        content={TERMS_OF_SERVICE}
      />
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
