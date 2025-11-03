import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { CompareVersionsSchema } from '@/lib/validations/version.schema';
import { ContentVersionError } from '@/application/errors/content-version.errors';
import { z } from 'zod';

/**
 * API Route: POST /api/versions/compare
 * Compare two versions of content to show differences.
 *
 * Architecture:
 * - Thin controller layer
 * - Validates request body with Zod schema
 * - Delegates to CompareVersionsUseCase
 * - Returns diff information between versions
 *
 * Error Mapping:
 * - 400: Validation errors, INVALID_VERSION_RANGE, CANNOT_COMPARE_SAME_VERSION
 * - 401: Unauthorized (not authenticated)
 * - 404: VERSION_NOT_FOUND, OLD_VERSION_NOT_FOUND, NEW_VERSION_NOT_FOUND
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validationResult = CompareVersionsSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { contentId, oldVersionNumber, newVersionNumber } = validationResult.data;

    // Additional validation: ensure versions are different
    if (oldVersionNumber === newVersionNumber) {
      return NextResponse.json(
        { success: false, message: 'Cannot compare the same version' },
        { status: 400 }
      );
    }

    // TODO: Instantiate use case when application layer is ready
    // const useCase = new CompareVersionsUseCase(new ContentVersionRepositoryPrisma());
    // const comparison = await useCase.execute(contentId, oldVersionNumber, newVersionNumber);

    // TEMPORARY: Return mock response
    return NextResponse.json({
      success: true,
      message: 'Compare versions API route ready - waiting for application layer',
      data: {
        contentId: contentId,
        oldVersion: {
          versionNumber: oldVersionNumber,
          content: `Content from version ${oldVersionNumber}`,
          createdAt: new Date()
        },
        newVersion: {
          versionNumber: newVersionNumber,
          content: `Content from version ${newVersionNumber}`,
          createdAt: new Date()
        },
        changes: {
          additions: 10,
          deletions: 5,
          modifications: 3
        },
        diff: 'Detailed diff would be here'
      }
    });

    // FINAL IMPLEMENTATION (uncomment when use cases ready):
    // return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    // Validation errors already handled above
    
    // Use case errors (uncomment when use cases ready)
    // if (error instanceof Error) {
    //   if (error.message === ContentVersionError.VERSION_NOT_FOUND ||
    //       error.message === ContentVersionError.OLD_VERSION_NOT_FOUND ||
    //       error.message === ContentVersionError.NEW_VERSION_NOT_FOUND) {
    //     return NextResponse.json(
    //       { success: false, message: 'One or more versions not found' },
    //       { status: 404 }
    //     );
    //   }
    //   if (error.message === ContentVersionError.CANNOT_COMPARE_SAME_VERSION) {
    //     return NextResponse.json(
    //       { success: false, message: error.message },
    //       { status: 400 }
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
