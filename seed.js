require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const logger = require('./src/utils/logger');

/**
 * Seed Script — populates the knowledge base with domain documents.
 *
 * WHY these documents?
 * They cover a realistic SaaS/e-commerce company policy knowledge base.
 * The topics are distinct enough to test retrieval across different questions.
 *
 * Run with: npm run seed
 */

const seedDocuments = [
  {
    title: 'Refund and Return Policy',
    content: `Our refund and return policy is designed to ensure customer satisfaction.
    
    Refund Eligibility:
    - Products can be returned within 30 days of purchase for a full refund.
    - Refunds are processed within 5-7 business days after we receive the returned item.
    - Digital products and software licenses are non-refundable once activated.
    - Items must be in original condition with all packaging intact.
    
    How to Request a Refund:
    - Contact our support team at support@example.com with your order number.
    - Our team will send a prepaid return shipping label within 24 hours.
    - Once the item is received and inspected, the refund is issued to your original payment method.
    
    Partial Refunds:
    - Items returned after 30 days but within 60 days may receive a 50% partial refund.
    - Damaged or incomplete returns may result in a deduction from the refund amount.
    
    Exchanges:
    - Free exchanges are available within 30 days for size or color issues.
    - Contact support to initiate an exchange.`,
    tags: ['refund', 'return', 'policy', 'money-back', 'exchange', 'shipping'],
  },
  {
    title: 'Subscription Plans and Pricing',
    content: `We offer three subscription tiers to meet different needs.
    
    Free Plan:
    - Up to 5 projects
    - 1 GB storage
    - Community support only
    - Basic analytics dashboard
    - Limited to 3 team members
    
    Pro Plan ($29/month or $290/year):
    - Unlimited projects
    - 50 GB storage
    - Priority email support (response within 4 hours)
    - Advanced analytics and reporting
    - Up to 15 team members
    - API access with 10,000 calls/month
    - Custom integrations
    
    Enterprise Plan (Custom pricing):
    - Unlimited everything
    - Dedicated account manager
    - 24/7 phone and email support
    - SLA guarantee of 99.9% uptime
    - SSO (Single Sign-On) support
    - Unlimited API calls
    - On-premise deployment option
    - Custom data retention policies
    
    Billing:
    - Annual plans receive a 20% discount compared to monthly billing.
    - All plans include a 14-day free trial. No credit card required.
    - You can upgrade or downgrade your plan at any time.`,
    tags: ['pricing', 'subscription', 'plans', 'billing', 'enterprise', 'pro', 'free', 'api'],
  },
  {
    title: 'Data Privacy and Security Policy',
    content: `We take data privacy and security seriously and are fully GDPR compliant.
    
    Data We Collect:
    - Account information: name, email address, billing details
    - Usage data: features used, login times, session duration
    - Technical data: IP address, browser type, device information
    - Communications: support tickets, emails, chat logs
    
    How We Use Your Data:
    - To provide and improve our services
    - To send transactional emails (receipts, password resets)
    - To send product updates (you can opt out anytime)
    - We never sell your data to third parties
    
    Data Retention:
    - Active account data is retained for the duration of your subscription.
    - After account deletion, data is purged within 30 days.
    - Backup copies are fully deleted within 90 days.
    
    Security Measures:
    - All data is encrypted at rest using AES-256 encryption.
    - All data in transit is protected by TLS 1.3.
    - We conduct quarterly third-party security audits.
    - Employee access to customer data requires two-factor authentication.
    
    Your Rights (GDPR):
    - Right to access: Request a copy of all data we hold about you.
    - Right to erasure: Request deletion of your account and data.
    - Right to portability: Export your data in JSON or CSV format.
    - Submit privacy requests to privacy@example.com.`,
    tags: ['privacy', 'security', 'gdpr', 'data', 'encryption', 'compliance', 'deletion'],
  },
  {
    title: 'Technical Support and Troubleshooting Guide',
    content: `Our support team is here to help you resolve any technical issues.
    
    Support Channels:
    - Live Chat: Available Monday–Friday, 9 AM–6 PM EST (Pro and Enterprise plans)
    - Email: support@example.com — response within 24 hours (Free), 4 hours (Pro), 1 hour (Enterprise)
    - Phone: 1-800-EXAMPLE — Enterprise plan only, 24/7 availability
    - Help Center: docs.example.com — self-service documentation and video tutorials
    
    Common Issues and Solutions:
    
    1. Login Problems:
       - Clear your browser cache and cookies and try again.
       - Use the "Forgot Password" link to reset your password.
       - Check if your account has been locked due to 5 failed login attempts (unlocks after 15 minutes).
    
    2. Slow Performance:
       - Check our status page at status.example.com for ongoing incidents.
       - Try using a different browser or disabling extensions.
       - Ensure your internet connection is stable.
    
    3. API Integration Issues:
       - Verify your API key is active in the dashboard under Settings > API.
       - Check you are not exceeding your plan's rate limits.
       - Review API documentation at docs.example.com/api.
    
    4. Payment Failures:
       - Ensure your card details are up to date in Billing settings.
       - Contact your bank if the issue persists.
       - We accept Visa, Mastercard, and PayPal.
    
    Escalation:
    - If your issue is not resolved within 48 hours, request escalation to a senior engineer via email.`,
    tags: ['support', 'troubleshooting', 'help', 'login', 'api', 'performance', 'technical'],
  },
  {
    title: 'Getting Started — Onboarding Guide',
    content: `Welcome! This guide will help you get up and running in under 10 minutes.
    
    Step 1: Create Your Account
    - Visit app.example.com and click "Sign Up".
    - Enter your name, work email, and a strong password.
    - Verify your email address by clicking the link we send you.
    
    Step 2: Set Up Your Workspace
    - Choose a workspace name (this becomes your team's URL: yourname.example.com).
    - Invite team members by entering their email addresses.
    - Assign roles: Admin, Editor, or Viewer.
    
    Step 3: Create Your First Project
    - Click "New Project" from the dashboard.
    - Choose a template or start from scratch.
    - Add a project name, description, and deadline.
    
    Step 4: Integrate Your Tools
    - Connect to Slack for real-time notifications.
    - Connect to GitHub for automatic deployments.
    - Connect to Google Drive to sync files.
    - All integrations are found under Settings > Integrations.
    
    Step 5: Explore the Dashboard
    - The main dashboard shows project health, team activity, and upcoming deadlines.
    - Use the search bar (Ctrl/Cmd + K) to find anything quickly.
    - Customize your notification preferences under Settings > Notifications.
    
    Tips for Success:
    - Use keyboard shortcuts to speed up your workflow (see Help > Shortcuts).
    - Watch our 5-minute intro video at docs.example.com/quickstart.
    - Join our community forum to ask questions and share tips.`,
    tags: ['onboarding', 'getting-started', 'setup', 'workspace', 'integration', 'account', 'quickstart'],
  },
  {
    title: 'API Rate Limits and Usage Guidelines',
    content: `Our API is designed for reliability and fair usage across all customers.
    
    Rate Limits by Plan:
    - Free Plan: 100 API calls/day, max 10 calls/minute
    - Pro Plan: 10,000 API calls/month, max 60 calls/minute
    - Enterprise Plan: Unlimited calls, custom rate limits available
    
    Rate Limit Headers:
    Every API response includes these headers:
    - X-RateLimit-Limit: your total allowed calls per window
    - X-RateLimit-Remaining: calls remaining in current window
    - X-RateLimit-Reset: Unix timestamp when the window resets
    
    When You Exceed Limits:
    - You will receive a 429 Too Many Requests response.
    - Wait until the reset timestamp before making more calls.
    - Consider upgrading your plan if you regularly hit limits.
    
    Best Practices:
    - Implement exponential backoff when you receive 429 or 503 errors.
    - Cache API responses where possible to reduce call volume.
    - Use webhooks instead of polling for real-time updates.
    - Batch API requests when the endpoint supports it.
    
    Authentication:
    - All API requests require a Bearer token in the Authorization header.
    - Generate API keys under Settings > API Keys.
    - Rotate your API keys every 90 days for security.
    - Never expose API keys in client-side code or public repositories.
    
    Webhooks:
    - Configure webhooks at Settings > Webhooks.
    - We support up to 10 webhook endpoints per workspace.
    - Payloads are signed with HMAC-SHA256 for verification.`,
    tags: ['api', 'rate-limit', 'authentication', 'webhook', 'developer', 'integration', 'bearer-token'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing documents before seeding (idempotent)
    await Document.deleteMany({});
    logger.info('Cleared existing documents');

    // Insert all seed documents
    const inserted = await Document.insertMany(seedDocuments);
    logger.info(`Successfully seeded ${inserted.length} documents`);

    // Print a summary
    inserted.forEach((doc) => {
      logger.info(`  ✓ [${doc._id}] ${doc.title}`);
    });

  } catch (error) {
    logger.error('Seed failed', { error: error.message });
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
