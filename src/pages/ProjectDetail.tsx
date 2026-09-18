import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, CheckCircle2, Layers } from 'lucide-react';
import { Project } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { Lightbox } from '../components/common/Lightbox';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = [
    { url: project.coverImageUrl, title: `${project.title} - Cover`, category: project.category },
    ...(project.galleryImageUrls?.map((url, idx) => ({
      url,
      title: `${project.title} - Screenshot ${idx + 1}`,
      category: project.category
    })) || [])
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {project.category}
          </span>
          {project.completionDate && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              Completed {project.completionDate}
            </span>
          )}
          {project.featured && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Featured Case Study
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition"
            >
              <span>Live Application</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm transition"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Cover Image */}
      <div
        onClick={() => handleOpenLightbox(0)}
        className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl aspect-16/9 bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in group relative"
      >
        <ImageWithFallback
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
          fallbackText={project.title}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs">
            Click to view full image
          </span>
        </div>
      </div>

      {/* Technologies & Tech Stack Overview */}
      <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
          Architecture & Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Full Markdown Case Study */}
      <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          In-Depth Case Study
        </h2>
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <MarkdownRenderer content={project.fullDescription || project.shortDescription} />
        </div>
      </div>

      {/* Gallery Screenshots */}
      {project.galleryImageUrls && project.galleryImageUrls.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Architecture & UI Gallery ({project.galleryImageUrls.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.galleryImageUrls.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenLightbox(idx + 1)}
                className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-16/10 bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in group relative"
              >
                <ImageWithFallback
                  src={imgUrl}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  fallbackText={`Screenshot ${idx + 1}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2.5 py-1 rounded">
                    Zoom
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
};
