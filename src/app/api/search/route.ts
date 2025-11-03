import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SearchQuerySchema } from "@/lib/validations/notification.schema";
import { GlobalSearchUseCase } from "@/application/use-cases/search/global-search.usecase";
import { SearchError } from "@/application/errors/search.errors";
import { PostgresSearchAdapter } from "@/infrastructure/search/postgres-search.adapter";

/**
 * API Route: GET /api/search?query=xxx&communityId=xxx
 * Global search across posts, comments, and users within a community.
 *
 * Architecture:
 * - Thin controller layer - validation and orchestration only
 * - Delegates business logic to GlobalSearchUseCase
 * - Uses Clerk for authentication
 * - Returns search results as DTOs
 *
 * Error Mapping:
 * - 400: Validation errors (Zod), QUERY_TOO_SHORT, QUERY_TOO_LONG, INVALID_INPUT
 * - 401: Unauthorized (not authenticated)
 * - 404: INVALID_COMMUNITY
 * - 500: INTERNAL_SERVER_ERROR
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const communityId = searchParams.get("communityId");

    if (!query || !communityId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing query or communityId parameter",
        },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validatedData = SearchQuerySchema.parse({ query, communityId });

    // Instantiate use case with search adapter
    const searchAdapter = new PostgresSearchAdapter();
    const useCase = new GlobalSearchUseCase(searchAdapter);

    // Execute search (pass userId for future personalisation)
    const results = await useCase.execute(
      validatedData.query,
      validatedData.communityId,
      userId
    );

    // Return search results
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    // Use case errors
    if (error instanceof Error) {
      if (error.message === SearchError.QUERY_TOO_SHORT) {
        return NextResponse.json(
          { success: false, message: "Query must be at least 2 characters" },
          { status: 400 }
        );
      }
      if (error.message === SearchError.INVALID_COMMUNITY) {
        return NextResponse.json(
          { success: false, message: "Invalid community ID" },
          { status: 404 }
        );
      }
      if (error.message === SearchError.SEARCH_FAILED) {
        return NextResponse.json(
          { success: false, message: "Search operation failed" },
          { status: 500 }
        );
      }
    }

    // Internal server error
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
