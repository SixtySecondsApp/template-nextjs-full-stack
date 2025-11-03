'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  Heading2,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  autoSave?: boolean;
  autoSaveKey?: string;
  className?: string;
}

export function RichTextEditor({
  initialContent = '',
  onChange,
  placeholder = 'Write your content...',
  minHeight = '200px',
  autoSave = false,
  autoSaveKey = 'draft',
  className = ''
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-color hover:underline'
        }
      }),
      CharacterCount
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}`
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    }
  });

  // Autosave to localStorage
  useEffect(() => {
    if (!autoSave || !editor) return;

    const timer = setTimeout(() => {
      const html = editor.getHTML();
      try {
        localStorage.setItem(autoSaveKey, html);
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [editor?.getHTML(), autoSave, autoSaveKey, editor]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!autoSave || !editor) return;

    try {
      const saved = localStorage.getItem(autoSaveKey);
      if (saved && saved !== '<p></p>') {
        editor.commands.setContent(saved);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, [autoSave, autoSaveKey, editor]);

  if (!editor) {
    return (
      <div className={`border border-border-color rounded-lg ${className}`}>
        <div className="h-48 flex items-center justify-center text-text-secondary">
          Loading editor...
        </div>
      </div>
    );
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-surface transition-colors ${
        isActive ? 'bg-surface text-primary-color' : 'text-text-secondary'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-border-color rounded-lg overflow-hidden bg-surface-elevated ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-border-color p-2 flex items-center gap-1 flex-wrap bg-surface">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border-color mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border-color mx-1" />

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <Link2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border-color mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character Count */}
      <div className="border-t border-border-color px-4 py-2 text-xs text-text-tertiary bg-surface">
        {editor.storage.characterCount?.characters?.() || 0} characters
      </div>
    </div>
  );
}
