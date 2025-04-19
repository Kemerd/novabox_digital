import { useAnalytics } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';

// Declare Facebook Pixel properties on Window interface
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * This component creates a bridge between Shopify Analytics and third-party analytics services.
 * It acts as a simplified example showing how you could connect Shopify Analytics to your
 * preferred third-party analytics services.
 */
export function ThirdPartyAnalyticsIntegration() {
  const { subscribe, register, publish } = useAnalytics();
  const initialized = useRef(false);

  // Register this analytics integration - this will prevent any analytics events
  // from being sent until this integration is ready
  const { ready } = register('Meta Pixel Integration');

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('[Analytics] Initializing Meta Pixel');

    // Initialize Meta Pixel
    if (typeof window !== 'undefined') {
      // Initialize Facebook Pixel
      window.fbq = function () {
        // @ts-ignore - fbq queue is expected to be accessed this way
        window.fbq.callMethod ?
          // @ts-ignore
          window.fbq.callMethod.apply(window.fbq, arguments) :
          // @ts-ignore
          window.fbq.queue.push(arguments);
      };

      // Set up initial fbq object
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];

      // Load the Facebook Pixel script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      // Initialize with your Pixel ID
      window.fbq('init', '614734581447160');

      // Track initial PageView
      window.fbq('track', 'PageView');

      // Subscribe to Shopify Analytics events and map them to Meta Pixel events
      subscribe('page_viewed', (data) => {
        console.log('[Analytics] Page viewed:', data);
        window.fbq('track', 'PageView');
      });

      subscribe('product_viewed', (data) => {
        console.log('[Analytics] Product viewed:', data);
        const product = data.products?.[0];
        if (product) {
          window.fbq('track', 'ViewContent', {
            content_type: 'product',
            content_ids: [product.id],
            content_name: product.title,
            content_category: product.vendor,
            value: parseFloat(product.price),
            currency: 'USD' // You may need to get the actual currency from your store
          });
        }
      });

      subscribe('collection_viewed', (data) => {
        console.log('[Analytics] Collection viewed:', data);
        window.fbq('track', 'ViewCategory', {
          content_name: data.collection?.handle || '',
          content_category: 'collection'
        });
      });

      subscribe('cart_viewed', (data) => {
        console.log('[Analytics] Cart viewed:', data);
        const cartItems = data.cart?.lines?.nodes || [];
        const contentIds = cartItems.map(item => item.merchandise.id);
        const value = data.cart?.cost?.totalAmount?.amount || '0';

        window.fbq('track', 'ViewCart', {
          content_type: 'product',
          content_ids: contentIds,
          value: parseFloat(value),
          currency: data.cart?.cost?.totalAmount?.currencyCode || 'USD'
        });
      });

      subscribe('cart_updated', (data) => {
        console.log('[Analytics] Cart updated:', data);
        // You can track AddToCart events here if the cart update was an addition
        if (data.prevCart && data.cart) {
          const prevItems = data.prevCart.lines?.nodes || [];
          const currentItems = data.cart.lines?.nodes || [];

          if (currentItems.length > prevItems.length) {
            // Likely an AddToCart event
            const newItems = currentItems.filter(item =>
              !prevItems.find(prev => prev.merchandise.id === item.merchandise.id)
            );

            if (newItems.length > 0) {
              const addedItem = newItems[0];
              window.fbq('track', 'AddToCart', {
                content_type: 'product',
                content_ids: [addedItem.merchandise.id],
                content_name: addedItem.merchandise.product?.title || '',
                value: parseFloat(addedItem.cost?.totalAmount?.amount || '0'),
                currency: addedItem.cost?.totalAmount?.currencyCode || 'USD'
              });
            }
          }
        }
      });

      // Add checkout and order events
      subscribe('checkout_started', (data) => {
        console.log('[Analytics] Checkout started:', data);
        const cart = data.cart;
        if (cart) {
          const cartItems = cart.lines?.nodes || [];
          const contentIds = cartItems.map(item => item.merchandise.id);
          const value = cart.cost?.totalAmount?.amount || '0';

          window.fbq('track', 'InitiateCheckout', {
            content_type: 'product',
            content_ids: contentIds,
            value: parseFloat(value),
            currency: cart.cost?.totalAmount?.currencyCode || 'USD',
            num_items: cartItems.length
          });
        }
      });

      subscribe('payment_info_submitted', (data) => {
        console.log('[Analytics] Payment info submitted:', data);
        // Track payment info being added
        window.fbq('track', 'AddPaymentInfo');
      });

      // Track order viewed events
      subscribe('order_viewed', (data) => {
        console.log('[Analytics] Order viewed:', data);
        const order = data.order;
        if (order) {
          window.fbq('track', 'ViewContent', {
            content_type: 'order',
            content_ids: [order.id],
            value: parseFloat(order.totalPrice?.amount || '0'),
            currency: order.totalPrice?.currencyCode || 'USD'
          });
        }
      });

      // Mark this analytics integration as ready
      ready();
    }

    return () => {
      // Clean up any listeners if needed
      // Nothing specific needs to be cleaned up for Meta Pixel
    };
  }, []);

  return null;
}

/**
 * NOTE: To properly implement third-party analytics, you'll need to:
 * 
 * 1. Add the necessary script tags with nonces to your CSP in entry.server.tsx
 * 2. Initialize your analytics services in this component's useEffect
 * 3. Use the analytics context to subscribe to events or manually publish events
 * 
 * For Meta Pixel integration, make sure to add the following to your CSP in entry.server.tsx:
 * - 'https://connect.facebook.net' to scriptSrc
 * - 'https://www.facebook.com' to connectSrc and imgSrc
 */ 