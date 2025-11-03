/**
 * Usage examples for ContentVersion entity.
 * These are not tests, but demonstrate proper usage patterns.
 */

import { ContentVersion, ContentType } from "./content-version.entity";
import { Post } from "../post/post.entity";
import { Comment } from "../comment/comment.entity";

// ============================================================================
// Example 1: Creating a version snapshot from a Post
// ============================================================================

export function examplePostVersionSnapshot(): ContentVersion {
  // Create a post
  const post = Post.create({
    id: "post-123",
    communityId: "community-abc",
    authorId: "user-456",
    title: "My First Post",
    content: "<p>This is the initial post content.</p>",
  });

  // Create version 1 snapshot
  const version1 = post.createVersionSnapshot(1);

  console.log("Version 1 created:", {
    id: version1.getId(),
    contentType: version1.getContentType(),
    versionNumber: version1.getVersionNumber(),
    content: version1.getContent(),
  });

  // Update post content
  post.update({
    content: "<p>This is the updated post content.</p>",
  });

  // Create version 2 snapshot after update
  const version2 = post.createVersionSnapshot(2);

  console.log("Version 2 created:", {
    id: version2.getId(),
    versionNumber: version2.getVersionNumber(),
    content: version2.getContent(),
  });

  return version2;
}

// ============================================================================
// Example 2: Creating a version snapshot from a Comment
// ============================================================================

export function exampleCommentVersionSnapshot(): ContentVersion {
  // Create a comment
  const comment = Comment.create({
    id: "comment-789",
    postId: "post-123",
    authorId: "user-456",
    content: "<p>This is my comment.</p>",
  });

  // Create version 1 snapshot
  const version1 = comment.createVersionSnapshot(1);

  console.log("Comment version 1:", {
    id: version1.getId(),
    contentType: version1.getContentType(),
    isCommentVersion: version1.isCommentVersion(),
  });

  return version1;
}

// ============================================================================
// Example 3: Manual ContentVersion creation (for use cases)
// ============================================================================

export function exampleManualVersionCreation(): ContentVersion {
  // Use case: Creating a version when you already have content data
  const version = ContentVersion.create({
    id: crypto.randomUUID(),
    contentType: ContentType.POST,
    contentId: "post-123",
    content: "<p>Content snapshot at specific time</p>",
    versionNumber: 3,
  });

  console.log("Manual version created:", {
    id: version.getId(),
    contentType: version.getContentType(),
    contentId: version.getContentId(),
    versionNumber: version.getVersionNumber(),
    isPostVersion: version.isPostVersion(),
  });

  return version;
}

// ============================================================================
// Example 4: Reconstituting from persistence (repository usage)
// ============================================================================

export function exampleReconstituteFromDatabase(): ContentVersion {
  // Simulating data retrieved from database
  const dbData = {
    id: "ver-abc-123",
    contentType: ContentType.POST as ContentType,
    contentId: "post-123",
    content: "<p>Historical content</p>",
    versionNumber: 5,
    createdAt: new Date("2025-11-01T10:00:00Z"),
  };

  // Reconstitute the entity
  const version = ContentVersion.reconstitute(dbData);

  console.log("Reconstituted version:", {
    id: version.getId(),
    versionNumber: version.getVersionNumber(),
    createdAt: version.getCreatedAt(),
  });

  return version;
}

// ============================================================================
// Example 5: Version history workflow
// ============================================================================

export function exampleVersionHistoryWorkflow(): ContentVersion[] {
  const versions: ContentVersion[] = [];

  // Simulate post lifecycle with version tracking
  const post = Post.create({
    id: "post-999",
    communityId: "community-abc",
    authorId: "user-456",
    title: "Version Tracking Example",
    content: "<p>Original content</p>",
  });

  // Version 1: Initial publish
  versions.push(post.createVersionSnapshot(1));

  // Version 2: First edit
  post.update({ content: "<p>First edit content</p>" });
  versions.push(post.createVersionSnapshot(2));

  // Version 3: Second edit
  post.update({ content: "<p>Second edit content</p>" });
  versions.push(post.createVersionSnapshot(3));

  // Version 4: Third edit
  post.update({ content: "<p>Third edit content</p>" });
  versions.push(post.createVersionSnapshot(4));

  console.log(`Created ${versions.length} versions:`);
  versions.forEach((v) => {
    console.log(`- Version ${v.getVersionNumber()}: ${v.getCreatedAt()}`);
  });

  return versions;
}

// ============================================================================
// Example 6: Validation scenarios
// ============================================================================

export function exampleValidation(): void {
  console.log("=== Validation Examples ===");

  // Valid version
  try {
    const valid = ContentVersion.create({
      id: "ver-123",
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Valid content</p>",
      versionNumber: 1,
    });
    console.log("✓ Valid version created");
  } catch (error) {
    console.error("✗ Unexpected error:", error);
  }

  // Invalid: Empty content
  try {
    ContentVersion.create({
      id: "ver-124",
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "",
      versionNumber: 1,
    });
    console.error("✗ Should have thrown error for empty content");
  } catch (error) {
    console.log("✓ Correctly rejected empty content:", (error as Error).message);
  }

  // Invalid: Version number < 1
  try {
    ContentVersion.create({
      id: "ver-125",
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Content</p>",
      versionNumber: 0,
    });
    console.error("✗ Should have thrown error for version 0");
  } catch (error) {
    console.log("✓ Correctly rejected version 0:", (error as Error).message);
  }

  // Invalid: Non-integer version number
  try {
    ContentVersion.create({
      id: "ver-126",
      contentType: ContentType.POST,
      contentId: "post-123",
      content: "<p>Content</p>",
      versionNumber: 1.5,
    });
    console.error("✗ Should have thrown error for non-integer version");
  } catch (error) {
    console.log("✓ Correctly rejected non-integer version:", (error as Error).message);
  }
}

// ============================================================================
// Example 7: Type checking and helper methods
// ============================================================================

export function exampleTypeChecking(): void {
  const postVersion = ContentVersion.create({
    id: "ver-post",
    contentType: ContentType.POST,
    contentId: "post-123",
    content: "<p>Post content</p>",
    versionNumber: 1,
  });

  const commentVersion = ContentVersion.create({
    id: "ver-comment",
    contentType: ContentType.COMMENT,
    contentId: "comment-456",
    content: "<p>Comment content</p>",
    versionNumber: 1,
  });

  console.log("Post version checks:");
  console.log("- isPostVersion():", postVersion.isPostVersion()); // true
  console.log("- isCommentVersion():", postVersion.isCommentVersion()); // false

  console.log("\nComment version checks:");
  console.log("- isPostVersion():", commentVersion.isPostVersion()); // false
  console.log("- isCommentVersion():", commentVersion.isCommentVersion()); // true
}
