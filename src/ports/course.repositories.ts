/**
 * Course Repository Interfaces (Ports)
 * Define contracts for Course-related persistence operations
 * Using domain entities, NOT DTOs or Prisma types
 */

import { Course } from "@/domain/course/course.entity";
import { CourseSection } from "@/domain/course/course-section.entity";
import { Lesson } from "@/domain/course/lesson.entity";
import { CourseEnrollment } from "@/domain/course/course-enrollment.entity";
import { LessonProgress } from "@/domain/course/lesson-progress.entity";

/**
 * Course Repository Interface
 * Defines persistence operations for Course aggregate
 */
export interface ICourseRepository {
  /**
   * Create a new course
   */
  create(course: Course): Promise<Course>;

  /**
   * Update an existing course
   */
  update(course: Course): Promise<Course>;

  /**
   * Archive (soft delete) a course
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived course
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a course (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find course by ID (excludes archived by default)
   */
  findById(id: string): Promise<Course | null>;

  /**
   * Find all courses for a community
   * @param communityId Community ID
   * @param includeArchived Optional flag to include archived courses
   */
  findByCommunityId(
    communityId: string,
    includeArchived?: boolean
  ): Promise<Course[]>;

  /**
   * Find only published courses for a community (excludes archived)
   */
  findPublishedByCommunityId(communityId: string): Promise<Course[]>;

  /**
   * Find all courses (excludes archived by default)
   */
  findAll(): Promise<Course[]>;
}

/**
 * CourseSection Repository Interface
 * Defines persistence operations for CourseSection aggregate
 */
export interface ICourseSectionRepository {
  /**
   * Create a new course section
   */
  create(section: CourseSection): Promise<CourseSection>;

  /**
   * Update an existing course section
   */
  update(section: CourseSection): Promise<CourseSection>;

  /**
   * Archive (soft delete) a course section
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived course section
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a course section (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find section by ID (excludes archived by default)
   */
  findById(id: string): Promise<CourseSection | null>;

  /**
   * Find all sections for a course (ordered by order field)
   * @param courseId Course ID
   * @param includeArchived Optional flag to include archived sections
   */
  findByCourseId(
    courseId: string,
    includeArchived?: boolean
  ): Promise<CourseSection[]>;

  /**
   * Reorder sections within a course
   * @param courseId Course ID
   * @param sectionOrders Array of {id, order} pairs for bulk reordering
   */
  reorder(
    courseId: string,
    sectionOrders: Array<{ id: string; order: number }>
  ): Promise<void>;
}

/**
 * Lesson Repository Interface
 * Defines persistence operations for Lesson aggregate
 */
export interface ILessonRepository {
  /**
   * Create a new lesson
   */
  create(lesson: Lesson): Promise<Lesson>;

  /**
   * Update an existing lesson
   */
  update(lesson: Lesson): Promise<Lesson>;

  /**
   * Archive (soft delete) a lesson
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived lesson
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete a lesson (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find lesson by ID (excludes archived by default)
   */
  findById(id: string): Promise<Lesson | null>;

  /**
   * Find all lessons for a section (ordered by order field)
   * @param sectionId Section ID
   * @param includeArchived Optional flag to include archived lessons
   */
  findBySectionId(
    sectionId: string,
    includeArchived?: boolean
  ): Promise<Lesson[]>;

  /**
   * Find available lessons based on drip schedule
   * @param sectionId Section ID
   * @param courseStartDate Course start date for drip calculation
   * @param currentDate Current date to check against drip schedule
   */
  findAvailableBySectionId(
    sectionId: string,
    courseStartDate: Date,
    currentDate: Date
  ): Promise<Lesson[]>;

  /**
   * Reorder lessons within a section
   * @param sectionId Section ID
   * @param lessonOrders Array of {id, order} pairs for bulk reordering
   */
  reorder(
    sectionId: string,
    lessonOrders: Array<{ id: string; order: number }>
  ): Promise<void>;
}

/**
 * CourseEnrollment Repository Interface
 * Defines persistence operations for CourseEnrollment aggregate
 */
export interface ICourseEnrollmentRepository {
  /**
   * Create a new course enrollment
   */
  create(enrollment: CourseEnrollment): Promise<CourseEnrollment>;

  /**
   * Update an existing enrollment
   */
  update(enrollment: CourseEnrollment): Promise<CourseEnrollment>;

  /**
   * Archive (soft delete) an enrollment
   */
  archive(id: string): Promise<void>;

  /**
   * Restore an archived enrollment
   */
  restore(id: string): Promise<void>;

  /**
   * Permanently delete an enrollment (use sparingly)
   */
  delete(id: string): Promise<void>;

  /**
   * Find enrollment by ID (excludes archived by default)
   */
  findById(id: string): Promise<CourseEnrollment | null>;

  /**
   * Find enrollment by user and course
   * @param userId User ID
   * @param courseId Course ID
   */
  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<CourseEnrollment | null>;

  /**
   * Find all enrollments for a user
   */
  findByUserId(userId: string): Promise<CourseEnrollment[]>;

  /**
   * Find all enrollments for a course
   */
  findByCourseId(courseId: string): Promise<CourseEnrollment[]>;
}

/**
 * LessonProgress Repository Interface
 * Defines persistence operations for LessonProgress aggregate
 */
export interface ILessonProgressRepository {
  /**
   * Create a new lesson progress record
   */
  create(progress: LessonProgress): Promise<LessonProgress>;

  /**
   * Update an existing progress record
   */
  update(progress: LessonProgress): Promise<LessonProgress>;

  /**
   * Find progress by ID
   */
  findById(id: string): Promise<LessonProgress | null>;

  /**
   * Find progress by user and lesson
   * @param userId User ID
   * @param lessonId Lesson ID
   */
  findByUserAndLesson(
    userId: string,
    lessonId: string
  ): Promise<LessonProgress | null>;

  /**
   * Find all progress records for a user
   */
  findByUserId(userId: string): Promise<LessonProgress[]>;

  /**
   * Find all progress records for a lesson
   */
  findByLessonId(lessonId: string): Promise<LessonProgress[]>;

  /**
   * Permanently delete a progress record
   */
  delete(id: string): Promise<void>;
}
