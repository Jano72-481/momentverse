import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your MomentVerse account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea; text-align: center;">Welcome to MomentVerse</h1>
        <p>Thank you for joining MomentVerse! Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If you didn't create an account with MomentVerse, you can safely ignore this email.</p>
        <p>Best regards,<br>The MomentVerse Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your MomentVerse password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea; text-align: center;">Password Reset Request</h1>
        <p>You requested a password reset for your MomentVerse account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The MomentVerse Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendCertificateEmail(email: string, certificateUrl: string, momentDetails: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your MomentVerse Certificate is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea; text-align: center;">Your Moment is Eternal</h1>
        <p>Congratulations! Your moment has been successfully dedicated to eternity.</p>
        <div style="background: rgba(102, 126, 234, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Moment Details:</h3>
          <p><strong>Start Time:</strong> ${new Date(momentDetails.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> ${new Date(momentDetails.endTime).toLocaleString()}</p>
          <p><strong>Dedication:</strong> ${momentDetails.dedication}</p>
          ${momentDetails.hasStarAddon ? '<p><strong>Star Pairing:</strong> Included</p>' : ''}
          ${momentDetails.hasPremiumCert ? '<p><strong>Certificate:</strong> Premium Design</p>' : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${certificateUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block;">
            Download Certificate
          </a>
        </div>
        <p>Your certificate is now available for download. Share it with friends and family to show your eternal moment!</p>
        <p>Best regards,<br>The MomentVerse Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
} 