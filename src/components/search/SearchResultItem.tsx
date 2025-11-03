'use client';

import { SearchResultDto } from '@/application/dtos/search.dto';
import { FileText, User } from 'lucide-react';

interface SearchResultItemProps {
  result: SearchResultDto;
  onClick?: () => void;
}

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <a
      href={result.url}
      role="option"
      tabIndex={0}
      className="block px-4 py-3 hover:bg-surface transition focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary-color"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${result.type === 'post' ? 'Post' : 'User'}: ${result.title}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon/Avatar */}
        <div className="flex-shrink-0 mt-1">
          {result.type === 'post' ? (
            <div className="w-10 h-10 bg-primary-color/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-color" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-success" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-text-primary truncate">
              {result.title}
            </p>
            {result.type === 'post' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-color/10 text-primary-color rounded">
                Post
              </span>
            )}
            {result.type === 'user' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded">
                Member
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary line-clamp-2">
            {result.snippet}
          </p>
        </div>
      </div>
    </a>
  );
}
