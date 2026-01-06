import { TrashIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  currentImageUrl,
  error,
  disabled = false,
  className = '',
}: ImageUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type,
        )
      ) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsImageRemoved(false);
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setPreview(null);
    setIsImageRemoved(true);
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const displayImage =
    preview || (currentImageUrl && !isImageRemoved ? currentImageUrl : null);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label className="text-base-content">
        {t('recipes.form.imageLabel', 'Image')}
      </label>

      <div
        className={`relative flex h-[18lh] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-base-300'} ${error ? 'border-error' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5'} `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {displayImage ? (
          <div className="relative flex h-full">
            <img
              src={displayImage}
              alt="Preview"
              className="rounded-lg object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="btn absolute top-4 right-4 btn-ghost btn-sm"
              >
                <TrashIcon size={20} className="text-error" />
              </button>
            )}
          </div>
        ) : (
          <div className="py-8">
            <svg
              className="mx-auto h-12 w-12 text-base-content/40"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-base-content">
                <span className="font-medium text-primary">
                  {t(
                    'recipes.form.imageUpload.clickToUpload',
                    'Click to upload',
                  )}
                </span>{' '}
                {t('recipes.form.imageUpload.orDragDrop', 'or drag and drop')}
              </p>
              <p className="mt-1 text-sm text-base-content/60">
                {t(
                  'recipes.form.imageUpload.formats',
                  "PNG, JPG, WebP up to 5MB",
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {value && (
        <div className="text-xs text-base-content/60">
          {t('recipes.form.imageUpload.selectedFile', 'Fichier sélectionné')}:{' '}
          {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
}
