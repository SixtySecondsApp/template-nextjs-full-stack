import {
  CreateLessonInput,
  UpdateLessonInput,
  LessonData,
  LessonType,
} from "./lesson.types";

/**
 * Lesson entity represents a lesson within a course.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Title: 3-200 characters
 * - Content: Required for TEXT type
 * - videoUrl: Required for VIDEO_EMBED type, must be valid URL
 * - pdfUrl: Required for PDF type, must be valid URL
 * - order: Must be >= 0
 * - Cannot modify archived lessons
 * - Type-specific validation enforced
 * - Drip content: Lessons can be scheduled for future availability
 */
export class Lesson {
  private constructor(
    private readonly id: string,
    private readonly courseId: string,
    private readonly sectionId: string | null,
    private title: string,
    private content: string,
    private readonly type: LessonType,
    private videoUrl: string | null,
    private pdfUrl: string | null,
    private order: number,
    private dripAvailableAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateTitle(title);
    this.validateContent(content, type);
    this.validateTypeSpecificFields(type, videoUrl, pdfUrl);
    this.validateOrder(order);
  }

  /**
   * Factory method to create a new Lesson entity.
   */
  static create(input: CreateLessonInput): Lesson {
    return new Lesson(
      input.id,
      input.courseId,
      input.sectionId,
      input.title,
      input.content,
      input.type,
      input.videoUrl,
      input.pdfUrl,
      input.order,
      null, // dripAvailableAt
      new Date(),
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a Lesson entity from persistence.
   */
  static reconstitute(data: LessonData): Lesson {
    return new Lesson(
      data.id,
      data.courseId,
      data.sectionId,
      data.title,
      data.content,
      data.type,
      data.videoUrl,
      data.pdfUrl,
      data.order,
      data.dripAvailableAt,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCourseId(): string {
    return this.courseId;
  }

  getSectionId(): string | null {
    return this.sectionId;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getType(): LessonType {
    return this.type;
  }

  getVideoUrl(): string | null {
    return this.videoUrl;
  }

  getPdfUrl(): string | null {
    return this.pdfUrl;
  }

  getOrder(): number {
    return this.order;
  }

  getDripAvailableAt(): Date | null {
    return this.dripAvailableAt;
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

  // Business logic methods

  /**
   * Update lesson content.
   * Re-validates type-specific fields if URL fields are updated.
   * @throws Error if lesson is archived or validation fails
   */
  update(input: UpdateLessonInput): void {
    this.ensureNotArchived();

    if (input.title !== undefined) {
      this.validateTitle(input.title);
      this.title = input.title;
    }

    if (input.content !== undefined) {
      this.validateContent(input.content, this.type);
      this.content = input.content;
    }

    if (input.videoUrl !== undefined) {
      this.videoUrl = input.videoUrl;
    }

    if (input.pdfUrl !== undefined) {
      this.pdfUrl = input.pdfUrl;
    }

    if (input.order !== undefined) {
      this.validateOrder(input.order);
      this.order = input.order;
    }

    // Re-validate type-specific fields after updates
    this.validateTypeSpecificFields(this.type, this.videoUrl, this.pdfUrl);

    this.updatedAt = new Date();
  }

  /**
   * Set drip content unlock date.
   * @throws Error if lesson is archived
   */
  setDripDate(date: Date): void {
    this.ensureNotArchived();

    this.dripAvailableAt = date;
    this.updatedAt = new Date();
  }

  /**
   * Clear drip content scheduling, making lesson immediately available.
   * @throws Error if lesson is archived
   */
  clearDripDate(): void {
    this.ensureNotArchived();

    this.dripAvailableAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Check if lesson is available based on drip scheduling.
   * @param currentDate - The current date to check against
   * @returns true if lesson is available, false if still locked
   */
  isAvailable(currentDate: Date): boolean {
    if (this.dripAvailableAt === null) {
      return true;
    }

    return currentDate >= this.dripAvailableAt;
  }

  /**
   * Archive (soft delete) the lesson.
   * @throws Error if lesson is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Lesson is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore lesson from archived state.
   * @throws Error if lesson is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Lesson is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Lesson title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      throw new Error("Lesson title must be at least 3 characters");
    }

    if (trimmedTitle.length > 200) {
      throw new Error("Lesson title must not exceed 200 characters");
    }
  }

  private validateContent(content: string, type: LessonType): void {
    if (type === LessonType.TEXT) {
      if (!content || content.trim().length === 0) {
        throw new Error("Lesson content is required for TEXT type");
      }
    }
  }

  private validateTypeSpecificFields(
    type: LessonType,
    videoUrl: string | null,
    pdfUrl: string | null
  ): void {
    if (type === LessonType.VIDEO_EMBED) {
      if (!videoUrl || videoUrl.trim().length === 0) {
        throw new Error("Video URL is required for VIDEO_EMBED type");
      }

      this.validateUrl(videoUrl, "Video URL");
    }

    if (type === LessonType.PDF) {
      if (!pdfUrl || pdfUrl.trim().length === 0) {
        throw new Error("PDF URL is required for PDF type");
      }

      this.validateUrl(pdfUrl, "PDF URL");
    }
  }

  private validateUrl(url: string, fieldName: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`${fieldName} must be a valid URL`);
    }
  }

  private validateOrder(order: number): void {
    if (order < 0) {
      throw new Error("Lesson order must be greater than or equal to 0");
    }

    if (!Number.isInteger(order)) {
      throw new Error("Lesson order must be an integer");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived lesson");
    }
  }
}
