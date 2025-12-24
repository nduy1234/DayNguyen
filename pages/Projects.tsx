import React from 'react';
import { Project } from '../types';
import { ArrowUpRight, Github } from 'lucide-react';

const projects: Project[] = [
  {
    id: 4,
    title: "BrandAI",
    description: "Project creating engaging content and materials for digital learning experiences",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["Content Creation", "Digital Learning", "AI"],
    repoUrl: "https://github.com/nduy1234/BrandAI",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 5,
    title: "My Healthcare App",
    description: "Project featuring a modern application interface design for healthcare appointments",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
    tags: ["UI/UX Design", "Healthcare", "Framer"],
    repoUrl: "https://framer.com/projects/My-Doc-Appt--V43wzx3kaDOjv17eCeXE-bdEYE?node=augiA20Il",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 6,
    title: "A Dance Lesson",
    description: "Project exploring innovative practices for digital storytelling and media techniques",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa8795?auto=format&fit=crop&w=800&q=80",
    tags: ["Digital Storytelling", "Media", "Video"],
    repoUrl: "https://youtu.be/ap32odJSwmY",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 7,
    title: "Exploring Tech Startups Hiring",
    description: "Project analyzing tech startup hiring trends using both relational and NoSQL database systems",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["Data Analysis", "SQL", "NoSQL"],
    repoUrl: "https://youtu.be/l2uJ8AWFwkY",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 8,
    title: "Supporting Students with Disabilities",
    description: "Project creating accessible educational content and inclusive learning experiences",
    image: "https://images.unsplash.com/photo-1573497491768-dcc21799863c?auto=format&fit=crop&w=800&q=80",
    tags: ["Accessibility", "Inclusive Design", "Education"],
    repoUrl: "https://day.talentlms.com/plus/my/courses/126/units/2092/preview",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 9,
    title: "Lucky Restaurant",
    description: "A restaurant web showcasing fundamental web development skills with modern design and functionality",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tags: ["Web Development", "Design", "Restaurant"],
    repoUrl: "https://github.com/cscie12/final-project-nduy1234.git",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 10,
    title: "Fancy Salon",
    description: "Web app for salon management with booking system and customer management features",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    tags: ["Web App", "Booking System", "Management"],
    repoUrl: "https://github.com/HarvardDCENode/assignment7-final-nduy1234",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 11,
    title: "My Film List",
    description: "Web app for movie tracking and recommendations built with modern static site technologies",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80",
    tags: ["Web App", "Static Site", "Movies"],
    repoUrl: "https://github.com/cscie114/csci-e-114-final-project-nduy1234.git",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 12,
    title: "My Favorite Seasons",
    description: "Project showcasing seasonal themes through creative visual storytelling",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    tags: ["Visual Storytelling", "Video", "Creative"],
    repoUrl: "https://vimeo.com/995440119/bd5ac7b72b?share=copy",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 13,
    title: "Connect",
    description: "Capstone project designed to help new startups network, collaborate, showcase projects, message others, and build meaningful connections to support early-stage growth",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    tags: ["Networking", "Startups", "Collaboration"],
    repoUrl: "https://github.com/nduy1234/connectapp",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 14,
    title: "Dissertation",
    description: "The Impact of Undergraduate Research Experience on Performance of Graduate Students in STEM",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    tags: ["Research", "STEM", "Education"],
    repoUrl: "https://www.calstatela.edu/library",
    linkText: "Link",
    hideRepoIcon: true
  },
  {
    id: 15,
    title: "Thesis",
    description: "My Story as a First-Generation Student from Vietnamese Immigrant Background",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    tags: ["Research", "Autoethnography", "Education"],
    repoUrl: "https://libraries.uvm.edu/home",
    linkText: "Link",
    hideRepoIcon: true
  }
];

const Projects = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      <header className="mb-20">
        <h1 className="text-5xl md:text-6xl font-bold font-heading text-slate-900 mb-6">Projects</h1>
        <p className="text-slate-500 text-xl font-light max-w-2xl">
          Selected works and creative experiments
        </p>
      </header>

      {/* Project List */}
      <section className="space-y-32" aria-label="Project List">
        {projects.map((project, index) => (
          <article key={project.id} className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} group`}>
             {/* Image */}
             <div className="w-full md:w-7/12 relative cursor-pointer overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-blue-900/10 group-hover:-translate-y-2">
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img 
                        src={project.image} 
                        alt={`Screenshot of ${project.title}`} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-500"></div>
                </div>
             </div>

             {/* Content */}
             <div className="w-full md:w-5/12 space-y-6">
                <div className="flex flex-col items-start">
                   <span className="text-6xl font-bold text-slate-100 -mb-8 -ml-4 select-none z-0 relative transition-colors duration-500 group-hover:text-slate-200">0{index + 1}</span>
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 relative z-10 transition-colors duration-300 group-hover:text-blue-600">{project.title}</h2>
                </div>
                
                <p className="text-slate-600 leading-relaxed text-lg">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 pt-2" aria-label="Technologies used">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wide uppercase border border-slate-200">
                        {tag}
                    </span>
                  ))}
                </div>
                
                <div className="pt-6 flex flex-wrap gap-6 items-center">
                    {project.demoUrl && (
                        <a 
                            href={project.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors group/btn"
                        >
                            Live Demo
                            <ArrowUpRight size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </a>
                    )}
                    
                    {project.repoUrl && (
                        <a 
                            href={project.repoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 transition-colors"
                        >
                            {!project.hideRepoIcon && <Github size={18} />}
                            {project.linkText || "Source Code"}
                        </a>
                    )}
                </div>
             </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Projects;