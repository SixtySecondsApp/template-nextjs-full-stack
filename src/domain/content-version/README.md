# ContentVersion Domain Entity

Pure domain entity representing immutable snapshots of post and comment content for version history and restore functionality.

## Purpose

The `ContentVersion` entity serves as an audit trail and version history system for user-generated content in the Sixty Community OS. It captures point-in-time snapshots of post and comment content, enabling:

- **Version History**: Track all changes to posts and comments over time
- **Content Restoration**: Restore previous versions of content
- **Audit Trail**: Maintain complete record of content modifications
- **Compliance**: Meet regulatory requirements for content tracking

## Architecture

Follows hexagonal architecture principles:

- **Pure Domain Logic**: No framework dependencies (Next.js, Prisma, etc.)
- **Immutable**: Content versions cannot be modified after creation
- **Factory Methods**: `create()` for new versions, `reconstitute()` for persistence loading
- **Validation**: Built-in validation for content, version numbers, and content types
- **Polymorphic Reference**: `contentId` references either `Post.id` or `Comment.id` based on `contentType`

## Business Rules

1. **Immutability**: Content versions are immutable once created - no update methods
2. **Version Numbers**: Start at 1, increment sequentially per content item
3. **Content Snapshot**: Stores complete HTML content at specific point in time
4. **Polymorphic Reference**: `contentId` + `contentType` determine the parent entity
5. **No Deletion**: Versions should never be deleted (permanent audit trail)
6. **Sequential Tracking**: Each content item maintains its own version sequence

## Entity Structure

```typescript
export class ContentVersion {
  private readonly id: string;              // Unique version identifier
  private readonly contentType: ContentType; // POST or COMMENT
  private readonly contentId: string;       // Parent Post.id or Comment.id
  private readonly content: string;         // HTML content snapshot
  private readonly versionNumber: number;   // Sequential version number (1, 2, 3...)
  private readonly createdAt: Date;         // Version creation timestamp
}
```

## Usage Examples

### Creating Version Snapshot from Post

```typescript
import { Post } from "@/domain/post/post.entity";

// Get current version number from repository
const currentVersionNumber = await contentVersionRepository
  .getLatestVersionNumber("post-123");

const nextVersionNumber = (currentVersionNumber ?? 0) + 1;

// Create version snapshot before updating post
const version = post.createVersionSnapshot(nextVersionNumber);

// Save version to repository
await contentVersionRepository.create(version);

// Now safe to update post content
post.update({ content: "<p>Updated content</p>" });
await postRepository.update(post);
```

### Creating Version Snapshot from Comment

```typescript
import { Comment } from "@/domain/comment/comment.entity";

// Get current version number
const currentVersionNumber = await contentVersionRepository
  .getLatestVersionNumber("comment-456");

const nextVersionNumber = (currentVersionNumber ?? 0) + 1;

// Create version snapshot before updating comment
const version = comment.createVersionSnapshot(nextVersionNumber);

// Save version to repository
await contentVersionRepository.create(version);

// Update comment content
comment.update("<p>Updated comment</p>");
await commentRepository.update(comment);
```

### Listing Version History

```typescript
// Get all versions for a post
const postVersions = await contentVersionRepository
  .findByContentId("post-123", ContentType.POST);

// Display version history
postVersions.forEach((version) => {
  console.log(
    `Version ${version.getVersionNumber()} - ${version.getCreatedAt()}`
  );
  console.log(version.getContent());
});
```

### Restoring Previous Version

```typescript
// Get specific version
const version = await contentVersionRepository
  .findByContentIdAndVersionNumber("post-123", 3);

if (!version) {
  throw new Error("Version not found");
}

// Restore post content from version
const post = await postRepository.findById("post-123");
if (!post) {
  throw new Error("Post not found");
}

// Create new version before restoring (capture current state)
const currentVersionNumber = await contentVersionRepository
  .getLatestVersionNumber("post-123");
const newVersion = post.createVersionSnapshot(currentVersionNumber + 1);
await contentVersionRepository.create(newVersion);

// Restore content from selected version
post.update({ content: version.getContent() });
await postRepository.update(post);
```

## Integration with Post and Comment

### Post Entity Integration

The `Post` entity provides a convenience method for creating version snapshots:

```typescript
public createVersionSnapshot(versionNumber: number): ContentVersion {
  return ContentVersion.create({
    id: crypto.randomUUID(),
    contentType: ContentType.POST,
    contentId: this.id,
    content: this.content,
    versionNumber,
  });
}
```

**When to create versions**:
- Before `post.update()` is called
- On initial `post.publish()` (version 1)
- Before content restoration from previous version

### Comment Entity Integration

The `Comment` entity provides identical version snapshot functionality:

```typescript
public createVersionSnapshot(versionNumber: number): ContentVersion {
  return ContentVersion.create({
    id: crypto.randomUUID(),
    contentType: ContentType.COMMENT,
    contentId: this.id,
    content: this.content,
    versionNumber,
  });
}
```

**When to create versions**:
- Before `comment.update()` is called
- On initial comment creation (version 1)
- Before content restoration from previous version

## Immutability Guarantees

The `ContentVersion` entity enforces immutability through:

1. **Private Constructor**: Cannot be instantiated directly
2. **Factory Methods Only**: `create()` and `reconstitute()` are the only entry points
3. **Readonly Fields**: All properties are `private readonly`
4. **No Setters**: Only getter methods provided, no modification methods
5. **No Business Logic**: Pure value object with validation only

## Version Number Semantics

- **Start at 1**: First version of any content is version 1
- **Sequential**: Each subsequent version increments by 1
- **Per Content**: Each post/comment maintains its own sequence
- **No Gaps**: Version numbers should be continuous (1, 2, 3, 4...)
- **Repository Responsibility**: Repository determines next version number

## Validation Rules

The entity validates:

1. **Content**: Cannot be empty or whitespace-only
2. **Version Number**: Must be integer ≥ 1
3. **Content Type**: Must be valid ContentType enum value (POST or COMMENT)

Validation occurs in constructor, so both `create()` and `reconstitute()` enforce rules.

## Relationship with Prisma Schema

Maps to `ContentVersion` model in `prisma/schema.prisma`:

```prisma
model ContentVersion {
  id            String      @id @default(cuid())
  contentType   ContentType
  contentId     String      // Post or Comment ID
  content       String      @db.Text
  versionNumber Int
  createdAt     DateTime    @default(now())

  post    Post?    @relation(fields: [contentId], references: [id])
  comment Comment? @relation(fields: [contentId], references: [id])

  @@unique([contentId, versionNumber])
  @@index([contentId, contentType])
  @@map("content_versions")
}
```

**Key Points**:
- Polymorphic relationship via `contentId` + `contentType`
- Unique constraint on `[contentId, versionNumber]` ensures no duplicate versions
- Index on `[contentId, contentType]` for efficient version lookups
- `@db.Text` for content field to support large HTML content

## Design Decisions

### Why Immutable?

Version snapshots represent historical state and should never change. Immutability:
- Ensures audit trail integrity
- Prevents accidental modification
- Simplifies reasoning about version history
- Aligns with event sourcing principles

### Why Factory Methods?

- **`create()`**: Used by Post/Comment when creating new snapshots
- **`reconstitute()`**: Used by repository when loading from database
- Separates creation concerns from persistence concerns
- Enables validation in single place (constructor)

### Why Polymorphic Reference?

Single `ContentVersion` entity handles both posts and comments because:
- Shared version tracking logic
- Consistent version history interface
- Simplified repository implementation
- Future extensibility (e.g., lesson comments, wiki pages)

### Why Version Numbers?

Version numbers provide:
- Human-readable version identification
- Sequential ordering
- Simple "restore to version N" operations
- Efficient version comparison

## Testing Considerations

### Unit Tests (Domain Layer)

Test entity creation, validation, and immutability:

```typescript
describe("ContentVersion Entity", () => {
  it("should create post version snapshot", () => {
    const version = ContentVersion.create({
      id: "ver-123",
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Hello world</p>",
      versionNumber: 1,
    });

    expect(version.getId()).toBe("ver-123");
    expect(version.isPostVersion()).toBe(true);
    expect(version.getVersionNumber()).toBe(1);
  });

  it("should throw error for empty content", () => {
    expect(() =>
      ContentVersion.create({
        id: "ver-123",
        contentType: ContentType.POST,
        contentId: "post-123",
        content: "",
        versionNumber: 1,
      })
    ).toThrow("Content snapshot is required");
  });

  it("should throw error for invalid version number", () => {
    expect(() =>
      ContentVersion.create({
        id: "ver-123",
        contentType: ContentType.POST,
        contentId: "post-123",
        content: "<p>Content</p>",
        versionNumber: 0,
      })
    ).toThrow("Version number must be at least 1");
  });
});
```

### Integration Tests (Repository Layer)

Test persistence and retrieval:

```typescript
describe("ContentVersionRepository", () => {
  it("should save and retrieve version", async () => {
    const version = ContentVersion.create({
      id: crypto.randomUUID(),
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Version 1</p>",
      versionNumber: 1,
    });

    await repository.create(version);

    const retrieved = await repository.findById(version.getId());
    expect(retrieved).toBeDefined();
    expect(retrieved?.getContent()).toBe("<p>Version 1</p>");
  });

  it("should enforce unique version numbers per content", async () => {
    const version1 = ContentVersion.create({
      id: crypto.randomUUID(),
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Version 1</p>",
      versionNumber: 1,
    });

    await repository.create(version1);

    const version1Duplicate = ContentVersion.create({
      id: crypto.randomUUID(),
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Different content</p>",
      versionNumber: 1, // Duplicate version number
    });

    await expect(repository.create(version1Duplicate)).rejects.toThrow();
  });
});
```

## Next Steps

Phase 3.2 will implement:
- `IContentVersionRepository` interface in `src/ports/repositories.ts`
- Prisma repository implementation
- Domain-to-Prisma mappers
- Use cases for version creation and retrieval
- API routes for version history endpoints

## Related Documentation

- [Post Entity](../post/README.md)
- [Comment Entity](../comment/README.md)
- [Architecture Overview](.cursor/rules/00-architecture.mdc)
- [Repository Patterns](.cursor/rules/20-prisma-repositories.mdc)
