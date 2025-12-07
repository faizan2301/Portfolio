"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Smartphone, Code, ChevronRight, Apple, Play } from "lucide-react";

const projects = [
  {
    title: "Khedmah Delivery",
    description: "Multi-service food delivery platform with home delivery, dine-out reservations, and pickup options. Optimized app performance and improved UI/UX across platforms.",
    technologies: ["React Native", "TypeScript", "Firebase", "REST APIs"],
    playStore: "https://play.google.com/store/apps/details?id=com.springtech.orderApp",
    appStore: "https://apps.apple.com/om/app/khedmah-delivery/id6738427748",
    highlights: ["Bug fixing & crash resolution", "Feature implementation", "Cross-platform optimization"],
    gradient: "from-orange-500 to-red-500",
    featured: true,
  },
  {
    title: "M-Attendance",
    description: "Comprehensive attendance tracking application with real-time monitoring. Led code refactoring initiatives and implemented new features for enhanced functionality.",
    technologies: ["Java", "XML", "React Native", "iOS"],
    playStore: "https://play.google.com/store/apps/details?id=com.attendance.mokshasolutions",
    appStore: "https://apps.apple.com/bn/app/m-attendance/id6443842046",
    highlights: ["Code refactoring", "Real-time tracking", "Cross-platform development"],
    gradient: "from-blue-500 to-cyan-500",
    featured: true,
  },
  {
    title: "Olive ProHealth",
    description: "Healthcare platform with nearby facility locator, expert Q&A forum, prescription management, and health blogs from verified doctors.",
    technologies: ["Flutter", "Dart", "Node.js", "MVVM"],
    playStore: "https://play.google.com/store/apps/details?id=com.olive.olive",
    highlights: ["Healthcare integration", "Doctor verification", "Prescription management"],
    gradient: "from-green-500 to-emerald-500",
    featured: true,
  },
  {
    title: "JJM Monitoring App",
    description: "Government project monitoring app with streamlined media upload, multi-level approval system, and intuitive dashboard for stakeholders.",
    technologies: ["Java", "XML", "Firebase", "REST APIs"],
    playStore: "https://play.google.com/store/apps/details?id=com.jjmaurangabad",
    highlights: ["Media validation system", "Multi-level approval", "Real-time monitoring"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "MGS Delivery",
    description: "Delivery management system with barcode scanner integration, order assignment, credit authorization, and Firebase notifications.",
    technologies: ["React Native", "JavaScript", "Node.js", "Firebase"],
    playStore: "https://play.google.com/store/apps/details?id=com.mgsdelivery",
    highlights: ["Barcode scanning", "Order management", "Real-time notifications"],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Crypto Connars",
    description: "Cryptocurrency tracking application with user-friendly interface and dynamic real-time insights for market updates.",
    technologies: ["Flutter", "Dart", "REST APIs"],
    highlights: ["Real-time data", "Market insights", "Intuitive UI"],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "M-CRM",
    description: "Complete CRM solution with leads management, accounts handling, invoice management, and real-time reporting portals.",
    technologies: ["Java", "XML", "Firebase", "SQLite"],
    highlights: ["Lead management", "Invoice system", "Real-time reports"],
    gradient: "from-teal-500 to-cyan-500",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);

  const displayedProjects = showAll ? projects : projects.filter((p) => p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="projects" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of mobile and web applications I&apos;ve built and contributed to
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30">
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                
                <div className="p-6">
                  {/* Title & Links */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-xs font-medium text-accent">Featured Project</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.playStore && (
                        <a
                          href={project.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors"
                          aria-label="Play Store"
                        >
                          <Play size={16} className="text-muted-foreground group-hover:text-primary" />
                        </a>
                      )}
                      {project.appStore && (
                        <a
                          href={project.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors"
                          aria-label="App Store"
                        >
                          <Apple size={16} className="text-muted-foreground group-hover:text-primary" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-4">
                    {project.highlights.slice(0, 3).map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 text-sm">
                        <ChevronRight size={14} className="text-primary" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && projects.length > 3 && (
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.button
              onClick={() => setShowAll(true)}
              className="px-8 py-4 rounded-full border border-border hover:border-primary/50 transition-colors font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

