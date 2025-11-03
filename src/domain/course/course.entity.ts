import { CreateCourseInput, UpdateCourseInput, CourseData } from "./course.types";

/**
 * Course entity represents a course within a community.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Title: 3-200 characters
 * - Description: 10-5000 characters
 * - Courses start as drafts (isPublished = false, publishedAt = null)
 * - Cannot modify archived courses
 * - Cannot publish archived course
 * - Cannot archive published course (must unpublish first)
 * - Publishing sets publishedAt timestamp
 */
export class Course {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private title: string,
    private description: string,
    private readonly instructorId: string,
    private isPublished: boolean,
    private publishedAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateTitle(title);
    this.validateDescription(description);
  }

  /**
   * Factory method to create a new Course entity.
   * Course starts as a draft (isPublished = false, publishedAt = null).
   */
  static create(input: CreateCourseInput): Course {
    return new Course(
      input.id,
      input.communityId,
      input.title,
      input.description,
      input.instructorId,
      false, // isPublished
      null, // publishedAt
      new Date(),
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a Course entity from persistence.
   */
  static reconstitute(data: CourseData): Course {
    return new Course(
      data.id,
      data.communityId,
      data.title,
      data.description,
      data.instructorId,
      data.isPublished,
      data.publishedAt,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getInstructorId(): string {
    return this.instructorId;
  }

  getIsPublished(): boolean {
    return this.isPublished;
  }

  getPublishedAt(): Date | null {
    return this.publishedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  isDraft(): boolean {
    return !this.isPublished;
  }

  // Business logic methods

  /**
   * Update course content (title and/or description).
   * @throws Error if course is archived or validation fails
   */
  update(input: UpdateCourseInput): void {
    this.ensureNotArchived();

    if (input.title !== undefined) {
      this.validateTitle(input.title);
      this.title = input.title;
    }

    if (input.description !== undefined) {
      this.validateDescription(input.description);
      this.description = input.description;
    }

    this.updatedAt = new Date();
  }

  /**
   * Publish the course, making it visible to community members.
   * @throws Error if course is archived or already published
   */
  publish(): void {
    this.ensureNotArchived();

    if (this.isPublished) {
      throw new Error("Course is already published");
    }

    this.isPublished = true;
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Unpublish the course, hiding it from community members.
   * @throws Error if course is archived or not published
   */
  unpublish(): void {
    this.ensureNotArchived();

    if (!this.isPublished) {
      throw new Error("Course is not published");
    }

    this.isPublished = false;
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the course.
   * @throws Error if course is already archived or is published
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Course is already archived");
    }

    if (this.isPublished) {
      throw new Error("Cannot archive published course. Unpublish first");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore course from archived state.
   * @throws Error if course is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Course is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Course title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      throw new Error("Course title must be at least 3 characters");
    }

    if (trimmedTitle.length > 200) {
      throw new Error("Course title must not exceed 200 characters");
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Course description is required");
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      throw new Error("Course description must be at least 10 characters");
    }

    if (trimmedDescription.length > 5000) {
      throw new Error("Course description must not exceed 5000 characters");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived course");
    }
  }
}
