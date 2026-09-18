import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  images: { url: string; title?: string; description?: string; category?: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onPrev, onNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer z-10"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
        <div className="relative max-h-[75vh] overflow-hidden rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-950">
          <img
            src={current.url}
            alt={current.title || 'Gallery image'}
            className="max-h-[75vh] w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="mt-4 text-center max-w-2xl text-white">
          <div className="flex items-center justify-center gap-2 mb-1">
            {current.category && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {current.category}
              </span>
            )}
            <span className="text-xs text-zinc-400">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
          {current.title && <h3 className="text-lg font-medium">{current.title}</h3>}
          {current.description && (
            <p className="text-sm text-zinc-400 mt-1">{current.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
