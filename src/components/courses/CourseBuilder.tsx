'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Save, Eye, EyeOff, GripVertical } from 'lucide-react';
import { CourseDto, CreateCourseDto, UpdateCourseDto } from '@/application/dtos/course.dto';
import { LessonDto, CreateLessonDto, LessonType } from '@/application/dtos/lesson.dto';
import { LessonEditor } from './LessonEditor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CourseBuilderProps {
  courseId?: string; // Optional: for editing existing course
  communityId: string;
  instructorId: string;
  onSave?: (courseId: string) => void;
}

interface SortableLessonItemProps {
  lesson: LessonDto;
  onEdit: (lesson: LessonDto) => void;
  onDelete: (lessonId: string) => void;
}

function SortableLessonItem({ lesson, onEdit, onDelete }: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-surface-elevated rounded-lg border border-border-color hover:border-primary-color/50 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-text-tertiary hover:text-text-primary"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{lesson.title}</span>
          <span className="px-2 py-0.5 text-xs bg-primary-color/10 text-primary-color rounded">
            {lesson.type}
          </span>
        </div>
        {lesson.dripAvailableAt && (
          <p className="text-xs text-text-tertiary mt-1">
            Available: {new Date(lesson.dripAvailableAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={() => onEdit(lesson)}
        className="px-3 py-1.5 text-sm text-text-secondary hover:text-primary-color transition-colors"
      >
        Edit
      </button>

      <button
        onClick={() => onDelete(lesson.id)}
        className="px-3 py-1.5 text-sm text-error hover:text-error/80 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

export function CourseBuilder({ courseId, communityId, instructorId, onSave }: CourseBuilderProps) {
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null);
  const [isDraft, setIsDraft] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLessonEditor, setShowLessonEditor] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Load existing course if editing
  useEffect(() => {
    if (courseId) {
      loadCourse();
      loadLessons();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to load course');
      const data = await response.json();
      setCourse(data);
      setTitle(data.title);
      setDescription(data.description);
      setIsDraft(!data.isPublished);
    } catch (error) {
      console.error('Error loading course:', error);
    }
  };

  const loadLessons = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`);
      if (!response.ok) throw new Error('Failed to load lessons');
      const data = await response.json();
      setLessons(data.sort((a: LessonDto, b: LessonDto) => a.orderIndex - b.orderIndex));
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const handleSaveCourse = async () => {
    setIsLoading(true);
    try {
      if (courseId) {
        // Update existing course
        const updateData: UpdateCourseDto = { title, description };
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Failed to update course');
        const updated = await response.json();
        setCourse(updated);
      } else {
        // Create new course
        const createData: CreateCourseDto = {
          communityId,
          instructorId,
          title,
          description
        };
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        });
        if (!response.ok) throw new Error('Failed to create course');
        const created = await response.json();
        setCourse(created);
        if (onSave) onSave(created.id);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!course) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}/publish`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to toggle publish status');
      const updated = await response.json();
      setCourse(updated);
      setIsDraft(!updated.isPublished);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLesson = (type: LessonType) => {
    const newLesson: Partial<LessonDto> = {
      id: `temp-${Date.now()}`,
      courseId: course?.id || '',
      sectionId: null,
      title: '',
      type,
      content: null,
      orderIndex: lessons.length,
      dripAvailableAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEditingLesson(newLesson as LessonDto);
    setShowLessonEditor(true);
  };

  const handleSaveLesson = async (lessonData: CreateLessonDto | LessonDto) => {
    if (!course) {
      alert('Please save the course first before adding lessons.');
      return;
    }

    setIsLoading(true);
    try {
      if ('id' in lessonData && !lessonData.id.startsWith('temp-')) {
        // Update existing lesson
        const response = await fetch(`/api/lessons/${lessonData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: lessonData.title,
            content: lessonData.content,
            dripAvailableAt: lessonData.dripAvailableAt
          })
        });
        if (!response.ok) throw new Error('Failed to update lesson');
        const updated = await response.json();
        setLessons(prev => prev.map(l => l.id === updated.id ? updated : l));
      } else {
        // Create new lesson
        const createData: CreateLessonDto = {
          courseId: course.id,
          sectionId: null,
          title: lessonData.title,
          type: lessonData.type,
          content: lessonData.content || null,
          orderIndex: lessons.length,
          dripAvailableAt: lessonData.dripAvailableAt || null
        };
        const response = await fetch('/api/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        });
        if (!response.ok) throw new Error('Failed to create lesson');
        const created = await response.json();
        setLessons(prev => [...prev, created]);
      }
      setShowLessonEditor(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete lesson');
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex(l => l.id === active.id);
    const newIndex = lessons.findIndex(l => l.id === over.id);

    const reordered = arrayMove(lessons, oldIndex, newIndex);
    setLessons(reordered);

    // Save new order to backend
    try {
      const response = await fetch('/api/lessons/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessons: reordered.map((l, index) => ({ id: l.id, orderIndex: index }))
        })
      });
      if (!response.ok) throw new Error('Failed to reorder lessons');
    } catch (error) {
      console.error('Error reordering lessons:', error);
      // Revert on error
      loadLessons();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Course Metadata Form */}
      <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Course Details</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
              Course Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color resize-none"
              placeholder="Describe your course"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveCourse}
              disabled={isLoading || !title.trim()}
              className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={18} />
              {courseId ? 'Update Course' : 'Save Course'}
            </button>

            {course && (
              <button
                onClick={handlePublishToggle}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  isDraft
                    ? 'bg-success text-white hover:bg-success/90'
                    : 'bg-warning text-white hover:bg-warning/90'
                }`}
              >
                {isDraft ? <Eye size={18} /> : <EyeOff size={18} />}
                {isDraft ? 'Publish' : 'Unpublish'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      {course && (
        <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">Lessons</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddLesson('TEXT')}
                className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Text Lesson
              </button>
              <button
                onClick={() => handleAddLesson('VIDEO')}
                className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Video Lesson
              </button>
              <button
                onClick={() => handleAddLesson('PDF')}
                className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                PDF Lesson
              </button>
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12 text-text-tertiary">
              No lessons yet. Add your first lesson to get started.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={lessons.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <SortableLessonItem
                      key={lesson.id}
                      lesson={lesson}
                      onEdit={(lesson) => {
                        setEditingLesson(lesson);
                        setShowLessonEditor(true);
                      }}
                      onDelete={handleDeleteLesson}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {/* Lesson Editor Modal */}
      {showLessonEditor && editingLesson && (
        <LessonEditor
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onCancel={() => {
            setShowLessonEditor(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}
