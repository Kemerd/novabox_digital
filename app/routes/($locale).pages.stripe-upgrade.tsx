import { type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

export const meta: MetaFunction = () => {
    return [{ title: 'Plan Upgrade Successful | Novabox LLC' }];
};

/**
 * Stripe Upgrade page component
 * Displays confirmation after successful plan upgrade
 */
export default function StripeUpgradePage() {
    return (
        <div className="stripe-upgrade-page">
            <motion.div 
                className="upgrade-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Upgrade Successful!</h1>
                <p>Congratulations, you've successfully upgraded your plan.</p>
            </motion.div>

            <div className="upgrade-content">
                <motion.div 
                    className="upgrade-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>What's Next?</h2>
                    <p>Your account has been updated with your new plan. You now have access to all the enhanced features included in your upgraded subscription.</p>
                    
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