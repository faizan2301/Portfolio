"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Calendar, MapPin, ExternalLink } from "lucide-react";

const experiences = [
  {
    title: "Frontend Engineer",
    company: "Khedmah Delivery",
    type: "Product-Based Company",
    location: "Remote",
    period: "2025 - Present",
    description: [
      "Working on a multi-service food delivery platform with delivery, dine-out, and pickup services",
      "Responsible for bug fixes and crash resolution to maintain app stability",
      "Contributing to new feature development for enhanced user experience",
      "Collaborating with backend and product teams for seamless integration",
    ],
    technologies: ["React Native", "TypeScript", "Firebase", "REST APIs"],
    current: true,
  },
  {
    title: "Sr. Mobile Application Developer",
    company: "Moksha Solutions",
    type: "Service-Based Company",
    location: "Aurangabad, India",
    period: "2022 - 2025",
    description: [
      "Led mobile application development using Java, Flutter, Dart, and React Native",
      "Integrated Node.js backend solutions ensuring seamless functionality",
      "Designed and implemented innovative features for high-quality products",
      "Direct client communication for requirements gathering and project alignment",
    ],
    technologies: ["Flutter", "React Native", "Java", "Node.js", "MongoDB"],
    current: false,
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section id="experience" className="py-16 sm:py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary bg-primary/10 rounded-full mb-3 sm:mb-4">
            Career Journey
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Work{" "}
            <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Building impactful solutions and growing with every project
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20 transform md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row gap-4 sm:gap-8 mb-8 sm:mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary transform -translate-x-1/2 mt-1.5 sm:mt-8 z-10">
                {exp.current && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                )}
              </div>

              {/* Content Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className={`ml-6 sm:ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}
              >
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 glow-hover transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-xl font-bold mb-1">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-primary">
                        <Building2 size={14} className="sm:w-4 sm:h-4" />
                        <span className="font-medium text-sm sm:text-base">{exp.company}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{exp.type}</p>
                    </div>
                    {exp.current && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Description */}
                  <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-muted rounded-full text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

