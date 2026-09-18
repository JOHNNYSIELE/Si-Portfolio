import React from 'react';
import { Briefcase, Calendar, MapPin, GraduationCap, CheckCircle } from 'lucide-react';
import { Experience as ExperienceType, Education } from '../types';

interface ExperienceProps {
  experience: ExperienceType[];
  education: Education[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience, education }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Experience Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
          Career Timeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Professional Experience
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          A track record of engineering leadership, scalable cloud deployments, and distributed systems architecture.
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-12">
        {experience.map((exp) => (
          <div key={exp.id} className="relative group">
            {/* Timeline Node Icon */}
            <div
              className={`absolute -left-9 sm:-left-11.5 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 ${
                exp.isCurrent
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                  : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>

            {/* Content Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                      {exp.organization}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location} ({exp.locationType || 'Remote'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                  {exp.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Current
                    </span>
                  )}
                </div>
              </div>

              {/* Bullet points */}
              {exp.description && exp.description.length > 0 && (
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Technologies */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="space-y-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
            Degrees & Certifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Academic Background
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                  {edu.qualification} in {edu.field}
                </h3>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {edu.institution}
                </p>
              </div>

              {edu.description && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
