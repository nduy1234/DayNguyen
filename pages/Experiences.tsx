import React, { useState } from 'react';
import { getFastSummary } from '../services/geminiService';
import { Briefcase, Zap } from 'lucide-react';
import { Experience } from '../types';

const experiences: Experience[] = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    period: "2021 - Present",
    description: "Leading the frontend team in rebuilding the core product dashboard using React 18 and Next.js. Improved performance by 40% and established a new design system."
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Creative Solutions Agency",
    period: "2019 - 2021",
    description: "Developed custom e-commerce solutions for high-profile clients. Managed deployment pipelines and backend integration with Node.js and AWS."
  },
  {
    id: 3,
    role: "Junior Web Developer",
    company: "StartUp Lab",
    period: "2018 - 2019",
    description: "Collaborated on rapid prototyping of MVP features. Gained expertise in Vue.js and Firebase integration."
  }
];

const ExperienceItem: React.FC<{ exp: Experience }> = ({ exp }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    const text = await getFastSummary(exp.description);
    setSummary(text);
    setLoading(false);
  };

  return (
    <li className="relative pl-8 md:pl-0 list-none">
      <div className="md:flex items-start justify-between group">
         {/* Timeline Dot */}
         <div className="absolute left-0 top-0 md:left-1/2 md:-ml-3 w-6 h-6 rounded-full bg-gray-200 border-4 border-white group-hover:bg-blue-600 transition-colors"></div>
         
         {/* Content Left (Date) for Desktop */}
         <div className="hidden md:block w-1/2 pr-12 text-right">
            <time className="text-lg font-bold text-gray-400 group-hover:text-gray-900 transition-colors">{exp.period}</time>
         </div>

         {/* Mobile Date */}
         <div className="md:hidden mb-1">
             <time className="text-sm font-bold text-gray-500">{exp.period}</time>
         </div>

         {/* Content Right (Details) */}
         <div className="md:w-1/2 md:pl-12 pb-12">
            <h3 className="text-2xl font-bold text-gray-900">{exp.role}</h3>
            <p className="text-lg text-gray-600 font-medium mb-2">{exp.company}</p>
            <p className="text-gray-500 leading-relaxed">{exp.description}</p>
            
            {/* AI Summary Feature */}
            <div className="mt-4">
              {!summary && !loading && (
                 <button 
                   onClick={handleSummarize}
                   className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                   aria-label="Generate AI summary for this experience"
                 >
                   <Zap size={12} />
                   AI Summarize
                 </button>
              )}
              {loading && <span className="text-xs text-gray-400 animate-pulse">Gemini Flash is thinking...</span>}
              {summary && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                   <span className="font-bold mr-1">✨ TL;DR:</span> {summary}
                </div>
              )}
            </div>
         </div>
      </div>
    </li>
  );
};

const Experiences = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Experience</h1>
          <p className="text-gray-500 text-xl">My professional journey and career highlights.</p>
       </header>

       <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 md:left-1/2"></div>
          
          <ul className="space-y-0 p-0 m-0">
            {experiences.map(exp => (
              <ExperienceItem key={exp.id} exp={exp} />
            ))}
          </ul>
       </div>
    </div>
  );
};

export default Experiences;