import { json, type LoaderFunctionArgs } from '@remix-run/server-runtime';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
// Keep imports for future use but comment them out
// import { ContactForm } from '~/components/ContactForm';
// import { sendEmail, formatContactEmail } from '~/lib/email.server';

export const meta: MetaFunction = () => {
    return [{ title: 'Contact Us | NovaBox Digital' }];
};

/**
 * Server-side loader function to fetch any necessary data
 */
export async function loader() {
    return json({
        contactEmail: 'contact@novabox.digital',
    });
}

// Keep the action function for future use but comment it out
/*
export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Validate form data server-side
    const errors: Record<string, string> = {};

    if (!name || name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (!email || email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!message || message.trim() === '') {
        errors.message = 'Message is required';
    }

    // Return errors if validation fails
    if (Object.keys(errors).length > 0) {
        return json({ error: 'Please correct the errors in the form', errors }, { status: 400 });
    }

    try {
        // Format the email data
        const emailData = formatContactEmail(name, email, message);

        // Send the email using our utility with the storefront from context
        const { success, error } = await sendEmail(context.storefront, emailData);

        if (!success) {
            console.error('Failed to send contact form email:', error);
            return json(
                { error: 'Failed to send your message. Please try again later.' },
                { status: 500 },
            );
        }

        // Return success response
        return json({ success: true });
    } catch (error) {
        console.error('Failed to send contact form email:', error);
        return json(
            { error: 'Failed to send your message. Please try again later.' },
            { status: 500 },
        );
    }
}
*/

/**
 * Contact page component
 * Renders contact information with a form
 */
export default function ContactPage() {
    const { contactEmail } = useLoaderData<typeof loader>();

    return (
        <div className="contact-page">
            <motion.div 
                className="contact-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Contact Us</h1>
                <p>Have a project in mind? Let's discuss how we can help bring your vision to life.</p>
            </motion.div>

            <div className="contact-content">
                <motion.div 
                    className="contact-form-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>Send us a message</h2>
                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Your name"
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Your email address"
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input 
                                type="text" 
                                id="subject" 
                                name="subject" 
                                placeholder="What's this about?"
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                placeholder="Tell us about your project"
                                rows={6}
                                required
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit"
                            className="submit-button"
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>

                <motion.div 
                    className="contact-info-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        
                        <div className="contact-info-item">
                            <h3>Email</h3>
                            <a href={`mailto:${contactEmail}`} className="contact-link">
                                {contactEmail}
                            </a>
                        </div>
                        
                        <div className="contact-info-item">
                            <h3>Hours</h3>
                            <p>Monday - Friday: 9am - 6pm EST</p>
                        </div>
                        
                        <div className="contact-info-item">
                            <h3>Let's Connect</h3>
                            <div className="social-links">
                                <a href="https://twitter.com/novaboxdigital" target="_blank" rel="noopener noreferrer">
                                    Twitter
                                </a>
                                <a href="https://linkedin.com/company/novaboxdigital" target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </a>
                                <a href="https://github.com/novaboxdigital" target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 