import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

// Development-friendly email configuration
export async function sendVerificationEmail(email: string, name: string, token: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV] Email verification would be sent to:', email);
    console.log('📧 [DEV] Verification link:', `${process.env.NEXTAUTH_URL}/auth/verify/${token}`);
    return Promise.resolve();
  }
  
  // Production email sending logic would go here
  console.log('📧 Sending verification email to:', email);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV] Password reset email would be sent to:', email);
    console.log('📧 [DEV] Reset link:', `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`);
    return Promise.resolve();
  }
  
  // Production email sending logic would go here
  console.log('📧 Sending password reset email to:', email);
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV] Welcome email would be sent to:', email);
    return Promise.resolve();
  }
  
  // Production email sending logic would go here
  console.log('📧 Sending welcome email to:', email);
}

// Send certificate ready email
export const sendCertificateReadyEmail = async (email: string, name: string, momentId: string, dedication: string) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@momentverse.com',
      to: email,
      subject: 'Your MomentVerse certificate is ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0221; color: white; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #7F00FF 0%, #00E5FF 100%); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 24px;">MV</span>
            </div>
            <h1 style="margin: 0; color: white; font-size: 28px;">Your Certificate is Ready! ⭐</h1>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
              Hi ${name},
            </p>
            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
              Your moment has been successfully dedicated to eternity! Your beautiful certificate is now ready for download.
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-style: italic; font-size: 18px;">
                "${dedication}"
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/moment/${momentId}" style="display: inline-block; background: linear-gradient(135deg, #7F00FF 0%, #00E5FF 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Your Certificate
              </a>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #B3B3B3; font-size: 12px;">
            <p style="margin: 0;">
              Thank you for choosing MomentVerse to preserve your special moment.
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Certificate ready email sent successfully to:', email)
  } catch (error) {
    console.error('Error sending certificate ready email:', error)
    throw new Error('Failed to send certificate ready email')
  }
}

// Email verification helper
export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token }
    })

    if (!user) {
      return { success: false, error: 'Invalid verification token' }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      }
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Error verifying email token:', error)
    return { success: false, error: 'Failed to verify email' }
  }
}

// Password reset helper
export async function verifyPasswordResetToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return { success: false, error: 'Invalid or expired reset token' }
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Error verifying password reset token:', error)
    return { success: false, error: 'Failed to verify reset token' }
  }
} 