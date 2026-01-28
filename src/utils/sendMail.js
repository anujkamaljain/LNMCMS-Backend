/**
 * Brevo Email Service
 * 
 * Email service for sending transactional emails via Brevo API.
 * Replaces the previous nodemailer + Gmail implementation.
 */

// Brevo API configuration
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Sender configuration
const DEFAULT_SENDER = {
  email: process.env.EMAIL_USER || 'noreply@lnmcms.com',
  name: 'LNM Complaint Portal',
};

/**
 * Send an email using Brevo API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendMail = async ({ to, subject, text }) => {
  if (!BREVO_API_KEY) {
    console.error('Brevo API key not configured');
    throw new Error('Email service not configured');
  }

  try {
    // Convert plain text to basic HTML (preserve line breaks)
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 24px 32px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                                LNM Complaint Portal
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px; background-color: #ffffff; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">
                            <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6; white-space: pre-line;">
${text}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 32px; background-color: #f9f9f9; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0; font-size: 13px; color: #666666; text-align: center;">
                                This email was sent by LNM Complaint Portal. If you didn't expect this email, you can safely ignore it.
                            </p>
                            <p style="margin: 12px 0 0 0; font-size: 12px; color: #999999; text-align: center;">
                                © ${new Date().getFullYear()} LNM Complaint Portal. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: DEFAULT_SENDER,
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    console.log(`Email sent successfully to ${to}, messageId: ${data.messageId}`);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = sendMail;
