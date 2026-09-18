import React from 'react';
import { Check, ArrowRight, Layout, Server, Sliders, Shield, Cloud, Terminal } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  onNavigate: (tab: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'server':
        return <Server className="w-6 h-6 text-indigo-500" />;
      case 'sliders':
        return <Sliders className="w-6 h-6 text-amber-500" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-emerald-500" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-sky-500" />;
      case 'layout':
      default:
        return <Layout className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
          Professional Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Engineering & Architecture Offerings
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Providing high-caliber technical leadership, custom software engineering, and cloud infrastructure consulting.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {getIcon(srv.iconName)}
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {srv.title}
              </h3>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {srv.description}
              </p>

              {srv.features && srv.features.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                    Included Deliverables
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {srv.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition cursor-pointer"
              >
                <span>Discuss this Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
