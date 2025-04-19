import { useState, useEffect } from 'react';
import { Form, useActionData, useNavigation } from '@remix-run/react';

/**
 * ContactForm component for handling user inquiries
 * 
 * This component renders a form with name, email, and message fields,
 * validates user input, and submits to the server action.
 */
export function ContactForm() {
    // Get form submission state from Remix
    const { state } = useNavigation();
    const actionData = useActionData<{
        error?: string;
        success?: boolean;
        errors?: {
            name?: string;
            email?: string;
            message?: string;
        };
    }>();

    // Local form state for validation
    const [formErrors, setFormErrors] = useState<{
        name?: string;
        email?: string;
        message?: string;
    }>({});

    // Update local errors when server returns validation errors
    useEffect(() => {
        if (actionData?.errors) {
            setFormErrors(actionData.errors);
        }
    }, [actionData]);

    // Form validation handler
    const validateForm = (formData: FormData) => {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        const errors: {
            name?: string;
            email?: string;
            message?: string;
        } = {};

        // Validate name
        if (!name || name.trim() === '') {
            errors.name = 'Name is required';
        }

        // Validate email
        if (!email || email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate message
        if (!message || message.trim() === '') {
            errors.message = 'Message is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        const formData = new FormData(form);

        // If validation fails, prevent form submission
        if (!validateForm(formData)) {
            event.preventDefault();
        }
    };

    // Reset form errors when user starts typing
    const handleInputChange = () => {
        if (Object.keys(formErrors).length > 0) {
            setFormErrors({});
        }
    };

    // Determine if form is submitting
    const isSubmitting = state === 'submitting';

    // Show success message if form was submitted successfully
    if (actionData?.success) {
        return (
            <div className="contact-form-success" role="alert">
                <h3>Thank you for your message!</h3>
                <p>We've received your inquiry and will get back to you as soon as possible.</p>
            </div>
        );
    }

    return (
        <div className="contact-form-container">
            <h2>Get in Touch</h2>
            <p>Have questions about our products or services? Send us a message and we'll get back to you as soon as possible.</p>

            {actionData?.error && (
                <div className="contact-form-error" role="alert">
                    <p>{actionData.error}</p>
                </div>
            )}

            <Form method="post" onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        aria-invalid={formErrors.name ? true : undefined}
                        aria-describedby={formErrors.name ? "name-error" : undefined}
                        onChange={handleInputChange}
                        style={{ color: '#000000' }}
                    />
                    {formErrors.name && (
                        <p className="field-error" id="name-error" role="alert">{formErrors.name}</p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        aria-invalid={formErrors.email ? true : undefined}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                        onChange={handleInputChange}
                        style={{ color: '#000000' }}
                    />
                    {formErrors.email && (
                        <p className="field-error" id="email-error" role="alert">{formErrors.email}</p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="How can we help you?"
                        aria-invalid={formErrors.message ? true : undefined}
                        aria-describedby={formErrors.message ? "message-error" : undefined}
                        onChange={handleInputChange}
                        style={{ color: '#000000' }}
                    ></textarea>
                    {formErrors.message && (
                        <p className="field-error" id="message-error" role="alert">{formErrors.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </Form>
        </div>
    );
} 