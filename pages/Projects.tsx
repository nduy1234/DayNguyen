import React from 'react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: "Youtube Clone",
    description: "A fully functional Youtube clone built with React and RapidAPI. Features include video playback, search, and channel details.",
    image: "https://picsum.photos/800/600?random=1",
    tags: ["React", "API", "Material UI"]
  },
  {
    id: 2,
    title: "E-Commerce Dashboard",
    description: "Comprehensive analytics dashboard for online retailers. Visualize sales data, manage inventory, and track customer behavior.",
    image: "https://picsum.photos/800/600?random=2",
    tags: ["TypeScript", "Recharts", "Tailwind"]
  },
  {
    id: 3,
    title: "AI Image Generator",
    description: "An interface connecting to state-of-the-art diffusion models to generate art from text prompts.",
    image: "https://picsum.photos/800/600?random=3",
    tags: ["Next.js", "OpenAI", "Canvas"]
  }
];

const Projects = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-gray-500 text-xl">Selected works and creative experiments.</p>
      </header>

      {/* Project List */}
      <section className="space-y-24" aria-label="Project List">
        {projects.map((project, index) => (
          <article key={project.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
             <div className="w-full md:w-1/2 group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                <img 
                    src={project.image} 
                    alt={`Screenshot of ${project.title} project`} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
             </div>
             <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2" aria-label="Technologies used">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">{tag}</span>
                  ))}
                </div>
                <button className="mt-4 text-black font-semibold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                  View Case Study
                </button>
             </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Projects;