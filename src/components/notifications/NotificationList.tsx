'use client';

import { useState, useEffect } from 'react';
import { NotificationDto } from '@/application/dtos/notification.dto';
import { NotificationItem } from './NotificationItem';
import { CheckCheck, Trash2, Filter } from 'lucide-react';

type FilterType = 'all' | 'unread' | 'read';

interface NotificationListProps {
  userId: string;
}

export function NotificationList({ userId }: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
      });

      if (filter === 'unread') {
        params.append('includeRead', 'false');
      } else if (filter === 'read') {
        params.append('onlyRead', 'true');
      }

      const response = await fetch(`/api/notifications?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        const newNotifications = data.data || [];
        setNotifications(newNotifications);
        setHasMore(newNotifications.length === limit);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) {
      return;
    }

    try {
      const response = await fetch('/api/notifications/delete-read', {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => !n.isRead));
      }
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Notifications</h1>
        <p className="text-text-secondary">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-4 p-4 bg-surface rounded-lg border border-border-color">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-tertiary" />
          <button
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-primary-color text-white'
                : 'text-text-secondary hover:bg-surface-elevated'
            }`}
            aria-pressed={filter === 'all'}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter('unread');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              filter === 'unread'
                ? 'bg-primary-color text-white'
                : 'text-text-secondary hover:bg-surface-elevated'
            }`}
            aria-pressed={filter === 'unread'}
          >
            Unread
          </button>
          <button
            onClick={() => {
              setFilter('read');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              filter === 'read'
                ? 'bg-primary-color text-white'
                : 'text-text-secondary hover:bg-surface-elevated'
            }`}
            aria-pressed={filter === 'read'}
          >
            Read
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                       text-primary-color hover:bg-primary-color/10 transition"
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {notifications.some((n) => n.isRead) && (
            <button
              onClick={deleteRead}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                       text-danger hover:bg-danger/10 transition"
              aria-label="Delete read notifications"
            >
              <Trash2 className="w-4 h-4" />
              Delete read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-surface-elevated rounded-lg border border-border-color overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color mx-auto"></div>
            <p className="text-text-secondary mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCheck className="w-8 h-8 text-success" />
            </div>
            <p className="text-text-primary font-semibold mb-2">No notifications</p>
            <p className="text-text-secondary text-sm">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                ? 'No read notifications to show.'
                : 'You have no notifications yet.'}
            </p>
          </div>
        ) : (
          <div role="list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && notifications.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-border-color
                     text-text-primary hover:bg-surface transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-text-secondary text-sm">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 rounded-lg border border-border-color
                     text-text-primary hover:bg-surface transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
