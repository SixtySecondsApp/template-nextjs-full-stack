/**
 * GET /api/billing/invoices
 * Get user's billing invoices from Stripe
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Replace with actual use case call
    // const getBillingInvoicesUseCase = new GetBillingInvoicesUseCase(...)
    // const result = await getBillingInvoicesUseCase.execute({ userId })

    // Mock response for development
    const mockInvoices = [
      {
        id: "inv_001",
        invoiceNumber: "INV-2025-001",
        amount: 2900, // $29.00
        status: "PAID" as const,
        invoiceUrl: "https://invoice.stripe.com/i/acct_test/inv_001",
        invoicePdf: "https://invoice.stripe.com/i/acct_test/inv_001/pdf",
        paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "inv_002",
        invoiceNumber: "INV-2025-002",
        amount: 2900, // $29.00
        status: "PAID" as const,
        invoiceUrl: "https://invoice.stripe.com/i/acct_test/inv_002",
        invoicePdf: "https://invoice.stripe.com/i/acct_test/inv_002/pdf",
        paidAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "inv_003",
        invoiceNumber: "INV-2025-003",
        amount: 2900, // $29.00
        status: "PENDING" as const,
        invoiceUrl: null,
        invoicePdf: null,
        paidAt: null,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockInvoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get invoices",
      },
      { status: 500 }
    );
  }
}
