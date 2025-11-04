/**
 * HTML Sanitization Utility
 *
 * Provides secure HTML sanitization to prevent XSS attacks when rendering
 * user-generated content. Uses DOMPurify with a whitelist of safe tags.
 *
 * @module lib/sanitize
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for different content types
 */
const SANITIZE_CONFIGS = {
  /**
   * Basic text content (posts, comments)
   * Allows: paragraphs, line breaks, basic formatting, links, lists
   */
  basic: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  },

  /**
   * Rich content (course lessons, articles)
   * Allows: headings, images, videos, tables, additional formatting
   */
  rich: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title', 'width', 'height',
      'class'
    ],
    ALLOW_DATA_ATTR: false,
  },

  /**
   * Minimal text (titles, names, short snippets)
   * No HTML tags allowed, only text content
   */
  text: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
};

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * @param html - The HTML string to sanitize
 * @param config - Sanitization configuration ('basic' | 'rich' | 'text')
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * ```tsx
 * // Basic sanitization for post content
 * const cleanHtml = sanitizeHtml(post.content, 'basic');
 * <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
 *
 * // Text-only for titles
 * const cleanTitle = sanitizeHtml(post.title, 'text');
 * <h2>{cleanTitle}</h2>
 * ```
 */
export function sanitizeHtml(
  html: string | null | undefined,
  config: keyof typeof SANITIZE_CONFIGS = 'basic'
): string {
  if (!html) return '';

  const sanitizeConfig = SANITIZE_CONFIGS[config];

  // Add security-focused options
  const fullConfig = {
    ...sanitizeConfig,
    // Prevent DOM clobbering
    SANITIZE_DOM: true,
    // Remove scripts and event handlers
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    // Ensure links open safely
    ADD_ATTR: ['rel'],
    // Force external links to open in new tab
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  };

  const cleaned = DOMPurify.sanitize(html, fullConfig);

  // Additional security: ensure external links have rel="noopener noreferrer"
  if (config !== 'text') {
    return cleaned.replace(
      /<a /g,
      '<a rel="noopener noreferrer" '
    );
  }

  return cleaned;
}

/**
 * Sanitize and truncate HTML content
 *
 * @param html - The HTML string to sanitize and truncate
 * @param maxLength - Maximum character length (default: 200)
 * @param config - Sanitization configuration
 * @returns Sanitized and truncated HTML string
 *
 * @example
 * ```tsx
 * const preview = sanitizeAndTruncate(post.content, 200, 'basic');
 * ```
 */
export function sanitizeAndTruncate(
  html: string | null | undefined,
  maxLength: number = 200,
  config: keyof typeof SANITIZE_CONFIGS = 'basic'
): string {
  if (!html) return '';

  const sanitized = sanitizeHtml(html, config);

  // Strip HTML tags for length calculation
  const textOnly = sanitized.replace(/<[^>]*>/g, '');

  if (textOnly.length <= maxLength) {
    return sanitized;
  }

  // Truncate and add ellipsis
  const truncated = textOnly.substring(0, maxLength);
  return `${truncated}...`;
}

/**
 * Check if content contains potential XSS payloads
 * For use in validation layers before storage
 *
 * @param content - Content to check
 * @returns true if content appears suspicious
 */
export function containsSuspiciousContent(content: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Sanitize object properties that may contain HTML
 * Useful for sanitizing entire DTOs
 *
 * @param obj - Object with potentially unsafe HTML properties
 * @param htmlFields - Array of field names to sanitize
 * @param config - Sanitization configuration
 * @returns New object with sanitized HTML fields
 *
 * @example
 * ```tsx
 * const cleanPost = sanitizeObject(post, ['title', 'content', 'excerpt'], 'basic');
 * ```
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  htmlFields: (keyof T)[],
  config: keyof typeof SANITIZE_CONFIGS = 'basic'
): T {
  const sanitized = { ...obj };

  for (const field of htmlFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeHtml(sanitized[field], config) as T[typeof field];
    }
  }

  return sanitized;
}
