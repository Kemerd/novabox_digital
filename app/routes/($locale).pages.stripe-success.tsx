import { type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import React, { useEffect, useState } from 'react';

export const meta: MetaFunction = () => {
    return [{ title: 'Purchase Successful | Novabox LLC' }];
};

/**
 * Stripe Success page component
 * Displays confirmation after successful plan purchase
 * Follows Apple Human Interface Guidelines with clean design
 */
export default function StripeSuccessPage() {
    // Control sequential animation of elements
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Trigger visibility after mount for animations
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="stripe-success-page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
        }}>
            {/* Success checkmark icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                    delay: 0.2
                }}
                style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: '#34C759',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 25px rgba(52, 199, 89, 0.3)'
                }}
            >
                <svg width="40" height="30" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8.5L7.5 15L21 1.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </motion.div>
            
            <motion.div
                className="success-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                    type: 'spring',
                    damping: 20,
                    stiffness: 100,
                    delay: 0.4
                }}
                style={{
                    marginBottom: '2rem'
                }}
            >
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    background: 'linear-gradient(90deg, #007AFF 0%, #34C759 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>Purchase Successful!</h1>
                <p style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.6',
                    opacity: 0.9,
                    maxWidth: '550px',
                }}>Congratulations, you've successfully purchased your plan.</p>
            </motion.div>

            <motion.div 
                className="success-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ 
                    type: 'spring',
                    damping: 20,
                    stiffness: 100,
                    delay: 0.6
                }}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '2rem',
                    width: '100%',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '2rem'
                }}
            >
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    marginBottom: '1rem'
                }}>What's Next?</h2>
                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem',
                    opacity: 0.8
                }}>
                    Your account has been updated with your new plan. You now have access to all the 
                    features included in your subscription. Your receipt has been emailed to you.
                </p>
                
                <div className="action-buttons" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <motion.a 
                        href="/" 
                        className="primary-button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#007AFF',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            boxShadow: '0 5px 15px rgba(0, 122, 255, 0.3)',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            maxWidth: '300px',
                            textAlign: 'center'
                        }}
                    >
                        Return to Dashboard
                    </motion.a>
                    <motion.a 
                        href="/contact" 
                        className="secondary-button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '0.75rem 2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            width: '100%',
                            maxWidth: '300px',
                            textAlign: 'center'
                        }}
                    >
                        Need Help?
                    </motion.a>
                </div>
            </motion.div>
            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{
                    fontSize: '0.95rem',
                    opacity: 0.6,
                    marginTop: '1.5rem'
                }}
            >
                You can close this page now.
            </motion.p>
        </div>
    );
} 