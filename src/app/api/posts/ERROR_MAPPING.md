# Post & Comment API Error Mapping Reference

This document provides comprehensive error mapping for Post and Comment API endpoints.
All error enums are defined in `src/application/errors/` and mapped to HTTP status codes in API routes.

## HTTP Status Code Mapping

### 400 Bad Request - Validation & Input Errors
**Post Errors:**
- `INVALID_INPUT` - General validation failure
- `INVALID_TITLE` - Title doesn't meet requirements (3-200 chars)
- `INVALID_CONTENT` - Content doesn't meet requirements (min 10 chars)
- `INVALID_POST_ID` - Post ID format invalid (not UUID)
- `MAX_NESTING_DEPTH_EXCEEDED` - Comment nesting too deep (if applicable)

**Comment Errors:**
- `INVALID_INPUT` - General validation failure
- `INVALID_CONTENT` - Content doesn't meet requirements (min 1 char)
- `INVALID_COMMENT_ID` - Comment ID format invalid (not UUID)
- `MAX_NESTING_DEPTH_EXCEEDED` - Exceeded maximum comment nesting depth

### 401 Unauthorized - Authentication Errors
**All Endpoints:**
- Missing or invalid authentication token
- User not authenticated via Clerk

### 404 Not Found - Resource Not Found Errors
**Post Errors:**
- `POST_NOT_FOUND` - Post with specified ID doesn't exist or is archived
- `COMMUNITY_NOT_FOUND` - Referenced community doesn't exist
- `AUTHOR_NOT_FOUND` - Referenced author doesn't exist

**Comment Errors:**
- `COMMENT_NOT_FOUND` - Comment with specified ID doesn't exist or is archived
- `POST_NOT_FOUND` - Referenced post doesn't exist or is archived
- `PARENT_COMMENT_NOT_FOUND` - Referenced parent comment doesn't exist

### 409 Conflict - State Conflict Errors
**Post Errors:**
- `POST_ALREADY_PUBLISHED` - Attempting to publish already published post
- `POST_ALREADY_ARCHIVED` - Attempting to modify archived post
- `POST_ALREADY_SOLVED` - Attempting to mark already solved post as solved
- `CANNOT_MODIFY_ARCHIVED_POST` - Attempting to modify archived post

**Comment Errors:**
- `COMMENT_ALREADY_ARCHIVED` - Attempting to modify archived comment
- `CANNOT_MODIFY_ARCHIVED_COMMENT` - Attempting to modify archived comment
- `CANNOT_COMMENT_ON_ARCHIVED_POST` - Attempting to comment on archived post

### 500 Internal Server Error - System Errors
**All Endpoints:**
- `INTERNAL_SERVER_ERROR` - Unexpected system error
- Unhandled exceptions
- Database connection failures

## API Endpoint Error Matrix

### Post Endpoints

#### POST /api/posts
| Error | Status | Condition |
|-------|--------|-----------|
| Zod validation | 400 | Invalid request body schema |
| INVALID_TITLE | 400 | Title validation failed |
| INVALID_CONTENT | 400 | Content validation failed |
| COMMUNITY_NOT_FOUND | 404 | Community doesn't exist |
| AUTHOR_NOT_FOUND | 404 | Author doesn't exist |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### GET /api/posts?communityId=xxx
| Error | Status | Condition |
|-------|--------|-----------|
| Missing communityId | 400 | Query param not provided |
| COMMUNITY_NOT_FOUND | 404 | Community doesn't exist |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### GET /api/posts/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_POST_ID | 400 | Invalid ID format |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### PATCH /api/posts/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| Zod validation | 400 | Invalid request body schema |
| INVALID_TITLE | 400 | Title validation failed |
| INVALID_CONTENT | 400 | Content validation failed |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| POST_ALREADY_ARCHIVED | 409 | Post is archived |
| CANNOT_MODIFY_ARCHIVED_POST | 409 | Attempted modification of archived post |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### DELETE /api/posts/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_POST_ID | 400 | Invalid ID format |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| POST_ALREADY_ARCHIVED | 409 | Post already archived |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### POST /api/posts/[id]/publish
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_POST_ID | 400 | Invalid ID format |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| POST_ALREADY_PUBLISHED | 409 | Post already published |
| POST_ALREADY_ARCHIVED | 409 | Post is archived |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### POST /api/posts/[id]/pin
| Error | Status | Condition |
|-------|--------|-----------|
| Zod validation | 400 | Invalid isPinned value |
| INVALID_POST_ID | 400 | Invalid ID format |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| POST_ALREADY_ARCHIVED | 409 | Post is archived |
| CANNOT_MODIFY_ARCHIVED_POST | 409 | Attempted modification of archived post |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### POST /api/posts/[id]/solve
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_POST_ID | 400 | Invalid ID format |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| POST_ALREADY_SOLVED | 409 | Post already marked solved |
| POST_ALREADY_ARCHIVED | 409 | Post is archived |
| CANNOT_MODIFY_ARCHIVED_POST | 409 | Attempted modification of archived post |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

### Comment Endpoints

#### POST /api/comments
| Error | Status | Condition |
|-------|--------|-----------|
| Zod validation | 400 | Invalid request body schema |
| INVALID_CONTENT | 400 | Content validation failed |
| MAX_NESTING_DEPTH_EXCEEDED | 400 | Comment nesting too deep |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| PARENT_COMMENT_NOT_FOUND | 404 | Parent comment doesn't exist |
| CANNOT_COMMENT_ON_ARCHIVED_POST | 409 | Post is archived |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### GET /api/comments?postId=xxx
| Error | Status | Condition |
|-------|--------|-----------|
| Missing postId | 400 | Query param not provided |
| POST_NOT_FOUND | 404 | Post doesn't exist |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### GET /api/comments/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_COMMENT_ID | 400 | Invalid ID format |
| COMMENT_NOT_FOUND | 404 | Comment doesn't exist |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### PATCH /api/comments/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| Zod validation | 400 | Invalid request body schema |
| INVALID_CONTENT | 400 | Content validation failed |
| COMMENT_NOT_FOUND | 404 | Comment doesn't exist |
| COMMENT_ALREADY_ARCHIVED | 409 | Comment is archived |
| CANNOT_MODIFY_ARCHIVED_COMMENT | 409 | Attempted modification of archived comment |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

#### DELETE /api/comments/[id]
| Error | Status | Condition |
|-------|--------|-----------|
| INVALID_COMMENT_ID | 400 | Invalid ID format |
| COMMENT_NOT_FOUND | 404 | Comment doesn't exist |
| COMMENT_ALREADY_ARCHIVED | 409 | Comment already archived |
| Unauthorized | 401 | Not authenticated |
| INTERNAL_SERVER_ERROR | 500 | System error |

## Error Response Format

All error responses follow this consistent structure:

```typescript
{
  success: false,
  message: string,          // Error message (enum value or description)
  errors?: ZodIssue[]      // Optional: Zod validation errors
}
```

## Implementation Notes

1. **Validation**: All validation errors caught by Zod return 400 with detailed error array
2. **Authentication**: Clerk `auth()` helper checks authentication on all endpoints
3. **Soft Delete**: Repository layer filters `deletedAt == null` by default
4. **Error Consistency**: All error enum values mapped consistently across endpoints
5. **Use Case Integration**: Routes delegate to use cases, which throw errors mapped here

## Next Steps

When application layer is ready:
1. Uncomment use case instantiation code in each route
2. Uncomment error handling blocks for use case errors
3. Define error enums in `src/application/errors/post.errors.ts` and `comment.errors.ts`
4. Implement use cases that throw these errors
5. Test error handling with integration tests
