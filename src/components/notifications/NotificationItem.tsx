'use client';

import { NotificationDto } from '@/application/dtos/notification.dto';
import { AtSign, MessageCircle, Heart, FileText, Bell } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkAsRead: () => void;
  onClick: () => void;
}

export function NotificationItem({ notification, onMarkAsRead, onClick }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'MENTION':
        return <AtSign className="w-5 h-5 text-primary-color" />;
      case 'REPLY':
      case 'COMMENT_ON_POST':
        return <MessageCircle className="w-5 h-5 text-success" />;
      case 'LIKE':
        return <Heart className="w-5 h-5 text-danger" />;
      case 'NEW_POST':
        return <FileText className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-text-tertiary" />;
    }
  };

  const handleClick = () => {
    onMarkAsRead();
    if (notification.linkUrl) {
      window.location.href = notification.linkUrl;
    }
    onClick();
  };

  return (
    <div
      className="p-4 border-b border-border-color hover:bg-surface
               cursor-pointer transition"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Notification: ${notification.message}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary">
            {notification.message}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
        {!notification.isRead && (
          <div className="flex-shrink-0" aria-label="Unread">
            <div className="w-2 h-2 bg-primary-color rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
