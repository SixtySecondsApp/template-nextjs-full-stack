import { useEffect, useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

/**
 * Draft Content Type
 */
export interface DraftContent {
  title?: string;
  body?: string;
  [key: string]: unknown;
}

/**
 * Autosave Options
 */
interface UseAutosaveOptions {
  /**
   * Debounce delay in milliseconds
   * @default 5000 (5 seconds)
   */
  delay?: number;

  /**
   * Post ID (optional - for editing existing posts)
   */
  postId?: string | null;

  /**
   * Callback when save succeeds
   */
  onSaveSuccess?: () => void;

  /**
   * Callback when save fails
   */
  onSaveError?: (error: Error) => void;

  /**
   * Enable localStorage fallback for offline support
   * @default true
   */
  enableOfflineStorage?: boolean;

  /**
   * localStorage key prefix
   * @default "draft"
   */
  storageKey?: string;
}

/**
 * Save Draft Response
 */
interface SaveDraftResponse {
  success: boolean;
  data: {
    id: string;
    postId: string | null;
    userId: string;
    content: DraftContent;
    savedAt: string;
    expiresAt: string;
  };
  message: string;
}

/**
 * Save draft to server
 */
async function saveDraft(
  content: DraftContent,
  postId?: string | null
): Promise<SaveDraftResponse> {
  const response = await fetch("/api/posts/draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      postId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save draft");
  }

  return response.json();
}

/**
 * Custom Hook: useAutosave
 *
 * Automatically saves draft content with debouncing
 * Includes localStorage fallback for offline support
 *
 * @example
 * ```tsx
 * const {
 *   isSaving,
 *   lastSaved,
 *   saveDraft: manualSave,
 *   saveStatus
 * } = useAutosave(content, {
 *   delay: 5000,
 *   postId: "post-123",
 *   onSaveSuccess: () => console.log("Draft saved!"),
 * });
 * ```
 */
export function useAutosave(
  content: DraftContent,
  options: UseAutosaveOptions = {}
) {
  const {
    delay = 5000,
    postId = null,
    onSaveSuccess,
    onSaveError,
    enableOfflineStorage = true,
    storageKey = "draft",
  } = options;

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isFirstRender = useRef(true);

  // Debounced content (waits for user to stop typing)
  const debouncedContent = useDebounce(content, delay);

  // Mutation for saving draft
  const { mutate: saveDraftMutation, isPending } = useMutation({
    mutationFn: () => saveDraft(content, postId),
    onMutate: () => {
      setSaveStatus("saving");
    },
    onSuccess: (data) => {
      setLastSaved(new Date(data.data.savedAt));
      setSaveStatus("saved");
      onSaveSuccess?.();

      // Clear localStorage after successful server save
      if (enableOfflineStorage) {
        const key = `${storageKey}-${postId || "new"}`;
        localStorage.removeItem(key);
      }
    },
    onError: (error: Error) => {
      console.error("[useAutosave] Error:", error);
      setSaveStatus("error");
      onSaveError?.(error);

      // Save to localStorage as fallback
      if (enableOfflineStorage) {
        try {
          const key = `${storageKey}-${postId || "new"}`;
          localStorage.setItem(
            key,
            JSON.stringify({
              content,
              savedAt: new Date().toISOString(),
            })
          );
          console.log("[useAutosave] Saved to localStorage as fallback");
        } catch (storageError) {
          console.error("[useAutosave] localStorage error:", storageError);
        }
      }
    },
  });

  // Auto-save when debounced content changes
  useEffect(() => {
    // Skip autosave on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if content is empty
    const hasContent = content.title || content.body;
    if (!hasContent) return;

    // Trigger autosave
    saveDraftMutation();
  }, [debouncedContent]);

  // Manual save function (for explicit save button)
  const manualSave = useCallback(() => {
    const hasContent = content.title || content.body;
    if (!hasContent) {
      console.warn("[useAutosave] Cannot save empty draft");
      return;
    }

    saveDraftMutation();
  }, [content, saveDraftMutation]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!enableOfflineStorage) return;

    const key = `${storageKey}-${postId || "new"}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        const { content: storedContent, savedAt } = JSON.parse(stored);
        console.log("[useAutosave] Restored draft from localStorage:", {
          savedAt,
          keys: Object.keys(storedContent),
        });

        // Note: You'll need to handle restoring content in your component
        // This hook just logs that data exists
      } catch (error) {
        console.error("[useAutosave] Failed to parse localStorage:", error);
      }
    }
  }, []);

  return {
    isSaving: isPending,
    lastSaved,
    saveStatus,
    saveDraft: manualSave,
  };
}
