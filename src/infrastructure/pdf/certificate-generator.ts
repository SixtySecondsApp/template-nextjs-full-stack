/**
 * Certificate Generator Implementation
 * Uses PDFKit to generate professional certificate PDFs
 *
 * V1 Implementation: Basic template without customisation
 * - Standard A4 size certificate
 * - Professional typography with serif/sans-serif fonts
 * - Simple border decoration
 * - No logo or custom branding (deferred to V2)
 */

import * as PDFDocument from "pdfkit";
import { IPdfGenerator, CertificateData } from "./pdf.port";
import { promises as fs } from "fs";

/**
 * Certificate Generator using PDFKit
 * Implements IPdfGenerator port interface
 */
export class CertificateGenerator implements IPdfGenerator {
  /**
   * Generate a certificate as a PDF buffer
   * Creates an in-memory PDF document with professional formatting
   */
  async generateCertificate(data: CertificateData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Create PDF document (A4 size, 50pt margins)
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];

      // Collect data chunks as they are written
      doc.on("data", (chunk) => chunks.push(chunk));

      // Resolve with complete buffer when finished
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Reject on any errors
      doc.on("error", reject);

      try {
        // Draw decorative border (20pt inset from edges)
        doc
          .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
          .lineWidth(2)
          .stroke("#2c3e50");

        // Inner border (30pt inset)
        doc
          .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
          .lineWidth(1)
          .stroke("#95a5a6");

        // Header: "CERTIFICATE OF COMPLETION"
        doc
          .fontSize(32)
          .font("Helvetica-Bold")
          .fillColor("#2c3e50")
          .text("CERTIFICATE OF COMPLETION", 50, 120, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Decorative line under header
        doc
          .moveTo(150, 170)
          .lineTo(doc.page.width - 150, 170)
          .lineWidth(1)
          .stroke("#3498db");

        // User name (large, prominent)
        doc
          .fontSize(42)
          .font("Times-Bold")
          .fillColor("#2c3e50")
          .text(data.userName, 50, 220, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Body text: "has successfully completed the"
        doc
          .fontSize(18)
          .font("Helvetica")
          .fillColor("#34495e")
          .text("has successfully completed the", 50, 300, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Course name (emphasised)
        doc
          .fontSize(28)
          .font("Times-Italic")
          .fillColor("#2c3e50")
          .text(data.courseName, 50, 350, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Instructor information
        doc
          .fontSize(16)
          .font("Helvetica")
          .fillColor("#34495e")
          .text(`Instructed by ${data.instructorName}`, 50, 450, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Issue date (formatted in UK English style)
        const formattedDate = data.issuedAt.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        doc
          .fontSize(14)
          .font("Helvetica")
          .text(`Issued on ${formattedDate}`, 50, 500, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Decorative line above verification code
        doc
          .moveTo(150, 650)
          .lineTo(doc.page.width - 150, 650)
          .lineWidth(0.5)
          .stroke("#bdc3c7");

        // Verification code (small, monospace at bottom)
        doc
          .fontSize(10)
          .font("Courier")
          .fillColor("#7f8c8d")
          .text(`Verification Code: ${data.verificationCode}`, 50, 670, {
            align: "center",
            width: doc.page.width - 100,
          });

        // Finalise the PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Save certificate directly to file
   * Useful for testing and local development
   * Production use should prefer generateCertificate() + S3 upload
   */
  async saveCertificateToPdf(
    data: CertificateData,
    filePath: string
  ): Promise<string> {
    try {
      // Generate PDF buffer
      const pdfBuffer = await this.generateCertificate(data);

      // Write to file system
      await fs.writeFile(filePath, pdfBuffer);

      return filePath;
    } catch (error) {
      throw new Error(
        `Failed to save certificate to ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
