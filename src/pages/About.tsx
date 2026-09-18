import React from 'react';
import { Download, Mail, MapPin, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Profile, Education } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface AboutProps {
  profile: Profile;
  education: Education[];
  onNavigate: (tab: string) => void;
}

export const About: React.FC<AboutProps> = ({ profile, education, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image & Quick Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-900 aspect-4/5">
            <ImageWithFallback
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              fallbackText={profile.fullName}
            />
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 text-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white">Professional Details</h3>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition">
                  {profile.email}
                </a>
              </div>
              {profile.availableForHire && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Available for contracts and architecture advisory</span>
                </div>
              )}
            </div>

            {profile.resumeUrl && (
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Download Official CV / Resume
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Narrative Story & Highlights */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              About Me
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Engineering with architectural discipline & product intuition.
            </h1>
          </div>

          <div className="space-y-4 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {profile.aboutStory && profile.aboutStory.length > 0 ? (
              profile.aboutStory.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>

          {/* Key Achievements Grid */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Career Benchmarks & Milestones</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.highlights?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1"
                >
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {item.value}
                  </span>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Qualifications */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <span>Academic Qualifications & Certifications</span>
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                      {edu.qualification} in {edu.field}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
