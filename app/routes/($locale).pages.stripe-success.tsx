import { type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

export const meta: MetaFunction = () => {
    return [{ title: 'Purchase Successful | Novabox LLC' }];
};

/**
 * Stripe Success page component
 * Displays confirmation after successful plan purchase
 */
export default function StripeSuccessPage() {
    return (
        <div className="stripe-success-page">
            <motion.div 
                className="success-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Purchase Successful!</h1>
                <p>Congratulations, you've successfully purchased your plan.</p>
            </motion.div>

            <div className="success-content">
                <motion.div 
                    className="success-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>What's Next?</h2>
                    <p>Your account has been updated with your new plan. You now have access to all the features included in your subscription.</p>
                    
                    <div className="action-buttons">
                        <a href="/" className="primary-button">
                            Return to Dashboard
                        </a>
                        <a href="/contact" className="secondary-button">
                            Need Help?
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 