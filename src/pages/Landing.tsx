import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Terminal, Github, Globe, Star, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-24 px-4 sm:px-8">
      <div className="max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Now supporting GitHub Imports
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-6xl font-bold tracking-tight text-slate-900 sm:text-8xl lg:leading-[1.1]"
        >
          Build. Track. <br />
          <span className="text-indigo-600">Showcase.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed"
        >
          The elite dashboard for developers to manage their professional portfolio, 
          track progress, and sync repositories directly from GitHub.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           className="mt-12 flex flex-wrap justify-center gap-6"
        >
          <Link to="/auth">
            <Button size="lg" className="h-14 px-10 text-base rounded-xl bg-indigo-600 shadow-indigo-200 shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-14 px-10 text-base rounded-xl border-slate-200 hover:bg-slate-50 transition-all" onClick={() => window.open('https://github.com', '_blank')}>
            <Github className="mr-2 h-5 w-5" /> Explore Public Projects
          </Button>
        </motion.div>
      </div>

      <div className="mt-32 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {[
          {
            icon: <Terminal className="h-6 w-6" />,
            title: "Project Tracking",
            description: "High-precision project management. Document tech stacks, record milestones, and track status with ease."
          },
          {
            icon: <Github className="h-6 w-6" />,
            title: "GitHub Sync",
            description: "Instant repository integration. Auto-mirror your codebase details, stars, and languages directly into your portfolio."
          },
          {
            icon: <Globe className="h-6 w-6" />,
            title: "Public Presence",
            description: "Elite-tier professional profile. Showcase your development narrative to recruiters with polished scannable visuals."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
            className="pro-card group p-8"
          >
            <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 border-l-2 border-transparent group-hover:border-indigo-600 group-hover:pl-3 transition-all">{feature.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
