import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ContentVersionError } from '@/application/errors/content-version.errors';

/**
 * API Route: GET /api/versions/[contentId]/[versionNumber]
 * Get a specific version of content.
 *
 * Architecture:
 * - Thin controller layer
 * - Validates path parameters
 * - Delegates to GetVersionUseCase
 *
 * Error Mapping:
 * - 400: Invalid version number
 * - 401: Unauthorized (not authenticated)
 * - 404: VERSION_NOT_FOUND, CONTENT_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string; versionNumber: string }> }
) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract and validate path parameters
    const { contentId, versionNumber } = await params;
    const versionNum = parseInt(versionNumber, 10);

    if (isNaN(versionNum) || versionNum < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid version number. Must be a positive integer.' },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new GetVersionUseCase(new ContentVersionRepositoryPrisma());
    // const version = await useCase.execute(contentId, versionNum);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: 'Get specific version API route ready - waiting for application layer',
      data: {
        id: `version-${versionNum}`,
        contentId: contentId,
        versionNumber: versionNum,
        content: `Version ${versionNum} content`,
        createdAt: new Date(),
        createdBy: userId
      }
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: version });
  } catch (error) {
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === ContentVersionError.VERSION_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: 'Version not found' },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === ContentVersionError.CONTENT_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: 'Content not found' },
    //       { status: 404 }
    //     );
    //   }
    // }

    // Internal server error
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
