import { CreateProgressInput, ProgressData } from "./course-progress.types";

/**
 * CourseProgress entity represents a user's progress through a course.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Tracks completed lesson IDs (array of strings)
 * - Tracks last accessed lesson for "continue where you left off"
 * - Cannot mark same lesson complete twice
 * - Cannot mark course complete if no lessons completed
 * - Completion percentage calculated from total lessons
 * - Course completion sets completedAt timestamp
 */
export class CourseProgress {
  private constructor(
    private readonly id: string,
    private readonly courseId: string,
    private readonly userId: string,
    private completedLessonIds: string[],
    private lastAccessedLessonId: string | null,
    private completedAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  /**
   * Factory method to create a new CourseProgress entity.
   * Progress starts with no completed lessons.
   */
  static create(input: CreateProgressInput): CourseProgress {
    return new CourseProgress(
      input.id,
      input.courseId,
      input.userId,
      [], // completedLessonIds
      null, // lastAccessedLessonId
      null, // completedAt
      new Date(),
      new Date()
    );
  }

  /**
   * Factory method to reconstitute a CourseProgress entity from persistence.
   */
  static reconstitute(data: ProgressData): CourseProgress {
    return new CourseProgress(
      data.id,
      data.courseId,
      data.userId,
      data.completedLessonIds,
      data.lastAccessedLessonId,
      data.completedAt,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCourseId(): string {
    return this.courseId;
  }

  getUserId(): string {
    return this.userId;
  }

  getCompletedLessonIds(): string[] {
    return [...this.completedLessonIds];
  }

  getLastAccessedLessonId(): string | null {
    return this.lastAccessedLessonId;
  }

  getCompletedAt(): Date | null {
    return this.completedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isComplete(): boolean {
    return this.completedAt !== null;
  }

  // Business logic methods

  /**
   * Mark a lesson as complete.
   * @param lessonId - The ID of the lesson to mark complete
   * @throws Error if lesson is already completed or lessonId is empty
   */
  markLessonComplete(lessonId: string): void {
    if (!lessonId || lessonId.trim().length === 0) {
      throw new Error("Lesson ID cannot be empty");
    }

    if (this.isLessonCompleted(lessonId)) {
      throw new Error("Lesson is already marked as complete");
    }

    this.completedLessonIds.push(lessonId);
    this.updatedAt = new Date();
  }

  /**
   * Mark a lesson as incomplete (remove from completed list).
   * @param lessonId - The ID of the lesson to mark incomplete
   * @throws Error if lesson is not completed or lessonId is empty
   */
  markLessonIncomplete(lessonId: string): void {
    if (!lessonId || lessonId.trim().length === 0) {
      throw new Error("Lesson ID cannot be empty");
    }

    if (!this.isLessonCompleted(lessonId)) {
      throw new Error("Lesson is not marked as complete");
    }

    this.completedLessonIds = this.completedLessonIds.filter(
      (id) => id !== lessonId
    );
    this.updatedAt = new Date();
  }

  /**
   * Update the last accessed lesson ID.
   * Used for "continue where you left off" functionality.
   * @param lessonId - The ID of the lesson last accessed
   * @throws Error if lessonId is empty
   */
  updateLastAccessed(lessonId: string): void {
    if (!lessonId || lessonId.trim().length === 0) {
      throw new Error("Lesson ID cannot be empty");
    }

    this.lastAccessedLessonId = lessonId;
    this.updatedAt = new Date();
  }

  /**
   * Mark the entire course as complete.
   * @throws Error if no lessons have been completed
   */
  markCourseComplete(): void {
    if (this.completedLessonIds.length === 0) {
      throw new Error("Cannot mark course complete with no completed lessons");
    }

    if (this.isComplete()) {
      throw new Error("Course is already marked as complete");
    }

    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Check if a specific lesson is completed.
   * @param lessonId - The ID of the lesson to check
   * @returns true if lesson is completed, false otherwise
   */
  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessonIds.includes(lessonId);
  }

  /**
   * Calculate completion percentage based on total lessons.
   * @param totalLessons - Total number of lessons in the course
   * @returns Completion percentage (0-100)
   */
  getCompletionPercentage(totalLessons: number): number {
    if (totalLessons === 0) {
      return 0;
    }

    const percentage =
      (this.completedLessonIds.length / totalLessons) * 100;
    return Math.round(percentage);
  }
}
