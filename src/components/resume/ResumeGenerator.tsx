import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  X,
  ChevronRight,
  Settings2,
  FileCode2
} from 'lucide-react';
import { Profile, Skill, Experience, Project, Education, ResumeConfig } from '../../types';

interface ResumeGeneratorProps {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  onClose?: () => void;
  isModal?: boolean;
}

export const ResumeGenerator: React.FC<ResumeGeneratorProps> = ({
  profile,
  skills,
  experience,
  projects,
  education,
  onClose,
  isModal = false
}) => {
  // Config state
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedEduIds, setSelectedEduIds] = useState<string[]>([]);

  const [rolePreset, setRolePreset] = useState<'custom' | 'architect' | 'backend' | 'fullstack' | 'devops'>('architect');
  const [template, setTemplate] = useState<'modern' | 'ats' | 'executive'>('modern');
  const [density, setDensity] = useState<'compact' | 'standard' | 'spacious'>('standard');
  const [accentColor, setAccentColor] = useState<'indigo' | 'slate' | 'emerald' | 'cyan' | 'monochrome'>('indigo');

  const [customHeadline, setCustomHeadline] = useState(profile.headline || profile.title);
  const [customSummary, setCustomSummary] = useState(profile.bio);
  const [showProficiencyBars, setShowProficiencyBars] = useState(false);
  const [showProjectLinks, setShowProjectLinks] = useState(true);

  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'projects' | 'styling' | 'contact'>('skills');

  // Initialize selections based on initial data
  useEffect(() => {
    // default select all active skills, experience, published projects, and education
    setSelectedSkillIds(skills.map(s => s.id || s.name));
    setSelectedExpIds(experience.map(e => e.id || e.organization));
    setSelectedProjectIds(projects.slice(0, 4).map(p => p.id || p.slug));
    setSelectedEduIds(education.map(ed => ed.id || ed.institution));
  }, [skills, experience, projects, education]);

  // Apply Role Presets
  const applyRolePreset = (preset: 'custom' | 'architect' | 'backend' | 'fullstack' | 'devops') => {
    setRolePreset(preset);
    if (preset === 'architect') {
      setCustomHeadline('Senior Cloud Solutions Architect & Distributed Systems Engineer');
      setCustomSummary(
        'Enterprise architect with 8+ years designing fault-tolerant, multi-region cloud infrastructures, event-driven microservices, and Kubernetes-orchestrated platforms delivering 99.99% availability.'
      );
      // prioritize cloud, DevOps, backend, and architecture skills
      const archKeywords = ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Microservices', 'System Design', 'PostgreSQL', 'Redis', 'Go', 'PHP 8+', 'CI/CD'];
      const matched = skills.filter(s =>
        archKeywords.some(k => s.name.toLowerCase().includes(k.toLowerCase())) ||
        s.category === 'Cloud & DevOps' ||
        s.category === 'Architecture'
      ).map(s => s.id || s.name);
      setSelectedSkillIds(matched.length > 0 ? matched : skills.map(s => s.id || s.name));
      // select top projects
      setSelectedProjectIds(projects.slice(0, 3).map(p => p.id || p.slug));
    } else if (preset === 'backend') {
      setCustomHeadline('Senior Backend Engineer & High-Throughput API Architect');
      setCustomSummary(
        'Backend specialist with deep proficiency in PHP 8+, Go, PostgreSQL, Redis, and high-concurrency event pipelines. Proven track record scaling API throughput and optimizing database query latencies.'
      );
      const backendKeywords = ['PHP', 'Go', 'Python', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'Docker', 'Database'];
      const matched = skills.filter(s =>
        backendKeywords.some(k => s.name.toLowerCase().includes(k.toLowerCase())) ||
        s.category === 'Backend' ||
        s.category === 'Database'
      ).map(s => s.id || s.name);
      setSelectedSkillIds(matched.length > 0 ? matched : skills.map(s => s.id || s.name));
    } else if (preset === 'fullstack') {
      setCustomHeadline('Lead Full-Stack Software Engineer & Product Builder');
      setCustomSummary(
        'Full-stack engineer experienced across modern frontend frameworks (React, TypeScript, Next.js) and robust backend architectures (PHP 8+, Node.js, Cloud Firestore). Dedicated to end-to-end product excellence.'
      );
      setSelectedSkillIds(skills.map(s => s.id || s.name));
    } else if (preset === 'devops') {
      setCustomHeadline('Lead DevOps & Cloud Platform Infrastructure Engineer');
      setCustomSummary(
        'DevOps specialist specializing in Infrastructure as Code (Terraform), Kubernetes cluster orchestration, zero-downtime CI/CD automation, and multi-cloud observability.'
      );
      const devopsKeywords = ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'CI/CD', 'GitHub Actions', 'Prometheus', 'Grafana'];
      const matched = skills.filter(s =>
        devopsKeywords.some(k => s.name.toLowerCase().includes(k.toLowerCase())) ||
        s.category === 'Cloud & DevOps'
      ).map(s => s.id || s.name);
      setSelectedSkillIds(matched.length > 0 ? matched : skills.map(s => s.id || s.name));
    }
  };

  // Toggle helpers
  const toggleSkill = (id: string) => {
    setRolePreset('custom');
    setSelectedSkillIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAllSkillsInCategory = (category: string) => {
    setRolePreset('custom');
    const catSkills = skills.filter(s => s.category === category).map(s => s.id || s.name);
    const allSelected = catSkills.every(id => selectedSkillIds.includes(id));
    if (allSelected) {
      setSelectedSkillIds(prev => prev.filter(id => !catSkills.includes(id)));
    } else {
      setSelectedSkillIds(prev => Array.from(new Set([...prev, ...catSkills])));
    }
  };

  const toggleExperience = (id: string) => {
    setSelectedExpIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleEducation = (id: string) => {
    setSelectedEduIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Grouped active skills for rendering
  const activeSkills = useMemo(() => {
    return skills.filter(s => selectedSkillIds.includes(s.id || s.name));
  }, [skills, selectedSkillIds]);

  const skillsByCategory = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    activeSkills.forEach(s => {
      const cat = s.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [activeSkills]);

  // Active experiences & projects
  const activeExperience = useMemo(() => {
    return experience.filter(e => selectedExpIds.includes(e.id || e.organization));
  }, [experience, selectedExpIds]);

  const activeProjects = useMemo(() => {
    return projects.filter(p => selectedProjectIds.includes(p.id || p.slug));
  }, [projects, selectedProjectIds]);

  const activeEducation = useMemo(() => {
    return education.filter(ed => selectedEduIds.includes(ed.id || ed.institution));
  }, [education, selectedEduIds]);

  // Actions
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let txt = `======================================================\n`;
    txt += `${profile.fullName.toUpperCase()}\n`;
    txt += `${customHeadline}\n`;
    txt += `Email: ${profile.email} | Location: ${profile.location}\n`;
    if (profile.phone) txt += `Phone: ${profile.phone} | `;
    if (profile.socialLinks?.linkedin) txt += `LinkedIn: ${profile.socialLinks.linkedin} | `;
    if (profile.socialLinks?.github) txt += `GitHub: ${profile.socialLinks.github}\n`;
    txt += `======================================================\n\n`;

    txt += `PROFESSIONAL SUMMARY\n------------------------------------------------------\n`;
    txt += `${customSummary}\n\n`;

    txt += `CORE TECHNICAL SKILLS\n------------------------------------------------------\n`;
    Object.entries(skillsByCategory).forEach(([cat, list]) => {
      txt += `${cat}: ${list.map(s => s.name).join(', ')}\n`;
    });
    txt += `\n`;

    txt += `WORK EXPERIENCE\n------------------------------------------------------\n`;
    activeExperience.forEach(exp => {
      txt += `${exp.position.toUpperCase()} | ${exp.organization} (${exp.location || ''})\n`;
      txt += `${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate || ''}\n`;
      if (exp.description && exp.description.length > 0) {
        exp.description.forEach((r: string) => {
          txt += `• ${r}\n`;
        });
      }
      if (exp.technologies && exp.technologies.length > 0) {
        txt += `Technologies: ${exp.technologies.join(', ')}\n`;
      }
      txt += `\n`;
    });

    if (activeProjects.length > 0) {
      txt += `NOTABLE PROJECTS\n------------------------------------------------------\n`;
      activeProjects.forEach(proj => {
        txt += `${proj.title} [${proj.category}]\n`;
        txt += `${proj.shortDescription}\n`;
        txt += `Stack: ${proj.technologies?.join(', ')}\n`;
        if (proj.liveUrl) txt += `Live URL: ${proj.liveUrl}\n`;
        if (proj.githubUrl) txt += `Source: ${proj.githubUrl}\n`;
        txt += `\n`;
      });
    }

    if (activeEducation.length > 0) {
      txt += `EDUCATION & CREDENTIALS\n------------------------------------------------------\n`;
      activeEducation.forEach(edu => {
        txt += `${edu.qualification} in ${edu.field}\n`;
        txt += `${edu.institution} (${edu.startDate} - ${edu.endDate || ''})\n`;
        if (edu.description) txt += `${edu.description}\n`;
        txt += `\n`;
      });
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, '_')}_Resume_ATS.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const data = {
      basics: {
        name: profile.fullName,
        label: customHeadline,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        summary: customSummary,
        profiles: [
          { network: 'GitHub', url: profile.socialLinks?.github },
          { network: 'LinkedIn', url: profile.socialLinks?.linkedin },
          { network: 'Website', url: profile.socialLinks?.website }
        ]
      },
      skills: activeSkills.map(s => ({
        name: s.name,
        category: s.category,
        level: s.levelLabel || (s.proficiency ? `${s.proficiency}%` : undefined)
      })),
      work: activeExperience.map(e => ({
        company: e.organization,
        position: e.position,
        startDate: e.startDate,
        endDate: e.isCurrent ? 'Present' : e.endDate || '',
        summary: e.description?.[0] || '',
        highlights: e.description,
        technologies: e.technologies
      })),
      projects: activeProjects.map(p => ({
        name: p.title,
        description: p.shortDescription,
        keywords: p.technologies,
        url: p.liveUrl
      })),
      education: activeEducation.map(ed => ({
        institution: ed.institution,
        area: ed.field,
        studyType: ed.qualification,
        startDate: ed.startDate,
        endDate: ed.endDate
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, '_')}_Resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Styling helper classes
  const accentClasses = {
    indigo: {
      header: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-600 dark:border-indigo-400',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      line: 'bg-indigo-600'
    },
    slate: {
      header: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-700 dark:border-slate-400',
      badge: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      line: 'bg-slate-700'
    },
    emerald: {
      header: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-600 dark:border-emerald-400',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      line: 'bg-emerald-600'
    },
    cyan: {
      header: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-600 dark:border-cyan-400',
      badge: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
      line: 'bg-cyan-600'
    },
    monochrome: {
      header: 'text-black dark:text-white',
      border: 'border-black dark:border-white',
      badge: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
      line: 'bg-black'
    }
  }[accentColor];

  const spacingClass = {
    compact: 'space-y-4 text-xs',
    standard: 'space-y-6 text-sm',
    spacious: 'space-y-8 text-base'
  }[density];

  return (
    <div className={`flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${isModal ? 'fixed inset-0 z-50 overflow-hidden' : ''}`}>
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Dynamic Resume & CV Generator</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium">
                Live Data
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Customize skills, roles, and formatting, then export as ATS-friendly PDF or text.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Print or Save as PDF via browser dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          {/* Download Plain Text ATS */}
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition cursor-pointer"
            title="Download Plain Text ATS formatted document"
          >
            <Download className="w-4 h-4" />
            <span>Plain Text (.txt)</span>
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition cursor-pointer"
            title="Download JSON Resume Schema"
          >
            <FileCode2 className="w-4 h-4" />
            <span>JSON</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer ml-2"
              title="Close Generator"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container: Left Customizer Panel + Right Document Preview Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Customizer Controls (Scrollable) */}
        <aside className="w-full lg:w-96 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden shrink-0">
          {/* Preset Selector Banner */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 font-mono uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Target Role Preset
              </span>
              <span>{rolePreset}</span>
            </div>
            <select
              value={rolePreset}
              onChange={(e) => applyRolePreset(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="architect">Cloud Solutions Architect</option>
              <option value="backend">Senior Backend Specialist</option>
              <option value="fullstack">Lead Full-Stack Engineer</option>
              <option value="devops">DevOps & Infrastructure Lead</option>
              <option value="custom">Custom Configuration</option>
            </select>
          </div>

          {/* Customizer Sub-tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-3 pt-2 gap-1 overflow-x-auto shrink-0 bg-white dark:bg-zinc-900">
            {[
              { id: 'skills', label: 'Skills', icon: Layers, count: activeSkills.length },
              { id: 'experience', label: 'Roles', icon: Briefcase, count: activeExperience.length },
              { id: 'projects', label: 'Projects', icon: FolderGit2, count: activeProjects.length },
              { id: 'styling', label: 'Format', icon: Settings2 },
              { id: 'contact', label: 'Header', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-tab Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">
                    {activeSkills.length} of {skills.length} skills selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSkillIds(skills.map(s => s.id || s.name))}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-zinc-300 dark:text-zinc-700">|</span>
                    <button
                      onClick={() => setSelectedSkillIds([])}
                      className="text-zinc-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Categories Grouping */}
                {Object.entries(
                  skills.reduce((acc, s) => {
                    const c = s.category || 'Other';
                    if (!acc[c]) acc[c] = [];
                    acc[c].push(s);
                    return acc;
                  }, {} as Record<string, Skill[]>)
                ).map(([category, catSkills]) => {
                  const allInCat = catSkills.every(s => selectedSkillIds.includes(s.id || s.name));
                  return (
                    <div key={category} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{category}</span>
                        <button
                          onClick={() => toggleAllSkillsInCategory(category)}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          {allInCat ? 'Deselect Category' : 'Select All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {catSkills.map(skill => {
                          const sid = skill.id || skill.name;
                          const isSelected = selectedSkillIds.includes(sid);
                          return (
                            <button
                              key={sid}
                              onClick={() => toggleSkill(sid)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{skill.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-3">
                <p className="text-zinc-500 leading-relaxed">
                  Toggle work experiences to tailor your career timeline for this specific submission:
                </p>
                {experience.map(exp => {
                  const eid = exp.id || exp.organization;
                  const isSelected = selectedExpIds.includes(eid);
                  return (
                    <div
                      key={eid}
                      onClick={() => toggleExperience(eid)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800'
                          : 'bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-zinc-900 dark:text-white">{exp.position}</h4>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {exp.organization} • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || ''}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {exp.description?.[0] || ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <p className="text-zinc-500 leading-relaxed">
                  Select key case studies to feature (recommended: 2-3 most relevant architectures):
                </p>
                {projects.map(proj => {
                  const pid = proj.id || proj.slug;
                  const isSelected = selectedProjectIds.includes(pid);
                  return (
                    <div
                      key={pid}
                      onClick={() => toggleProject(pid)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800'
                          : 'bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-zinc-900 dark:text-white">{proj.title}</h4>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {proj.category}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {proj.shortDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STYLING / FORMAT TAB */}
            {activeTab === 'styling' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Resume Template Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'modern', label: 'Modern' },
                      { id: 'ats', label: 'Classic ATS' },
                      { id: 'executive', label: 'Executive' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id as any)}
                        className={`py-2 px-2 rounded-xl text-center font-semibold text-xs border transition cursor-pointer ${
                          template === t.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Page Density (Fit to 1 or 2 pages)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'compact', label: 'Compact (1 Page)' },
                      { id: 'standard', label: 'Standard' },
                      { id: 'spacious', label: 'Spacious' }
                    ].map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDensity(d.id as any)}
                        className={`py-2 px-1 text-center font-medium text-[11px] rounded-xl border transition cursor-pointer ${
                          density === d.id
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'indigo', bg: 'bg-indigo-600' },
                      { id: 'slate', bg: 'bg-slate-700' },
                      { id: 'emerald', bg: 'bg-emerald-600' },
                      { id: 'cyan', bg: 'bg-cyan-600' },
                      { id: 'monochrome', bg: 'bg-black' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setAccentColor(c.id as any)}
                        className={`w-7 h-7 rounded-full ${c.bg} transition ring-offset-2 cursor-pointer ${
                          accentColor === c.id ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.id}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProficiencyBars}
                      onChange={(e) => setShowProficiencyBars(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Show skill proficiency ratings
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProjectLinks}
                      onChange={(e) => setShowProjectLinks(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Include project demo & GitHub links
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* HEADER & SUMMARY TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Target Headline / Job Title
                  </label>
                  <input
                    type="text"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Professional Summary / Objective
                  </label>
                  <textarea
                    rows={5}
                    value={customSummary}
                    onChange={(e) => setCustomSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Document Preview Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-100 dark:bg-zinc-950">
          {/* Printable Document Box (Styled as an A4 Page) */}
          <div
            id="printable-resume"
            className={`w-full max-w-[850px] min-h-[1100px] bg-white text-zinc-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-zinc-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:min-h-0 print:w-full ${spacingClass}`}
          >
            {/* Resume Header */}
            <header className="border-b border-zinc-200 pb-5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                  {profile.fullName}
                </h1>
                <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase font-mono ${accentClasses.header}`}>
                  {customHeadline}
                </span>
              </div>

              {/* Contact bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{profile.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{profile.location}</span>
                </span>
                {profile.socialLinks?.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                      linkedin.com/in/johnnysiele
                    </a>
                  </span>
                )}
                {profile.socialLinks?.github && (
                  <span className="flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-zinc-400" />
                    <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:underline">
                      github.com/johnnysiele
                    </a>
                  </span>
                )}
              </div>
            </header>

            {/* Executive Summary */}
            {customSummary && (
              <section className="space-y-1.5">
                <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${accentClasses.header}`}>
                  Professional Profile
                </h2>
                <p className="text-zinc-700 leading-relaxed text-justify">
                  {customSummary}
                </p>
              </section>
            )}

            {/* Technical Skills Section */}
            {activeSkills.length > 0 && (
              <section className="space-y-2">
                <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${accentClasses.header}`}>
                  Technical Skills Matrix
                </h2>

                {template === 'ats' ? (
                  // Plain text ATS format for maximum scanner compliance
                  <div className="space-y-1 text-xs">
                    {Object.entries(skillsByCategory).map(([cat, list]) => (
                      <div key={cat} className="flex flex-col sm:flex-row">
                        <strong className="min-w-36 text-zinc-900 font-semibold">{cat}:</strong>
                        <span className="text-zinc-700">{list.map(s => s.name).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Modern or Executive Chip Matrix
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(skillsByCategory).map(([cat, list]) => (
                      <div key={cat} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                        <div className="font-bold text-zinc-900 text-[11px] font-mono uppercase tracking-wide">
                          {cat}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {list.map(s => (
                            <span
                              key={s.name}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                s.isTopSkill ? accentClasses.badge : 'bg-white text-zinc-800 border border-zinc-200'
                              }`}
                            >
                              {s.name}
                              {showProficiencyBars && s.proficiency ? ` (${s.proficiency}%)` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Work Experience */}
            {activeExperience.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${accentClasses.header}`}>
                  Professional Experience
                </h2>

                <div className="space-y-4">
                  {activeExperience.map(exp => (
                    <div key={exp.id || exp.organization} className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div>
                          <strong className="text-zinc-900 font-bold text-sm">{exp.position}</strong>
                          <span className="text-zinc-600 font-medium"> — {exp.organization}</span>
                          {exp.location && <span className="text-zinc-400 text-xs"> ({exp.location})</span>}
                        </div>
                        <div className="text-xs font-mono text-zinc-500 font-medium">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || ''}
                        </div>
                      </div>

                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-xs">
                          {exp.description.map((resp: string, i: number) => (
                            <li key={i} className="leading-relaxed">
                              {resp}
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="text-[11px] font-mono text-zinc-500 pt-0.5">
                          <span className="font-semibold text-zinc-700">Environment: </span>
                          {exp.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notable Projects */}
            {activeProjects.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${accentClasses.header}`}>
                  Key Engineering Case Studies
                </h2>

                <div className="space-y-3">
                  {activeProjects.map(proj => (
                    <div key={proj.id || proj.slug} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-zinc-900 font-bold text-xs sm:text-sm">
                            {proj.title}
                          </strong>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 font-medium">
                            {proj.category}
                          </span>
                        </div>
                        {showProjectLinks && (
                          <div className="text-[11px] text-zinc-500 font-mono space-x-2">
                            {proj.liveUrl && (
                              <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                Demo
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                Code
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-zinc-700 text-xs leading-relaxed">
                        {proj.shortDescription}
                      </p>
                      {proj.technologies && (
                        <div className="text-[10px] font-mono text-zinc-500">
                          <span className="font-semibold text-zinc-700">Stack: </span>
                          {proj.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {activeEducation.length > 0 && (
              <section className="space-y-2">
                <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${accentClasses.header}`}>
                  Education & Credentials
                </h2>
                <div className="space-y-2 text-xs">
                  {activeEducation.map(edu => (
                    <div key={edu.id || edu.institution} className="flex justify-between items-baseline">
                      <div>
                        <strong className="text-zinc-900 font-bold">{edu.qualification} in {edu.field}</strong>
                        <div className="text-zinc-600">{edu.institution}</div>
                      </div>
                      <div className="font-mono text-zinc-500">
                        {edu.startDate} – {edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
