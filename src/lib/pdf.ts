import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import { writeFileSync } from 'fs'
import { join } from 'path'
// @ts-ignore
import type * as PDFKit from 'pdfkit'

export async function generateCertificate({
  momentId,
  startTime,
  endTime,
  dedication,
  userName,
  starName,
  isPremium = false,
}: {
  momentId: string
  startTime: Date
  endTime: Date
  dedication?: string
  userName: string
  starName?: string
  isPremium?: boolean
}) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  })

  // Background
  doc.rect(0, 0, doc.page.width, doc.page.height)
  doc.fill(isPremium ? '#FFF8DC' : '#FFFFFF')
  doc.stroke()

  // Border
  if (isPremium) {
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    doc.strokeColor('#DAA520')
    doc.lineWidth(3)
    doc.stroke()
  }

  // Header
  doc.fontSize(36)
  doc.font('Helvetica-Bold')
  doc.fillColor('#1F2937')
  doc.text('Certificate of Time Dedication', doc.page.width / 2, 80, {
    align: 'center',
  })

  // Subtitle
  doc.fontSize(18)
  doc.font('Helvetica')
  doc.fillColor('#6B7280')
  doc.text('MomentVerse', doc.page.width / 2, 130, {
    align: 'center',
  })

  // Certificate number
  doc.fontSize(14)
  doc.text(`Certificate #${momentId}`, doc.page.width / 2, 160, {
    align: 'center',
  })

  // Main content
  const centerY = doc.page.height / 2
  const leftX = 100
  const rightX = doc.page.width - 300

  // Left side - Time details
  doc.fontSize(16)
  doc.font('Helvetica-Bold')
  doc.fillColor('#1F2937')
  doc.text('Time Dedicated:', leftX, centerY - 60)

  doc.fontSize(14)
  doc.font('Helvetica')
  doc.fillColor('#374151')
  doc.text(`Start: ${startTime.toLocaleString()}`, leftX, centerY - 30)
  doc.text(`End: ${endTime.toLocaleString()}`, leftX, centerY - 10)
  
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationSeconds = Math.floor(durationMs / 1000)
  doc.text(`Duration: ${durationSeconds} seconds`, leftX, centerY + 10)

  // Right side - Dedication
  if (dedication) {
    doc.fontSize(16)
    doc.font('Helvetica-Bold')
    doc.fillColor('#1F2937')
    doc.text('Dedication:', rightX, centerY - 60)

    doc.fontSize(14)
    doc.font('Helvetica')
    doc.fillColor('#374151')
    doc.text(dedication, rightX, centerY - 30, {
      width: 250,
      align: 'left',
    })
  }

  // Star information
  if (starName) {
    doc.fontSize(16)
    doc.font('Helvetica-Bold')
    doc.fillColor('#1F2937')
    doc.text('Paired Star:', leftX, centerY + 60)

    doc.fontSize(14)
    doc.font('Helvetica')
    doc.fillColor('#374151')
    doc.text(starName, leftX, centerY + 90)
  }

  // Footer
  doc.fontSize(12)
  doc.fillColor('#6B7280')
  doc.text(`Issued to: ${userName}`, 100, doc.page.height - 100)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, doc.page.height - 80)

  // QR Code
  const qrCodeData = `${process.env.NEXTAUTH_URL}/moment/${momentId}`
  const qrCodeSvg = await QRCode.toString(qrCodeData, { type: 'svg' })
  
  // For simplicity, we'll add a placeholder for QR code
  doc.rect(doc.page.width - 150, doc.page.height - 150, 100, 100)
  doc.strokeColor('#D1D5DB')
  doc.stroke()
  doc.fontSize(10)
  doc.text('QR Code', doc.page.width - 100, doc.page.height - 100, {
    align: 'center',
  })

  // Premium seal
  if (isPremium) {
    doc.circle(doc.page.width - 100, 100, 30)
    doc.fillColor('#DAA520')
    doc.fill()
    doc.fontSize(12)
    doc.fillColor('#FFFFFF')
    doc.text('PREMIUM', doc.page.width - 100, 100, {
      align: 'center',
    })
  }

  return doc
}

export async function saveCertificate(doc: PDFKit.PDFDocument, momentId: string): Promise<string> {
  const chunks: Buffer[] = []
  
  doc.on('data', (chunk: Buffer) => {
    chunks.push(chunk)
  })

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks)
      const filePath = join(process.cwd(), 'public', 'certs', `${momentId}.pdf`)
      writeFileSync(filePath, pdfBuffer)
      resolve(`/certs/${momentId}.pdf`)
    })

    doc.on('error', reject)
    doc.end()
  })
} 