import puppeteer from 'puppeteer'
import QRCode from 'qrcode'
import { prisma } from '@/lib/db'

interface CertificateData {
  momentId: string
  startTime: Date
  endTime: Date
  dedication: string
  hasStarAddon: boolean
  hasPremiumCert: boolean
  userName?: string
  starName?: string
}

export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(
    `${process.env.NEXTAUTH_URL}/moment/${data.momentId}`
  )

  // Create certificate HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>MomentVerse Certificate</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');
        
        body {
          margin: 0;
          padding: 40px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
          color: white;
          min-height: 100vh;
        }
        
        .certificate {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: ${data.hasPremiumCert ? '3px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.2)'};
          border-radius: 20px;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: twinkle 4s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #a0a0a0;
          font-weight: 300;
        }
        
        .main-content {
          text-align: center;
          margin: 40px 0;
        }
        
        .title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ffffff;
        }
        
        .dedication {
          font-size: 18px;
          line-height: 1.6;
          color: #e0e0e0;
          margin: 30px 0;
          font-style: italic;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 40px 0;
          text-align: left;
        }
        
        .detail-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-label {
          font-size: 14px;
          color: #a0a0a0;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
        }
        
        .star-section {
          margin: 30px 0;
          padding: 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 15px;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }
        
        .star-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .star-name {
          font-size: 20px;
          color: #ffffff;
          font-weight: 600;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
        }
        
        .qr-code {
          display: inline-block;
          margin: 20px 0;
        }
        
        .qr-code img {
          width: 120px;
          height: 120px;
          background: white;
          padding: 10px;
          border-radius: 10px;
        }
        
        .certificate-id {
          font-size: 14px;
          color: #a0a0a0;
          margin-top: 10px;
        }
        
        .premium-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          transform: rotate(15deg);
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        ${data.hasPremiumCert ? '<div class="premium-badge">PREMIUM</div>' : ''}
        
        <div class="header">
          <div class="logo">MomentVerse</div>
          <div class="subtitle">Where Time Meets Eternity</div>
        </div>
        
        <div class="main-content">
          <div class="title">Certificate of Dedication</div>
          
          <div class="dedication">
            "${data.dedication}"
          </div>
          
          <div class="details">
            <div class="detail-item">
              <div class="detail-label">Start Time</div>
              <div class="detail-value">${data.startTime.toLocaleString()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">End Time</div>
              <div class="detail-value">${data.endTime.toLocaleString()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Duration</div>
              <div class="detail-value">${Math.round((data.endTime.getTime() - data.startTime.getTime()) / 1000)} seconds</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Dedicated By</div>
              <div class="detail-value">${data.userName || 'Anonymous'}</div>
            </div>
          </div>
          
          ${data.hasStarAddon && data.starName ? `
            <div class="star-section">
              <div class="star-title">⭐ Paired with Star</div>
              <div class="star-name">${data.starName}</div>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <div class="qr-code">
            <img src="${qrCodeDataUrl}" alt="Certificate QR Code" />
          </div>
          <div class="certificate-id">Certificate ID: ${data.momentId}</div>
          <div style="margin-top: 20px; font-size: 14px; color: #a0a0a0;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html)
    
    // Wait for animations to complete
    await page.waitForTimeout(2000)
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })

    return pdf
  } finally {
    await browser.close()
  }
}

export async function assignStarToMoment(momentId: string): Promise<string | null> {
  try {
    // Find an available star (not assigned to any moment)
    const availableStar = await prisma.star.findFirst({
      where: { isAssigned: false }
    })

    if (!availableStar) {
      // If no stars available, create a placeholder
      return null
    }

    // Assign the star to the moment
    await prisma.moment.update({
      where: { id: momentId },
      data: { starId: availableStar.id }
    })

    // Mark star as assigned
    await prisma.star.update({
      where: { id: availableStar.id },
      data: { isAssigned: true }
    })

    return availableStar.name
  } catch (error) {
    console.error('Error assigning star:', error)
    return null
  }
}

export async function generateAndSaveCertificate(momentId: string): Promise<string> {
  try {
    // Get moment data
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        user: true,
        star: true,
        order: true
      }
    })

    if (!moment) {
      throw new Error('Moment not found')
    }

    // Assign star if needed
    let starName: string | undefined
    if (moment.hasStarAddon && !moment.starId) {
      starName = await assignStarToMoment(momentId)
    } else if (moment.star) {
      starName = moment.star.name
    }

    // Generate certificate
    const certificateData: CertificateData = {
      momentId: moment.id,
      startTime: moment.startTime,
      endTime: moment.endTime,
      dedication: moment.dedication || 'A special moment dedicated to eternity',
      hasStarAddon: moment.hasStarAddon,
      hasPremiumCert: moment.hasPremiumCert,
      userName: moment.user?.name || undefined,
      starName
    }

    const pdfBuffer = await generateCertificate(certificateData)

    // Save to file system (in production, you'd save to cloud storage)
    const fileName = `certificate-${momentId}.pdf`
    const filePath = `./public/certificates/${fileName}`
    
    // Ensure directory exists
    const fs = require('fs')
    const path = require('path')
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(filePath, pdfBuffer)

    // Update moment with certificate URL
    await prisma.moment.update({
      where: { id: momentId },
      data: {
        certificateUrl: `/certificates/${fileName}`,
        certificateGenerated: true
      }
    })

    return `/certificates/${fileName}`
  } catch (error) {
    console.error('Error generating certificate:', error)
    throw error
  }
} 