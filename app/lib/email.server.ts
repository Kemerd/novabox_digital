/**
 * Email utility for sending contact form submissions
 * 
 * This module provides functionality to send emails using Shopify's Admin API
 * or can be extended to use other email services like SendGrid, Nodemailer, etc.
 */

import type { Storefront } from '@shopify/hydrogen';

/**
 * Interface for email data
 */
interface EmailData {
    to: string;
    from: string;
    subject: string;
    body: string;
    replyTo?: string;
}

/**
 * Interface for Shopify GraphQL response
 */
interface ShopifyGraphQLResponse {
    data?: {
        emailSend?: {
            success: boolean;
            userErrors: Array<{
                field: string;
                message: string;
            }>;
        };
    };
    errors?: Array<{
        message: string;
    }>;
}

/**
 * Send an email using Shopify's Admin API
 * 
 * This function sends an email using the Shopify Admin API.
 * 
 * @param storefront - The Shopify storefront instance
 * @param emailData - The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(
    storefront: Storefront,
    emailData: EmailData,
): Promise<{ success: boolean; error?: string }> {
    try {
        // Get the shop domain from the storefront
        const shopDomain = storefront.getShopifyDomain();

        // For the access token, we need to use the one from the environment
        // This would be passed from the context in the route action

        // Construct the GraphQL mutation for sending an email
        const mutation = `
            mutation sendEmail($input: EmailInput!) {
                emailSend(input: $input) {
                    success
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        // Prepare the variables for the mutation
        const variables = {
            input: {
                to: emailData.to,
                from: emailData.from,
                subject: emailData.subject,
                body: emailData.body,
                replyTo: emailData.replyTo || emailData.from,
            },
        };

        // Make the API request to Shopify Admin API
        // We'll use the storefront's fetch method which handles authentication
        const result = await storefront.mutate(mutation, {
            variables,
        }) as ShopifyGraphQLResponse;

        // Check for errors in the response
        if (result.errors && result.errors.length > 0) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        if (result.data?.emailSend?.userErrors && result.data.emailSend.userErrors.length > 0) {
            throw new Error(`Email send errors: ${JSON.stringify(result.data.emailSend.userErrors)}`);
        }

        // Log success for debugging
        console.log('Email sent successfully via Shopify Admin API');

        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * Format a contact form submission as an email
 * 
 * @param name - The name of the person submitting the form
 * @param email - The email of the person submitting the form
 * @param message - The message from the person submitting the form
 * @returns Formatted email data
 */
export function formatContactEmail(
    name: string,
    email: string,
    message: string,
): EmailData {
    const subject = `Contact Form Submission from ${name}`;
    const body = `
Name: ${name}
Email: ${email}

Message:
${message}
  `;

    return {
        to: 'support@novabox.works', // The destination email address
        from: 'no-reply@novabox.works', // The sender email address (must be verified in your email service)
        subject,
        body,
        replyTo: email, // Set reply-to as the submitter's email
    };
} 