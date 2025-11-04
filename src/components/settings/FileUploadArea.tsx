"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FileUploadAreaProps {
  id: string;
  label: string;
  accept: string;
  maxSize?: number; // in MB
  currentFile?: string | null;
  onFileChange: (file: File | null) => void;
  recommendedSize?: string;
}

export function FileUploadArea({
  id,
  label,
  accept,
  maxSize = 5,
  currentFile,
  onFileChange,
  recommendedSize,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!acceptedTypes.includes(fileExtension) && !acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${accept}`;
    }

    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileChange(file);

    // Create preview for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>

      {preview ? (
        <div className="relative">
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-48 object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
          style={{
            borderColor: isDragging ? "var(--primary-color)" : "var(--border)",
            background: isDragging
              ? "rgba(99, 102, 241, 0.05)"
              : "var(--surface)",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            aria-label={label}
          />

          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(99, 102, 241, 0.1)" }}
            >
              {isDragging ? (
                <ImageIcon className="w-6 h-6" style={{ color: "var(--primary-color)" }} />
              ) : (
                <Upload className="w-6 h-6" style={{ color: "var(--primary-color)" }} />
              )}
            </div>

            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {accept.replace(/\./g, "").toUpperCase()} up to {maxSize}MB
              </p>
              {recommendedSize && (
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Recommended: {recommendedSize}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
