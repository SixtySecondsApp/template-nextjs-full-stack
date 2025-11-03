'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { SearchResultDto } from '@/application/dtos/search.dto';
import { SearchResultItem } from './SearchResultItem';

interface SearchBarProps {
  communityId?: string;
  placeholder?: string;
}

export function SearchBar({ communityId, placeholder = 'Search posts and members...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [query, communityId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        query: query,
        ...(communityId && { communityId }),
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data.results || data.data || []);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-border-color rounded-lg
                   bg-surface text-text-primary
                   focus:ring-2 focus:ring-primary-color focus:border-transparent
                   placeholder-text-tertiary transition-all"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary
                     hover:text-text-primary transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          id="search-results"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-surface-elevated rounded-lg shadow-lg
                   border border-border-color max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-text-secondary">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-color mx-auto"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-text-secondary">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <SearchResultItem
                  key={`${result.type}-${result.id}`}
                  result={result}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
