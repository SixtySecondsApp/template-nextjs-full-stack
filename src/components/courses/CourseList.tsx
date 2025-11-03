'use client';

import { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { CourseDto } from '@/application/dtos/course.dto';
import { ProgressDto } from '@/application/dtos/progress.dto';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  communityId?: string;
  userId?: string;
  initialCourses?: CourseDto[];
}

type FilterType = 'all' | 'in-progress' | 'completed' | 'not-started';
type SortType = 'newest' | 'popular' | 'title';

export function CourseList({ communityId, userId, initialCourses = [] }: CourseListProps) {
  const [courses, setCourses] = useState<CourseDto[]>(initialCourses);
  const [progressMap, setProgressMap] = useState<Map<string, ProgressDto>>(new Map());
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(!initialCourses.length);

  useEffect(() => {
    if (!initialCourses.length) {
      loadCourses();
    }
    if (userId) {
      loadProgress();
    }
  }, [communityId, userId]);

  const loadCourses = async () => {
    try {
      const url = communityId
        ? `/api/courses?communityId=${communityId}`
        : '/api/courses';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/users/${userId}/progress`);
      if (!response.ok) return; // No progress yet, that's ok
      const progressData: ProgressDto[] = await response.json();

      const map = new Map<string, ProgressDto>();
      progressData.forEach(p => map.set(p.courseId, p));
      setProgressMap(map);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const getFilteredAndSortedCourses = () => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructorName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(course => {
        const progress = progressMap.get(course.id);

        switch (filter) {
          case 'in-progress':
            return progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;
          case 'completed':
            return progress && progress.completionPercentage === 100;
          case 'not-started':
            return !progress;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.enrolledCount - a.enrolledCount;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const filteredCourses = getFilteredAndSortedCourses();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-surface-elevated rounded-lg border border-border-color p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-text-tertiary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {(filter !== 'all' || searchQuery.trim()) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-color">
            <span className="text-sm text-text-tertiary">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
            {(filter !== 'all' || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="text-sm text-primary-color hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-surface-elevated rounded-lg border border-border-color">
          <p className="text-text-tertiary mb-2">
            {searchQuery.trim() ? 'No courses match your search' : 'No courses available'}
          </p>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary-color hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progressMap.get(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
