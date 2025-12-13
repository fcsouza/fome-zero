import { Resend } from 'resend';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'email-service' });

/**
 * EmailService - Handles all email sending operations
 * Single Responsibility: Email delivery
 */
export class EmailService {
  private readonly resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else if (process.env.NODE_ENV === 'development') {
      logger.warn(
        'RESEND_API_KEY not set. Email service will not send emails in development.'
      );
    }
  }

  /**
   * Send a subscription welcome email
   */
  async sendSubscriptionWelcomeEmail(
    to: string,
    planName: string,
    userName: string
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
          userName,
        },
        'Would send welcome email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Welcome to ${planName} Plan!`,
        html: this.getSubscriptionWelcomeTemplate(planName, userName),
      });
      logger.info({ to, planName }, 'Subscription welcome email sent');
    } catch (error) {
      logger.error(
        { err: error, to, planName },
        'Failed to send subscription welcome email'
      );
      throw error;
    }
  }

  /**
   * Send a subscription update email
   */
  async sendSubscriptionUpdateEmail(
    to: string,
    planName: string,
    userName: string,
    status: string
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
          status,
        },
        'Would send update email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Your ${planName} subscription has been updated`,
        html: this.getSubscriptionUpdateTemplate(planName, userName, status),
      });
      logger.info({ to, planName, status }, 'Subscription update email sent');
    } catch (error) {
      logger.error(
        { err: error, to, planName, status },
        'Failed to send subscription update email'
      );
      throw error;
    }
  }

  /**
   * Send a subscription cancellation email
   */
  async sendSubscriptionCancellationEmail(
    to: string,
    planName: string,
    userName: string,
    cancelAtPeriodEnd: boolean,
    periodEnd?: Date
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
          cancelAtPeriodEnd,
        },
        'Would send cancellation email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Your ${planName} subscription has been canceled`,
        html: this.getSubscriptionCancellationTemplate(
          planName,
          userName,
          cancelAtPeriodEnd,
          periodEnd
        ),
      });
      logger.info(
        { to, planName, cancelAtPeriodEnd },
        'Subscription cancellation email sent'
      );
    } catch (error) {
      logger.error(
        { err: error, to, planName },
        'Failed to send subscription cancellation email'
      );
      throw error;
    }
  }

  /**
   * Send a trial start email
   */
  async sendTrialStartEmail(
    to: string,
    planName: string,
    userName: string,
    trialDays: number,
    trialEnd: Date
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
          userName,
          trialDays,
          trialEnd,
        },
        'Would send trial start email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Your ${trialDays}-day ${planName} trial has started`,
        html: this.getTrialStartTemplate(
          planName,
          userName,
          trialDays,
          trialEnd
        ),
      });
      logger.info({ to, planName, trialDays }, 'Trial start email sent');
    } catch (error) {
      logger.error(
        { err: error, to, planName },
        'Failed to send trial start email'
      );
      throw error;
    }
  }

  /**
   * Send a trial end email
   */
  async sendTrialEndEmail(
    to: string,
    planName: string,
    userName: string
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
        },
        'Would send trial end email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Your ${planName} trial has ended`,
        html: this.getTrialEndTemplate(planName, userName),
      });
      logger.info({ to, planName }, 'Trial end email sent');
    } catch (error) {
      logger.error(
        { err: error, to, planName },
        'Failed to send trial end email'
      );
      throw error;
    }
  }

  /**
   * Send a trial expired email
   */
  async sendTrialExpiredEmail(
    to: string,
    planName: string,
    userName: string
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          planName,
        },
        'Would send trial expired email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: `Your ${planName} trial has expired`,
        html: this.getTrialExpiredTemplate(planName, userName),
      });
      logger.info({ to, planName }, 'Trial expired email sent');
    } catch (error) {
      logger.error(
        { err: error, to, planName },
        'Failed to send trial expired email'
      );
      throw error;
    }
  }

  /**
   * Send an email verification email
   */
  async sendVerificationEmail(
    to: string,
    userName: string,
    verificationUrl: string
  ): Promise<void> {
    if (!this.resend) {
      logger.debug(
        {
          to,
          userName,
        },
        'Would send verification email (RESEND_API_KEY not configured)'
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to,
        subject: 'Verify your email address',
        html: this.getVerificationEmailTemplate(userName, verificationUrl),
      });
      logger.info({ to }, 'Verification email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send verification email');
      throw error;
    }
  }

  /**
   * Get the from email address
   */
  private getFromEmail(): string {
    return process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  /**
   * Get subscription welcome email template
   */
  private getSubscriptionWelcomeTemplate(
    planName: string,
    userName: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Welcome to ${planName} Plan!</h1>
    <p>Hi ${userName},</p>
    <p>Thank you for subscribing to our ${planName} plan! We're excited to have you on board.</p>
    <p>Your subscription is now active, and you have access to all the features included in your plan.</p>
    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get subscription update email template
   */
  private getSubscriptionUpdateTemplate(
    planName: string,
    userName: string,
    status: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Subscription Update</h1>
    <p>Hi ${userName},</p>
    <p>Your ${planName} subscription status has been updated to: <strong>${status}</strong>.</p>
    <p>If you have any questions about this change, please contact our support team.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get subscription cancellation email template
   */
  private getSubscriptionCancellationTemplate(
    planName: string,
    userName: string,
    cancelAtPeriodEnd: boolean,
    periodEnd?: Date
  ): string {
    const periodEndText = periodEnd
      ? `Your subscription will remain active until ${periodEnd.toLocaleDateString()}.`
      : 'Your subscription has been canceled immediately.';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #dc2626;">Subscription Canceled</h1>
    <p>Hi ${userName},</p>
    <p>We're sorry to see you go. Your ${planName} subscription has been canceled.</p>
    ${cancelAtPeriodEnd ? `<p>${periodEndText}</p>` : `<p>${periodEndText}</p>`}
    <p>If you change your mind, you can reactivate your subscription anytime before the end of your billing period.</p>
    <p>We'd love to hear your feedback on how we can improve. Please reply to this email if you'd like to share your thoughts.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get trial start email template
   */
  private getTrialStartTemplate(
    planName: string,
    userName: string,
    trialDays: number,
    trialEnd: Date
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Your ${trialDays}-Day Trial Has Started!</h1>
    <p>Hi ${userName},</p>
    <p>Great news! Your ${trialDays}-day free trial for the ${planName} plan has started.</p>
    <p>Your trial will end on ${trialEnd.toLocaleDateString()}. After that, your subscription will automatically continue unless you cancel.</p>
    <p>Enjoy exploring all the features included in your plan!</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get trial end email template
   */
  private getTrialEndTemplate(planName: string, userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Your Trial Has Ended</h1>
    <p>Hi ${userName},</p>
    <p>Your ${planName} trial period has ended. Your subscription is now active and billing has begun.</p>
    <p>Thank you for continuing with us! We're excited to have you as a paying customer.</p>
    <p>If you have any questions, please don't hesitate to reach out.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get trial expired email template
   */
  private getTrialExpiredTemplate(planName: string, userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #dc2626;">Trial Expired</h1>
    <p>Hi ${userName},</p>
    <p>Your ${planName} trial period has expired without conversion to a paid subscription.</p>
    <p>We're sorry to see you go. If you'd like to come back, you can always subscribe again at any time.</p>
    <p>We'd love to hear your feedback on how we can improve. Please reply to this email if you'd like to share your thoughts.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get email verification email template
   */
  private getVerificationEmailTemplate(
    userName: string,
    verificationUrl: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Verify Your Email Address</h1>
    <p>Hi ${userName},</p>
    <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email Address</a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
    <p>This verification link will expire in 1 hour.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>
    `.trim();
  }
}

export const emailService = new EmailService();
